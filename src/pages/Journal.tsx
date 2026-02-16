import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookHeart, Plus, X } from "lucide-react";

const moodOptions = [
  { value: 1, emoji: "😢", label: "Muy mal" },
  { value: 2, emoji: "😟", label: "Mal" },
  { value: 3, emoji: "😐", label: "Regular" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "😄", label: "Muy bien" },
];

const emotions = [
  "Ansiedad", "Nostalgia", "Soledad", "Frustración", "Gratitud",
  "Esperanza", "Confusión", "Alegría", "Tristeza", "Calma",
  "Estrés", "Motivación", "Miedo", "Orgullo", "Cansancio",
];

const Journal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [emotion, setEmotion] = useState("");
  const [content, setContent] = useState("");

  const { data: entries } = useQuery({
    queryKey: ["journal", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user!.id,
        mood: mood!,
        emotion,
        content: content || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["recent-journal"] });
      setShowForm(false);
      setMood(null);
      setEmotion("");
      setContent("");
      toast({ title: "✨ Entrada guardada" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-2">
            <BookHeart className="w-8 h-8 text-warm" /> Diario Emocional
          </h1>
          <p className="text-muted-foreground mt-1">Registra tus emociones diarias y observa tus patrones</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "default"}>
          {showForm ? <X className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-1" /> Nueva entrada</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 space-y-5 overflow-hidden"
          >
            {/* Mood */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">¿Cómo te sientes?</label>
              <div className="flex gap-3 justify-center">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMood(opt.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                      mood === opt.value ? "bg-primary/10 ring-2 ring-primary scale-110" : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-xs text-muted-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion tags */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">¿Qué emoción predomina?</label>
              <div className="flex flex-wrap gap-2">
                {emotions.map((em) => (
                  <button
                    key={em}
                    onClick={() => setEmotion(em)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      emotion === em
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">¿Quieres escribir algo más? (opcional)</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe libremente sobre cómo te sientes hoy..."
                rows={3}
              />
            </div>

            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!mood || !emotion || saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? "Guardando..." : "Guardar entrada"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries list */}
      <div className="space-y-3">
        {entries?.map((entry: any, i: number) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 flex items-start gap-4"
          >
            <div className="text-3xl">
              {moodOptions.find((m) => m.value === entry.mood)?.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {entry.emotion}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString("es", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              {entry.content && (
                <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
              )}
            </div>
          </motion.div>
        ))}
        {entries?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookHeart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aún no tienes entradas. ¡Comienza tu diario hoy!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
