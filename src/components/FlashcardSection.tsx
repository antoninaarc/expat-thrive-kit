import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { Brain, CloudRain, Users, Ghost, Crown, Globe, RotateCcw, PartyPopper } from "lucide-react";
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

// Confetti particle component
const ConfettiParticle = ({ delay, index }: { delay: number; index: number }) => {
  const colors = [
    "bg-[hsl(var(--warm))]",
    "bg-[hsl(var(--coral))]",
    "bg-[hsl(var(--calm))]",
    "bg-[hsl(var(--sage))]",
    "bg-[hsl(var(--primary))]",
    "bg-[hsl(var(--secondary))]",
    "bg-[hsl(var(--mood-5))]",
  ];
  const size = 4 + Math.random() * 6;
  const xEnd = (Math.random() - 0.5) * 300;
  const rotation = Math.random() * 720 - 360;

  return (
    <motion.div
      className={`absolute rounded-sm ${colors[index % colors.length]}`}
      style={{ width: size, height: size, left: "50%", top: "40%" }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        x: xEnd,
        y: [0, -120 - Math.random() * 80, 200 + Math.random() * 100],
        rotate: rotation,
        scale: [1, 1.2, 0.5],
      }}
      transition={{ duration: 1.8, delay, ease: "easeOut" }}
    />
  );
};

const FlashcardSection = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seenCards, setSeenCards] = useState<Set<number>>(new Set([0]));
  const [showCelebration, setShowCelebration] = useState(false);

  const confettiParticles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
    })), []);

  const handleSwipe = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % cardDefs.length;
      setSeenCards((s) => {
        const updated = new Set(s);
        updated.add(next);
        if (updated.size === cardDefs.length) {
          setShowCelebration(true);
        }
        return updated;
      });
      return next;
    });
  }, []);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const handleReset = () => {
    setCurrentIndex(0);
    setSeenCards(new Set([0]));
    setShowCelebration(false);
  };

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

      <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
        <AnimatePresence mode="popLayout">
          <SwipeCard key={`bg-${next.id}-${currentIndex}`} card={next} isTop={false} onSwipe={() => {}} />
          <SwipeCard key={`top-${current.id}-${currentIndex}`} card={current} isTop={true} onSwipe={handleSwipe} />
        </AnimatePresence>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              {confettiParticles.map((p) => (
                <ConfettiParticle key={p.id} delay={p.delay} index={p.id} />
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--warm))] to-[hsl(var(--coral))] flex items-center justify-center mb-3"
              >
                <PartyPopper className="w-7 h-7 text-white" />
              </motion.div>

              <motion.h3
                className="font-display font-bold text-lg text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t("flashcards.complete_title")}
              </motion.h3>
              <motion.p
                className="text-sm text-muted-foreground mt-1 text-center px-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {t("flashcards.complete_msg")}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5">
        {cardDefs.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-primary w-4"
                : seenCards.has(i)
                ? "bg-primary/40"
                : "bg-muted-foreground/30"
            }`}
            onClick={() => {
              setCurrentIndex(i);
              setSeenCards((s) => new Set(s).add(i));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardSection;
