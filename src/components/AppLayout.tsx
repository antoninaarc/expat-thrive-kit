import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Leaf, LayoutDashboard, BookHeart, ClipboardCheck, ShieldAlert, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { to: "/journal", icon: BookHeart, label: "Diario" },
  { to: "/assessments", icon: ClipboardCheck, label: "Tests" },
  { to: "/emergency-kit", icon: ShieldAlert, label: "Kit SOS" },
];

const AppLayout = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full gradient-calm animate-pulse-soft" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg text-foreground hidden sm:block">Equilibria</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active ? "text-primary bg-calm-light" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-calm-light -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
