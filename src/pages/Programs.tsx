import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Circle, Lock, Play, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  duration_days: number;
  category: string;
}

interface ProgramDay {
  id: string;
  day_number: number;
  title: string;
  content: string;
  exercise: string;
  reflection_prompt: string;
}

interface UserProgress {
  program_id: string;
  current_day: number;
  started_at: string;
  completed_at: string | null;
}

interface DayCompletion {
  day_number: number;
  reflection: string | null;
  completed_at: string;
}

const Programs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeDay, setActiveDay] = useState<ProgramDay | null>(null);
  const [reflection, setReflection] = useState("");

  // Fetch programs
  const { data: programs = [] } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Program[];
    },
  });

  // Fetch user progress for all programs
  const { data: progressList = [] } = useQuery({
    queryKey: ["user-program-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_program_progress")
        .select("*");
      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!user,
  });

  // Fetch days for selected program
  const { data: days = [] } = useQuery({
    queryKey: ["program-days", selectedProgram?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_days")
        .select("*")
        .eq("program_id", selectedProgram!.id)
        .order("day_number");
      if (error) throw error;
      return data as ProgramDay[];
    },
    enabled: !!selectedProgram,
  });

  // Fetch completions for selected program
  const { data: completions = [] } = useQuery({
    queryKey: ["day-completions", selectedProgram?.id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_day_completions")
        .select("*")
        .eq("program_id", selectedProgram!.id);
      if (error) throw error;
      return data as DayCompletion[];
    },
    enabled: !!selectedProgram && !!user,
  });

  const getProgress = (programId: string) =>
    progressList.find((p) => p.program_id === programId);

  // Start program
  const startMutation = useMutation({
    mutationFn: async (programId: string) => {
      const { error } = await supabase.from("user_program_progress").insert({
        user_id: user!.id,
        program_id: programId,
        current_day: 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-program-progress"] });
      toast({ title: "¡Programa iniciado! 🚀" });
    },
    onError: (e: any) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Complete day
  const completeDayMutation = useMutation({
    mutationFn: async ({
      programId,
      dayNumber,
    }: {
      programId: string;
      dayNumber: number;
    }) => {
      // Insert completion
      const { error: compError } = await supabase
        .from("user_day_completions")
        .insert({
          user_id: user!.id,
          program_id: programId,
          day_number: dayNumber,
          reflection: reflection || null,
        });
      if (compError) throw compError;

      // Update progress
      const program = programs.find((p) => p.id === programId);
      const isLast = dayNumber >= (program?.duration_days || 0);
      const { error: progError } = await supabase
        .from("user_program_progress")
        .update({
          current_day: isLast ? dayNumber : dayNumber + 1,
          completed_at: isLast ? new Date().toISOString() : null,
        })
        .eq("user_id", user!.id)
        .eq("program_id", programId);
      if (progError) throw progError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-program-progress"] });
      queryClient.invalidateQueries({ queryKey: ["day-completions"] });
      setReflection("");
      setActiveDay(null);
      toast({ title: "¡Día completado! ✅" });
    },
    onError: (e: any) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Active day view
  if (activeDay && selectedProgram) {
    const isDone = completions.some((c) => c.day_number === activeDay.day_number);
    const pastReflection = completions.find(
      (c) => c.day_number === activeDay.day_number
    )?.reflection;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button
          onClick={() => setActiveDay(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al programa
        </button>

        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Día {activeDay.day_number} de {selectedProgram.duration_days}
          </span>
          <h1 className="text-2xl font-display font-bold text-foreground mt-1">
            {activeDay.title}
          </h1>
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-foreground leading-relaxed">{activeDay.content}</p>
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
            🎯 Ejercicio del día
          </h3>
          <p className="text-foreground leading-relaxed">{activeDay.exercise}</p>
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
            💭 Reflexión
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {activeDay.reflection_prompt}
          </p>
          {isDone ? (
            pastReflection && (
              <div className="p-3 rounded-xl bg-muted/50 text-sm italic text-foreground">
                "{pastReflection}"
              </div>
            )
          ) : (
            <>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Escribe tu reflexión aquí..."
                rows={3}
              />
              <Button
                onClick={() =>
                  completeDayMutation.mutate({
                    programId: selectedProgram.id,
                    dayNumber: activeDay.day_number,
                  })
                }
                disabled={completeDayMutation.isPending}
                className="w-full"
              >
                {completeDayMutation.isPending
                  ? "Guardando..."
                  : "Completar día ✅"}
              </Button>
            </>
          )}
          {isDone && (
            <div className="flex items-center gap-2 text-primary text-sm">
              <CheckCircle2 className="w-4 h-4" /> Día completado
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Program detail view
  if (selectedProgram) {
    const progress = getProgress(selectedProgram.id);
    const completedDays = completions.map((c) => c.day_number);
    const pct = days.length
      ? Math.round((completedDays.length / days.length) * 100)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button
          onClick={() => setSelectedProgram(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Todos los programas
        </button>

        <div>
          <span className="text-4xl">{selectedProgram.emoji}</span>
          <h1 className="text-2xl font-display font-bold text-foreground mt-2">
            {selectedProgram.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedProgram.description}
          </p>
        </div>

        {progress ? (
          <div className="glass rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium text-foreground">
                {completedDays.length}/{days.length} días
              </span>
            </div>
            <Progress value={pct} className="h-2" />
            {progress.completed_at && (
              <div className="flex items-center gap-2 text-primary text-sm mt-2">
                <Trophy className="w-4 h-4" /> ¡Programa completado!
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={() => startMutation.mutate(selectedProgram.id)}
            disabled={!user || startMutation.isPending}
            size="lg"
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {!user ? "Inicia sesión para empezar" : "Comenzar programa"}
          </Button>
        )}

        {/* Day list */}
        <div className="space-y-2">
          {days.map((day) => {
            const done = completedDays.includes(day.day_number);
            const unlocked =
              !progress ||
              day.day_number <= (progress.current_day || 1);

            return (
              <button
                key={day.id}
                onClick={() => unlocked && setActiveDay(day)}
                disabled={!unlocked}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                  done
                    ? "glass border-primary/20"
                    : unlocked
                    ? "glass hover:shadow-md"
                    : "opacity-50 bg-muted/30 rounded-xl cursor-not-allowed"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                ) : unlocked ? (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground">
                    Día {day.day_number}
                  </span>
                  <h3
                    className={`text-sm font-medium truncate ${
                      done ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {day.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Programs list
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Programas 🎯
        </h1>
        <p className="text-muted-foreground mt-1">
          Series temáticas para trabajar objetivos específicos paso a paso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {programs.map((program, i) => {
            const progress = getProgress(program.id);
            const isComplete = !!progress?.completed_at;
            const isActive = progress && !isComplete;

            return (
              <motion.button
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedProgram(program)}
                className="text-left glass rounded-2xl p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{program.emoji}</span>
                  {isComplete && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Completado
                    </span>
                  )}
                  {isActive && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                      Día {progress.current_day}/{program.duration_days}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {program.description}
                </p>
                <span className="text-xs text-muted-foreground/60 mt-3 block">
                  {program.duration_days} días
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Programs;
