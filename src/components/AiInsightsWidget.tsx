import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Brain, Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

const AiInsightsWidget = () => {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["ai-insights", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { language: i18n.language?.startsWith("en") ? "en" : "es" },
      });
      if (error) throw error;
      return data as { insight: string | null; hasData: boolean; avgMood?: number; topEmotions?: string[] };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30, // 30 min cache
    refetchOnWindowFocus: false,
  });

  if (!user || (!isLoading && !data?.hasData)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass rounded-2xl p-4 relative overflow-hidden"
    >
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--warm))] to-[hsl(var(--calm))]" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--warm))] flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">{t("dashboard.ai_insight_title")}</h3>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {t("dashboard.ai_powered")}
            </span>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading || isRefetching ? (
        <div className="space-y-2 py-2">
          <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
          <div className="h-3 bg-muted rounded-full w-4/5 animate-pulse" />
          <div className="h-3 bg-muted rounded-full w-3/5 animate-pulse" />
        </div>
      ) : data?.insight ? (
        <div className="prose prose-sm max-w-none text-sm text-foreground/90 leading-relaxed [&>p]:mb-1">
          <ReactMarkdown>{data.insight}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("dashboard.ai_no_insight")}</p>
      )}
    </motion.div>
  );
};

export default AiInsightsWidget;
