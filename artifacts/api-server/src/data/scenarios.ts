export interface Scenario {
  id: number;
  axis: string;
  textAr: string;
  textEn: string;
  optionA: {
    ar: string;
    en: string;
  };
  optionB: {
    ar: string;
    en: string;
  };
}

export interface MiniScenario extends Scenario {}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    axis: "Intention",
    textAr:
      "طُلب منك قيادة مشروع جديد. لديك خياران: مشروع ناجح بنسبة 80% لكنه محدود التأثير، أو مشروع طموح بنسبة 40% لكن تأثيره ضخم. ماذا تختار؟",
    textEn:
      "You are asked to lead a new project. You have two options: an 80% likely-to-succeed project with limited impact, or an ambitious 40% project with huge impact. What do you choose?",
    optionA: {
      ar: "المشروع الآمن ذو الاحتمالية العالية (80%)",
      en: "The safe high-probability project (80%)",
    },
    optionB: {
      ar: "المشروع الطموح ذو التأثير الضخم (40%)",
      en: "The ambitious high-impact project (40%)",
    },
  },
  {
    id: 2,
    axis: "Narrative",
    textAr:
      "زميلك يحتاج منك شرح قرار معقد اتخذته. هل تشرح له بالتفصيل الكامل والمنطق الكامل؟ أم تعطيه الخلاصة فقط مع الاستعداد للتوضيح؟",
    textEn:
      "Your colleague needs you to explain a complex decision you made. Do you explain it in full detail with complete logic? Or give them just the summary and be ready to clarify?",
    optionA: {
      ar: "أشرح بالتفصيل الكامل والمنطق الكامن",
      en: "I explain in full detail with complete logic",
    },
    optionB: {
      ar: "أعطي الخلاصة وأوضح عند الحاجة فقط",
      en: "I give the summary and only clarify when needed",
    },
  },
  {
    id: 3,
    axis: "Style",
    textAr:
      "أمامك يوم عمل مكثف. هل تبدأ بإنجاز المهام الأصعب والأكثر إرهاقاً أولاً؟ أم تبدأ بالسهلة لبناء الزخم والثقة ثم تتدرج؟",
    textEn:
      "You have an intensive workday ahead. Do you start with the hardest and most draining tasks first? Or start with easy ones to build momentum and confidence then gradually increase difficulty?",
    optionA: {
      ar: "أبدأ بالأصعب فوراً (نظرية أكل الضفدع)",
      en: "I start with the hardest immediately (eat the frog theory)",
    },
    optionB: {
      ar: "أبدأ بالسهل لبناء الزخم ثم أتدرج",
      en: "I start easy to build momentum then gradually increase",
    },
  },
  {
    id: 4,
    axis: "Preferences",
    textAr:
      "تلقيت ملاحظة نقدية قاسية على عملك. هل تفضل أن تتلقاها أمام الفريق بشكل مباشر؟ أم في جلسة خاصة بعيداً عن الأعين؟",
    textEn:
      "You received harsh critical feedback on your work. Do you prefer to receive it in front of the team directly? Or in a private session away from others?",
    optionA: {
      ar: "أفضلها أمام الفريق — الشفافية مهمة",
      en: "I prefer it in front of the team — transparency matters",
    },
    optionB: {
      ar: "أفضلها في جلسة خاصة — أتعامل معها بشكل أفضل",
      en: "I prefer a private session — I handle it better",
    },
  },
  {
    id: 5,
    axis: "Interaction",
    textAr:
      "في اجتماع مهم، طُرحت فكرة تعتقد أنها خاطئة. هل تعترض فوراً وتوضح وجهة نظرك؟ أم تنتظر نهاية الاجتماع لمناقشة الأمر بهدوء؟",
    textEn:
      "In an important meeting, an idea was raised that you believe is wrong. Do you object immediately and clarify your view? Or wait until the end of the meeting to calmly discuss it?",
    optionA: {
      ar: "أعترض فوراً وأوضح وجهة نظري",
      en: "I object immediately and clarify my viewpoint",
    },
    optionB: {
      ar: "أنتظر وأناقشها بعد الاجتماع بهدوء",
      en: "I wait and discuss it calmly after the meeting",
    },
  },
  {
    id: 6,
    axis: "Reflection",
    textAr:
      "مشروعك فشل. هل تُجري مراجعة شاملة (Post-Mortem) لفهم كل ما حدث بالتفصيل؟ أم تستخلص الدروس الرئيسية فقط وتتقدم بسرعة؟",
    textEn:
      "Your project failed. Do you conduct a comprehensive post-mortem to understand everything that happened in detail? Or extract just the main lessons and move forward quickly?",
    optionA: {
      ar: "أُجري مراجعة شاملة لفهم كل التفاصيل",
      en: "I conduct a comprehensive review to understand all details",
    },
    optionB: {
      ar: "أستخلص الدروس الأساسية وأتقدم بسرعة",
      en: "I extract key lessons and move forward quickly",
    },
  },
  {
    id: 7,
    axis: "Evaluation",
    textAr:
      "عند تقييم نجاح قرار اتخذته، ما الذي يهمك أكثر: الأرقام والنتائج الملموسة؟ أم تأثيره على من حولك ورضاهم؟",
    textEn:
      "When evaluating the success of a decision you made, what matters more: the numbers and tangible results? Or its impact on those around you and their satisfaction?",
    optionA: {
      ar: "الأرقام والنتائج الملموسة أولاً",
      en: "Numbers and tangible results first",
    },
    optionB: {
      ar: "التأثير على الناس ورضاهم أكثر أهمية",
      en: "Impact on people and their satisfaction is more important",
    },
  },
  {
    id: 8,
    axis: "Style",
    textAr:
      "عندما تعمل مع الذكاء الاصطناعي، هل تفضل أن يُعطيك الحل مباشرة وبسرعة؟ أم تفضل أن يشرح التفكير والمنطق معك خطوة بخطوة؟",
    textEn:
      "When working with AI, do you prefer it to give you the solution directly and quickly? Or do you prefer it to walk you through the thinking and logic step by step?",
    optionA: {
      ar: "أريد الحل مباشرة وبسرعة دون تفاصيل",
      en: "I want the solution directly and quickly without details",
    },
    optionB: {
      ar: "أفضل الشرح خطوة بخطوة مع المنطق",
      en: "I prefer step-by-step explanation with the logic",
    },
  },
];

export const MINI_SCENARIOS: MiniScenario[] = SCENARIOS.slice(0, 5);
