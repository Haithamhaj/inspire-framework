import type { ReactNode } from "react";
import { useI18n } from "@/i18n";

export type ReportLanguage = "ar" | "en" | "both";
type SingleReportLanguage = "ar" | "en";

interface ReportBlockProps {
  lang: SingleReportLanguage;
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

/**
 * ReportBlock — wraps LLM-generated report content in a direction-aware
 * container so the report keeps its original direction regardless of the
 * surrounding UI direction. Always pass a single language ("ar" or "en").
 * For reportLanguage="both", use <ReportContent /> below.
 */
export function ReportBlock({
  lang,
  children,
  className,
  as = "div",
}: ReportBlockProps) {
  const Tag = as;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const directionClassName =
    lang === "ar"
      ? "text-right [unicode-bidi:plaintext]"
      : "text-left [unicode-bidi:plaintext]";
  return (
    <Tag
      lang={lang}
      dir={dir}
      data-report-lang={lang}
      className={[directionClassName, className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}

interface ReportContentProps {
  reportLanguage: ReportLanguage;
  arabic?: ReactNode;
  english?: ReactNode;
  className?: string;
  blockClassName?: string;
}

/**
 * ReportContent — high-level helper that handles all three values of
 * reportLanguage ("ar" | "en" | "both"). For "both" it stacks the two
 * versions vertically (mobile-safe).
 */
export function ReportContent({
  reportLanguage,
  arabic,
  english,
  className,
  blockClassName,
}: ReportContentProps) {
  if (reportLanguage === "ar") {
    return (
      <div className={className}>
        <ReportBlock lang="ar" className={blockClassName}>
          {arabic}
        </ReportBlock>
      </div>
    );
  }
  if (reportLanguage === "en") {
    return (
      <div className={className}>
        <ReportBlock lang="en" className={blockClassName}>
          {english}
        </ReportBlock>
      </div>
    );
  }
  // both — stack vertically, mobile-safe.
  return (
    <div className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}>
      {arabic !== undefined && (
        <ReportBlock lang="ar" className={blockClassName}>
          {arabic}
        </ReportBlock>
      )}
      {english !== undefined && (
        <ReportBlock lang="en" className={blockClassName}>
          {english}
        </ReportBlock>
      )}
    </div>
  );
}

interface MismatchNoticeProps {
  reportLanguage: ReportLanguage;
  className?: string;
}

/**
 * MismatchNotice — small inline notice shown only when the active UI
 * language differs from the report language. Subtle, non-dismissible,
 * never alarming. Hidden when languages match or when reportLanguage="both".
 */
export function MismatchNotice({
  reportLanguage,
  className,
}: MismatchNoticeProps) {
  const { locale, t } = useI18n();
  if (reportLanguage === "both") return null;
  if (reportLanguage === locale) return null;
  return (
    <div
      role="status"
      data-testid="report-mismatch-notice"
      className={[
        "inline-flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[12.5px] leading-relaxed text-white/65 backdrop-blur-md",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300/80" />
      <span>{t("results.mismatchNotice")}</span>
    </div>
  );
}
