import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { language } = await req.json();
    const lang = language === "en" ? "English" : "Spanish";

    // Fetch recent check-ins (last 14 days)
    const { data: checkins } = await supabase
      .from("daily_checkins")
      .select("mood, thought, checkin_date")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .limit(14);

    // Fetch recent journal entries
    const { data: journals } = await supabase
      .from("journal_entries")
      .select("mood, emotion, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Fetch latest assessment results
    const { data: assessments } = await supabase
      .from("assessment_results")
      .select("assessment_type, score, max_score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    const hasData = (checkins?.length || 0) + (journals?.length || 0) + (assessments?.length || 0) > 0;
    if (!hasData) {
      return new Response(JSON.stringify({ insight: null, hasData: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build context for AI
    const moodLabels = ["very bad", "bad", "okay", "good", "great"];
    const checkinSummary = checkins?.length
      ? checkins.map(c => `${c.checkin_date}: mood ${moodLabels[c.mood - 1]}${c.thought ? `, thought: "${c.thought}"` : ""}`).join("\n")
      : "No check-ins yet.";

    const journalSummary = journals?.length
      ? journals.map(j => `${new Date(j.created_at).toLocaleDateString()}: mood ${moodLabels[j.mood - 1]}, emotion: ${j.emotion}${j.content ? `, wrote: "${j.content.slice(0, 100)}"` : ""}`).join("\n")
      : "No journal entries.";

    const assessmentSummary = assessments?.length
      ? assessments.map(a => `${a.assessment_type}: ${Math.round((a.score / a.max_score) * 100)}%`).join(", ")
      : "No assessments.";

    // Calculate average mood and trend
    const allMoods = [...(checkins?.map(c => c.mood) || []), ...(journals?.map(j => j.mood) || [])];
    const avgMood = allMoods.length ? (allMoods.reduce((a, b) => a + b, 0) / allMoods.length).toFixed(1) : "unknown";
    
    // Find predominant emotions from journals
    const emotionCounts: Record<string, number> = {};
    journals?.forEach(j => { emotionCounts[j.emotion] = (emotionCounts[j.emotion] || 0) + 1; });
    const topEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([e]) => e);

    const systemPrompt = `You are a warm, empathetic wellness coach for expats living in the Netherlands. 
You analyze emotional data and provide ONE personalized, actionable insight.

Rules:
- Respond ONLY in ${lang}
- Maximum 3 sentences total
- Be specific: reference their actual patterns (emotions, mood trends)
- Suggest ONE concrete action they can do right now from the app (journal, breathing exercise, a program, etc.)
- Use a warm, encouraging tone with 1-2 emojis
- If mood is trending down, be extra compassionate
- If mood is good, celebrate and encourage consistency
- Never diagnose or play doctor`;

    const userPrompt = `Here is the user's recent wellness data:

CHECK-INS (last 14 days):
${checkinSummary}

JOURNAL ENTRIES (recent):
${journalSummary}

ASSESSMENT SCORES: ${assessmentSummary}

AVERAGE MOOD: ${avgMood}/5
TOP EMOTIONS: ${topEmotions.join(", ") || "not enough data"}

Generate a single personalized insight with a suggested action.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content || null;

    return new Response(JSON.stringify({ insight, hasData: true, avgMood: parseFloat(avgMood as string), topEmotions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
