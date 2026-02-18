import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sun, Flame, CheckCircle2, Circle, Sparkles, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";
import FlashcardSection from "@/components/FlashcardSection";
import EmotionCheckin, { EMOTIONS } from "@/components/EmotionCheckin";
import RecommendationsSection from "@/components/RecommendationsSection";

const DAILY_PROMPTS_ES = [
  "¿Qué es lo primero que sentiste al despertar hoy?",
  "¿Hay algo de tu país que extrañas especialmente hoy?",
  "Nombra una cosa buena que te ha pasado aquí en Holanda.",
  "¿Qué te genera más estrés en este momento?",
  "¿Con quién te gustaría hablar hoy? ¿Por qué?",
  "¿Qué parte de la cultura holandesa te sorprendió esta semana?",
  "¿Qué harías si no tuvieras miedo?",
  "Escribe 3 cosas por las que estás agradecido/a hoy.",
  "¿Cómo describirías tu energía hoy en una palabra?",
  "¿Qué necesitas soltar hoy?",
  "¿Qué aprendiste sobre ti mismo/a esta semana?",
  "¿Cuándo fue la última vez que te sentiste en casa aquí?",
  "¿Qué conversación pendiente necesitas tener?",
  "¿Qué ritual te ayuda a sentirte más arraigado/a?",
  "Si pudieras decirle algo a tu yo de hace 6 meses, ¿qué sería?",
  "¿Qué te hace sentir orgulloso/a de vivir en otro país?",
  "¿Cómo está tu cuerpo hoy? ¿Dónde sientes tensión?",
  "¿Qué limite necesitas poner hoy?",
  "Describe tu momento favorito de esta semana.",
  "¿Qué emoción te cuesta más aceptar?",
  "¿Hay algo que estés evitando? ¿Por qué?",
  "¿Qué te gustaría que fuera diferente en tu vida hoy?",
  "Escribe una cosa amable que te dirías a ti mismo/a.",
  "¿Qué te conecta con las personas a tu alrededor?",
  "¿Cómo podrías cuidarte mejor mañana?",
  "¿Qué te da esperanza en este momento?",
  "¿Cuál es tu mayor logro desde que llegaste a Holanda?",
  "¿Qué creencia sobre ti mismo/a quieres cuestionar?",
  "¿Cómo te sientes con tu balance vida-trabajo hoy?",
  "Si hoy fuera perfecto, ¿cómo se vería?",
];

const DAILY_PROMPTS_EN = [
  "What's the first thing you felt when you woke up today?",
  "Is there something about your home country you miss especially today?",
  "Name one good thing that happened to you here in the Netherlands.",
  "What's causing you the most stress right now?",
  "Who would you like to talk to today? Why?",
  "What part of Dutch culture surprised you this week?",
  "What would you do if you weren't afraid?",
  "Write 3 things you're grateful for today.",
  "How would you describe your energy today in one word?",
  "What do you need to let go of today?",
  "What did you learn about yourself this week?",
  "When was the last time you felt at home here?",
  "What pending conversation do you need to have?",
  "What ritual helps you feel more rooted?",
  "If you could tell your 6-months-ago self something, what would it be?",
  "What makes you proud of living in another country?",
  "How is your body today? Where do you feel tension?",
  "What boundary do you need to set today?",
  "Describe your favorite moment of this week.",
  "What emotion is hardest for you to accept?",
  "Is there something you're avoiding? Why?",
  "What would you like to be different in your life today?",
  "Write one kind thing you'd say to yourself.",
  "What connects you to the people around you?",
  "How could you take better care of yourself tomorrow?",
  "What gives you hope right now?",
  "What's your biggest achievement since arriving in the Netherlands?",
  "What belief about yourself do you want to question?",
  "How do you feel about your work-life balance today?",
  "If today were perfect, what would it look like?",
];

const QUICK_EXERCISES = [
  { key: "breathing", duration: "2 min", icon: "🌬️" },
  { key: "grounding", duration: "2 min", icon: "🌿" },
  { key: "gratitude", duration: "1 min", icon: "🙏" },
];

const moodEmojis = [
  { value: 1, emoji: "😢" },
  { value: 2, emoji: "😟" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "🙂" },
  { value: 5, emoji: "😄" },
];

// Streak milestone messages
const getStreakMessage = (streak: number, isEn: boolean): string | null => {
  if (streak === 3) return isEn ? "🔥 3 days! You're building a habit!" : "🔥 ¡3 días! ¡Estás creando un hábito!";
  if (streak === 7) return isEn ? "⭐ 1 week streak! Amazing!" : "⭐ ¡1 semana de racha! ¡Increíble!";
  if (streak === 15) return isEn ? "🏆 15 days! You're a wellness warrior!" : "🏆 ¡15 días! ¡Eres un guerrero del bienestar!";
  if (streak === 30) return isEn ? "👑 30 days! You've transformed your routine!" : "👑 ¡30 días! ¡Has transformado tu rutina!";
  return null;
};

const DailyRoutine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");

  const todayStr = new Date().toISOString().split("T")[0];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

  // Fetch prompts from DB
  const { data: dbPrompts } = useQuery({
    queryKey: ["journal-prompts"],
    queryFn: async () => {
      const { data } = await supabase.from("journal_prompts").select("*").order("day_index");
      return data || [];
    },
  });

  const promptIndex = dbPrompts && dbPrompts.length > 0
    ? dayOfYear % dbPrompts.length
    : dayOfYear % DAILY_PROMPTS_ES.length;

  const todayPrompt = (() => {
    if (dbPrompts && dbPrompts.length > 0) {
      const p = dbPrompts[dayOfYear % dbPrompts.length];
      return isEn ? (p.prompt_en || p.prompt_es) : p.prompt_es;
    }
    return isEn ? DAILY_PROMPTS_EN[promptIndex] : DAILY_PROMPTS_ES[promptIndex];
  })();

  const [mood, setMood] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [thought, setThought] = useState("");
  const [exerciseDone, setExerciseDone] = useState(false);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Fetch profile for time_abroad
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch today's checkin
  const { data: todayCheckin } = useQuery({
    queryKey: ["daily-checkin", user?.id, todayStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("checkin_date", todayStr)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch streak
  const { data: checkins } = useQuery({
    queryKey: ["checkin-history", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("daily_checkins")
        .select("checkin_date")
        .order("checkin_date", { ascending: false })
        .limit(60);
      return data || [];
    },
    enabled: !!user,
  });

  const streak = useMemo(() => {
    if (!checkins?.length) return 0;
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < checkins.length; i++) {
      const d = new Date(checkins[i].checkin_date + "T00:00:00");
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (d.getTime() === expected.getTime()) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [checkins]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const emoData = selectedEmotion ? EMOTIONS.find(e => e.key === selectedEmotion) : null;
      const moodVal = emoData ? emoData.mood : (mood || 3);
      const { error } = await supabase.from("daily_checkins").upsert({
        user_id: user!.id,
        checkin_date: todayStr,
        mood: moodVal,
        emotion: selectedEmotion,
        thought: thought || null,
        prompt_index: promptIndex,
        exercise_completed: exerciseDone,
      }, { onConflict: "user_id,checkin_date" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-checkin"] });
      queryClient.invalidateQueries({ queryKey: ["checkin-history"] });
      toast({ title: t("routine.saved") });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Timer logic
  const startExercise = (key: string) => {
    setActiveExercise(key);
    setTimer(key === "gratitude" ? 60 : 120);
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          setExerciseDone(true);
          setActiveExercise(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const alreadyDone = !!todayCheckin;

  const steps = [
    { label: t("routine.step_mood"), done: alreadyDone || selectedEmotion !== null },
    { label: t("routine.step_thought"), done: alreadyDone || thought.length > 0 },
    { label: t("routine.step_exercise"), done: alreadyDone ? todayCheckin.exercise_completed : exerciseDone },
  ];

  const streakMsg = getStreakMessage(streak, isEn);

  return (
    <div className="space-y-6">
      {/* Header with streak */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-2">
            <Sun className="w-8 h-8 text-warm" />
            {t("routine.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("routine.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass">
          <Flame className="w-5 h-5 text-accent" />
          <span className="text-2xl font-bold text-foreground">{streak}</span>
          <span className="text-xs text-muted-foreground">{t("routine.streak")}</span>
        </div>
      </div>

      {/* Streak milestone message */}
      {streakMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-gradient-to-r from-[hsl(var(--warm))] to-[hsl(var(--coral))] p-4 text-white text-center"
        >
          <p className="font-display font-bold text-sm">{streakMsg}</p>
        </motion.div>
      )}

      {/* Progress steps */}
      <div className="flex gap-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 glass rounded-xl px-3 py-2">
            {step.done ? (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={`text-sm ${step.done ? "text-primary font-medium" : "text-muted-foreground"}`}>{step.label}</span>
          </div>
        ))}
      </div>

      {alreadyDone ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 text-center space-y-3">
          <div className="text-5xl">
            {todayCheckin.emotion
              ? EMOTIONS.find(e => e.key === todayCheckin.emotion)?.emoji
              : moodEmojis.find(m => m.value === todayCheckin.mood)?.emoji}
          </div>
          <h2 className="text-xl font-display text-foreground">{t("routine.done_title")}</h2>
          <p className="text-muted-foreground">{t("routine.done_desc")}</p>
          {todayCheckin.thought && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50 text-sm text-foreground italic">
              "{todayCheckin.thought}"
            </div>
          )}
          {/* Show recommendations after check-in */}
          <div className="mt-6 text-left">
            <RecommendationsSection
              lastEmotion={todayCheckin.emotion}
              timeAbroad={(profile as any)?.time_abroad}
              streak={streak}
            />
          </div>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {/* Daily Prompt */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-warm" />
              <span className="text-sm font-medium text-foreground">{t("routine.prompt_label")}</span>
            </div>
            <p className="text-lg font-display text-foreground leading-relaxed">{todayPrompt}</p>
          </motion.div>

          {/* Emotion selector (6 visual cards) */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-5">
            <label className="text-sm font-medium text-foreground mb-3 block">{t("routine.how_feel")}</label>
            <EmotionCheckin selected={selectedEmotion} onSelect={setSelectedEmotion} />
          </motion.div>

          {/* Context (what happened today) */}
          <AnimatePresence>
            {selectedEmotion && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-5">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {isEn ? "What happened today? (optional)" : "¿Qué pasó hoy? (opcional)"}
                </label>
                <Textarea value={thought} onChange={(e) => setThought(e.target.value)} placeholder={t("routine.thought_placeholder")} rows={3} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick exercise */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-5">
            <label className="text-sm font-medium text-foreground mb-3 block">{t("routine.exercise_label")}</label>
            {activeExercise ? (
              <div className="text-center space-y-3">
                <div className="text-4xl">{QUICK_EXERCISES.find(e => e.key === activeExercise)?.icon}</div>
                <div className="flex items-center justify-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-mono font-bold text-foreground">
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{t(`routine.exercise_${activeExercise}`)}</p>
              </div>
            ) : exerciseDone ? (
              <div className="text-center py-3">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-primary font-medium">{t("routine.exercise_done")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {QUICK_EXERCISES.map((ex) => (
                  <button key={ex.key} onClick={() => startExercise(ex.key)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-all">
                    <span className="text-2xl">{ex.icon}</span>
                    <span className="text-xs font-medium text-foreground">{t(`routine.exercise_${ex.key}_title`)}</span>
                    <span className="text-xs text-muted-foreground">{ex.duration}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Save */}
          <Button onClick={() => saveMutation.mutate()} disabled={!selectedEmotion || saveMutation.isPending} className="w-full" size="lg">
            {saveMutation.isPending ? t("routine.saving") : t("routine.save")}
          </Button>
        </div>
      )}

      {/* Flashcards section */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <FlashcardSection />
      </div>
    </div>
  );
};

export default DailyRoutine;
