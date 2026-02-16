import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookHeart, ClipboardCheck, ShieldAlert, TrendingUp, Smile, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😄"];

const now = new Date();
const mockEntries = [
  { id: "m1", mood: 4, created_at: new Date(now.getTime() - 0 * 86400000).toISOString() },
  { id: "m2", mood: 3, created_at: new Date(now.getTime() - 1 * 86400000).toISOString() },
  { id: "m3", mood: 5, created_at: new Date(now.getTime() - 2 * 86400000).toISOString() },
  { id: "m4", mood: 3, created_at: new Date(now.getTime() - 3 * 86400000).toISOString() },
  { id: "m5", mood: 4, created_at: new Date(now.getTime() - 4 * 86400000).toISOString() },
];

const mockAssessments = [
  { id: "a1", assessment_type: "stress", score: 18, max_score: 40, created_at: new Date(now.getTime() - 1 * 86400000).toISOString() },
  { id: "a2", assessment_type: "emotional_regulation", score: 28, max_score: 40, created_at: new Date(now.getTime() - 3 * 86400000).toISOString() },
  { id: "a3", assessment_type: "cultural_adaptation", score: 30, max_score: 40, created_at: new Date(now.getTime() - 5 * 86400000).toISOString() },
  { id: "a4", assessment_type: "work_life_balance", score: 22, max_score: 40, created_at: new Date(now.getTime() - 7 * 86400000).toISOString() },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en" : "es";

  const { data: dbEntries } = useQuery({
    queryKey: ["recent-journal", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: dbAssessments } = useQuery({
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

  const recentEntries = (dbEntries && dbEntries.length > 0) ? dbEntries : mockEntries;
  const recentAssessments = (dbAssessments && dbAssessments.length > 0) ? dbAssessments : mockAssessments;

  const cards = [
    { to: "/journal", icon: BookHeart, title: t("dashboard.journal_title"), desc: t("dashboard.journal_desc"), gradient: "from-[hsl(var(--warm))] to-[hsl(var(--coral))]", bg: "bg-warm-light" },
    { to: "/assessments", icon: ClipboardCheck, title: t("dashboard.tests_title"), desc: t("dashboard.tests_desc"), gradient: "from-[hsl(var(--calm))] to-[hsl(var(--sage))]", bg: "bg-calm-light" },
    { to: "/emergency-kit", icon: ShieldAlert, title: t("dashboard.sos_title"), desc: t("dashboard.sos_desc"), gradient: "from-[hsl(var(--coral))] to-[hsl(var(--mood-2))]", bg: "bg-coral-light" },
  ];

  const typeLabels: Record<string, string> = {
    stress: t("dashboard.stress"),
    emotional_regulation: t("dashboard.emotions"),
    cultural_adaptation: t("dashboard.adaptation"),
    work_life_balance: t("dashboard.balance"),
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero Banner */}
      <motion.div
        variants={item}
        className="relative rounded-3xl overflow-hidden"
      >
        <img
          src={dashboardHero}
          alt="Expat wellness illustration"
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[hsl(var(--warm))]" />
              <span className="text-sm font-medium text-[hsl(var(--warm))]">Expat Rooted</span>
            </div>
            <h1 className="text-2xl sm:text-3xl text-white mb-1">
              {t("dashboard.hello", { name: profile?.display_name?.split(" ")[0] || "Expat" })}
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-md">
              {t("dashboard.how_are_you")}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ to, icon: Icon, title, desc, gradient, bg }, index) => (
          <motion.div
            key={to}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link to={to} className="group block glass rounded-2xl p-5 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{desc}</p>
              <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>{locale === "es" ? "Explorar" : "Explore"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Mood */}
      {recentEntries.length > 0 && (
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-[hsl(var(--warm))]" />
              <h2 className="font-display text-xl text-foreground">{t("dashboard.recent_mood")}</h2>
            </div>
            <Link to="/journal" className="text-sm text-primary hover:underline">
              {locale === "es" ? "Ver todo" : "See all"}
            </Link>
          </div>
          <div className="flex gap-4">
            {recentEntries.map((entry: any, i: number) => (
              <motion.div
                key={entry.id}
                className="text-center flex-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.2 }}
              >
                <div className="text-3xl mb-1 cursor-default">{moodEmojis[entry.mood - 1]}</div>
                <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString(locale, { weekday: "short" })}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <motion.div variants={item} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl text-foreground">{t("dashboard.recent_tests")}</h2>
            </div>
            <Link to="/assessments" className="text-sm text-primary hover:underline">
              {locale === "es" ? "Ver todo" : "See all"}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentAssessments.map((result: any, i: number) => {
              const pct = Math.round((result.score / result.max_score) * 100);
              const color = pct >= 75 ? "text-[hsl(var(--mood-5))]" : pct >= 50 ? "text-[hsl(var(--warm))]" : "text-[hsl(var(--coral))]";
              return (
                <motion.div
                  key={result.id}
                  className="bg-muted rounded-xl p-4 text-center hover:bg-muted/80 transition-colors cursor-default"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-sm font-medium text-foreground">{typeLabels[result.assessment_type] || result.assessment_type}</div>
                  <div className={`text-2xl font-bold mt-1 ${color}`}>{pct}%</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(result.created_at).toLocaleDateString(locale)}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
