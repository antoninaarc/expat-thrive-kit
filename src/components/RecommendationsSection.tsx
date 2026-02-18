import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { EMOTION_TAG_MAP } from "./EmotionCheckin";
import { BookOpen, Headphones, Play, Dumbbell, Sparkles } from "lucide-react";

const typeIcons: Record<string, any> = {
  article: BookOpen,
  meditation: Headphones,
  audio: Headphones,
  video: Play,
  exercise: Dumbbell,
};

const typeLabelsEs: Record<string, string> = {
  article: "📝 Artículo",
  meditation: "🧘 Meditación",
  audio: "🎧 Audio",
  video: "🎬 Video",
  exercise: "💪 Ejercicio",
};

const typeLabelsEn: Record<string, string> = {
  article: "📝 Article",
  meditation: "🧘 Meditation",
  audio: "🎧 Audio",
  video: "🎬 Video",
  exercise: "💪 Exercise",
};

interface RecommendationsSectionProps {
  lastEmotion?: string | null;
  timeAbroad?: string | null;
  streak?: number;
}

const RecommendationsSection = ({ lastEmotion, timeAbroad, streak = 0 }: RecommendationsSectionProps) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");

  const { data: resources } = useQuery({
    queryKey: ["wellness-resources"],
    queryFn: async () => {
      const { data } = await supabase
        .from("wellness_resources")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data || [];
    },
  });

  if (!resources || resources.length === 0) return null;

  // Get tags for the last emotion
  const emotionTags = lastEmotion ? EMOTION_TAG_MAP[lastEmotion] || [] : [];

  // 1. Emotion-based recommendation
  const emotionRec = emotionTags.length > 0
    ? resources.find((r: any) => r.tags?.some((tag: string) => emotionTags.includes(tag)))
    : null;

  // 2. Time-abroad based recommendation (newer = more basic content)
  const timeTag = timeAbroad === "less_6_months" || timeAbroad === "6_12_months"
    ? "principios_basicos"
    : "logros";
  const timeRec = resources.find((r: any) =>
    r.tags?.includes(timeTag) && r.id !== emotionRec?.id
  );

  // 3. Discovery/varied recommendation
  const usedIds = [emotionRec?.id, timeRec?.id].filter(Boolean);
  const discoveryRec = resources.find((r: any) => !usedIds.includes(r.id));

  // Streak milestone recommendations
  const streakRec = streak >= 30
    ? resources.find((r: any) => r.tags?.includes("logros") && !usedIds.includes(r.id))
    : streak >= 7
    ? resources.find((r: any) => r.tags?.includes("logros") && !usedIds.includes(r.id))
    : null;

  const recommendations = [emotionRec, timeRec, discoveryRec].filter(Boolean).slice(0, 3);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[hsl(var(--warm))]" />
        <h2 className="font-display text-base font-semibold text-foreground">
          {isEn ? "For you today" : "Para ti hoy"}
        </h2>
      </div>

      {/* Streak milestone */}
      {streakRec && streak >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-[hsl(var(--warm))] to-[hsl(var(--coral))] p-4 text-white"
        >
          <div className="text-sm font-bold mb-1">
            🎉 {streak >= 30
              ? (isEn ? "30-day streak! You're incredible!" : "¡30 días de racha! ¡Eres increíble!")
              : (isEn ? "7-day streak! Amazing consistency!" : "¡7 días de racha! ¡Increíble consistencia!")}
          </div>
          <p className="text-xs text-white/80">
            {isEn ? (streakRec as any).title_en : (streakRec as any).title_es}
          </p>
        </motion.div>
      )}

      <div className="space-y-2">
        {recommendations.map((res: any, i: number) => {
          const Icon = typeIcons[res.type] || BookOpen;
          const labels = isEn ? typeLabelsEn : typeLabelsEs;
          return (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                      {labels[res.type] || res.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">· {res.duration_minutes} min</span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground leading-tight">
                    {isEn ? res.title_en : res.title_es}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {isEn ? res.content_en : res.content_es}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationsSection;
