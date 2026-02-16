import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Heart, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Auth = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    } else {
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
            <span className="font-display text-2xl text-foreground">Expat Rooted</span>
          </div>
          <p className="text-muted-foreground">{t("auth.subtitle")}</p>
        </div>

        <div className="glass rounded-2xl p-8">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.loading") : isLogin ? t("auth.submit_login") : t("auth.submit_register")}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-coral" /> {t("auth.footer")}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
