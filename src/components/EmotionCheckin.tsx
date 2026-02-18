import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const EMOTIONS = [
  { key: "happy", emoji: "😊", color: "from-[hsl(var(--mood-5))] to-[hsl(var(--sage))]", mood: 5 },
  { key: "nostalgic", emoji: "🥹", color: "from-[hsl(var(--warm))] to-[hsl(var(--coral))]", mood: 3 },
  { key: "anxious", emoji: "😰", color: "from-[hsl(var(--coral))] to-[hsl(var(--mood-2))]", mood: 2 },
  { key: "lonely", emoji: "😔", color: "from-[hsl(var(--mood-3))] to-[hsl(var(--muted))]", mood: 2 },
  { key: "overwhelmed", emoji: "⚡", color: "from-[hsl(var(--mood-2))] to-[hsl(var(--coral))]", mood: 1 },
  { key: "connected", emoji: "🧘", color: "from-[hsl(var(--calm))] to-[hsl(var(--primary))]", mood: 4 },
];

// Maps emotions to resource tags for recommendations
export const EMOTION_TAG_MAP: Record<string, string[]> = {
  happy: ["felicidad", "logros"],
  nostalgic: ["nostalgia", "duelo_migratorio"],
  anxious: ["ansiedad", "agobio"],
  lonely: ["soledad", "conexion_social", "hacer_amigos"],
  overwhelmed: ["agobio", "ansiedad"],
  connected: ["felicidad", "conexion_social", "logros"],
};

interface EmotionCheckinProps {
  selected: string | null;
  onSelect: (emotion: string) => void;
}

const EmotionCheckin = ({ selected, onSelect }: EmotionCheckinProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-3">
      {EMOTIONS.map((emo, i) => (
        <motion.button
          key={emo.key}
          onClick={() => onSelect(emo.key)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.92 }}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${
            selected === emo.key
              ? `bg-gradient-to-br ${emo.color} text-white ring-2 ring-primary shadow-lg scale-[1.05]`
              : "glass hover:bg-muted/80"
          }`}
        >
          <span className="text-3xl">{emo.emoji}</span>
          <span className={`text-xs font-medium ${selected === emo.key ? "text-white" : "text-foreground"}`}>
            {t(`emotions.${emo.key}`)}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default EmotionCheckin;
