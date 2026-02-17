import { motion } from "framer-motion";
import { Phone, Users, Heart, ExternalLink, Globe, MessageCircle, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Resource {
  titleKey: string;
  descKey: string;
  url: string;
  icon: React.ReactNode;
  tagKey: string;
  tagColor: string;
}

interface Section {
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
  resources: Resource[];
}

const sections: Section[] = [
  {
    titleKey: "resources.helplines_title",
    subtitleKey: "resources.helplines_subtitle",
    icon: <Phone className="w-5 h-5" />,
    resources: [
      {
        titleKey: "resources.helplines_113_title",
        descKey: "resources.helplines_113_desc",
        url: "https://www.113.nl/",
        icon: <Phone className="w-5 h-5" />,
        tagKey: "resources.helplines_113_tag",
        tagColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      {
        titleKey: "resources.helplines_luisterlijn_title",
        descKey: "resources.helplines_luisterlijn_desc",
        url: "https://www.deluisterlijn.nl/",
        icon: <MessageCircle className="w-5 h-5" />,
        tagKey: "resources.helplines_luisterlijn_tag",
        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      {
        titleKey: "resources.helplines_crisis_title",
        descKey: "resources.helplines_crisis_desc",
        url: "https://findahelpline.com/countries/nl",
        icon: <Globe className="w-5 h-5" />,
        tagKey: "resources.helplines_crisis_tag",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
    ],
  },
  {
    titleKey: "resources.community_title",
    subtitleKey: "resources.community_subtitle",
    icon: <Users className="w-5 h-5" />,
    resources: [
      {
        titleKey: "resources.community_internations_title",
        descKey: "resources.community_internations_desc",
        url: "https://www.internations.org/netherlands-expats",
        icon: <Users className="w-5 h-5" />,
        tagKey: "resources.community_internations_tag",
        tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      {
        titleKey: "resources.community_meetup_title",
        descKey: "resources.community_meetup_desc",
        url: "https://www.meetup.com/find/?keywords=expat&location=nl",
        icon: <Globe className="w-5 h-5" />,
        tagKey: "resources.community_meetup_tag",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      {
        titleKey: "resources.community_reddit_title",
        descKey: "resources.community_reddit_desc",
        url: "https://www.reddit.com/r/Netherlands/",
        icon: <MessageCircle className="w-5 h-5" />,
        tagKey: "resources.community_reddit_tag",
        tagColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
      },
    ],
  },
  {
    titleKey: "resources.health_title",
    subtitleKey: "resources.health_subtitle",
    icon: <Shield className="w-5 h-5" />,
    resources: [
      {
        titleKey: "resources.health_gp_title",
        descKey: "resources.health_gp_desc",
        url: "https://www.government.nl/topics/health-insurance/standard-health-insurance",
        icon: <Shield className="w-5 h-5" />,
        tagKey: "resources.health_gp_tag",
        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      {
        titleKey: "resources.health_referral_title",
        descKey: "resources.health_referral_desc",
        url: "https://www.rijksoverheid.nl/onderwerpen/geestelijke-gezondheidszorg",
        icon: <MessageCircle className="w-5 h-5" />,
        tagKey: "resources.health_referral_tag",
        tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      {
        titleKey: "resources.health_wait_title",
        descKey: "resources.health_wait_desc",
        url: "https://www.wachttijdenggz.nl/",
        icon: <Globe className="w-5 h-5" />,
        tagKey: "resources.health_wait_tag",
        tagColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    ],
  },
  {
    titleKey: "resources.therapists_title",
    subtitleKey: "resources.therapists_subtitle",
    icon: <Heart className="w-5 h-5" />,
    resources: [
      {
        titleKey: "resources.therapists_igp_title",
        descKey: "resources.therapists_igp_desc",
        url: "https://www.igp.nl/",
        icon: <Shield className="w-5 h-5" />,
        tagKey: "resources.therapists_igp_tag",
        tagColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      },
      {
        titleKey: "resources.therapists_openup_title",
        descKey: "resources.therapists_openup_desc",
        url: "https://openup.com/",
        icon: <Heart className="w-5 h-5" />,
        tagKey: "resources.therapists_openup_tag",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      {
        titleKey: "resources.therapists_psychtoday_title",
        descKey: "resources.therapists_psychtoday_desc",
        url: "https://www.psychologytoday.com/nl/counselling",
        icon: <Globe className="w-5 h-5" />,
        tagKey: "resources.therapists_psychtoday_tag",
        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
    ],
  },
];

const ResourceCard = ({ resource, index, t }: { resource: Resource; index: number; t: (key: string) => string }) => (
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
              {t(resource.tagKey)}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </div>
        <CardTitle className="text-base mt-2">{t(resource.titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {t(resource.descKey)}
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
            key={section.titleKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: sIdx * 0.15 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-display font-semibold text-foreground">{t(section.titleKey)}</h2>
              <p className="text-sm text-muted-foreground">{t(section.subtitleKey)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.resources.map((resource, rIdx) => (
                <ResourceCard key={resource.titleKey} resource={resource} index={sIdx * 3 + rIdx} t={t} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default Resources;
