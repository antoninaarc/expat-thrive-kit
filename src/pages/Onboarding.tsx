import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Globe, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const COUNTRIES = [
  "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica",
  "Cuba", "Dominican Republic", "Ecuador", "El Salvador", "Guatemala",
  "Honduras", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru",
  "Puerto Rico", "Spain", "Uruguay", "Venezuela", "Other"
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
  const [timeAbroad, setTimeAbroad] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        country_origin: countryOrigin,
        country_destination: "your new country",
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
      icon: Clock,
      title: isEn ? "How long have you been in the your new country?" : "¿Hace cuánto vives en tu nuevo país?",
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
          <div cl

