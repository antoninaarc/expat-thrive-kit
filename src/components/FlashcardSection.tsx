import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { Brain, CloudRain, Users, Ghost, Crown, Globe, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface FlashcardDef {
  id: string;
  icon: React.ReactNode;
  catKey: string;
  frontKey: string;
  msgKey: string;
  backKey: string;
  stepKeys: string[];
  bgColor: string;
}

const cardDefs: FlashcardDef[] = [
  {
    id: "ansiedad",
    icon: <Brain className="w-5 h-5" />,
    catKey: "flashcards.ansiedad_cat",
    frontKey: "flashcards.ansiedad_front",
    msgKey: "flashcards.ansiedad_msg",
    backKey: "flashcards.ansiedad_back",
    stepKeys: ["flashcards.ansiedad_s1", "flashcards.ansiedad_s2", "flashcards.ansiedad_s3", "flashcards.ansiedad_s4", "flashcards.ansiedad_s5"],
    bgColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  {
    id: "tristeza",
    icon: <CloudRain className="w-5 h-5" />,
    catKey: "flashcards.tristeza_cat",
    frontKey: "flashcards.tristeza_front",
    msgKey: "flashcards.tristeza_msg",
    backKey: "flashcards.tristeza_back",
    stepKeys: ["flashcards.tristeza_s1", "flashcards.tristeza_s2", "flashcards.tristeza_s3", "flashcards.tristeza_s4"],
    bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "fomo",
    icon: <Users className="w-5 h-5" />,
    catKey: "flashcards.fomo_cat",
    frontKey: "flashcards.fomo_front",
    msgKey: "flashcards.fomo_msg",
    backKey: "flashcards.fomo_back",
    stepKeys: ["flashcards.fomo_s1", "flashcards.fomo_s2", "flashcards.fomo_s3", "flashcards.fomo_s4"],
    bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    id: "soledad",
    icon: <Ghost className="w-5 h-5" />,
    catKey: "flashcards.soledad_cat",
    frontKey: "flashcards.soledad_front",
    msgKey: "flashcards.soledad_msg",
    backKey: "flashcards.soledad_back",
    stepKeys: ["flashcards.soledad_s1", "flashcards.soledad_s2", "flashcards.soledad_s3", "flashcards.soledad_s4"],
    bgColor: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
  },
  {
    id: "impostor",
    icon: <Crown className="w-5 h-5" />,
    catKey: "flashcards.impostor_cat",
    frontKey: "flashcards.impostor_front",
    msgKey: "flashcards.impostor_msg",
    backKey: "flashcards.impostor_back",
    stepKeys: ["flashcards.impostor_s1", "flashcards.impostor_s2", "flashcards.impostor_s3", "flashcards.impostor_s4"],
    bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  {
    id: "choque",
    icon: <Globe className="w-5 h-5" />,
    catKey: "flashcards.choque_cat",
    frontKey: "flashcards.choque_front",
    msgKey: "flashcards.choque_msg",
    backKey: "flashcards.choque_back",
    stepKeys: ["flashcards.choque_s1", "flashcards.choque_s2", "flashcards.choque_s3", "flashcards.choque_s4"],
    bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
];

const SWIPE_THRESHOLD = 100;

const SwipeCard = ({
  card,
  isTop,
  onSwipe,
}: {
  card: FlashcardDef;
  isTop: boolean;
  onSwipe: () => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useTranslation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      onSwipe();
    }
  };

  if (!isTop) {
    return (
      <motion.div
        className={`absolute inset-0 rounded-2xl ${card.bgColor} shadow-lg`}
        style={{ scale: 0.95, y: 8 }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, opacity, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{ x: 300, opacity: 0, rotate: 20, transition: { duration: 0.3 } }}
    >
      <div
        className="w-full h-full"
        style={{ perspective: 1000 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 rounded-2xl ${card.bgColor} shadow-xl p-5 flex flex-col justify-between`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-white/70 mb-3">
                {card.icon}
                <span className="text-xs font-semibold uppercase tracking-wider">{t(card.catKey)}</span>
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">{t(card.frontKey)}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{t(card.msgKey)}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 animate-pulse">
                {t("flashcards.swipe_hint")}
              </span>
              <span className="text-[10px] text-white/40">
                {t("flashcards.tap_flip")}
              </span>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 rounded-2xl ${card.bgColor} shadow-xl p-5 flex flex-col`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h3 className="text-sm font-display font-bold text-white mb-3">{t(card.backKey)}</h3>
            <ol className="space-y-2.5 flex-1">
              {card.stepKeys.map((key, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-white/90">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{t(key)}</span>
                </li>
              ))}
            </ol>
            <span className="text-[10px] text-white/40 text-center">{t("flashcards.tap_back")}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const FlashcardSection = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cardDefs.length);
  }, []);

  const handleReset = () => setCurrentIndex(0);

  const current = cardDefs[currentIndex];
  const next = cardDefs[(currentIndex + 1) % cardDefs.length];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-foreground">
          {t("flashcards.title")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1}/{cardDefs.length}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative w-full" style={{ height: 300 }}>
        <AnimatePresence mode="popLayout">
          <SwipeCard key={`bg-${next.id}-${currentIndex}`} card={next} isTop={false} onSwipe={() => {}} />
          <SwipeCard key={`top-${current.id}-${currentIndex}`} card={current} isTop={true} onSwipe={handleSwipe} />
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5">
        {cardDefs.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-primary w-4" : "bg-muted-foreground/30"
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardSection;
