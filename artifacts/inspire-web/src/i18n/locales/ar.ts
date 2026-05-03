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
    dateLocale: "ar-SA",
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
        step1:
          "افتح ChatGPT وادخل على إعدادات المساعد المخصص (Customize ChatGPT).",
        step2:
          'الصق ملف التشغيل في خانة "كيف تريد أن يردّ عليك ChatGPT؟".',
        step3:
          "احفظ الإعدادات. ستجد المساعد يعمل بشخصيتك المخصصة في كل محادثة جديدة.",
      },
      gemini: {
        name: "Gemini",
        howTo:
          "افتح Gemini Gems أو إعدادات السياق الشخصي والصق هذا الملف لتطبيق التعليمات على محادثاتك.",
        step1: 'افتح Gemini واختر "Gems" لإنشاء مساعد جديد.',
        step2:
          'الصق ملف التشغيل في حقل تعليمات الـ Gem واحفظه باسم "مساعد المشروع".',
        step3: "افتح الـ Gem في كل مرة تحتاج فيها هذا الدور تحديدًا.",
      },
      claude: {
        name: "Claude",
        howTo:
          "افتح Claude Projects وأنشئ مشروعًا جديدًا، ثم الصق هذا الملف في System Prompt للحصول على نفس السلوك.",
        step1: "في Claude، أنشئ Project جديدًا باسم مشروعك.",
        step2:
          "الصق ملف التشغيل في خانة Custom Instructions الخاصة بالمشروع.",
        step3:
          "ابدأ كل محادثة من هذا المشروع لتحصل على نفس السلوك المتسق.",
      },
    },
    starters: {
      eyebrow: "ابدأ الآن",
      title: "نقاط انطلاق جاهزة",
      subtitle:
        "انسخ أيًا منها وألصقه بعد ملف التشغيل في أي محادثة جديدة.",
      hint: "ابدأ به مباشرة في أداتك المفضلة.",
    },
    status: {
      ready: "ملف تشغيل مساعدك جاهز",
      processingTitle: "يجري تحليل ملفك السلوكي",
      processingLine1: "يعمل الذكاء الاصطناعي على توليد تعليماتك المخصصة",
      processingLine2: "هذا يستغرق عادةً 30–60 ثانية",
      errorTitle: "تعذّر فتح التقرير",
      errorMissing: "التقرير غير موجود",
      errorBack: "عودة لتقاريري",
    },
    header: {
      titlePrefix: "تم بناء ملف تشغيل مساعدك",
      titleConnector: "لـ",
      subtitle:
        "استخدمه مع ChatGPT أو Gemini أو Claude ليعمل الذكاء الاصطناعي معك بطريقة أوضح وأكثر اتساقًا.",
      ctaPrimary: "نسخ تعليمات المساعد",
      ctaPrimarySuccess: "تم نسخ كامل التعليمات",
      ctaSecondary: "كيف أستخدمه؟",
      generatedBy: "نُوِّل بواسطة",
      myAssessments: "تقاريري",
      downloadPdf: "تحميل PDF",
      generatePdf: "توليد PDF",
      generatingPdf: "جارٍ التوليد...",
      share: "مشاركة النتائج",
      sharing: "جارٍ التحضير...",
      revokeShare: "إلغاء المشاركة",
      revoking: "جارٍ الإلغاء...",
      linkCopiedPrefix: "تم نسخ الرابط:",
      shareCancelled: "تم إلغاء رابط المشاركة",
    },
    identity: {
      eyebrow: "هوية مساعدك",
      titlePrefix: "مساعدك الشخصي ·",
      fallbackParagraph:
        "تم بناء ملف تشغيل مخصص لمشروعك. استخدمه ليعمل المساعد دائمًا في سياقك بدل الإجابات العامة.",
      tagPartner: "شريك تنفيذ",
      tagReviewer: "مراجع قرارات",
      tagContextAware: "حسّاس للسياق",
      tagOutcomeFocused: "موجّه نحو النتيجة",
    },
    strengths: {
      eyebrow: "نقاط قوتك",
      title: "ما يجيده مساعدك بشكل خاص",
      subtitle: "هذه نقاط القوة التي رصدها التحليل في أسلوبك.",
    },
    redLines: {
      eyebrow: "الخطوط الحمراء",
      title: "ما يجب أن يتجنبه مساعدك",
      subtitle:
        "حدود واضحة لضمان أن تبقى المخرجات في خط أسلوبك ومتطلبات مشروعك.",
    },
    developmentAreas: {
      eyebrow: "ما يحتاج انتباه",
      title: "نقاط للمتابعة الواعية",
      subtitle:
        "ليست عيوبًا — مجرد جوانب يستحق الانتباه إليها عند العمل مع المساعد.",
    },
    recommendations: {
      eyebrow: "توصيات عملية",
      title: "خطوات يمكنك البدء بها",
      subtitle: "توصيات مرتبطة بأسلوبك ومخرجاتك المنشودة.",
    },
    profile: {
      eyebrow: "ملف التشغيل",
      title: "تعليمات مساعدك الجاهزة",
      subtitle:
        "ملف تشغيل مكتوب بأسلوب طبيعي، جاهز لتلصقه في ChatGPT أو Gemini أو Claude.",
      headerLabel: "ملف تشغيل مساعدك",
      headerHint: "انسخ التعليمات إلى ChatGPT / Gemini / Claude",
      copyAll: "نسخ كامل الملف",
      copyAllSuccess: "تم نسخ كامل الملف",
    },
    howToUse: {
      eyebrow: "طريقة الاستخدام",
      title: "أين تستخدم ملف التشغيل؟",
      subtitle:
        "نفس الملف يعمل في الأدوات الثلاث الكبرى. اختر أداتك واتبع الخطوات.",
      headingPrefix: "كيف تستخدمه في",
    },
    newCta: {
      line: "هل تريد ملف تشغيل لمشروع آخر؟",
      button: "ابدأ تقييمًا جديدًا",
    },
    projectGoalLabel: "هدف المشروع",
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
