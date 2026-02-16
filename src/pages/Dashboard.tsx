import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookHeart, ClipboardCheck, ShieldAlert, TrendingUp, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😄"];

const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en" : "es";

  const { data: recentEntries } = useQuery({
    queryKey: ["recent-journal", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: recentAssessments } = useQuery({
    queryKey: ["recent-assessments", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("assessment_results").select("*").order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const cards = [
    { to: "/journal", icon: BookHeart, title: t("dashboard.journal_title"), desc: t("dashboard.journal_desc"), color: "bg-warm-light text-warm" },
    { to: "/assessments", icon: ClipboardCheck, title: t("dashboard.tests_title"), desc: t("dashboard.tests_desc"), color: "bg-calm-light text-calm" },
    { to: "/emergency-kit", icon: ShieldAlert, title: t("dashboard.sos_title"), desc: t("dashboard.sos_desc"), color: "bg-coral-light text-coral" },
  ];

  const typeLabels: Record<string, string> = {
    stress: t("dashboard.stress"),
    emotional_regulation: t("dashboard.emotions"),
    cultural_adaptation: t("dashboard.adaptation"),
    work_life_balance: t("dashboard.balance"),
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-3xl mb-1">{t("dashboard.hello", { name: profile?.display_name?.split(" ")[0] || "Expat" })}</h1>
        <p className="text-muted-foreground">{t("dashboard.how_are_you")}</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ to, icon: Icon, title, desc, color }) => (
          <Link key={to} to={to} className="group glass rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
            <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </motion.div>

      {recentEntries && recentEntries.length > 0 && (
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Smile className="w-5 h-5 text-warm" />
            <h2 className="font-display text-xl text-foreground">{t("dashboard.recent_mood")}</h2>
          </div>
          <div className="flex gap-3">
            {recentEntries.map((entry: any) => (
              <div key={entry.id} className="text-center">
                <div className="text-2xl mb-1">{moodEmojis[entry.mood - 1]}</div>
                <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString(locale, { weekday: "short" })}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {recentAssessments && recentAssessments.length > 0 && (
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-calm" />
            <h2 className="font-display text-xl text-foreground">{t("dashboard.recent_tests")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentAssessments.map((result: any) => {
              const pct = Math.round((result.score / result.max_score) * 100);
              return (
                <div key={result.id} className="bg-muted rounded-xl p-3 text-center">
                  <div className="text-sm font-medium text-foreground">{typeLabels[result.assessment_type] || result.assessment_type}</div>
                  <div className="text-2xl font-bold text-primary mt-1">{pct}%</div>
                  <div className="text-xs text-muted-foreground">{new Date(result.created_at).toLocaleDateString(locale)}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
