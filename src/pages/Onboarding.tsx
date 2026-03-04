import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Globe, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
  "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
  "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba",
  "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent",
  "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
];

const TIME_OPTIONS = [
  { value: "less_6_months", labelEs: "Menos de 6 meses", labelEn: "Less than 6 months" },
  { value: "6_12_months", labelEs: "6-12 meses", labelEn: "6-12 months" },
  { value: "1_3_years", labelEs: "1-3 años", labelEn: "1-3 years" },
  { value: "more_3_years", labelEs: "Más de 3 años", labelEn: "More than 3 years" },
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");
  const [step, setStep] = useState(0);
  const [countryOrigin, setCountryOrigin] = useState("");
  const [countryDestination, setCountryDestination] = useState("");
  const [timeAbroad, setTimeAbroad] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        country_origin: countryOrigin,
        country_destination: countryDestination,
        time_abroad: timeAbroad,
        onboarding_completed: true,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["profile-onboarding"] });
      navigate("/dashboard", { replace: true });
    }
    setSaving(false);
  };

  const steps = [
    {
      icon: Globe,
      title: isEn ? "Where are you from?" : "¿De qué país eres?",
      subtitle: isEn ? "Select your home country" : "Selecciona tu país de origen",
      content: (
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {COUNTRIES.map((country) => (
            <button
              key={country}
              onClick={() => setCountryOrigin(country)}
              className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                countryOrigin === country
                  ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-lg scale-[1.02]"
                  : "glass hover:bg-muted"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      ),
      canNext: countryOrigin.length > 0,
    },
    {
      icon: MapPin,
      title: isEn ? "Where do you live now?" : "¿En qué país vives ahora?",
      subtitle: isEn ? "Your current country" : "Tu país actual",
      content: (
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {COUNTRIES.map((country) => (
            <button
              key={country}
              onClick={() => setCountryDestination(country)}
              className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                countryDestination === country
                  ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-lg scale-[1.02]"
                  : "glass hover:bg-muted"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      ),
      canNext: countryDestination.length > 0,
    },
    {
      icon: Clock,
      title: isEn ? "How long have you lived there?" : "¿Hace cuánto vives ahí?",
      subtitle: isEn ? "Time since you moved" : "Tiempo desde que te mudaste",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeAbroad(opt.value)}
              className={`p-4 rounded-xl text-sm font-medium transition-all ${
                timeAbroad === opt.value
                  ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-lg scale-[1.02]"
                  : "glass hover:bg-muted"
              }`}
            >
              {isEn ? opt.labelEn : opt.labelEs}
            </button>
          ))}
        </div>
      ),
      canNext: timeAbroad.length > 0,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl text-foreground">Rooted Abroad</span>
          </div>
          <div className="flex justify-center gap-2 mb-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? "w-8 bg-primary" : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-8 text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <current.icon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground mb-1">{current.title}</h2>
              <p className="text-sm text-muted-foreground">{current.subtitle}</p>
            </div>
            {current.content}
            <Button
              onClick={() => (isLast ? handleFinish() : setStep(step + 1))}
              disabled={!current.canNext || saving}
              className="w-full group"
              size="lg"
            >
              {saving
                ? (isEn ? "Saving..." : "Guardando...")
                : isLast
                ? (isEn ? "Start my journey 🌱" : "Comenzar mi viaje 🌱")
                : (isEn ? "Continue" : "Continuar")}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
