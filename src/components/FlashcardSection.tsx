import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, CloudRain, Users, Ghost, Crown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

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
}

const flashcards: Flashcard[] = [
  {
    id: "ansiedad",
    icon: <Brain className="w-6 h-6" />,
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
    gradient: "from-teal-500/20 to-cyan-500/10",
    accentColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "tristeza",
    icon: <CloudRain className="w-6 h-6" />,
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
    gradient: "from-indigo-500/20 to-purple-500/10",
    accentColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "fomo",
    icon: <Users className="w-6 h-6" />,
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
    gradient: "from-amber-500/20 to-orange-500/10",
    accentColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "soledad",
    icon: <Ghost className="w-6 h-6" />,
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
    gradient: "from-violet-500/20 to-fuchsia-500/10",
    accentColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "impostor",
    icon: <Crown className="w-6 h-6" />,
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
    gradient: "from-rose-500/20 to-pink-500/10",
    accentColor: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "choque-cultural",
    icon: <Globe className="w-6 h-6" />,
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
    gradient: "from-emerald-500/20 to-green-500/10",
    accentColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const FlipCard = ({ card }: { card: Flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className="w-full cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full min-h-[280px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl border bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-4 flex flex-col justify-between`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className={`inline-flex items-center gap-1.5 ${card.accentColor} mb-3`}>
              {card.icon}
              <span className="text-xs font-semibold uppercase tracking-wider">{card.category}</span>
            </div>
            <h3 className="text-base font-display font-bold text-foreground mb-2">{card.frontTitle}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{card.frontMessage}</p>
          </div>
          <span className="text-[10px] text-muted-foreground/50 text-center animate-pulse">
            {t("flashcards.tap_exercise")}
          </span>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-4 flex flex-col`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className={`text-sm font-display font-bold ${card.accentColor} mb-3`}>{card.backTitle}</h3>
          <ol className="space-y-2 flex-1">
            {card.backExercise.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center text-[10px] font-bold ${card.accentColor}`}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <span className="text-[10px] text-muted-foreground/50 text-center">{t("flashcards.tap_back")}</span>
        </div>
      </motion.div>
    </div>
  );
};

const FlashcardSection = () => {
  const { t } = useTranslation();
  return (
  <div className="space-y-3">
    <h2 className="text-lg font-display font-semibold text-foreground">
      {t("flashcards.title")}
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {flashcards.map((card) => (
        <FlipCard key={card.id} card={card} />
      ))}
    </div>
  </div>
  );
};

export default FlashcardSection;
