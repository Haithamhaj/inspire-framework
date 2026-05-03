import { useI18n } from "@/i18n";
import {
  ReportBlock,
  ReportContent,
  MismatchNotice,
  type ReportLanguage,
} from "@/components/premium/ReportBlock";
import { useState } from "react";

const REPORT_OPTIONS: ReportLanguage[] = ["ar", "en", "both"];

export default function I18nDemo() {
  const { locale, dir, t, setLocale } = useI18n();
  const [reportLang, setReportLang] = useState<ReportLanguage>("ar");

  const arSample = t("i18nDemo.sampleAr");
  const enSample = t("i18nDemo.sampleEn");

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#0b0d1f] text-white"
      data-testid="i18n-demo-page"
    >
      <div className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8 md:py-16">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11.5px] text-white/60 backdrop-blur-md">
            P0 · Bilingual Foundation
          </div>
          <h1 className="mt-3 text-[28px] font-bold leading-tight md:text-[36px]">
            {t("i18nDemo.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/65 md:text-[15px]">
            {t("i18nDemo.subtitle")}
          </p>
        </header>

        {/* Status row */}
        <section className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-wide text-white/45">
              {t("i18nDemo.currentLocale")}
            </div>
            <div
              className="mt-1 text-[18px] font-semibold"
              data-testid="status-locale"
            >
              {locale === "ar" ? t("common.languageSwitcher.ar") : t("common.languageSwitcher.en")}
              <span className="ms-2 text-[12px] font-normal text-white/45">
                ({locale})
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-wide text-white/45">
              {t("i18nDemo.documentDir")}
            </div>
            <div
              className="mt-1 text-[18px] font-semibold"
              data-testid="status-dir"
            >
              {dir.toUpperCase()}
              <span className="ms-2 text-[12px] font-normal text-white/45">
                ({dir === "rtl" ? t("common.direction.isRtl") : t("common.direction.isLtr")})
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-wide text-white/45">
              {t("i18nDemo.fallbackOrder")}
            </div>
            <div
              className="mt-1 text-[12.5px] font-mono text-white/80"
              data-testid="status-fallback"
            >
              {t("i18nDemo.fallbackOrderValue")}
            </div>
          </div>
        </section>

        {/* Language switcher */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 text-[12.5px] text-white/65">
            {t("common.languageSwitcher.label")}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="switch-ar"
              onClick={() => setLocale("ar")}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                locale === "ar"
                  ? "border-rose-400/40 bg-rose-500/15 text-rose-100"
                  : "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
              }`}
            >
              {t("i18nDemo.switchTo")} {t("common.languageSwitcher.ar")}
            </button>
            <button
              type="button"
              data-testid="switch-en"
              onClick={() => setLocale("en")}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                locale === "en"
                  ? "border-teal-400/40 bg-teal-500/15 text-teal-100"
                  : "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
              }`}
            >
              {t("i18nDemo.switchTo")} {t("common.languageSwitcher.en")}
            </button>
          </div>
        </section>

        {/* Report language selector */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 text-[12.5px] text-white/65">
            reportLanguage
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {REPORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                data-testid={`report-${opt}`}
                onClick={() => setReportLang(opt)}
                className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                  reportLang === opt
                    ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
                    : "border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <MismatchNotice reportLanguage={reportLang} />
          </div>
        </section>

        {/* Live ReportBlock examples */}
        <section className="mb-10 space-y-4">
          {reportLang === "ar" && (
            <article
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              data-testid="report-card-ar"
            >
              <div className="mb-2 text-[11.5px] uppercase tracking-wide text-rose-200/80">
                {t("i18nDemo.sampleArHeader")}
              </div>
              <ReportBlock
                lang="ar"
                className="rounded-xl border border-white/[0.06] bg-black/30 p-4 text-[14px] leading-loose text-white/90"
              >
                {arSample}
              </ReportBlock>
            </article>
          )}

          {reportLang === "en" && (
            <article
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              data-testid="report-card-en"
            >
              <div className="mb-2 text-[11.5px] uppercase tracking-wide text-teal-200/80">
                {t("i18nDemo.sampleEnHeader")}
              </div>
              <ReportBlock
                lang="en"
                className="rounded-xl border border-white/[0.06] bg-black/30 p-4 text-[14px] leading-loose text-white/90"
              >
                {enSample}
              </ReportBlock>
            </article>
          )}

          {reportLang === "both" && (
            <article
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              data-testid="report-card-both"
            >
              <div className="mb-3 text-[11.5px] uppercase tracking-wide text-violet-200/80">
                {t("i18nDemo.sampleBothHeader")}
              </div>
              <ReportContent
                reportLanguage="both"
                arabic={arSample}
                english={enSample}
                blockClassName="rounded-xl border border-white/[0.06] bg-black/30 p-4 text-[14px] leading-loose text-white/90"
              />
            </article>
          )}
        </section>

        {/* Acceptance checklist */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-3 text-[13px] font-semibold text-white/85">
            {t("i18nDemo.rules.title")}
          </div>
          <ul className="space-y-2 text-[13px] leading-relaxed text-white/70">
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400/80" />
              {t("i18nDemo.rules.r1")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400/80" />
              {t("i18nDemo.rules.r2")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400/80" />
              {t("i18nDemo.rules.r3")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400/80" />
              {t("i18nDemo.rules.r4")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400/80" />
              {t("i18nDemo.rules.r5")}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400/80" />
              {t("i18nDemo.rules.r6")}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
