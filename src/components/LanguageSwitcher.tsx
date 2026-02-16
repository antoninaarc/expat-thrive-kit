import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "es";

  const toggle = () => {
    i18n.changeLanguage(currentLang === "es" ? "en" : "es");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={currentLang === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">{currentLang === "es" ? "EN" : "ES"}</span>
    </button>
  );
};

export default LanguageSwitcher;
