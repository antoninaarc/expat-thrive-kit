import { useState } from "react";
import { emergencyExercises, categoryLabels } from "@/data/emergencyKit";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Clock, CheckCircle2 } from "lucide-react";

const EmergencyKit = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const exercise = emergencyExercises.find((e) => e.id === activeExercise);
  const filtered = activeFilter
    ? emergencyExercises.filter((e) => e.category === activeFilter)
    : emergencyExercises;

  const markStep = (idx: number) => {
    const next = new Set(completedSteps);
    next.add(idx);
    setCompletedSteps(next);
    if (idx < (exercise?.steps.length ?? 0) - 1) {
      setCurrentStep(idx + 1);
    }
  };

  if (exercise) {
    const allDone = completedSteps.size === exercise.steps.length;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-6">
        <button
          onClick={() => { setActiveExercise(null); setCurrentStep(0); setCompletedSteps(new Set()); }}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">{exercise.icon}</div>
          <h1 className="text-2xl">{exercise.title}</h1>
          <p className="text-muted-foreground mt-1">{exercise.description}</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" /> {exercise.duration}
          </div>
        </div>

        {/* Breathing animation for breathing exercises */}
        {exercise.category === "breathing" && (
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full gradient-calm animate-breathe opacity-60" />
          </div>
        )}

        <div className="space-y-3">
          {exercise.steps.map((step, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => markStep(i)}
              className={`w-full text-left glass rounded-xl p-4 flex items-start gap-3 transition-all ${
                completedSteps.has(i) ? "opacity-60" : i === currentStep ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                completedSteps.has(i) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {completedSteps.has(i) ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span className={`text-sm ${completedSteps.has(i) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {step}
              </span>
            </motion.button>
          ))}
        </div>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass rounded-2xl p-6"
          >
            <div className="text-4xl mb-2">🌟</div>
            <h3 className="font-display text-xl text-foreground">¡Bien hecho!</h3>
            <p className="text-muted-foreground text-sm mt-1">Has completado el ejercicio. Recuerda que cuidar tu bienestar es un acto de valentía.</p>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-coral" /> Kit de Emergencia
        </h1>
        <p className="text-muted-foreground mt-1">Herramientas rápidas para momentos difíciles</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            !activeFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
          }`}
        >
          Todos
        </button>
        {Object.entries(categoryLabels).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              activeFilter === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((ex, i) => (
          <motion.button
            key={ex.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveExercise(ex.id)}
            className="glass rounded-2xl p-5 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl">{ex.icon}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {ex.duration}
              </span>
            </div>
            <h3 className="font-display text-lg text-foreground mb-1">{ex.title}</h3>
            <p className="text-sm text-muted-foreground">{ex.description}</p>
            <div className="mt-3">
              <span className={`px-2 py-0.5 rounded-full text-xs bg-${categoryLabels[ex.category]?.color}-light text-${categoryLabels[ex.category]?.color}`}>
                {categoryLabels[ex.category]?.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmergencyKit;
