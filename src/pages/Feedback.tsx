import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquareHeart, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const categories = [
  { value: "suggestion", emoji: "💡" },
  { value: "bug", emoji: "🐛" },
  { value: "content", emoji: "📚" },
  { value: "design", emoji: "🎨" },
  { value: "other", emoji: "💬" },
] as const;

const Feedback = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [category, setCategory] = useState<string>("suggestion");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setSending(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      category,
      message: message.trim().slice(0, 2000),
    });

    setSending(false);
    if (error) {
      toast.error(t("feedback.error"));
    } else {
      setSent(true);
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MessageSquareHeart className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">
            {t("feedback.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("feedback.subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category chips */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t("feedback.category_label")}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.emoji} {t(`feedback.cat_${cat.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t("feedback.message_label")}
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("feedback.placeholder")}
            rows={5}
            maxLength={2000}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {message.length}/2000
          </p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-xl p-3"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t("feedback.success")}
            </motion.div>
          ) : (
            <Button
              type="submit"
              disabled={!message.trim() || sending}
              className="w-full gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? t("feedback.sending") : t("feedback.send")}
            </Button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default Feedback;
