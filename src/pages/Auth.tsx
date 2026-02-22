import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Heart, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation, Trans } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { lovable } from "@/integrations/lovable/index";
import { Separator } from "@/components/ui/separator";
const Auth = () => {
  const { t } = useTranslation();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: t("auth.reset_sent", "Email sent"),
        description: t("auth.reset_sent_desc", "Check your email for the reset link."),
      });
      setIsForgot(false);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      if (!consent) {
        toast({ title: "Error", description: t("legal.consent_required", "Please accept the Terms and Privacy Policy"), variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: t("auth.account_created"), description: t("auth.check_email") });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4"><LanguageSwitcher /></div>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl text-foreground">Rooted Abroad</span>
          </div>
          <p className="text-muted-foreground">{t("auth.subtitle")}</p>
          <p className="text-sm text-muted-foreground/70 mt-1">{t("auth.subtitle2")}</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {isForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t("auth.forgot_desc", "Enter your email and we'll send you a reset link.")}
              </p>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("auth.email")}</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.email_placeholder")} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("auth.loading") : t("auth.send_reset", "Send reset link")}
              </Button>
              <button type="button" onClick={() => setIsForgot(false)} className="text-xs text-primary hover:underline w-full text-center">
                {t("auth.back_to_login", "Back to login")}
              </button>
            </form>
          ) : (
          <>
          <div className="flex gap-2 mb-6">
            <Button variant={isLogin ? "default" : "ghost"} className="flex-1" onClick={() => setIsLogin(true)}>{t("auth.login")}</Button>
            <Button variant={!isLogin ? "default" : "ghost"} className="flex-1" onClick={() => setIsLogin(false)}>{t("auth.register")}</Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("auth.name")}</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t("auth.name_placeholder")} />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("auth.email")}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.email_placeholder")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("auth.password")}</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>

            {isLogin && (
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-xs text-primary hover:underline"
              >
                {t("auth.forgot_password", "¿Olvidaste tu contraseña?")}
              </button>
            )}

            {!isLogin && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  <Trans i18nKey="legal.consent_checkbox"
                    components={{
                      terms: <Link to="/terms" className="text-primary underline hover:text-primary/80" />,
                      privacy: <Link to="/privacy" className="text-primary underline hover:text-primary/80" />,
                    }}
                  />
                </label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || (!isLogin && !consent)}>
              {loading ? t("auth.loading") : isLogin ? t("auth.submit_login") : t("auth.submit_register")}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">{t("auth.or", "o")}</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
              }
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t("auth.google_signin", "Continuar con Google")}
          </Button>
          </>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-coral" /> {t("auth.footer")}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
