import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessments, getScoreLabel } from "@/data/assessments";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, ChevronRight, ArrowLeft, BarChart3, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const Assessments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en" : "es";
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const { data: history } = useQuery({
    queryKey: ["assessments-history", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("assessment_results").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ type, score, maxScore }: { type: string; score: number; maxScore: number }) => {
      const { error } = await supabase.from("assessment_results").insert({ user_id: user!.id, assessment_type: type, score, max_score: maxScore, answers });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments-history"] });
      queryClient.invalidateQueries({ queryKey: ["recent-assessments"] });
    },
  });

  const assessment = assessments.find((a) => a.id === activeAssessment);

  const handleAnswer = (value: number) => {
    if (!assessment) return;
    const q = assessment.questions[currentQ];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    if (currentQ < assessment.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const score = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const maxScore = assessment.questions.length * 4;
      saveMutation.mutate({ type: assessment.id, score, maxScore });
      setShowResult(true);
      fetchAiRecommendation(assessment.id, score, maxScore);
    }
  };

  const fetchAiRecommendation = async (type: string, score: number, maxScore: number) => {
    setLoadingAi(true);
    setAiRecommendation(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-recommendations", {
        body: { assessmentType: type, score, maxScore, language: locale },
      });
      if (error) throw error;
      setAiRecommendation(data.recommendation);
    } catch (e: any) {
      console.error("AI error:", e);
      toast({ title: t("assessments.no_recommendations"), variant: "destructive" });
    } finally {
      setLoadingAi(false);
    }
  };

  const resetTest = () => {
    setActiveAssessment(null); setCurrentQ(0); setAnswers({}); setShowResult(false);
    setAiRecommendation(null); setLoadingAi(false);
  };

  if (showResult && assessment) {
    const score = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = assessment.questions.length * 4;
    const result = getScoreLabel(score, maxScore, t);
    const pct = Math.round((score / maxScore) * 100);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto text-center space-y-6">
        <div className="text-5xl mb-2">{assessment.icon}</div>
        <h1 className="text-3xl">{t(assessment.titleKey)}</h1>
        <div className="glass rounded-2xl p-8 space-y-4">
          <div className="text-6xl font-bold text-primary">{pct}%</div>
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-${result.color}/20 text-${result.color}`}>{result.label}</div>
          <p className="text-muted-foreground">{result.advice}</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-warm" />
            <h3 className="font-display text-lg text-foreground">{t("assessments.recommendations_title")}</h3>
          </div>
          {loadingAi ? (
            <div className="flex items-center gap-2 justify-center py-6 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t("assessments.loading_ai")}</span>
            </div>
          ) : aiRecommendation ? (
            <div className="prose prose-sm max-w-none text-muted-foreground [&_strong]:text-foreground [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display">
              <ReactMarkdown>{aiRecommendation}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">{t("assessments.no_recommendations")}</p>
          )}
        </motion.div>
        <Button onClick={resetTest}>{t("assessments.back_to_tests")}</Button>
      </motion.div>
    );
  }

  if (assessment) {
    const q = assessment.questions[currentQ];
    const progress = ((currentQ) / assessment.questions.length) * 100;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-6">
        <button onClick={resetTest} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm">
          <ArrowLeft className="w-4 h-4" /> {t("assessments.back")}
        </button>
        <div>
          <h1 className="text-2xl">{assessment.icon} {t(assessment.titleKey)}</h1>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full gradient-calm rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{currentQ + 1} {t("assessments.of")} {assessment.questions.length}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-2xl p-6 space-y-4">
            <p className="text-lg font-medium text-foreground">{t(q.textKey)}</p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <button key={opt.labelKey + opt.value} onClick={() => handleAnswer(opt.value)} className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-secondary transition-colors text-sm text-foreground">
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  const typeLabels: Record<string, string> = {
    stress: t("dashboard.stress"), emotional_regulation: t("dashboard.emotions"),
    cultural_adaptation: t("dashboard.adaptation"), work_life_balance: t("dashboard.balance"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl flex items-center gap-2"><ClipboardCheck className="w-8 h-8 text-calm" /> {t("assessments.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("assessments.subtitle")}</p>
      </div>
      <div className="grid gap-4">
        {assessments.map((a) => {
          const latestResult = history?.find((h: any) => h.assessment_type === a.id);
          return (
            <motion.button key={a.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setActiveAssessment(a.id)} className="glass rounded-2xl p-5 text-left flex items-center gap-4 w-full">
              <div className="text-3xl">{a.icon}</div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-foreground">{t(a.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(a.descKey)}</p>
              </div>
              {latestResult && (
                <div className="text-right mr-2">
                  <div className="text-lg font-bold text-primary">{Math.round((latestResult.score / latestResult.max_score) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">{t("assessments.last")}</div>
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          );
        })}
      </div>
      {history && history.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-calm" />
            <h2 className="font-display text-xl text-foreground">{t("assessments.history")}</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <span className="text-sm font-medium text-foreground">{typeLabels[r.assessment_type] || r.assessment_type}</span>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(r.created_at).toLocaleDateString(locale)}</span>
                </div>
                <span className="text-sm font-bold text-primary">{Math.round((r.score / r.max_score) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;
