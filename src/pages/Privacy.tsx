import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> {t("legal.back")}
          </Link>
          <LanguageSwitcher />
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t("legal.privacy_title")}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t("legal.last_updated")}: 2025-06-17</p>

        <div className="prose prose-sm max-w-none text-foreground/90 space-y-6">
          {/* Disclaimer */}
          <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-foreground mt-0">{t("legal.disclaimer_title")}</h2>
            <p>{t("legal.disclaimer_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s1_title")}</h2>
            <p>{t("legal.privacy_s1_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s2_title")}</h2>
            <p>{t("legal.privacy_s2_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s3_title")}</h2>
            <p>{t("legal.privacy_s3_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s4_title")}</h2>
            <p>{t("legal.privacy_s4_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s5_title")}</h2>
            <p>{t("legal.privacy_s5_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s6_title")}</h2>
            <p>{t("legal.privacy_s6_text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">{t("legal.privacy_s7_title")}</h2>
            <p>{t("legal.privacy_s7_text")}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
