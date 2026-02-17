import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Leaf, LayoutDashboard, BookHeart, ClipboardCheck, ShieldAlert, Library, Target, BookOpen, LogOut, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const AppLayout = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("nav.home") },
    { to: "/routine", icon: Sun, label: t("nav.routine") },
    { to: "/journal", icon: BookHeart, label: t("nav.journal") },
    { to: "/assessments", icon: ClipboardCheck, label: t("nav.tests") },
    { to: "/emergency-kit", icon: ShieldAlert, label: t("nav.sos") },
    { to: "/library", icon: Library, label: t("library.title") },
    { to: "/programs", icon: Target, label: t("programs.title") },
    { to: "/resources", icon: BookOpen, label: t("resources.title").replace(" 🌿", "") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full gradient-calm animate-pulse-soft" />
      </div>
    );
  }

  // Auth check removed — app is open for preview

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container flex items-center justify-between h-14">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-vibrant flex items-center justify-center shadow-md">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-foreground hidden sm:block tracking-tight">Expat Rooted</span>
          </Link>

          <nav className="flex items-center gap-0.5">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link key={to} to={to} className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "text-primary bg-warm-light" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {active && <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-xl bg-warm-light -z-10" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
                </Link>
              );
            })}
            <LanguageSwitcher />
            <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="container py-6 max-w-4xl"><Outlet /></main>
    </div>
  );
};

export default AppLayout;
