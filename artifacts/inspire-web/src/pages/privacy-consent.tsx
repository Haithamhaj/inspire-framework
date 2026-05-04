import { useState } from "react";
import { useLocation } from "wouter";
import { Check, Shield, FileText, LockKeyhole, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import {
  JourneyPanel,
  JourneyPrimaryButton,
  JourneyShell,
  JourneyStepIndicator,
} from "@/components/journey";

export default function PrivacyConsent() {
  const [, setLocation] = useLocation();
  const [agreed, setAgreed] = useState(false);
  const { dir, t } = useI18n();

  const handleContinue = () => {
    if (agreed) {
      // In a real app we might store consent in local storage or context before passing to register
      setLocation("/register");
    }
  };

  return (
    <JourneyShell
      dir={dir}
      eyebrow="INSPIRE"
      title={t("privacyConsent.title")}
      subtitle={t("privacyConsent.subtitle")}
      aside={
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-100">INSPIRE</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {t("privacyConsent.intro")}
              </p>
            </div>
          </div>

          <JourneyStepIndicator
            steps={[
              { label: t("privacyConsent.title"), state: "current" },
              { label: t("register.title"), state: "upcoming" },
              { label: t("assessment.shell.title"), state: "upcoming" },
            ]}
          />
        </div>
      }
    >
      <JourneyPanel className="max-w-3xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-500/[0.1] text-rose-200 shadow-lg shadow-rose-950/25">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200/80">
              {t("privacyConsent.dataUseTitle")}
            </p>
            <p className="mt-2 max-w-2xl text-base leading-8 text-slate-300">
              {t("privacyConsent.intro")}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            {
              icon: BarChart3,
              title: t("privacyConsent.analysisTitle"),
              text: t("privacyConsent.analysisText"),
            },
            {
              icon: LockKeyhole,
              title: t("privacyConsent.confidentialityTitle"),
              text: t("privacyConsent.confidentialityText"),
            },
            {
              icon: Sparkles,
              title: t("privacyConsent.improvementTitle"),
              text: t("privacyConsent.improvementText"),
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="flex items-start gap-3 rounded-2xl border border-slate-400/10 bg-slate-900/45 p-4"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-400/10 bg-slate-950/70 text-rose-200">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-black text-slate-100">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <label className="group mt-7 flex cursor-pointer items-start gap-4 rounded-3xl border border-slate-400/10 bg-slate-900/55 p-5 transition-colors hover:border-rose-300/25 hover:bg-slate-900/75">
          <div className="relative mt-1 flex items-center justify-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <div className="flex h-7 w-7 items-center justify-center rounded-xl border-2 border-slate-500/50 bg-slate-950/80 transition-all peer-checked:border-rose-300 peer-checked:bg-rose-500 group-hover:border-rose-300/70">
              <Check className="h-4 w-4 text-slate-950 opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="select-none text-lg font-black text-slate-100 transition-colors group-hover:text-rose-100">
              {t("privacyConsent.agreeTitle")}
            </span>
            <span className="mt-1 select-none text-sm text-slate-400" dir={dir === "rtl" ? "ltr" : "rtl"}>
              {t("privacyConsent.agreeSubtitle")}
            </span>
          </div>
        </label>

        <div className="mt-7 flex justify-end">
          <JourneyPrimaryButton onClick={handleContinue} disabled={!agreed}>
            {t("privacyConsent.continueButton")}
          </JourneyPrimaryButton>
        </div>
      </JourneyPanel>
    </JourneyShell>
  );
}
