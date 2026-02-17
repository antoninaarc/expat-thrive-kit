import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

const CATEGORIES = [
  { key: "all", label: "Todos", emoji: "📚" },
  { key: "mente", label: "Mente", emoji: "🧠" },
  { key: "emociones", label: "Emociones", emoji: "💛" },
  { key: "vida-expat", label: "Vida Expat", emoji: "✈️" },
  { key: "amor-relaciones", label: "Amor y Relaciones", emoji: "❤️" },
  { key: "crecimiento", label: "Crecimiento", emoji: "🌱" },
  { key: "psicologia", label: "Psicología", emoji: "🔬" },
];

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
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
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (selectedArticle) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la biblioteca
        </button>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            {CATEGORIES.find((c) => c.key === selectedArticle.category)?.emoji}{" "}
            {CATEGORIES.find((c) => c.key === selectedArticle.category)?.label}
          </span>
          <h1 className="text-3xl font-display font-bold text-foreground mt-2">
            {selectedArticle.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>{selectedArticle.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {selectedArticle.read_time_minutes} min
            </span>
          </div>
        </div>

        {selectedArticle.cover_image_url && (
          <img
            src={selectedArticle.cover_image_url}
            alt={selectedArticle.title}
            className="w-full h-64 object-cover rounded-2xl"
          />
        )}

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
        </article>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" /> Biblioteca
        </h1>
        <p className="text-muted-foreground mt-1">
          Artículos para entenderte mejor y navegar tu vida como expat.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar artículos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hay artículos en esta categoría aún.</p>
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
                    {CATEGORIES.find((c) => c.key === article.category)?.emoji}{" "}
                    {CATEGORIES.find((c) => c.key === article.category)?.label}
                  </span>
                  <h3 className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
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
