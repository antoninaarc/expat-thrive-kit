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
    { to: "/library", icon: Library, label: "Biblioteca" },
    { to: "/programs", icon: Target, label: "Programas" },
    { to: "/resources", icon: BookOpen, label: "Recursos" },
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
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg text-foreground hidden sm:block">Expat Rooted</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link key={to} to={to} className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "text-primary bg-calm-light" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {active && <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-lg bg-calm-light -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
                </Link>
              );
            })}
            <LanguageSwitcher />
            <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
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
