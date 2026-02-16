import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, CloudRain, Users, Ghost, Crown, Globe } from "lucide-react";

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
    icon: <Brain className="w-8 h-8" />,
    category: "Ansiedad",
    frontTitle: "¿Sientes el pecho apretado?",
    frontMessage: "Es normal sentir ansiedad al adaptarte a un nuevo país. Tu cuerpo está en modo alerta porque todo es nuevo. No estás en peligro, estás creciendo.",
    backTitle: "Ejercicio: Respiración Mariposa 🦋",
    backExercise: [
      "Cruza los brazos sobre tu pecho, con las manos en los hombros opuestos.",
      "Cierra los ojos y respira lento.",
      "Alterna golpecitos suaves: izquierda, derecha, izquierda, derecha…",
      "Sigue por 2 minutos al ritmo de tu respiración.",
      "Nota cómo tu cuerpo se va soltando poco a poco.",
    ],
    gradient: "from-teal-500/20 to-cyan-500/10",
    accentColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "tristeza",
    icon: <CloudRain className="w-8 h-8" />,
    category: "Tristeza",
    frontTitle: "¿Extrañas lo que dejaste atrás?",
    frontMessage: "La nostalgia es el precio del amor que sientes por tu hogar. Extrañar no es debilidad, es prueba de que tienes raíces profundas que te sostienen.",
    backTitle: "Ejercicio: Carta al Presente 💌",
    backExercise: [
      "Toma tu teléfono o un papel.",
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
    icon: <Users className="w-8 h-8" />,
    category: "FOMO",
    frontTitle: "¿Sientes que te pierdes todo?",
    frontMessage: "Ver en redes las fiestas, bodas y reuniones de casa duele. Pero recuerda: tú también estás viviendo momentos que otros envidiarían. Solo que los das por sentado.",
    backTitle: "Ejercicio: Mi Momento Ahora 📸",
    backExercise: [
      "Mira a tu alrededor: ¿dónde estás ahora mismo?",
      "Toma una foto mental (o real) de este instante.",
      "Escribe o piensa: '¿Qué tiene de especial ESTE momento?'",
      "Compártelo con alguien o guárdalo para ti.",
      "Repite: 'Estoy exactamente donde necesito estar.'",
    ],
    gradient: "from-amber-500/20 to-orange-500/10",
    accentColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "soledad",
    icon: <Ghost className="w-8 h-8" />,
    category: "Soledad",
    frontTitle: "¿Te sientes invisible aquí?",
    frontMessage: "Construir un círculo social desde cero es agotador. La soledad del expat es real: estás rodeado de gente pero sin nadie que te conozca de verdad. Eso cambiará.",
    backTitle: "Ejercicio: Puente de Conexión 🌉",
    backExercise: [
      "Piensa en una persona aquí con quien hayas tenido una conversación agradable.",
      "Envíale un mensaje corto: '¡Hola! Me acordé de ti, ¿cómo estás?'",
      "Si no tienes a nadie aún, busca un evento local esta semana (meetup, clase, café).",
      "Comprométete a ir sin expectativas, solo a estar presente.",
      "Recuerda: una sola conexión genuina puede cambiar todo.",
    ],
    gradient: "from-violet-500/20 to-fuchsia-500/10",
    accentColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "impostor",
    icon: <Crown className="w-8 h-8" />,
    category: "Síndrome del Impostor",
    frontTitle: "¿Sientes que no perteneces?",
    frontMessage: "Hablar otro idioma, no entender las reglas no escritas, sentir que todos saben algo que tú no… No eres un fraude. Estás aprendiendo un mundo entero desde cero.",
    backTitle: "Ejercicio: Inventario de Logros 🏆",
    backExercise: [
      "Escribe 5 cosas difíciles que has logrado desde que llegaste.",
      "Incluye cosas 'pequeñas': ir al médico en otro idioma, hacer un trámite, cocinar con ingredientes nuevos.",
      "Lee tu lista en voz alta y di: 'Yo hice todo esto.'",
      "Guarda esta lista en tu teléfono para los días difíciles.",
      "Agrega un nuevo logro cada semana.",
    ],
    gradient: "from-rose-500/20 to-pink-500/10",
    accentColor: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "choque-cultural",
    icon: <Globe className="w-8 h-8" />,
    category: "Choque Cultural",
    frontTitle: "¿Todo te parece raro aquí?",
    frontMessage: "La directheid holandesa, las cenas a las 6pm, la agenda para todo… No estás loco/a. Tu cerebro está procesando miles de reglas nuevas al mismo tiempo. Es normal sentirse perdido/a.",
    backTitle: "Ejercicio: Diario Cultural 📓",
    backExercise: [
      "Escribe algo que te haya chocado hoy de la cultura local.",
      "Pregúntate: '¿Por qué me molesta? ¿Qué valor mío está siendo retado?'",
      "Ahora busca el lado positivo o la lógica detrás de esa costumbre.",
      "Habla con alguien local y pregúntale por qué hacen las cosas así.",
      "Recuerda: entender no significa aceptar todo, pero sí te da paz.",
    ],
    gradient: "from-emerald-500/20 to-green-500/10",
    accentColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const FlipCard = ({ card }: { card: Flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="w-full cursor-pointer"
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full min-h-[360px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl border bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-6 flex flex-col justify-between shadow-lg`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className={`inline-flex items-center gap-2 ${card.accentColor} mb-4`}>
              {card.icon}
              <span className="text-sm font-semibold uppercase tracking-wider">{card.category}</span>
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-3">
              {card.frontTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {card.frontMessage}
            </p>
          </div>
          <div className="flex items-center justify-center mt-4">
            <span className="text-xs text-muted-foreground/60 animate-pulse">
              Toca para ver el ejercicio →
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl border bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-6 flex flex-col shadow-lg`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className={`text-lg font-display font-bold ${card.accentColor} mb-4`}>
            {card.backTitle}
          </h3>
          <ol className="space-y-3 flex-1">
            {card.backExercise.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center text-xs font-bold ${card.accentColor}`}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-center justify-center mt-4">
            <span className="text-xs text-muted-foreground/60">
              ← Toca para volver
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Activities = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Actividades ✨
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Elige una carta según cómo te sientes. Tócala para descubrir un ejercicio que te ayudará.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {flashcards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <FlipCard card={card} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
