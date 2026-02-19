import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, BookHeart, ClipboardCheck, ShieldAlert, ArrowRight, Heart } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Landing = () => {
  const { t } = useTranslation();

  const features = [
    { icon: ClipboardCheck, title: t("landing.feature_tracker_title"), desc: t("landing.feature_tracker_desc"), color: "bg-calm-light text-calm" },
    { icon: BookHeart, title: t("landing.feature_journal_title"), desc: t("landing.feature_journal_desc"), color: "bg-warm-light text-warm" },
    { icon: ShieldAlert, title: t("landing.feature_kit_title"), desc: t("landing.feature_kit_desc"), color: "bg-coral-light text-coral" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="container flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-calm flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl text-foreground">Rooted Abroad</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/auth">
            <Button>{t("landing.get_started")}</Button>
          </Link>
        </div>
      </header>

      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">{t("landing.hero_title")}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">{t("landing.hero_desc")}</p>
            <Link to="/auth">
              <Button size="lg" className="group">
                {t("landing.cta")}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <img src={heroImage} alt="Cultural transition bridge illustration" className="rounded-3xl shadow-2xl w-full" />
          </motion.div>
        </div>
      </section>

      <section className="container py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">{t("landing.features_title")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("landing.features_desc")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass rounded-2xl p-6">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}><f.icon className="w-6 h-6" /></div>
              <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="container py-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          {t("landing.footer").split("love").length > 1 ? t("landing.footer") : <>{t("landing.footer")}</>}
          <Heart className="w-3 h-3 text-coral" />
        </p>
      </footer>
    </div>
  );
};

export default Landing;
