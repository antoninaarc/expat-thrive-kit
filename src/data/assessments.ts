import { TFunction } from "i18next";

export interface Question {
  id: string;
  textKey: string;
  options: { labelKey: string; value: number }[];
}

export interface Assessment {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  color: string;
  questions: Question[];
}

const likertOptionKeys = [
  { labelKey: "assessments.never", value: 0 },
  { labelKey: "assessments.almost_never", value: 1 },
  { labelKey: "assessments.sometimes", value: 2 },
  { labelKey: "assessments.often", value: 3 },
  { labelKey: "assessments.always", value: 4 },
];

export const assessments: Assessment[] = [
  {
    id: "stress", titleKey: "assessments.stress_title", descKey: "assessments.stress_desc", icon: "🧠", color: "coral",
    questions: [
      { id: "s1", textKey: "assessments.questions.s1", options: likertOptionKeys },
      { id: "s2", textKey: "assessments.questions.s2", options: likertOptionKeys },
      { id: "s3", textKey: "assessments.questions.s3", options: likertOptionKeys },
      { id: "s4", textKey: "assessments.questions.s4", options: [...likertOptionKeys].reverse() },
      { id: "s5", textKey: "assessments.questions.s5", options: [...likertOptionKeys].reverse() },
      { id: "s6", textKey: "assessments.questions.s6", options: likertOptionKeys },
      { id: "s7", textKey: "assessments.questions.s7", options: [...likertOptionKeys].reverse() },
      { id: "s8", textKey: "assessments.questions.s8", options: [...likertOptionKeys].reverse() },
      { id: "s9", textKey: "assessments.questions.s9", options: likertOptionKeys },
      { id: "s10", textKey: "assessments.questions.s10", options: likertOptionKeys },
    ],
  },
  {
    id: "emotional_regulation", titleKey: "assessments.emotional_title", descKey: "assessments.emotional_desc", icon: "💚", color: "calm",
    questions: [
      { id: "e1", textKey: "assessments.questions.e1", options: [...likertOptionKeys].reverse() },
      { id: "e2", textKey: "assessments.questions.e2", options: likertOptionKeys },
      { id: "e3", textKey: "assessments.questions.e3", options: likertOptionKeys },
      { id: "e4", textKey: "assessments.questions.e4", options: [...likertOptionKeys].reverse() },
      { id: "e5", textKey: "assessments.questions.e5", options: likertOptionKeys },
      { id: "e6", textKey: "assessments.questions.e6", options: [...likertOptionKeys].reverse() },
      { id: "e7", textKey: "assessments.questions.e7", options: likertOptionKeys },
      { id: "e8", textKey: "assessments.questions.e8", options: [...likertOptionKeys].reverse() },
    ],
  },
  {
    id: "cultural_adaptation", titleKey: "assessments.cultural_title", descKey: "assessments.cultural_desc", icon: "🌍", color: "warm",
    questions: [
      { id: "c1", textKey: "assessments.questions.c1", options: likertOptionKeys },
      { id: "c2", textKey: "assessments.questions.c2", options: likertOptionKeys },
      { id: "c3", textKey: "assessments.questions.c3", options: likertOptionKeys },
      { id: "c4", textKey: "assessments.questions.c4", options: likertOptionKeys },
      { id: "c5", textKey: "assessments.questions.c5", options: [...likertOptionKeys].reverse() },
      { id: "c6", textKey: "assessments.questions.c6", options: likertOptionKeys },
      { id: "c7", textKey: "assessments.questions.c7", options: likertOptionKeys },
      { id: "c8", textKey: "assessments.questions.c8", options: likertOptionKeys },
    ],
  },
  {
    id: "work_life_balance", titleKey: "assessments.work_title", descKey: "assessments.work_desc", icon: "⚖️", color: "sage",
    questions: [
      { id: "w1", textKey: "assessments.questions.w1", options: likertOptionKeys },
      { id: "w2", textKey: "assessments.questions.w2", options: likertOptionKeys },
      { id: "w3", textKey: "assessments.questions.w3", options: [...likertOptionKeys].reverse() },
      { id: "w4", textKey: "assessments.questions.w4", options: likertOptionKeys },
      { id: "w5", textKey: "assessments.questions.w5", options: likertOptionKeys },
      { id: "w6", textKey: "assessments.questions.w6", options: [...likertOptionKeys].reverse() },
      { id: "w7", textKey: "assessments.questions.w7", options: likertOptionKeys },
      { id: "w8", textKey: "assessments.questions.w8", options: likertOptionKeys },
    ],
  },
];

export const getScoreLabel = (score: number, maxScore: number, t: TFunction): { label: string; color: string; advice: string } => {
  const pct = score / maxScore;
  if (pct <= 0.25) return { label: t("assessments.score_excellent"), color: "mood-5", advice: t("assessments.advice_excellent") };
  if (pct <= 0.5) return { label: t("assessments.score_good"), color: "mood-4", advice: t("assessments.advice_good") };
  if (pct <= 0.75) return { label: t("assessments.score_moderate"), color: "mood-3", advice: t("assessments.advice_moderate") };
  return { label: t("assessments.score_attention"), color: "mood-1", advice: t("assessments.advice_attention") };
};
