import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookHeart, ClipboardCheck, ShieldAlert, Smile, ArrowRight,
  Sparkles, Flame, Calendar, Lightbulb, Play, Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😄"];

const now = new Date();
const mockEntries = [
  { id: "m1", mood: 4, created_at: new Date(now.getTime() - 0 * 86400000).toISOString() },
  { id: "m2", mood: 3, created_at: new Date(now.getTime() - 1 * 86400000).toISOString() },
  { id: "m3", mood: 5, created_at: new Date(now.getTime() - 2 * 86400000).toISOString() },
  { id: "m4", mood: 3, created_at: new Date(now.getTime() - 3 * 86400000).toISOString() },
  { id: "m5", mood: 4, created_at: new Date(now.getTime() - 4 * 86400000).toISOString() },
  { id: "m6", mood: 2, created_at: new Date(now.getTime() - 5 * 86400000).toISOString() },
  { id: "m7", mood: 4, created_at: new Date(now.getTime() - 6 * 86400000).toISOString() },
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
      const { data } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false }).limit(7);
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

  const { data: activePrograms } = useQuery({
    queryKey: ["active-programs", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_program_progress")
        .select("*, programs(*)")
        .eq("user_id", user!.id)
        .is("completed_at", null)
        .order("started_at", { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: checkins } = useQuery({
    queryKey: ["streak-checkins", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("daily_checkins")
        .select("checkin_date")
        .eq("user_id", user!.id)
        .order("checkin_date", { ascending: false })
        .limit(30);
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate streak
  const streak = (() => {
    if (!checkins || checkins.length === 0) return 3; // mock
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < checkins.length; i++) {
      const d = new Date(checkins[i].checkin_date);
      d.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (d.getTime() === expected.getTime()) {
        count++;
      } else break;
    }
    return count;
  })();

  const recentEntries = (dbEntries && dbEntries.length > 0) ? dbEntries : mockEntries;
  const recentAssessments = (dbAssessments && dbAssessments.length > 0) ? dbAssessments : mockAssessments;
  const programs = activePrograms || [];

  const typeLabels: Record<string, string> = {
    stress: t("dashboard.stress"),
    emotional_regulation: t("dashboard.emotions"),
    cultural_adaptation: t("dashboard.adaptation"),
    work_life_balance: t("dashboard.balance"),
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } } };

  // Mood bar chart max height
  const maxBarH = 48;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Hero Banner */}
      <motion.div variants={item} className="relative rounded-2xl overflow-hidden">
        <img src={dashboardHero} alt="Expat wellness" className="w-full h-44 sm:h-52 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--warm))]" />
              <span className="text-xs font-medium text-[hsl(var(--warm))]">Expat Rooted</span>
            </div>
            <h1 className="text-xl sm:text-2xl text-white font-display font-bold mb-0.5">
              {t("dashboard.hello", { name: profile?.display_name?.split(" ")[0] || "Expat" })}
            </h1>
            <p className="text-white/75 text-sm max-w-sm">{t("dashboard.how_are_you")}</p>
          </motion.div>
        </div>

        {/* Streak badge */}
        <motion.div
          className="absolute top-3 right-3 glass rounded-xl px-3 py-1.5 flex items-center gap-1.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Flame className="w-4 h-4 text-[hsl(var(--warm))]" />
          <span className="text-xs font-bold text-foreground">{streak}</span>
        </motion.div>
      </motion.div>

      {/* Quick Actions - 2x2 grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {[
          { to: "/routine", icon: Calendar, title: t("dashboard.routine_title"), desc: t("dashboard.routine_desc"), gradient: "from-[hsl(var(--warm))] to-[hsl(var(--coral))]" },
          { to: "/journal", icon: BookHeart, title: t("dashboard.journal_title"), desc: t("dashboard.journal_desc"), gradient: "from-[hsl(var(--calm))] to-[hsl(var(--sage))]" },
          { to: "/assessments", icon: ClipboardCheck, title: t("dashboard.tests_title"), desc: t("dashboard.tests_desc"), gradient: "from-[hsl(var(--sage))] to-[hsl(var(--calm))]" },
          { to: "/emergency-kit", icon: ShieldAlert, title: t("dashboard.sos_title"), desc: t("dashboard.sos_desc"), gradient: "from-[hsl(var(--coral))] to-[hsl(var(--mood-2))]" },
        ].map(({ to, icon: Icon, title, desc, gradient }) => (
          <motion.div key={to} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
            <Link to={to} className="group block glass rounded-2xl p-4 hover:shadow-lg transition-shadow h-full">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Mood Chart - Bar style */}
      <motion.div variants={item} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-[hsl(var(--warm))]" />
            <h2 className="font-display text-base font-semibold text-foreground">{t("dashboard.recent_mood")}</h2>
          </div>
          <Link to="/journal" className="text-xs text-primary hover:underline">{t("dashboard.see_all")}</Link>
        </div>
        <div className="flex items-end gap-2 justify-between">
          {recentEntries.slice(0, 7).reverse().map((entry: any, i: number) => {
            const h = (entry.mood / 5) * maxBarH;
            const colors = [
              "bg-[hsl(var(--mood-1))]",
              "bg-[hsl(var(--mood-2))]",
              "bg-[hsl(var(--mood-3))]",
              "bg-[hsl(var(--mood-4))]",
              "bg-[hsl(var(--mood-5))]",
            ];
            return (
              <motion.div
                key={entry.id}
                className="flex-1 flex flex-col items-center gap-1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                style={{ originY: 1 }}
              >
                <span className="text-sm">{moodEmojis[entry.mood - 1]}</span>
                <div
                  className={`w-full rounded-lg ${colors[entry.mood - 1]} transition-all`}
                  style={{ height: h, minHeight: 6 }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString(locale, { weekday: "narrow" })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Active Programs */}
      <motion.div variants={item} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[hsl(var(--calm))]" />
            <h2 className="font-display text-base font-semibold text-foreground">{t("dashboard.programs_title")}</h2>
          </div>
          <Link to="/programs" className="text-xs text-primary hover:underline">{t("dashboard.see_all")}</Link>
        </div>
        {programs.length > 0 ? (
          <div className="space-y-3">
            {programs.map((prog: any) => {
              const p = prog.programs;
              const pct = Math.round((prog.current_day / (p?.duration_days || 1)) * 100);
              return (
                <Link key={prog.id} to="/programs" className="block">
                  <motion.div className="bg-muted/60 rounded-xl p-3 hover:bg-muted transition-colors" whileHover={{ x: 4 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p?.emoji || "📘"}</span>
                        <span className="text-sm font-medium text-foreground truncate">{p?.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t("dashboard.day_of", { current: prog.current_day, total: p?.duration_days })}
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <Link to="/programs" className="block">
            <div className="bg-muted/60 rounded-xl p-4 text-center hover:bg-muted transition-colors">
              <Play className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("dashboard.no_programs")}</p>
              <span className="text-xs text-primary font-medium">{t("dashboard.start_program")} →</span>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <motion.div variants={item} className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-primary" />
              <h2 className="font-display text-base font-semibold text-foreground">{t("dashboard.recent_tests")}</h2>
            </div>
            <Link to="/assessments" className="text-xs text-primary hover:underline">{t("dashboard.see_all")}</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recentAssessments.map((result: any, i: number) => {
              const pct = Math.round((result.score / result.max_score) * 100);
              const color = pct >= 75 ? "text-[hsl(var(--mood-5))]" : pct >= 50 ? "text-[hsl(var(--warm))]" : "text-[hsl(var(--coral))]";
              return (
                <motion.div
                  key={result.id}
                  className="bg-muted/60 rounded-xl p-3 text-center hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="text-xs font-medium text-foreground">{typeLabels[result.assessment_type] || result.assessment_type}</div>
                  <div className={`text-xl font-bold mt-0.5 ${color}`}>{pct}%</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(result.created_at).toLocaleDateString(locale)}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tip of the day */}
      <motion.div
        variants={item}
        className="rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] p-4 text-white"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm mb-0.5">{t("dashboard.tip_title")}</h3>
            <p className="text-white/80 text-xs leading-relaxed">{t("dashboard.tip_text")}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
