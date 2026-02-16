import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { assessmentType, score, maxScore, language } = await req.json();
    const lang = language === "en" ? "English" : "Spanish";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const pct = Math.round((score / maxScore) * 100);

    const typeDescriptions: Record<string, string> = {
      stress: "estrés percibido (escala PSS-10). Un porcentaje más alto indica mayor estrés.",
      emotional_regulation: "regulación emocional (escala DERS simplificada). Un porcentaje más alto indica mayor dificultad para regular emociones.",
      cultural_adaptation: "adaptación cultural como expatriado. Un porcentaje más alto indica mejor adaptación.",
      work_life_balance: "balance vida-trabajo como expatriado. Un porcentaje más alto indica mejor equilibrio.",
    };

    const systemPrompt = `You are a psychologist specialized in expat wellbeing. You MUST respond in ${lang}.
You provide personalized recommendations based on psychological test results.
Your recommendations must be:
- Practical and actionable (3-5 specific recommendations)
- Evidence-based (ACT, CBT, DBT, mindfulness)
- Sensitive to the expat life context
- Written in a warm and hopeful tone
- Brief but useful (max 300 words total)
Use emojis moderately. Structure with an initial summary paragraph then numbered recommendations.`;

    const userPrompt = `The user scored ${pct}% on the ${typeDescriptions[assessmentType] || assessmentType} test.
Score: ${score} out of ${maxScore} possible points.
Please generate personalized recommendations to improve their wellbeing in this area. Respond in ${lang}.`;

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
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error al generar recomendaciones" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content || "No se pudieron generar recomendaciones.";

    return new Response(JSON.stringify({ recommendation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
