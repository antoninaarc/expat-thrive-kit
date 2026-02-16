import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { assessmentType, score, maxScore, answers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const pct = Math.round((score / maxScore) * 100);

    const typeDescriptions: Record<string, string> = {
      stress: "estrés percibido (escala PSS-10). Un porcentaje más alto indica mayor estrés.",
      emotional_regulation: "regulación emocional (escala DERS simplificada). Un porcentaje más alto indica mayor dificultad para regular emociones.",
      cultural_adaptation: "adaptación cultural como expatriado. Un porcentaje más alto indica mejor adaptación.",
      work_life_balance: "balance vida-trabajo como expatriado. Un porcentaje más alto indica mejor equilibrio.",
    };

    const systemPrompt = `Eres un psicólogo especializado en bienestar de expatriados. Hablas español de forma cálida, empática y profesional. 
Proporcionas recomendaciones personalizadas basadas en resultados de tests psicológicos.
Tus recomendaciones deben ser:
- Prácticas y accionables (3-5 recomendaciones específicas)
- Basadas en evidencia (ACT, CBT, DBT, mindfulness)
- Sensibles al contexto de vida expatriada
- Escritas en un tono amable y esperanzador
- Breves pero útiles (máximo 300 palabras total)
Usa emojis moderadamente para hacer el texto más amigable.
Estructura tu respuesta con un párrafo de resumen inicial y luego las recomendaciones numeradas.`;

    const userPrompt = `El usuario obtuvo un ${pct}% en el test de ${typeDescriptions[assessmentType] || assessmentType}.
Puntuación: ${score} de ${maxScore} puntos posibles.
Por favor, genera recomendaciones personalizadas para mejorar su bienestar en esta área.`;

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
