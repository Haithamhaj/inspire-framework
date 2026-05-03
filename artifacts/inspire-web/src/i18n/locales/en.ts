import type { Dictionary } from "./ar";

export const en: Dictionary = {
  common: {
    languageSwitcher: {
      ar: "العربية",
      en: "English",
      label: "Language",
    },
    copy: {
      label: "Copy",
      copied: "Copied",
    },
    actions: {
      back: "Back",
      next: "Next",
      close: "Close",
      learnMore: "Learn more",
    },
    direction: {
      isRtl: "Arabic (right-to-left)",
      isLtr: "English (left-to-right)",
    },
  },
  results: {
    pageTitle: "Your assistant operating profile",
    mismatchNotice:
      "The interface language differs from the report language. The report is shown in its original language to preserve its content.",
    sections: {
      identity: "Assistant identity",
      benefits: "What you gain",
      roles: "Dynamic roles",
      modes: "Thinking modes",
      redLines: "Red lines",
      profile: "Full operating profile",
      howToUse: "How to use it",
      starters: "Starter prompts",
    },
    actions: {
      copyAll: "Copy assistant instructions",
      copySection: "Copy this section",
      share: "Share",
      downloadPdf: "Download PDF",
      openInChatGPT: "Open in ChatGPT",
      openInGemini: "Open in Gemini",
      openInClaude: "Open in Claude",
    },
    platforms: {
      chatgpt: {
        name: "ChatGPT",
        howTo:
          "Open ChatGPT customization settings and paste this profile into the instructions field to activate your assistant's working style.",
      },
      gemini: {
        name: "Gemini",
        howTo:
          "Open Gemini Gems or your personal context settings and paste this profile to apply the instructions to your conversations.",
      },
      claude: {
        name: "Claude",
        howTo:
          "Open Claude Projects, create a new project, then paste this profile into the System Prompt to get the same behavior.",
      },
    },
    starters: {
      eyebrow: "Starter prompt",
      hint: "Use it directly in your preferred tool.",
    },
  },
  i18nDemo: {
    title: "Bilingual foundation verification",
    subtitle:
      "Verification page only: language switching, document direction, and mixed-direction content.",
    currentLocale: "Current locale",
    documentDir: "Document direction",
    fallbackOrder: "Detection order",
    fallbackOrderValue: "?lang= → localStorage → navigator.language → ar",
    switchTo: "Switch to",
    sampleArHeader: "Arabic report inside any UI",
    sampleEnHeader: "English report inside any UI",
    sampleBothHeader: "Bilingual report (vertically stacked)",
    sampleAr:
      "هذا نص تقرير افتراضي بالعربية لاختبار اتجاه RTL داخل بطاقة التقرير. يجب أن يبقى الاتجاه يمين-يسار حتى لو كانت لغة الواجهة الإنجليزية.",
    sampleEn:
      "This is a sample English report body to verify LTR direction inside a report block. It must remain left-to-right even if the surrounding UI is in Arabic.",
    rules: {
      title: "What you should see",
      r1: "?lang=ar activates Arabic and right-to-left direction.",
      r2: "?lang=en activates English and left-to-right direction.",
      r3: "The language choice persists after reload.",
      r4: "The report card preserves its own direction regardless of the UI language.",
      r5: "The 'both' case renders both versions stacked vertically.",
      r6: "The mismatch notice appears subtly when UI and report languages differ.",
    },
  },
};
