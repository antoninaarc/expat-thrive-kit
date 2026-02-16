import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookHeart, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const emotionKeys = [
  "Anxiety", "Nostalgia", "Loneliness", "Frustration", "Gratitude",
  "Hope", "Confusion", "Joy", "Sadness", "Calm",
  "Stress", "Motivation", "Fear", "Pride", "Exhaustion",
];

const Journal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en" : "es";
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [emotion, setEmotion] = useState("");
  const [content, setContent] = useState("");

  const moodOptions = [
    { value: 1, emoji: "😢", label: t("journal.mood_1") },
    { value: 2, emoji: "😟", label: t("journal.mood_2") },
    { value: 3, emoji: "😐", label: t("journal.mood_3") },
    { value: 4, emoji: "🙂", label: t("journal.mood_4") },
    { value: 5, emoji: "😄", label: t("journal.mood_5") },
  ];

  const { data: entries } = useQuery({
    queryKey: ["journal", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user!.id, mood: mood!, emotion, content: content || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["recent-journal"] });
      setShowForm(false); setMood(null); setEmotion(""); setContent("");
      toast({ title: t("journal.saved") });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-2"><BookHeart className="w-8 h-8 text-warm" /> {t("journal.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("journal.subtitle")}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "default"}>
          {showForm ? <X className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-1" /> {t("journal.new_entry")}</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-6 space-y-5 overflow-hidden">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">{t("journal.how_feel")}</label>
              <div className="flex gap-3 justify-center">
                {moodOptions.map((opt) => (
                  <button key={opt.value} onClick={() => setMood(opt.value)} className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${mood === opt.value ? "bg-primary/10 ring-2 ring-primary scale-110" : "hover:bg-muted"}`}>
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-xs text-muted-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">{t("journal.main_emotion")}</label>
              <div className="flex flex-wrap gap-2">
                {emotionKeys.map((key) => (
                  <button key={key} onClick={() => setEmotion(key)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${emotion === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
                    {t(`journal.emotions.${key}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{t("journal.write_more")}</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t("journal.write_placeholder")} rows={3} />
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={!mood || !emotion || saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? t("journal.saving") : t("journal.save")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {entries?.map((entry: any, i: number) => (
          <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4 flex items-start gap-4">
            <div className="text-3xl">{moodOptions.find((m) => m.value === entry.mood)?.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {String(t(`journal.emotions.${entry.emotion}`, { defaultValue: entry.emotion }))}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" })}
                </span>
              </div>
              {entry.content && <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>}
            </div>
          </motion.div>
        ))}
        {entries?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookHeart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t("journal.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
