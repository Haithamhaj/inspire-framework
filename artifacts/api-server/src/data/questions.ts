export interface BehavioralQuestion {
  id: number;
  axis: string;
  textAr: string;
  textEn: string;
  options: {
    ar: string;
    en: string;
  }[];
}

export const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  {
    id: 1,
    axis: "Intention",
    textAr: "عندما تبدأ مشروعاً جديداً، ما الذي يحفزك أكثر؟",
    textEn: "When starting a new project, what motivates you most?",
    options: [
      { ar: "تحقيق هدف واضح ومحدد", en: "Achieving a clear, specific goal" },
      {
        ar: "استكشاف إمكانيات جديدة غير محددة",
        en: "Exploring open-ended possibilities",
      },
      {
        ar: "المساهمة في فريق أو مجتمع",
        en: "Contributing to a team or community",
      },
      {
        ar: "تطوير مهاراتي الشخصية",
        en: "Developing my personal skills",
      },
    ],
  },
  {
    id: 2,
    axis: "Intention",
    textAr: "كيف تحدد الأولويات عند مواجهة مهام متعددة؟",
    textEn: "How do you set priorities when facing multiple tasks?",
    options: [
      {
        ar: "حسب الأهمية والتأثير الاستراتيجي",
        en: "By strategic importance and impact",
      },
      { ar: "حسب ترتيب الورود والإلحاح", en: "By arrival order and urgency" },
      {
        ar: "حسب ما يثير اهتمامي أكثر",
        en: "By what interests me most",
      },
      {
        ar: "حسب ما يرضي الآخرين ويفيدهم",
        en: "By what satisfies and benefits others",
      },
    ],
  },
  {
    id: 3,
    axis: "Intention",
    textAr: "ما الذي يجعلك تشعر أن عملك ناجح حقاً؟",
    textEn: "What makes you feel your work is truly successful?",
    options: [
      {
        ar: "تحقيق النتائج المستهدفة بدقة",
        en: "Achieving targeted results precisely",
      },
      {
        ar: "التعلم وكسب خبرة جديدة",
        en: "Learning and gaining new experience",
      },
      {
        ar: "حصول على إطراء وتقدير من الآخرين",
        en: "Receiving praise and recognition from others",
      },
      {
        ar: "الشعور بالرضا الداخلي والإنجاز الشخصي",
        en: "Feeling inner satisfaction and personal achievement",
      },
    ],
  },
  {
    id: 4,
    axis: "Narrative",
    textAr: "كيف تفضل شرح فكرة معقدة لشخص آخر؟",
    textEn: "How do you prefer to explain a complex idea to someone?",
    options: [
      {
        ar: "باستخدام الأمثلة والقصص الواقعية",
        en: "Using real-world examples and stories",
      },
      {
        ar: "بتفكيكها إلى خطوات منطقية متسلسلة",
        en: "Breaking it into sequential logical steps",
      },
      {
        ar: "برسم مخطط أو صورة توضيحية",
        en: "Drawing a diagram or visual illustration",
      },
      {
        ar: "بالتدريب العملي والتجربة المباشرة",
        en: "Through practical hands-on experience",
      },
    ],
  },
  {
    id: 5,
    axis: "Narrative",
    textAr: "ما نوع المحتوى الذي تجد نفسك تستهلكه أكثر؟",
    textEn: "What type of content do you find yourself consuming most?",
    options: [
      {
        ar: "مقالات وتحليلات معمقة",
        en: "In-depth articles and analyses",
      },
      {
        ar: "مقاطع فيديو تعليمية قصيرة",
        en: "Short educational videos",
      },
      {
        ar: "نقاشات ومحادثات مع الآخرين",
        en: "Discussions and conversations with others",
      },
      {
        ar: "كتب وتقارير شاملة",
        en: "Comprehensive books and reports",
      },
    ],
  },
  {
    id: 6,
    axis: "Narrative",
    textAr: "عندما تكتب أو تتحدث، ما الذي يميز أسلوبك؟",
    textEn: "When you write or speak, what characterizes your style?",
    options: [
      {
        ar: "الدقة والتفصيل والشمولية",
        en: "Precision, detail, and comprehensiveness",
      },
      {
        ar: "الإيجاز والوضوح والمباشرة",
        en: "Brevity, clarity, and directness",
      },
      {
        ar: "الحماس والطاقة العالية",
        en: "Enthusiasm and high energy",
      },
      {
        ar: "استخدام الاستعارات والصور الأدبية",
        en: "Using metaphors and literary imagery",
      },
    ],
  },
  {
    id: 7,
    axis: "Style",
    textAr: "كيف تتعامل مع المعلومات الجديدة التي تتلقاها؟",
    textEn: "How do you handle new information you receive?",
    options: [
      {
        ar: "أحللها وأتحقق من مصادرها فوراً",
        en: "I analyze and verify its sources immediately",
      },
      {
        ar: "أربطها بما أعرفه مسبقاً",
        en: "I connect it to what I already know",
      },
      {
        ar: "أشاركها مع الآخرين لمناقشتها",
        en: "I share it with others to discuss",
      },
      {
        ar: "أحفظها وأعود إليها لاحقاً عند الحاجة",
        en: "I save it and return to it later when needed",
      },
    ],
  },
  {
    id: 8,
    axis: "Style",
    textAr: "ما الذي يزعجك أكثر في بيئة العمل؟",
    textEn: "What bothers you most in a work environment?",
    options: [
      {
        ar: "الفوضى وغياب التنظيم",
        en: "Chaos and lack of organization",
      },
      {
        ar: "الروتين والتكرار المفرط",
        en: "Routine and excessive repetition",
      },
      {
        ar: "التعامل مع أشخاص سلبيين أو غير متعاونين",
        en: "Dealing with negative or uncooperative people",
      },
      {
        ar: "القيود والقواعد الصارمة التي تقيد الإبداع",
        en: "Strict rules and restrictions that limit creativity",
      },
    ],
  },
  {
    id: 9,
    axis: "Style",
    textAr: "كيف تصف طريقة عملك بشكل عام؟",
    textEn: "How would you describe your general work style?",
    options: [
      {
        ar: "منهجي ومنظم وأتبع خطة محددة",
        en: "Systematic, organized, and I follow a specific plan",
      },
      {
        ar: "مرن وأتكيف مع المتغيرات",
        en: "Flexible and adaptable to changes",
      },
      {
        ar: "تعاوني وأعتمد على الفريق",
        en: "Collaborative and team-dependent",
      },
      {
        ar: "مستقل وأفضل العمل بمفردي",
        en: "Independent and prefer working alone",
      },
    ],
  },
  {
    id: 10,
    axis: "Preferences",
    textAr: "ما نوع الملاحظات (Feedback) التي تجدها أكثر فائدة؟",
    textEn: "What type of feedback do you find most useful?",
    options: [
      {
        ar: "ملاحظات مباشرة وصريحة حتى لو كانت قاسية",
        en: "Direct and honest feedback even if harsh",
      },
      {
        ar: "ملاحظات تتضمن إيجابيات وسلبيات بشكل متوازن",
        en: "Balanced feedback with positives and negatives",
      },
      {
        ar: "ملاحظات مفصلة مع أمثلة وتوضيحات",
        en: "Detailed feedback with examples and explanations",
      },
      {
        ar: "أسئلة توجيهية تساعدني على اكتشاف الحل بنفسي",
        en: "Guiding questions that help me discover solutions myself",
      },
    ],
  },
  {
    id: 11,
    axis: "Preferences",
    textAr: "ما الأسلوب الذي تفضله عند تلقي المساعدة من الذكاء الاصطناعي؟",
    textEn: "What style do you prefer when receiving AI assistance?",
    options: [
      {
        ar: "إجابات مباشرة وموجزة دون تفاصيل زائدة",
        en: "Direct and concise answers without extra details",
      },
      {
        ar: "شرح مفصل مع السياق والمنطق الكامن",
        en: "Detailed explanation with context and underlying logic",
      },
      {
        ar: "خيارات متعددة مع مزايا وعيوب كل منها",
        en: "Multiple options with pros and cons of each",
      },
      {
        ar: "أسلوب حواري يشبه النقاش مع متخصص",
        en: "Conversational style resembling a discussion with an expert",
      },
    ],
  },
  {
    id: 12,
    axis: "Preferences",
    textAr: "كيف تفضل تنظيم معلوماتك ومشاريعك؟",
    textEn: "How do you prefer to organize your information and projects?",
    options: [
      {
        ar: "قوائم مرتبة وتسلسل هرمي واضح",
        en: "Ordered lists and clear hierarchy",
      },
      {
        ar: "خرائط ذهنية وعلاقات بصرية",
        en: "Mind maps and visual relationships",
      },
      {
        ar: "قواعد بيانات وأنظمة إدارة المشاريع",
        en: "Databases and project management systems",
      },
      {
        ar: "ملاحظات حرة بدون تنسيق صارم",
        en: "Free-form notes without strict formatting",
      },
    ],
  },
  {
    id: 13,
    axis: "Interaction",
    textAr: "كيف تتصرف عادةً في اجتماع جماعي؟",
    textEn: "How do you usually behave in a group meeting?",
    options: [
      {
        ar: "أقود النقاش وأوجه الحوار",
        en: "I lead the discussion and direct the dialogue",
      },
      {
        ar: "أساهم عند الضرورة وأستمع بعناية",
        en: "I contribute when necessary and listen carefully",
      },
      {
        ar: "أطرح أسئلة لتوضيح الفهم",
        en: "I ask questions to clarify understanding",
      },
      {
        ar: "أُلخّص ما قيل وأستخلص النقاط الرئيسية",
        en: "I summarize what was said and extract key points",
      },
    ],
  },
  {
    id: 14,
    axis: "Interaction",
    textAr: "ما طريقتك المفضلة للتواصل مع الزملاء في العمل؟",
    textEn: "What is your preferred way to communicate with work colleagues?",
    options: [
      {
        ar: "المحادثات الوجاهية المباشرة",
        en: "Direct face-to-face conversations",
      },
      {
        ar: "الرسائل النصية والبريد الإلكتروني",
        en: "Text messages and email",
      },
      {
        ar: "المكالمات الصوتية أو المرئية",
        en: "Voice or video calls",
      },
      {
        ar: "التوثيق المكتوب والتقارير المشتركة",
        en: "Written documentation and shared reports",
      },
    ],
  },
  {
    id: 15,
    axis: "Interaction",
    textAr: "كيف تتعامل مع الاختلاف في الرأي مع شخص آخر؟",
    textEn: "How do you handle disagreement with another person?",
    options: [
      {
        ar: "أناقش بحزم للوصول لحل مقبول",
        en: "I discuss firmly to reach an acceptable solution",
      },
      {
        ar: "أحاول فهم وجهة نظره أولاً",
        en: "I try to understand their perspective first",
      },
      {
        ar: "أبحث عن أرضية مشتركة للتوافق",
        en: "I look for common ground for consensus",
      },
      {
        ar: "أتجنب الجدال وأتعامل معه لاحقاً",
        en: "I avoid the argument and address it later",
      },
    ],
  },
  {
    id: 16,
    axis: "Reflection",
    textAr: "كيف تتعامل مع الأخطاء التي ترتكبها؟",
    textEn: "How do you deal with mistakes you make?",
    options: [
      {
        ar: "أحللها لفهم أسبابها ومنع تكرارها",
        en: "I analyze them to understand causes and prevent recurrence",
      },
      {
        ar: "أتجاوزها بسرعة وأتعلم منها",
        en: "I move past them quickly and learn from them",
      },
      {
        ar: "أعتذر وأُصلح العلاقات المتأثرة",
        en: "I apologize and repair affected relationships",
      },
      {
        ar: "أفكر فيها طويلاً حتى أتأكد من فهمها",
        en: "I think about them for a long time until I fully understand",
      },
    ],
  },
  {
    id: 17,
    axis: "Reflection",
    textAr: "ما الذي تفعله عادةً بعد إنهاء مشروع مهم؟",
    textEn: "What do you usually do after completing an important project?",
    options: [
      {
        ar: "أراجع ما تم إنجازه وأُقيّم الأداء",
        en: "I review what was accomplished and evaluate performance",
      },
      {
        ar: "أحتفل وأُكافئ الفريق والنفس",
        en: "I celebrate and reward the team and myself",
      },
      {
        ar: "أبدأ التخطيط للمشروع التالي فوراً",
        en: "I immediately start planning the next project",
      },
      {
        ar: "أستريح وأُعيد شحن طاقتي",
        en: "I rest and recharge my energy",
      },
    ],
  },
  {
    id: 18,
    axis: "Reflection",
    textAr: "كيف تُعالج مشاعر الإحباط أو الضغط؟",
    textEn: "How do you process feelings of frustration or pressure?",
    options: [
      {
        ar: "بالتحليل المنطقي للمشكلة وإيجاد حلول",
        en: "By logically analyzing the problem and finding solutions",
      },
      {
        ar: "بالتحدث مع شخص قريب وموثوق",
        en: "By talking to a close and trusted person",
      },
      {
        ar: "بممارسة نشاط يساعدني على التنفيس",
        en: "By doing an activity that helps me decompress",
      },
      {
        ar: "بمنح نفسي وقتاً للتأمل الهادئ",
        en: "By giving myself time for quiet reflection",
      },
    ],
  },
  {
    id: 19,
    axis: "Evaluation",
    textAr: "كيف تحكم على جودة قراراتك عادةً؟",
    textEn: "How do you usually judge the quality of your decisions?",
    options: [
      {
        ar: "بمقارنة النتائج الفعلية بالأهداف المرسومة",
        en: "By comparing actual results to set goals",
      },
      {
        ar: "بمدى رضا من تأثروا بهذا القرار",
        en: "By satisfaction of those affected by the decision",
      },
      {
        ar: "بالشعور الداخلي بأنني اتخذت القرار الصحيح",
        en: "By inner feeling that I made the right decision",
      },
      {
        ar: "بتقييم الآخرين لي",
        en: "By how others evaluate me",
      },
    ],
  },
  {
    id: 20,
    axis: "Evaluation",
    textAr: "ما أسلوبك في اتخاذ القرارات المهمة؟",
    textEn: "What is your approach to making important decisions?",
    options: [
      {
        ar: "أجمع البيانات وأحلل الخيارات بشكل منهجي",
        en: "I gather data and systematically analyze options",
      },
      {
        ar: "أثق بحدسي وخبرتي السابقة",
        en: "I trust my intuition and past experience",
      },
      {
        ar: "أستشير الآخرين وآخذ آراءهم بعين الاعتبار",
        en: "I consult others and consider their opinions",
      },
      {
        ar: "أُجري تجارب صغيرة قبل الالتزام الكامل",
        en: "I run small experiments before full commitment",
      },
    ],
  },
  {
    id: 21,
    axis: "Evaluation",
    textAr: "كيف تتعامل مع المخاطر في مشاريعك؟",
    textEn: "How do you handle risks in your projects?",
    options: [
      {
        ar: "أُحدد المخاطر وأضع خطط للتعامل معها مسبقاً",
        en: "I identify risks and prepare contingency plans in advance",
      },
      {
        ar: "أتعامل مع المخاطر عند ظهورها فقط",
        en: "I handle risks only when they appear",
      },
      {
        ar: "أتجنب المخاطر العالية وأُفضّل الاستقرار",
        en: "I avoid high risks and prefer stability",
      },
      {
        ar: "أرى المخاطر فرصاً للابتكار والتميز",
        en: "I see risks as opportunities for innovation and excellence",
      },
    ],
  },
  {
    id: 22,
    axis: "Narrative",
    textAr: "ما الذي يلفت انتباهك أكثر عند قراءة تقرير أو تحليل؟",
    textEn: "What catches your attention most when reading a report or analysis?",
    options: [
      {
        ar: "الأرقام والإحصاءات والبيانات الدقيقة",
        en: "Numbers, statistics, and precise data",
      },
      {
        ar: "الخلاصة والتوصيات العملية",
        en: "Summary and practical recommendations",
      },
      {
        ar: "القصص والأمثلة الحقيقية",
        en: "Stories and real-world examples",
      },
      {
        ar: "المنهجية والمنطق الكامن وراء التحليل",
        en: "The methodology and logic behind the analysis",
      },
    ],
  },
  {
    id: 23,
    axis: "Style",
    textAr: "كيف تستجيب للتغيير المفاجئ في الخطة؟",
    textEn: "How do you respond to sudden changes in plan?",
    options: [
      {
        ar: "أشعر بالإحباط وأحتاج وقتاً للتكيف",
        en: "I feel frustrated and need time to adapt",
      },
      {
        ar: "أرى التغيير فرصة لتجربة نهج جديد",
        en: "I see change as an opportunity to try a new approach",
      },
      {
        ar: "أُعيد تنظيم الأولويات بسرعة وأتحرك",
        en: "I quickly reorganize priorities and move forward",
      },
      {
        ar: "أسأل عن السبب أولاً قبل أي تحرك",
        en: "I ask for the reason first before any action",
      },
    ],
  },
  {
    id: 24,
    axis: "Intention",
    textAr: "ما الذي تأمل أن يُحققه تفاعلك مع الذكاء الاصطناعي؟",
    textEn:
      "What do you hope your interaction with AI will achieve for you?",
    options: [
      {
        ar: "توفير الوقت وزيادة الإنتاجية",
        en: "Saving time and increasing productivity",
      },
      {
        ar: "توليد أفكار إبداعية وخيارات جديدة",
        en: "Generating creative ideas and new options",
      },
      {
        ar: "الحصول على منظور موضوعي بعيد عن التحيز",
        en: "Getting an objective perspective free of bias",
      },
      {
        ar: "التعلم والنمو في مجالي المهني",
        en: "Learning and growing in my professional field",
      },
    ],
  },
];
