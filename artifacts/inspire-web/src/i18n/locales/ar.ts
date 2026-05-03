export const ar = {
  common: {
    languageSwitcher: {
      ar: "العربية",
      en: "English",
      label: "اللغة",
    },
    copy: {
      label: "نسخ",
      copied: "تم النسخ",
    },
    actions: {
      back: "رجوع",
      next: "التالي",
      close: "إغلاق",
      learnMore: "معرفة المزيد",
    },
    direction: {
      isRtl: "عربي (يمين-يسار)",
      isLtr: "إنجليزي (يسار-يمين)",
    },
  },
  results: {
    pageTitle: "ملف تشغيل مساعدك",
    mismatchNotice:
      "لغة الواجهة تختلف عن لغة التقرير. نعرض التقرير بلغته الأصلية حتى لا يتغير محتواه.",
    sections: {
      identity: "هوية المساعد",
      benefits: "ما الذي يضيفه لك",
      roles: "الأدوار الديناميكية",
      modes: "أنماط التفكير",
      redLines: "الخطوط الحمراء",
      profile: "ملف التشغيل الكامل",
      howToUse: "كيف تستخدمه",
      starters: "برومبتات بداية",
    },
    actions: {
      copyAll: "نسخ تعليمات المساعد",
      copySection: "نسخ هذا القسم",
      share: "مشاركة",
      downloadPdf: "تحميل PDF",
      openInChatGPT: "افتح في ChatGPT",
      openInGemini: "افتح في Gemini",
      openInClaude: "افتح في Claude",
    },
    platforms: {
      chatgpt: {
        name: "ChatGPT",
        howTo:
          "افتح إعدادات تخصيص ChatGPT والصق هذا الملف في حقل التعليمات لتفعيل أسلوب عمل المساعد معك.",
      },
      gemini: {
        name: "Gemini",
        howTo:
          "افتح Gemini Gems أو إعدادات السياق الشخصي والصق هذا الملف لتطبيق التعليمات على محادثاتك.",
      },
      claude: {
        name: "Claude",
        howTo:
          "افتح Claude Projects وأنشئ مشروعًا جديدًا، ثم الصق هذا الملف في System Prompt للحصول على نفس السلوك.",
      },
    },
    starters: {
      eyebrow: "برومبت بداية",
      hint: "ابدأ به مباشرة في أداتك المفضلة.",
    },
  },
  i18nDemo: {
    title: "تجربة البنية ثنائية اللغة",
    subtitle:
      "صفحة تحقق فقط: تبديل اللغة، اتجاه المستند، وعرض المحتوى مختلط الاتجاه.",
    currentLocale: "اللغة الحالية",
    documentDir: "اتجاه المستند",
    fallbackOrder: "ترتيب الكشف",
    fallbackOrderValue: "?lang= → localStorage → navigator.language → ar",
    switchTo: "التبديل إلى",
    sampleArHeader: "تقرير عربي داخل واجهة بأي لغة",
    sampleEnHeader: "English report inside any UI",
    sampleBothHeader: "تقرير ثنائي اللغة (مكدّس عموديًا)",
    sampleAr:
      "هذا نص تقرير افتراضي بالعربية لاختبار اتجاه RTL داخل بطاقة التقرير. يجب أن يبقى الاتجاه يمين-يسار حتى لو كانت لغة الواجهة الإنجليزية.",
    sampleEn:
      "This is a sample English report body to verify LTR direction inside a report block. It must remain left-to-right even if the surrounding UI is in Arabic.",
    rules: {
      title: "ما يجب أن تراه",
      r1: "?lang=ar يفعّل العربية والاتجاه يمين-يسار.",
      r2: "?lang=en يفعّل الإنجليزية والاتجاه يسار-يمين.",
      r3: "اختيار اللغة يبقى محفوظًا بعد إعادة التحميل.",
      r4: "بطاقة التقرير تحافظ على اتجاهها الأصلي بغض النظر عن لغة الواجهة.",
      r5: "حالة (كلتاهما) تعرض النسختين مكدّستين عموديًا.",
      r6: "إشعار التضارب يظهر بهدوء عند اختلاف لغة الواجهة عن لغة التقرير.",
    },
  },
} as const;

type Widen<T> = T extends string
  ? string
  : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof ar>;

