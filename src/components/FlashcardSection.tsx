import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { Brain, CloudRain, Users, Ghost, Crown, Globe, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Flashcard {
  id: string;
  icon: React.ReactNode;
  category: string;
  frontTitle: string;
  frontMessage: string;
  backTitle: string;
  backExercise: string[];
  gradient: string;
  accentColor: string;
  bgColor: string;
}

const flashcards: Flashcard[] = [
  {
    id: "ansiedad",
    icon: <Brain className="w-5 h-5" />,
    category: "Ansiedad",
    frontTitle: "¿Sientes el pecho apretado?",
    frontMessage: "Es normal sentir ansiedad al adaptarte a un nuevo país. Tu cuerpo está en modo alerta porque todo es nuevo.",
    backTitle: "Ejercicio: Respiración Mariposa 🦋",
    backExercise: [
      "Cruza los brazos sobre tu pecho, manos en hombros opuestos.",
      "Cierra los ojos y respira lento.",
      "Alterna golpecitos suaves: izquierda, derecha…",
      "Sigue por 2 minutos al ritmo de tu respiración.",
      "Nota cómo tu cuerpo se va soltando.",
    ],
    gradient: "from-teal-500 to-cyan-400",
    accentColor: "text-white/90",
    bgColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
  {
    id: "tristeza",
    icon: <CloudRain className="w-5 h-5" />,
    category: "Tristeza",
    frontTitle: "¿Extrañas lo que dejaste atrás?",
    frontMessage: "La nostalgia es el precio del amor que sientes por tu hogar. Extrañar no es debilidad.",
    backTitle: "Ejercicio: Carta al Presente 💌",
    backExercise: [
      "Escribe 3 cosas que extrañas de casa.",
      "Ahora escribe 3 cosas nuevas que has descubierto aquí.",
      "Lee ambas listas en voz alta.",
      "Permítete sentir gratitud por las dos realidades.",
    ],
    gradient: "from-indigo-500 to-purple-500",
    accentColor: "text-white/90",
    bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "fomo",
    icon: <Users className="w-5 h-5" />,
    category: "FOMO",
    frontTitle: "¿Sientes que te pierdes todo?",
    frontMessage: "Tú también estás viviendo momentos que otros envidiarían. Solo que los das por sentado.",
    backTitle: "Ejercicio: Mi Momento Ahora 📸",
    backExercise: [
      "Mira a tu alrededor: ¿dónde estás ahora mismo?",
      "Toma una foto mental de este instante.",
      "Piensa: '¿Qué tiene de especial ESTE momento?'",
      "Repite: 'Estoy exactamente donde necesito estar.'",
    ],
    gradient: "from-amber-500 to-orange-500",
    accentColor: "text-white/90",
    bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  {
    id: "soledad",
    icon: <Ghost className="w-5 h-5" />,
    category: "Soledad",
    frontTitle: "¿Te sientes invisible aquí?",
    frontMessage: "La soledad del expat es real: estás rodeado de gente pero sin nadie que te conozca de verdad.",
    backTitle: "Ejercicio: Puente de Conexión 🌉",
    backExercise: [
      "Piensa en alguien con quien hayas tenido una conversación agradable.",
      "Envíale un mensaje: '¡Hola! ¿Cómo estás?'",
      "Si no tienes a nadie, busca un evento local esta semana.",
      "Una sola conexión genuina puede cambiar todo.",
    ],
    gradient: "from-violet-500 to-fuchsia-500",
    accentColor: "text-white/90",
    bgColor: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
  },
  {
    id: "impostor",
    icon: <Crown className="w-5 h-5" />,
    category: "Impostor",
    frontTitle: "¿Sientes que no perteneces?",
    frontMessage: "No eres un fraude. Estás aprendiendo un mundo entero desde cero.",
    backTitle: "Ejercicio: Inventario de Logros 🏆",
    backExercise: [
      "Escribe 5 cosas difíciles que has logrado desde que llegaste.",
      "Incluye cosas 'pequeñas': ir al médico en otro idioma, hacer un trámite…",
      "Di en voz alta: 'Yo hice todo esto.'",
      "Agrega un nuevo logro cada semana.",
    ],
    gradient: "from-rose-500 to-pink-500",
    accentColor: "text-white/90",
    bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  {
    id: "choque-cultural",
    icon: <Globe className="w-5 h-5" />,
    category: "Choque Cultural",
    frontTitle: "¿Todo te parece raro aquí?",
    frontMessage: "Tu cerebro está procesando miles de reglas nuevas al mismo tiempo. Es normal sentirse perdido/a.",
    backTitle: "Ejercicio: Diario Cultural 📓",
    backExercise: [
      "Escribe algo que te haya chocado hoy de la cultura local.",
      "Pregúntate: '¿Por qué me molesta?'",
      "Busca el lado positivo detrás de esa costumbre.",
      "Entender no significa aceptar todo, pero sí te da paz.",
    ],
    gradient: "from-emerald-500 to-green-500",
    accentColor: "text-white/90",
    bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
];

const SWIPE_THRESHOLD = 100;

const SwipeCard = ({
  card,
  isTop,
  onSwipe,
}: {
  card: Flashcard;
  isTop: boolean;
  onSwipe: () => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
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
                <span className="text-xs font-semibold uppercase tracking-wider">{card.category}</span>
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">{card.frontTitle}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{card.frontMessage}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 animate-pulse">
                ← desliza para siguiente →
              </span>
              <span className="text-[10px] text-white/40">
                toca para ejercicio
              </span>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 rounded-2xl ${card.bgColor} shadow-xl p-5 flex flex-col`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h3 className="text-sm font-display font-bold text-white mb-3">{card.backTitle}</h3>
            <ol className="space-y-2.5 flex-1">
              {card.backExercise.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-white/90">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <span className="text-[10px] text-white/40 text-center">toca para volver</span>
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
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  }, []);

  const handleReset = () => setCurrentIndex(0);

  const current = flashcards[currentIndex];
  const next = flashcards[(currentIndex + 1) % flashcards.length];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-foreground">
          {t("flashcards.title")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1}/{flashcards.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Card deck */}
      <div className="relative w-full" style={{ height: 300 }}>
        <AnimatePresence mode="popLayout">
          {/* Next card (behind) */}
          <SwipeCard
            key={`bg-${next.id}-${currentIndex}`}
            card={next}
            isTop={false}
            onSwipe={() => {}}
          />
          {/* Current card (top) */}
          <SwipeCard
            key={`top-${current.id}-${currentIndex}`}
            card={current}
            isTop={true}
            onSwipe={handleSwipe}
          />
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {flashcards.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-primary w-4"
                : "bg-muted-foreground/30"
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardSection;
