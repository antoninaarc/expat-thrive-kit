export interface Question {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questions: Question[];
}

const likertOptions = [
  { label: "Nunca", value: 0 },
  { label: "Casi nunca", value: 1 },
  { label: "A veces", value: 2 },
  { label: "Con frecuencia", value: 3 },
  { label: "Siempre", value: 4 },
];

export const assessments: Assessment[] = [
  {
    id: "stress",
    title: "Estrés Percibido",
    description: "Evalúa tu nivel de estrés actual basado en la Escala de Estrés Percibido (PSS-10)",
    icon: "🧠",
    color: "coral",
    questions: [
      { id: "s1", text: "¿Con qué frecuencia te has sentido molesto/a por algo inesperado?", options: likertOptions },
      { id: "s2", text: "¿Con qué frecuencia has sentido que no podías controlar las cosas importantes de tu vida?", options: likertOptions },
      { id: "s3", text: "¿Con qué frecuencia te has sentido nervioso/a o estresado/a?", options: likertOptions },
      { id: "s4", text: "¿Con qué frecuencia has sentido confianza en tu capacidad para manejar tus problemas personales?", options: [...likertOptions].reverse() },
      { id: "s5", text: "¿Con qué frecuencia has sentido que las cosas iban como tú querías?", options: [...likertOptions].reverse() },
      { id: "s6", text: "¿Con qué frecuencia has sentido que no podías con todo lo que tenías que hacer?", options: likertOptions },
      { id: "s7", text: "¿Con qué frecuencia has podido controlar las irritaciones de tu vida?", options: [...likertOptions].reverse() },
      { id: "s8", text: "¿Con qué frecuencia has sentido que tenías el control de todo?", options: [...likertOptions].reverse() },
      { id: "s9", text: "¿Con qué frecuencia te has enfadado por cosas que escapaban a tu control?", options: likertOptions },
      { id: "s10", text: "¿Con qué frecuencia has sentido que las dificultades se acumulaban tanto que no podías superarlas?", options: likertOptions },
    ],
  },
  {
    id: "emotional_regulation",
    title: "Regulación Emocional",
    description: "Mide tu capacidad de regulación emocional (basado en DERS simplificado)",
    icon: "💚",
    color: "calm",
    questions: [
      { id: "e1", text: "Tengo claro qué emociones estoy sintiendo", options: [...likertOptions].reverse() },
      { id: "e2", text: "Me cuesta encontrar sentido a mis sentimientos", options: likertOptions },
      { id: "e3", text: "Me siento abrumado/a por mis emociones", options: likertOptions },
      { id: "e4", text: "Sé cómo calmarme cuando estoy molesto/a", options: [...likertOptions].reverse() },
      { id: "e5", text: "Cuando me siento mal, creo que será así para siempre", options: likertOptions },
      { id: "e6", text: "Puedo aceptar mis emociones sin juzgarlas", options: [...likertOptions].reverse() },
      { id: "e7", text: "Cuando estoy molesto/a, me cuesta concentrarme", options: likertOptions },
      { id: "e8", text: "Puedo manejar mis emociones de forma saludable", options: [...likertOptions].reverse() },
    ],
  },
  {
    id: "cultural_adaptation",
    title: "Adaptación Cultural",
    description: "Evalúa tu proceso de adaptación cultural en el nuevo país",
    icon: "🌍",
    color: "warm",
    questions: [
      { id: "c1", text: "Me siento cómodo/a con las costumbres locales", options: likertOptions },
      { id: "c2", text: "Puedo comunicarme efectivamente en el idioma local", options: likertOptions },
      { id: "c3", text: "Tengo amistades significativas en el país donde vivo", options: likertOptions },
      { id: "c4", text: "Entiendo las normas sociales no escritas de esta cultura", options: likertOptions },
      { id: "c5", text: "Siento nostalgia intensa por mi país de origen", options: [...likertOptions].reverse() },
      { id: "c6", text: "Me siento parte de la comunidad donde vivo", options: likertOptions },
      { id: "c7", text: "Puedo mantener mi identidad cultural mientras me adapto", options: likertOptions },
      { id: "c8", text: "Me siento en casa en este país", options: likertOptions },
    ],
  },
  {
    id: "work_life_balance",
    title: "Balance Vida-Trabajo",
    description: "Mide qué tan equilibrada es tu vida profesional y personal como expat",
    icon: "⚖️",
    color: "sage",
    questions: [
      { id: "w1", text: "Tengo suficiente tiempo para actividades personales", options: likertOptions },
      { id: "w2", text: "Me desconecto del trabajo fuera del horario laboral", options: likertOptions },
      { id: "w3", text: "El trabajo interfiere con mis relaciones personales", options: [...likertOptions].reverse() },
      { id: "w4", text: "Me siento satisfecho/a con mi carrera profesional aquí", options: likertOptions },
      { id: "w5", text: "Tengo energía para disfrutar mi vida fuera del trabajo", options: likertOptions },
      { id: "w6", text: "Las diferencias culturales laborales me generan estrés", options: [...likertOptions].reverse() },
      { id: "w7", text: "Siento que mi trabajo tiene propósito y significado", options: likertOptions },
      { id: "w8", text: "Puedo establecer límites saludables en el trabajo", options: likertOptions },
    ],
  },
];

export const getScoreLabel = (score: number, maxScore: number): { label: string; color: string; advice: string } => {
  const pct = score / maxScore;
  if (pct <= 0.25) return { label: "Excelente", color: "mood-5", advice: "¡Estás en un gran momento! Sigue con tus hábitos actuales." };
  if (pct <= 0.5) return { label: "Bueno", color: "mood-4", advice: "Vas bien. Algunos ajustes pequeños pueden ayudarte a mantener el equilibrio." };
  if (pct <= 0.75) return { label: "Moderado", color: "mood-3", advice: "Hay áreas de oportunidad. Considera explorar las herramientas del Kit SOS." };
  return { label: "Necesita atención", color: "mood-1", advice: "Tu bienestar necesita atención. Te recomendamos buscar apoyo profesional." };
};
