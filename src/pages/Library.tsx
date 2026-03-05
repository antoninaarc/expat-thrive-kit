import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const CATEGORY_KEYS = ["all", "mente", "emociones", "vida-people living abroad", "amor-relaciones", "crecimiento", "psicologia"];
const CATEGORY_EMOJIS: Record<string, string> = {
  all: "📚", mente: "🧠", emociones: "💛", "vida-people living abroad": "✈️",
  "amor-relaciones": "❤️", crecimiento: "🌱", psicologia: "🔬",
};

interface Article {
  id: string;
  title: string;
  title_en: string;
  title_es: string;
  slug: string;
  summary: string;
  summary_en: string;
  summary_es: string;
  content: string;
  content_en: string;
  content_es: string;
  category: string;
  cover_image_url: string | null;
  author: string;
  read_time_minutes: number;
  created_at: string;
}

const Library = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en" : "es";

  const CAT_I18N: Record<string, string> = {
    all: "library.cat_all", mente: "library.cat_mente", emociones: "library.cat_emociones",
    "vida-people living abroad": "library.cat_vida_people living abroad", "amor-relaciones": "library.cat_amor",
    crecimiento: "library.cat_crecimiento", psicologia: "library.cat_psicologia",
  };
  const getCatLabel = (key: string) => t(CAT_I18N[key] || key);

  const localTitle = (a: Article) => (locale === "en" ? a.title_en || a.title : a.title_es || a.title);
  const localSummary = (a: Article) => (locale === "en" ? a.summary_en || a.summary : a.summary_es || a.summary);
  const localContent = (a: Article) => (locale === "en" ? a.content_en || a.content : a.content_es || a.content);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Article[];
    },
  });

  const filtered = articles.filter((a) => {
    const matchCategory = activeCategory === "all" || a.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      localTitle(a).toLowerCase().includes(searchQuery.toLowerCase()) ||
      localSummary(a).toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (selectedArticle) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("library.back")}
        </button>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            {CATEGORY_EMOJIS[selectedArticle.category]}{" "}
            {getCatLabel(selectedArticle.category)}
          </span>
          <h1 className="text-3xl font-display font-bold text-foreground mt-2">
            {localTitle(selectedArticle)}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>{selectedArticle.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {selectedArticle.read_time_minutes} {t("library.min_read")}
            </span>
          </div>
        </div>

        {selectedArticle.cover_image_url && (
          <img
            src={selectedArticle.cover_image_url}
            alt={selectedArticle.title}
            className="w-full h-72 object-cover rounded-2xl"
          />
        )}

        <article className="space-y-2">
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-3xl font-bold mt-10 mb-5 text-foreground">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground border-b border-border pb-2">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-semibold mt-8 mb-3 text-primary">{children}</h3>,
              p: ({children}) => <p className="text-base leading-8 mb-5 text-foreground/90">{children}</p>,
              strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
              ol: ({children}) => <ol className="list-decimal pl-6 mb-5 space-y-3">{children}</ol>,
              ul: ({children}) => <ul className="list-disc pl-6 mb-5 space-y-3">{children}</ul>,
              li: ({children}) => <li className="text-base leading-7 text-foreground/90">{children}</li>,
              em: ({children}) => <em className="italic text-foreground/80">{children}</em>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-foreground/70">{children}</blockquote>,
            }}
          >
            {localContent(selectedArticle)}
          </ReactMarkdown>
        </article>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" /> {t("library.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("library.subtitle")}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("library.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {CATEGORY_EMOJIS[key]} {getCatLabel(key)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{t("library.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((article, i) => (
              <motion.button
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedArticle(article)}
                className="text-left glass rounded-2xl overflow-hidden hover:shadow-md transition-all group"
              >
                {article.cover_image_url && (
                  <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {CATEGORY_EMOJIS[article.category]}{" "}
                    {getCatLabel(article.category)}
                  </span>
                  <h3 className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {localTitle(article)}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {localSummary(article)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {article.read_time_minutes} min
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Library;
