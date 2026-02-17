import { motion } from "framer-motion";
import { Phone, Users, Heart, ExternalLink, Globe, MessageCircle, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Resource {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
}

const sections = [
  {
    title: "Líneas de Ayuda 🆘",
    subtitle: "Si necesitas hablar con alguien ahora mismo",
    icon: <Phone className="w-5 h-5" />,
    resources: [
      {
        title: "113 Zelfmoordpreventie",
        description: "Línea de prevención del suicidio en Países Bajos. 24/7, gratuita y confidencial.",
        url: "https://www.113.nl/",
        icon: <Phone className="w-5 h-5" />,
        tag: "24/7",
        tagColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      {
        title: "De Luisterlijn",
        description: "Línea de escucha anónima. Puedes llamar, chatear o enviar email. En neerlandés e inglés.",
        url: "https://www.deluisterlijn.nl/",
        icon: <MessageCircle className="w-5 h-5" />,
        tag: "Anónimo",
        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      {
        title: "Crisis Line International",
        description: "Apoyo en crisis en múltiples idiomas, incluyendo español e inglés.",
        url: "https://findahelpline.com/countries/nl",
        icon: <Globe className="w-5 h-5" />,
        tag: "Multilingüe",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
    ] as Resource[],
  },
  {
    title: "Comunidades de Expats 🤝",
    subtitle: "Conecta con personas que entienden lo que vives",
    icon: <Users className="w-5 h-5" />,
    resources: [
      {
        title: "Internations Netherlands",
        description: "Red global de expats con eventos, actividades y grupos locales en todas las ciudades holandesas.",
        url: "https://www.internations.org/netherlands-expats",
        icon: <Users className="w-5 h-5" />,
        tag: "Eventos",
        tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      {
        title: "Meetup.com — Expats NL",
        description: "Grupos de meetup para expats: deportes, idiomas, networking, apoyo emocional y más.",
        url: "https://www.meetup.com/find/?keywords=expat&location=nl",
        icon: <Globe className="w-5 h-5" />,
        tag: "Gratis",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      {
        title: "r/Netherlands (Reddit)",
        description: "Comunidad activa en Reddit donde expats comparten experiencias, consejos y apoyo.",
        url: "https://www.reddit.com/r/Netherlands/",
        icon: <MessageCircle className="w-5 h-5" />,
        tag: "Online",
        tagColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
      },
    ] as Resource[],
  },
  {
    title: "Terapeutas para Expats 🧠",
    subtitle: "Profesionales que hablan tu idioma y entienden tu situación",
    icon: <Heart className="w-5 h-5" />,
    resources: [
      {
        title: "iGP (International GP)",
        description: "Red de médicos de cabecera internacionales que pueden derivarte a psicólogos en inglés/español.",
        url: "https://www.igp.nl/",
        icon: <Shield className="w-5 h-5" />,
        tag: "Seguro médico",
        tagColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      },
      {
        title: "OpenUp",
        description: "Sesiones gratuitas de bienestar mental online en inglés. Muchos empleadores holandeses lo cubren.",
        url: "https://openup.com/",
        icon: <Heart className="w-5 h-5" />,
        tag: "Gratis vía employer",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      {
        title: "Psychology Today — NL",
        description: "Directorio de terapeutas en Países Bajos. Filtra por idioma, especialidad y tipo de seguro.",
        url: "https://www.psychologytoday.com/nl/counselling",
        icon: <Globe className="w-5 h-5" />,
        tag: "Directorio",
        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
    ] as Resource[],
  },
];

const ResourceCard = ({ resource, index }: { resource: Resource; index: number }) => (
  <motion.a
    href={resource.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="block group"
  >
    <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            {resource.icon}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${resource.tagColor}`}>
              {resource.tag}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </div>
        <CardTitle className="text-base mt-2">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {resource.description}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.a>
);

const Resources = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          {t("resources.title")}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {t("resources.subtitle")}
        </p>
      </motion.div>

      <div className="space-y-10">
        {sections.map((section, sIdx) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: sIdx * 0.15 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-display font-semibold text-foreground">{section.title}</h2>
              <p className="text-sm text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.resources.map((resource, rIdx) => (
                <ResourceCard key={resource.title} resource={resource} index={sIdx * 3 + rIdx} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default Resources;
