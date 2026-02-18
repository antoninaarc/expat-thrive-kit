import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Trans } from "react-i18next";
import {
  Leaf, LayoutDashboard, BookHeart, ClipboardCheck, ShieldAlert,
  Library, Target, BookOpen, LogOut, Sun, ShieldCheck, MoreHorizontal, X, MessageSquareHeart, Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const AppLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);

  // Primary tabs shown in bottom bar (max 5 slots: 4 main + "More")
  const primaryItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("nav.home") },
    { to: "/routine", icon: Sun, label: t("nav.routine") },
    { to: "/journal", icon: BookHeart, label: t("nav.journal") },
    { to: "/assessments", icon: ClipboardCheck, label: t("nav.tests") },
    { to: "/emergency-kit", icon: ShieldAlert, label: t("nav.sos") },
  ];

  // Secondary items in "More" menu
  const secondaryItems = [
    { to: "/roadmap", icon: Map, label: t("roadmap.title") },
    { to: "/library", icon: Library, label: t("library.title") },
    { to: "/programs", icon: Target, label: t("programs.title") },
    { to: "/resources", icon: BookOpen, label: t("resources.title").replace(" 🌿", "") },
    { to: "/feedback", icon: MessageSquareHeart, label: t("feedback.title") },
    ...(isAdmin ? [{ to: "/admin", icon: ShieldCheck, label: "Admin" }] : []),
  ];

  const allItems = [...primaryItems, ...secondaryItems];

  // Check if "More" section has active route
  const moreIsActive = secondaryItems.some((item) => location.pathname.startsWith(item.to));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full gradient-calm animate-pulse-soft" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ═══════════ DESKTOP TOP NAV ═══════════ */}
      {!isMobile && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <div className="container flex items-center justify-between h-14">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-vibrant flex items-center justify-center shadow-md">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-foreground tracking-tight">
                Expat Rooted
              </span>
            </Link>

            <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
              {allItems.map(({ to, icon: Icon, label }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      active
                        ? "text-primary bg-warm-light"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-xl bg-warm-light -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
              <LanguageSwitcher />
            </nav>
          </div>
        </header>
      )}

      {/* ═══════════ MOBILE TOP BAR (minimal) ═══════════ */}
      {isMobile && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <div className="flex items-center justify-between h-12 px-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-vibrant flex items-center justify-center shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-base font-bold text-foreground tracking-tight">
                Expat Rooted
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
            </div>
          </div>
        </header>
      )}

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className={`container py-6 px-4 max-w-4xl mx-auto ${isMobile ? "pb-24" : ""}`}>
        <Outlet />
      </main>

      {/* ═══════════ LEGAL DISCLAIMER FOOTER ═══════════ */}
      <footer className={`border-t border-border/30 bg-muted/30 ${isMobile ? "pb-20" : ""}`}>
        <div className="container max-w-4xl py-4 px-4 text-center">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <Trans i18nKey="legal.footer_disclaimer"
              components={{
                terms: <Link to="/terms" className="underline hover:text-foreground transition-colors" />,
                privacy: <Link to="/privacy" className="underline hover:text-foreground transition-colors" />,
              }}
            />
          </p>
        </div>
      </footer>

      {/* ═══════════ MOBILE BOTTOM TAB BAR ═══════════ */}
      {isMobile && (
        <>
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 safe-area-bottom">
            <div className="flex items-stretch justify-around h-16 px-2 max-w-md mx-auto">
              {primaryItems.slice(0, 4).map(({ to, icon: Icon, label }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex flex-col items-center justify-center flex-1 min-w-0 gap-0.5 transition-colors ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                    <span className="text-[10px] font-medium leading-tight truncate max-w-[56px] text-center">{label}</span>
                    {active && (
                      <motion.div
                        layoutId="mobile-tab-indicator"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* SOS tab */}
              {(() => {
                const sos = primaryItems[4];
                const active = location.pathname.startsWith(sos.to);
                return (
                  <Link
                    to={sos.to}
                    className={`flex flex-col items-center justify-center flex-1 min-w-0 gap-0.5 transition-colors ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <sos.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                    <span className="text-[10px] font-medium leading-tight truncate max-w-[56px] text-center">{sos.label}</span>
                  </Link>
                );
              })()}

              {/* More button */}
              <button
                onClick={() => setMoreOpen(true)}
                className={`flex flex-col items-center justify-center flex-1 min-w-0 gap-0.5 transition-colors ${
                  moreIsActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium leading-tight truncate max-w-[56px] text-center">{t("nav.more", "Más")}</span>
              </button>
            </div>
          </nav>

          {/* ═══════════ MORE SHEET (overlay) ═══════════ */}
          <AnimatePresence>
            {moreOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMoreOpen(false)}
                />
                {/* Panel */}
                <motion.div
                  className="fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-2xl border-t border-border/40 safe-area-bottom"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {t("nav.more", "Más")}
                    </h3>
                    <button
                      onClick={() => setMoreOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="px-3 pb-6 space-y-1">
                    {secondaryItems.map(({ to, icon: Icon, label }) => {
                      const active = location.pathname.startsWith(to);
                      return (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                            active
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted/60"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default AppLayout;
