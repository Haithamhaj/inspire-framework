import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, ClipboardList, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
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
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-start px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    INSPIRE
                  </div>
                  <span className="text-[10px] text-primary/70 leading-none mt-0.5">Personal AI Instructions</span>
                </div>
                <Link
                  href="/my-assessments"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>تقاريري</span>
                </Link>
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-border/50 hover:border-primary/40 hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{String((user as { name?: unknown }).name ?? "")}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/privacy-consent"
                  className="text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  ابدأ التقييم
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
