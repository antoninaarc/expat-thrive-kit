export interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "breathing" | "grounding" | "reframing" | "mindfulness";
  duration: string;
  steps: string[];
}

export const emergencyExercises: Exercise[] = [
  {
    id: "box-breathing",
    title: "Respiración Cuadrada",
    description: "Técnica de respiración 4-4-4-4 para calmar el sistema nervioso",
    icon: "🫁",
    category: "breathing",
    duration: "4 min",
    steps: [
      "Inhala lentamente contando hasta 4",
      "Mantén el aire contando hasta 4",
      "Exhala lentamente contando hasta 4",
      "Mantén los pulmones vacíos contando hasta 4",
      "Repite el ciclo 4-6 veces",
    ],
  },
  {
    id: "54321-grounding",
    title: "Técnica 5-4-3-2-1",
    description: "Anclaje sensorial para regresar al presente",
    icon: "🖐️",
    category: "grounding",
    duration: "5 min",
    steps: [
      "Nombra 5 cosas que puedas VER a tu alrededor",
      "Nombra 4 cosas que puedas TOCAR",
      "Nombra 3 cosas que puedas ESCUCHAR",
      "Nombra 2 cosas que puedas OLER",
      "Nombra 1 cosa que puedas SABOREAR",
    ],
  },
  {
    id: "cognitive-reframe",
    title: "Reencuadre Cognitivo",
    description: "Identifica y transforma pensamientos negativos (CBT)",
    icon: "🔄",
    category: "reframing",
    duration: "10 min",
    steps: [
      "Identifica el pensamiento que te molesta",
      "¿Qué evidencia apoya este pensamiento?",
      "¿Qué evidencia lo contradice?",
      "¿Hay una forma más equilibrada de verlo?",
      "¿Qué le dirías a un amigo en esta situación?",
      "Escribe tu nuevo pensamiento más equilibrado",
    ],
  },
  {
    id: "body-scan",
    title: "Escaneo Corporal",
    description: "Mindfulness para liberar tensión física y emocional",
    icon: "🧘",
    category: "mindfulness",
    duration: "8 min",
    steps: [
      "Cierra los ojos y respira profundo 3 veces",
      "Lleva tu atención a la parte superior de tu cabeza",
      "Baja lentamente: frente, ojos, mandíbula... nota tensiones",
      "Continúa por cuello, hombros, brazos, manos",
      "Sigue por pecho, abdomen, espalda",
      "Termina con piernas, rodillas, pies",
      "Respira y suelta cualquier tensión que hayas encontrado",
    ],
  },
  {
    id: "self-compassion",
    title: "Auto-compasión Expat",
    description: "Ejercicio de amabilidad contigo mismo en momentos difíciles",
    icon: "💛",
    category: "mindfulness",
    duration: "5 min",
    steps: [
      "Reconoce: 'Este es un momento de sufrimiento'",
      "Normaliza: 'Adaptarse a otro país es difícil. No estoy solo/a en esto'",
      "Coloca tu mano en el corazón y di: 'Me doy el cariño que necesito'",
      "Pregúntate: '¿Qué necesito ahora mismo?'",
      "Comprométete a darte eso que necesitas",
    ],
  },
  {
    id: "478-breathing",
    title: "Respiración 4-7-8",
    description: "Técnica de relajación profunda para momentos de ansiedad",
    icon: "💨",
    category: "breathing",
    duration: "3 min",
    steps: [
      "Inhala por la nariz contando hasta 4",
      "Mantén el aire contando hasta 7",
      "Exhala por la boca contando hasta 8",
      "Repite 3-4 ciclos",
    ],
  },
];

export const categoryLabels: Record<string, { label: string; color: string }> = {
  breathing: { label: "Respiración", color: "calm" },
  grounding: { label: "Grounding", color: "warm" },
  reframing: { label: "Reencuadre CBT", color: "coral" },
  mindfulness: { label: "Mindfulness", color: "sage" },
};
