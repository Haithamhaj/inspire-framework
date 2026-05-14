import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { I18nProvider } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { applySeo, getSeoForPath } from "@/lib/seo";
import { useI18n } from "@/i18n";
import { getPathLocale, stripLocalePrefix } from "@/lib/locale-paths";

// Pages
import Landing from "@/pages/landing";
import PrivacyConsent from "@/pages/privacy-consent";
import { PrivacyPage, RefundPolicyPage, TermsPage } from "@/pages/legal";
import Register from "@/pages/register";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Research from "@/pages/research";
import Guides from "@/pages/guides";
import Assess from "@/pages/assess";
import AssessMini from "@/pages/assess-mini";
import Results from "@/pages/results";
import MyAssessments from "@/pages/my-assessments";
import Profile from "@/pages/profile";
import Share from "@/pages/share";
import ReviewDemo from "@/pages/review-demo";
import Admin from "@/pages/admin";
import BillingSuccess from "@/pages/billing-success";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    const pathLocale = getPathLocale(location);
    if (pathLocale && pathLocale !== locale) setLocale(pathLocale);
  }, [location, locale, setLocale]);

  useEffect(() => {
    applySeo(getSeoForPath(location, locale));
  }, [location, locale]);

  const normalizedLocation = stripLocalePrefix(location).split("?")[0] || "/";
  const premiumNavPaths = new Set([
    "/",
    "/privacy-consent",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/register",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/pricing",
    "/about",
    "/contact",
    "/research",
    "/guides",
    "/assess",
    "/assess/mini",
    "/review-demo",
    "/billing/success",
  ]);
  const isPremium = premiumNavPaths.has(normalizedLocation) || /^\/results\/[^/]+/.test(normalizedLocation);
  const isReviewDemo = normalizedLocation === "/review-demo";

  return (
    <div className="flex flex-col min-h-screen">
      {!isReviewDemo && <Navbar variant={isPremium ? "premium" : "default"} />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/ar" component={Landing} />
          <Route path="/privacy-consent" component={PrivacyConsent} />
          <Route path="/ar/privacy-consent" component={PrivacyConsent} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/ar/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/ar/privacy" component={PrivacyPage} />
          <Route path="/refund-policy" component={RefundPolicyPage} />
          <Route path="/ar/refund-policy" component={RefundPolicyPage} />
          <Route path="/register" component={Register} />
          <Route path="/ar/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/ar/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/ar/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/ar/reset-password" component={ResetPassword} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/ar/pricing" component={Pricing} />
          <Route path="/about" component={About} />
          <Route path="/ar/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/ar/contact" component={Contact} />
          <Route path="/research" component={Research} />
          <Route path="/ar/research" component={Research} />
          <Route path="/guides" component={Guides} />
          <Route path="/ar/guides" component={Guides} />
          <Route path="/guides/:slug" component={Guides} />
          <Route path="/ar/guides/:slug" component={Guides} />
          <Route path="/assess" component={Assess} />
          <Route path="/ar/assess" component={Assess} />
          <Route path="/assess/mini" component={AssessMini} />
          <Route path="/ar/assess/mini" component={AssessMini} />
          <Route path="/results/:id" component={Results} />
          <Route path="/ar/results/:id" component={Results} />
          <Route path="/my-assessments" component={MyAssessments} />
          <Route path="/ar/my-assessments" component={MyAssessments} />
          <Route path="/profile" component={Profile} />
          <Route path="/ar/profile" component={Profile} />
          <Route path="/share/:token" component={Share} />
          <Route path="/ar/share/:token" component={Share} />
          <Route path="/review-demo" component={ReviewDemo} />
          <Route path="/ar/review-demo" component={ReviewDemo} />
          <Route path="/billing/success" component={BillingSuccess} />
          <Route path="/ar/billing/success" component={BillingSuccess} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isReviewDemo && <LegalFooter />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
