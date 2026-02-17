import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Sun, BookHeart, ClipboardCheck, Target, ShieldAlert,
  BookOpen, Check, Lock, ChevronRight, Sparkles, Map,
} from "lucide-react";

interface Phase {
  id: string;
  titleKey: string;
  descKey: string;
  icon: React.ElementType;
  color: string;
  to: string;
  checkFn: (data: RoadmapData) => boolean;
}

interface RoadmapData {
  hasCheckin: boolean;
  hasJournal: boolean;
  hasAssessment: boolean;
  hasProgram: boolean;
  hasEmergency: boolean; // always "available"
  journalCount: number;
  assessmentCount: number;
  checkinStreak: number;
}

const phases: Phase[] = [
  {
    id: "routine",
    titleKey: "roadmap.phase_routine",
    descKey: "roadmap.phase_routine_desc",
    icon: Sun,
    color: "from-[hsl(var(--warm))] to-[hsl(var(--coral))]",
    to: "/routine",
    checkFn: (d) => d.hasCheckin,
  },
  {
    id: "journal",
    titleKey: "roadmap.phase_journal",
    descKey: "roadmap.phase_journal_desc",
    icon: BookHeart,
    color: "from-[hsl(var(--calm))] to-[hsl(var(--sage))]",
    to: "/journal",
    checkFn: (d) => d.journalCount >= 3,
  },
  {
    id: "assessment",
    titleKey: "roadmap.phase_assessment",
    descKey: "roadmap.phase_assessment_desc",
    icon: ClipboardCheck,
    color: "from-[hsl(var(--sage))] to-[hsl(var(--calm))]",
    to: "/assessments",
    checkFn: (d) => d.assessmentCount >= 1,
  },
  {
    id: "program",
    titleKey: "roadmap.phase_program",
    descKey: "roadmap.phase_program_desc",
    icon: Target,
    color: "from-[hsl(var(--primary))] to-[hsl(var(--calm))]",
    to: "/programs",
    checkFn: (d) => d.hasProgram,
  },
  {
    id: "emergency",
    titleKey: "roadmap.phase_emergency",
    descKey: "roadmap.phase_emergency_desc",
    icon: ShieldAlert,
    color: "from-[hsl(var(--coral))] to-[hsl(var(--mood-2))]",
    to: "/emergency-kit",
    checkFn: () => false, // explore anytime
  },
  {
    id: "mastery",
    titleKey: "roadmap.phase_mastery",
    descKey: "roadmap.phase_mastery_desc",
    icon: Sparkles,
    color: "from-[hsl(var(--warm))] to-[hsl(var(--primary))]",
    to: "/dashboard",
    checkFn: (d) => d.checkinStreak >= 7 && d.journalCount >= 7 && d.assessmentCount >= 4,
  },
];

const Roadmap = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: checkins } = useQuery({
    queryKey: ["roadmap-checkins", user?.id],
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

  const { data: journals } = useQuery({
    queryKey: ["roadmap-journals", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: assessments } = useQuery({
    queryKey: ["roadmap-assessments", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("assessment_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: programs } = useQuery({
    queryKey: ["roadmap-programs", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("user_program_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  // Calculate streak
  const streak = (() => {
    if (!checkins || checkins.length === 0) return 0;
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < checkins.length; i++) {
      const d = new Date(checkins[i].checkin_date);
      d.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (d.getTime() === expected.getTime()) count++;
      else break;
    }
    return count;
  })();

  const roadmapData: RoadmapData = {
    hasCheckin: (checkins?.length || 0) > 0,
    hasJournal: (journals || 0) > 0,
    hasAssessment: (assessments || 0) > 0,
    hasProgram: (programs || 0) > 0,
    hasEmergency: true,
    journalCount: journals || 0,
    assessmentCount: assessments || 0,
    checkinStreak: streak,
  };

  // For demo (no user), show partial progress
  const demoData: RoadmapData = {
    hasCheckin: true,
    hasJournal: true,
    hasAssessment: false,
    hasProgram: false,
    hasEmergency: true,
    journalCount: 5,
    assessmentCount: 0,
    checkinStreak: 3,
  };

  const data = user ? roadmapData : demoData;

  // Find current phase (first uncompleted)
  const completedCount = phases.filter((p) => p.checkFn(data)).length;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <Map className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">{t("roadmap.title")}</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("roadmap.subtitle")}</p>
      </motion.div>

      {/* Progress summary */}
      <motion.div variants={item} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">{t("roadmap.progress")}</span>
          <span className="text-xs text-muted-foreground">{completedCount}/{phases.length} {t("roadmap.phases_done")}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-primary to-[hsl(var(--warm))]"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / phases.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50" />

        <div className="space-y-4">
          {phases.map((phase, i) => {
            const completed = phase.checkFn(data);
            const isCurrent = !completed && (i === 0 || phases[i - 1].checkFn(data));
            const Icon = phase.icon;

            return (
              <motion.div
                key={phase.id}
                variants={item}
                className="relative pl-14"
              >
                {/* Node */}
                <div className={`absolute left-3 top-3 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all ${
                  completed
                    ? "bg-gradient-to-br " + phase.color + " shadow-md"
                    : isCurrent
                    ? "bg-background border-2 border-primary shadow-md ring-4 ring-primary/20"
                    : "bg-muted border border-border"
                }`}>
                  {completed ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>

                {/* Card */}
                <Link to={phase.to}>
                  <motion.div
                    className={`glass rounded-xl p-4 transition-all hover:shadow-md ${
                      isCurrent ? "ring-1 ring-primary/30 bg-primary/5" : ""
                    } ${completed ? "opacity-80" : ""}`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-display text-sm font-semibold ${
                            completed ? "text-muted-foreground line-through" : "text-foreground"
                          }`}>
                            {t(phase.titleKey)}
                          </h3>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {t("roadmap.current")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(phase.descKey)}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                        completed ? "text-muted-foreground/40" : "text-muted-foreground"
                      }`} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Motivational footer */}
      <motion.div
        variants={item}
        className="rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--calm))] p-4 text-white text-center"
      >
        <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-80" />
        <p className="text-sm font-medium">{t("roadmap.motivation")}</p>
      </motion.div>
    </motion.div>
  );
};

export default Roadmap;
