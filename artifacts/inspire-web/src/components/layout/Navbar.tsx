import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, ClipboardList, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";

type NavbarProps = {
  variant?: "default" | "premium";
};

export function Navbar({ variant = "default" }: NavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const isPremium = variant === "premium";

  return (
    <nav
      className={[
        "sticky top-0 z-50 w-full border-b transition-colors",
        isPremium
          ? "bg-black/40 backdrop-blur-xl border-white/10"
          : "bg-background/80 backdrop-blur-md border-border/40",
      ].join(" ")}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <span
            className="font-display font-bold tracking-tight"
            dir="ltr"
            style={{ fontSize: "20px", color: "#e94560" }}
          >
            INSPIRE
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className={[
              "text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all",
              isPremium
                ? "border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary/50",
            ].join(" ")}
            dir="ltr"
          >
            {locale === "ar" ? "EN" : "ع"}
          </button>

          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <div
                  className={[
                    "hidden md:flex flex-col items-start px-3 py-1.5 rounded-full",
                    isPremium
                      ? "bg-white/10 text-white"
                      : "bg-primary/10 text-primary",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    INSPIRE
                  </div>
                  <span
                    className={[
                      "text-[10px] leading-none mt-0.5",
                      isPremium ? "text-white/50" : "text-primary/70",
                    ].join(" ")}
                  >
                    {t("common.nav.brandTagline")}
                  </span>
                </div>

                <Link
                  href="/my-assessments"
                  className={[
                    "hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors",
                    isPremium
                      ? "text-white/70 hover:text-white"
                      : "text-muted-foreground hover:text-primary",
                  ].join(" ")}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>{t("common.nav.myReports")}</span>
                </Link>

                <Link
                  href="/profile"
                  className={[
                    "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
                    isPremium
                      ? "bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20"
                      : "bg-secondary/50 border-border/50 hover:border-primary/40 hover:bg-secondary",
                  ].join(" ")}
                >
                  <User
                    className={[
                      "h-4 w-4",
                      isPremium ? "text-white/70" : "text-primary",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "text-sm font-medium",
                      isPremium ? "text-white" : "text-foreground",
                    ].join(" ")}
                  >
                    {String((user as { name?: unknown }).name ?? "")}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className={[
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    isPremium
                      ? "text-white/60 hover:text-white"
                      : "text-muted-foreground hover:text-accent",
                  ].join(" ")}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("common.nav.logout")}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={[
                    "text-sm font-medium transition-colors px-4 py-2",
                    isPremium
                      ? "text-white/80 hover:text-white"
                      : "text-foreground hover:text-primary",
                  ].join(" ")}
                >
                  {t("common.nav.login")}
                </Link>
                <Link
                  href="/privacy-consent"
                  className={[
                    "text-sm font-semibold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0",
                    isPremium
                      ? "bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/30"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
                  ].join(" ")}
                >
                  {t("common.nav.startAssessment")}
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
