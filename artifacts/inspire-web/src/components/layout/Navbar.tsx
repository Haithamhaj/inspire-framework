import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Globe2, LogOut, User, ClipboardList, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type NavbarProps = {
  variant?: "default" | "premium";
};

export function Navbar({ variant = "default" }: NavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const { t, locale, setLocale, dir } = useI18n();
  const isPremium = variant === "premium";
  const isRtl = dir === "rtl";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        isPremium
          ? "border-rose-200/[0.06] bg-[#070713]/92 shadow-lg shadow-black/20 backdrop-blur-2xl"
          : "border-border/40 bg-background/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.08] shadow-lg shadow-rose-950/20 sm:h-9 sm:w-9">
            <Sparkles className="h-[17px] w-[17px] text-rose-200" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] font-black tracking-tight text-rose-200 sm:text-[18px]" dir="ltr">
              INSPIRE
            </span>
            <span
              className={cn(
                "mt-1 hidden text-[10px] font-semibold sm:block",
                isPremium ? "text-slate-500" : "text-muted-foreground"
              )}
            >
              {t("common.nav.brandTagline")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-black transition-all sm:h-9 sm:gap-2 sm:px-3",
              isPremium
                ? "border-slate-400/10 bg-slate-950/45 text-slate-300 hover:border-rose-300/25 hover:bg-slate-900/70 hover:text-rose-100"
                : "border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50 hover:text-foreground"
            )}
            dir="ltr"
            aria-label={t("common.languageSwitcher.label")}
          >
            <Globe2 className="h-3.5 w-3.5" />
            {locale === "ar" ? "EN" : "ع"}
          </button>

          {!isLoading && (
            user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/my-assessments"
                  className={cn(
                    "hidden h-9 items-center gap-2 rounded-2xl border px-3 text-sm font-bold transition-colors sm:flex",
                    isPremium
                      ? "border-slate-400/10 bg-slate-950/35 text-slate-300 hover:border-rose-300/25 hover:bg-slate-900/70 hover:text-rose-100"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  )}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>{t("common.nav.myReports")}</span>
                </Link>

                <Link
                  href="/profile"
                  className={cn(
                    "hidden h-9 max-w-[11rem] items-center gap-2 rounded-2xl border px-3 transition-colors sm:flex",
                    isPremium
                      ? "border-slate-400/10 bg-slate-950/35 hover:border-rose-300/25 hover:bg-slate-900/70"
                      : "border-border/50 bg-secondary/50 hover:border-primary/40 hover:bg-secondary"
                  )}
                >
                  <User
                    className={cn("h-4 w-4 shrink-0", isPremium ? "text-rose-200" : "text-primary")}
                  />
                  <span
                    className={cn(
                      "truncate text-sm font-bold",
                      isPremium ? "text-slate-100" : "text-foreground"
                    )}
                  >
                    {String((user as { name?: unknown }).name ?? "")}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-2xl px-2.5 text-sm font-bold transition-colors",
                    isPremium
                      ? "text-slate-500 hover:bg-slate-900/60 hover:text-slate-200"
                      : "text-muted-foreground hover:text-accent"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("common.nav.logout")}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className={cn(
                    "hidden h-9 items-center rounded-2xl px-3 text-sm font-bold transition-colors sm:inline-flex",
                    isPremium
                      ? "text-slate-300 hover:bg-slate-900/60 hover:text-rose-100"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {t("common.nav.login")}
                </Link>
                <Link
                  href="/privacy-consent"
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0 sm:h-9 sm:gap-2 sm:px-4",
                    isPremium
                      ? "bg-gradient-to-l from-rose-500 to-orange-500 text-slate-950 shadow-lg shadow-rose-950/25 hover:from-rose-400 hover:to-orange-400"
                      : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                  )}
                >
                  <span className="hidden sm:inline">{t("common.nav.startAssessment")}</span>
                  <span className="sm:hidden">{locale === "ar" ? "ابدأ" : "Start"}</span>
                  <ArrowRight className={cn("h-4 w-4", isRtl && "rotate-180")} />
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
