export interface V2Option {
  id: string;
  textAr: string;
  textEn: string;
}

export interface V2Question {
  id: string;
  block: "Setup / Behavioral Bridge" | "Behavioral Backbone" | "AI-Use Scenario";
  selectionMode: "single";
  displayCondition: "always";
  questionAr: string;
  questionEn: string;
  options: V2Option[];
}

export const V2_QUESTIONS: V2Question[] = [
  // ─── Block 1: Setup / Behavioral Bridge (S2, S3) ────────────────────────────

  {
    id: "S2",
    block: "Setup / Behavioral Bridge",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تصف نمط عملك العام عند مواجهة مهمة جديدة أو تحدٍّ غير مألوف؟",
    questionEn: "How would you describe your general work pattern when facing a new task or unfamiliar challenge?",
    options: [
      { id: "S2-a", textAr: "أُحلّل الوضع أولاً وأضع خطة واضحة قبل الشروع", textEn: "I analyze the situation first and make a clear plan before starting" },
      { id: "S2-b", textAr: "أبدأ فوراً وأعدّل المسار أثناء التنفيذ", textEn: "I start immediately and adjust course as I go" },
      { id: "S2-c", textAr: "أبحث عن نماذج ناجحة وأستلهم منها", textEn: "I look for successful models and draw inspiration from them" },
      { id: "S2-d", textAr: "أستشير من لديهم خبرة وأبني على رأيهم", textEn: "I consult experienced people and build on their input" },
      { id: "S2-e", textAr: "أجرّب أكثر من نهج في وقت واحد وأختار الأنجح", textEn: "I try multiple approaches simultaneously and choose the most effective" },
    ],
  },

  {
    id: "S3",
    block: "Setup / Behavioral Bridge",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تتعامل مع المعلومات الجديدة التي تتلقاها في سياق العمل؟",
    questionEn: "How do you process new information you receive in a work context?",
    options: [
      { id: "S3-a", textAr: "أتحقق من مصادرها وموثوقيتها فوراً قبل الاستخدام", textEn: "I immediately verify sources and reliability before using them" },
      { id: "S3-b", textAr: "أربطها بما أعرفه وأبني عليها فهماً أعمق", textEn: "I connect it to what I know and build a deeper understanding" },
      { id: "S3-c", textAr: "أُطبّقها مباشرةً وأرى مدى نجاحها في الواقع", textEn: "I apply it directly and see how it works in practice" },
      { id: "S3-d", textAr: "أُشارك غيري بها لمناقشتها وتكوين رأي جماعي", textEn: "I share it with others to discuss and form a collective view" },
      { id: "S3-e", textAr: "أحتفظ بها وأراجعها لاحقاً حين تواجهني مشكلة مماثلة", textEn: "I store it and revisit it later when a similar problem arises" },
    ],
  },

  // ─── Block 2: Behavioral Backbone (Q01–Q15) ─────────────────────────────────

  {
    id: "Q01",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "ما الذي يحفّزك بشكل أساسي عند الشروع في مشروع جديد؟",
    questionEn: "What primarily motivates you when starting a new project?",
    options: [
      { id: "Q01-a", textAr: "تحقيق هدف واضح ومحدد بدقة", textEn: "Achieving a clearly defined specific goal" },
      { id: "Q01-b", textAr: "استكشاف إمكانيات جديدة وفرص غير معروفة", textEn: "Exploring new possibilities and unknown opportunities" },
      { id: "Q01-c", textAr: "المساهمة في نجاح الفريق أو المجتمع", textEn: "Contributing to team or community success" },
      { id: "Q01-d", textAr: "تطوير مهاراتي الشخصية والنمو المستمر", textEn: "Developing my personal skills and continuous growth" },
    ],
  },

  {
    id: "Q02",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تُحدّد الأولويات عند مواجهة مهام متعددة في آنٍ واحد؟",
    questionEn: "How do you prioritize when facing multiple tasks simultaneously?",
    options: [
      { id: "Q02-a", textAr: "حسب الأهمية الاستراتيجية والتأثير بعيد المدى", textEn: "By strategic importance and long-term impact" },
      { id: "Q02-b", textAr: "حسب الإلحاح والمواعيد النهائية القريبة", textEn: "By urgency and approaching deadlines" },
      { id: "Q02-c", textAr: "حسب ما يثير اهتمامي وشغفي في اللحظة الراهنة", textEn: "By what interests and excites me at the current moment" },
      { id: "Q02-d", textAr: "حسب احتياجات الفريق وما يُفيد الآخرين أولاً", textEn: "By team needs and what benefits others first" },
    ],
  },

  {
    id: "Q03",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "ما الذي يجعلك تشعر أن عملك ناجح فعلاً؟",
    questionEn: "What makes you feel your work is genuinely successful?",
    options: [
      { id: "Q03-a", textAr: "تحقيق النتائج المستهدفة بدقة قياسية", textEn: "Achieving targeted results with measurable precision" },
      { id: "Q03-b", textAr: "اكتساب خبرة ومعرفة جديدة من التجربة", textEn: "Gaining new experience and knowledge from the process" },
      { id: "Q03-c", textAr: "الحصول على تقدير وإشادة من المحيطين", textEn: "Receiving recognition and appreciation from those around me" },
      { id: "Q03-d", textAr: "الإحساس الداخلي بالرضا والإنجاز الحقيقي", textEn: "An inner sense of satisfaction and genuine accomplishment" },
    ],
  },

  {
    id: "Q04",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تُفضّل شرح فكرة معقدة لشخص آخر؟",
    questionEn: "How do you prefer to explain a complex idea to someone?",
    options: [
      { id: "Q04-a", textAr: "بأمثلة واقعية وقصص قابلة للتطبيق", textEn: "Through real-world examples and applicable stories" },
      { id: "Q04-b", textAr: "بتفكيكها إلى خطوات منطقية متسلسلة", textEn: "By breaking it into sequential logical steps" },
      { id: "Q04-c", textAr: "برسم مخطط أو خريطة بصرية توضيحية", textEn: "By drawing a diagram or visual map" },
      { id: "Q04-d", textAr: "بالتدريب العملي والتجربة المباشرة", textEn: "Through hands-on practice and direct experience" },
    ],
  },

  {
    id: "Q05",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "ما نوع المحتوى الذي تجد نفسك تستهلكه أكثر في حياتك المهنية؟",
    questionEn: "What type of content do you find yourself consuming most in your professional life?",
    options: [
      { id: "Q05-a", textAr: "مقالات تحليلية وتقارير متعمقة", textEn: "Analytical articles and in-depth reports" },
      { id: "Q05-b", textAr: "مقاطع فيديو تعليمية سريعة وملخصات موجزة", textEn: "Quick educational videos and concise summaries" },
      { id: "Q05-c", textAr: "نقاشات ومحادثات مباشرة مع متخصصين", textEn: "Direct discussions and conversations with specialists" },
      { id: "Q05-d", textAr: "كتب ومراجع شاملة ودراسات معمقة", textEn: "Comprehensive books, references, and in-depth studies" },
    ],
  },

  {
    id: "Q06",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تتعامل مع الأخطاء التي ترتكبها في العمل؟",
    questionEn: "How do you handle mistakes you make at work?",
    options: [
      { id: "Q06-a", textAr: "أُحلّلها بعمق لفهم أسبابها ومنع تكرارها", textEn: "I analyze them deeply to understand root causes and prevent recurrence" },
      { id: "Q06-b", textAr: "أتجاوزها بسرعة وأتعلم منها دون توقف طويل", textEn: "I move past them quickly and learn without dwelling" },
      { id: "Q06-c", textAr: "أعتذر وأُعيد بناء الثقة مع من تأثروا", textEn: "I apologize and rebuild trust with those affected" },
      { id: "Q06-d", textAr: "أُفكر فيها طويلاً حتى أتأكد من فهمها الكامل", textEn: "I reflect on them at length until I fully understand them" },
    ],
  },

  {
    id: "Q07",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تصف أسلوب عملك العام؟",
    questionEn: "How would you describe your general work style?",
    options: [
      { id: "Q07-a", textAr: "منهجي ومنظم وأتّبع خطة واضحة ومحددة", textEn: "Systematic and organized, following a clear defined plan" },
      { id: "Q07-b", textAr: "مرن وقادر على التكيف السريع مع المتغيرات", textEn: "Flexible and capable of rapid adaptation to changes" },
      { id: "Q07-c", textAr: "تعاوني وأعتمد على التشاور والعمل الجماعي", textEn: "Collaborative and relying on consultation and teamwork" },
      { id: "Q07-d", textAr: "مستقل وأُفضّل اتخاذ القرارات والعمل بنفسي", textEn: "Independent, preferring to make decisions and work solo" },
    ],
  },

  {
    id: "Q08",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "ما نوع الملاحظات التي تجدها أكثر فائدة في تحسين أدائك؟",
    questionEn: "What type of feedback do you find most useful for improving your performance?",
    options: [
      { id: "Q08-a", textAr: "ملاحظات مباشرة وصريحة حتى لو كانت قاسية", textEn: "Direct and candid feedback even if it's harsh" },
      { id: "Q08-b", textAr: "ملاحظات متوازنة تجمع بين الإيجابي والسلبي", textEn: "Balanced feedback combining positives and areas for improvement" },
      { id: "Q08-c", textAr: "ملاحظات مفصلة مع أمثلة وخطوات إجرائية واضحة", textEn: "Detailed feedback with examples and clear action steps" },
      { id: "Q08-d", textAr: "أسئلة توجيهية تُساعدني على اكتشاف الحل بنفسي", textEn: "Guiding questions that help me discover solutions on my own" },
    ],
  },

  {
    id: "Q09",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تتعامل مع التغيير المفاجئ في الخطط والتوقعات؟",
    questionEn: "How do you handle sudden changes in plans and expectations?",
    options: [
      { id: "Q09-a", textAr: "يستغرق الأمر مني وقتاً للتكيف وأحتاج مرحلة انتقالية", textEn: "It takes me time to adapt and I need a transition phase" },
      { id: "Q09-b", textAr: "أتكيف بمرونة وأُعيد ترتيب أولوياتي بسرعة", textEn: "I adapt flexibly and quickly reorder my priorities" },
      { id: "Q09-c", textAr: "أنظر إليه كفرصة للتجديد والاختبار الإبداعي", textEn: "I see it as an opportunity for renewal and creative experimentation" },
      { id: "Q09-d", textAr: "أسعى لاستعادة الخطة الأصلية إن أمكن ذلك", textEn: "I try to restore the original plan if possible" },
    ],
  },

  {
    id: "Q10",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "ما أسلوبك المفضل في اتخاذ القرارات المهمة؟",
    questionEn: "What is your preferred style for making important decisions?",
    options: [
      { id: "Q10-a", textAr: "أجمع البيانات وأُحلّل الخيارات بشكل منهجي شامل", textEn: "I gather data and analyze options in a comprehensive systematic way" },
      { id: "Q10-b", textAr: "أثق بحدسي وخبرتي السابقة في المواقف المشابهة", textEn: "I trust my intuition and past experience in similar situations" },
      { id: "Q10-c", textAr: "أستشير الآخرين وآخذ آراءهم بعين الاعتبار", textEn: "I consult others and take their perspectives into account" },
      { id: "Q10-d", textAr: "أُجري تجارب صغيرة قبل الالتزام بالقرار النهائي", textEn: "I run small experiments before committing to a final decision" },
    ],
  },

  {
    id: "Q11",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تتصرف عادةً في الاجتماعات والنقاشات الجماعية؟",
    questionEn: "How do you typically behave in group meetings and discussions?",
    options: [
      { id: "Q11-a", textAr: "أقود النقاش وأُوجّه الحوار نحو الأهداف", textEn: "I lead the discussion and direct dialogue toward goals" },
      { id: "Q11-b", textAr: "أُساهم عند الضرورة وأستمع بعناية للآخرين", textEn: "I contribute when necessary and listen carefully to others" },
      { id: "Q11-c", textAr: "أطرح أسئلة توضيحية لتعميق الفهم المشترك", textEn: "I ask clarifying questions to deepen shared understanding" },
      { id: "Q11-d", textAr: "أُلخّص ما قيل وأستخلص النقاط والقرارات الجوهرية", textEn: "I summarize what was said and extract key points and decisions" },
    ],
  },

  {
    id: "Q12",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تتعامل مع الاختلاف في وجهات النظر داخل الفريق؟",
    questionEn: "How do you handle differences of opinion within a team?",
    options: [
      { id: "Q12-a", textAr: "أناقش بحزم ووضوح للوصول إلى حل مقبول للجميع", textEn: "I discuss firmly and clearly to reach a solution acceptable to all" },
      { id: "Q12-b", textAr: "أحاول فهم وجهة نظر الطرف الآخر أولاً قبل الرد", textEn: "I try to understand the other party's perspective before responding" },
      { id: "Q12-c", textAr: "أبحث عن أرضية مشتركة ونقاط التقاء ممكنة", textEn: "I look for common ground and possible convergence points" },
      { id: "Q12-d", textAr: "أتجنب الجدال المباشر وأتعامل مع الأمر لاحقاً", textEn: "I avoid direct argument and address the matter later" },
    ],
  },

  {
    id: "Q13",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تحكم على جودة قراراتك بعد اتخاذها؟",
    questionEn: "How do you assess the quality of your decisions after making them?",
    options: [
      { id: "Q13-a", textAr: "بمقارنة النتائج الفعلية بالأهداف والمعايير المحددة", textEn: "By comparing actual results to defined goals and standards" },
      { id: "Q13-b", textAr: "بمدى رضا من تأثروا بالقرار وردود فعلهم", textEn: "By the satisfaction of those affected and their reactions" },
      { id: "Q13-c", textAr: "بالشعور الداخلي بأنني اتخذت القرار الصحيح", textEn: "By an inner feeling that I made the right decision" },
      { id: "Q13-d", textAr: "بتقييم الآخرين لأدائي وملاحظاتهم عليه", textEn: "By how others evaluate my performance and their feedback on it" },
    ],
  },

  {
    id: "Q14",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تعالج مشاعر الإحباط أو الضغط المهني؟",
    questionEn: "How do you process feelings of professional frustration or pressure?",
    options: [
      { id: "Q14-a", textAr: "بالتحليل المنطقي للمشكلة وإيجاد حلول عملية", textEn: "Through logical analysis of the problem and finding practical solutions" },
      { id: "Q14-b", textAr: "بالتحدث مع شخص موثوق وأخذ رأيه", textEn: "By talking to a trusted person and getting their perspective" },
      { id: "Q14-c", textAr: "بممارسة نشاط يساعدني على التنفيس والاسترخاء", textEn: "By engaging in an activity that helps me decompress and relax" },
      { id: "Q14-d", textAr: "بمنح نفسي وقتاً للتأمل الهادئ والتفكير المنفرد", textEn: "By giving myself time for quiet reflection and solitary thinking" },
    ],
  },

  {
    id: "Q15",
    block: "Behavioral Backbone",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "كيف تتعامل مع المخاطر في مشاريعك المهنية؟",
    questionEn: "How do you handle risks in your professional projects?",
    options: [
      { id: "Q15-a", textAr: "أُحدّد المخاطر مسبقاً وأضع خططاً احتياطية لها", textEn: "I identify risks in advance and prepare contingency plans" },
      { id: "Q15-b", textAr: "أتعامل مع المخاطر عند ظهورها فعلياً", textEn: "I deal with risks when they actually emerge" },
      { id: "Q15-c", textAr: "أقبل المخاطر المحسوبة وأعتبرها جزءاً من التقدم", textEn: "I accept calculated risks and consider them part of progress" },
      { id: "Q15-d", textAr: "أُفضّل الأمان والتحفظ وتجنب المخاطر قدر الإمكان", textEn: "I prefer safety, caution, and avoiding risks as much as possible" },
    ],
  },

  // ─── Block 3: AI-Use Scenario (AI01–AI04) ───────────────────────────────────

  {
    id: "AI01",
    block: "AI-Use Scenario",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "عندما تستخدم الذكاء الاصطناعي في العمل، ما أسلوبك المفضل في الحصول على الإجابات؟",
    questionEn: "When using AI at work, what is your preferred style for getting answers?",
    options: [
      { id: "AI01-a", textAr: "إجابات مباشرة وموجزة دون تفاصيل زائدة", textEn: "Direct and concise answers without extra details" },
      { id: "AI01-b", textAr: "شرح مفصل مع السياق والمنطق الكامن وراء كل خطوة", textEn: "Detailed explanation with context and the logic behind each step" },
      { id: "AI01-c", textAr: "خيارات متعددة مع مزايا وعيوب كل منها لأختار أنا", textEn: "Multiple options with pros and cons of each so I can choose" },
      { id: "AI01-d", textAr: "حوار تفاعلي يشبه النقاش مع متخصص يُرشدني", textEn: "An interactive dialogue resembling a discussion with an expert who guides me" },
    ],
  },

  {
    id: "AI02",
    block: "AI-Use Scenario",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "عند استخدام الذكاء الاصطناعي في مشروع ما، كيف تُفضّل توزيع الأدوار؟",
    questionEn: "When using AI in a project, how do you prefer to divide roles?",
    options: [
      { id: "AI02-a", textAr: "أقود الحوار وأُحدّد الاتجاه وأستخدم الذكاء الاصطناعي كأداة تنفيذ", textEn: "I lead the dialogue, set direction, and use AI as an execution tool" },
      { id: "AI02-b", textAr: "أترك للذكاء الاصطناعي المبادرة باقتراح الخطوات والاتجاه", textEn: "I let AI take initiative in suggesting steps and direction" },
      { id: "AI02-c", textAr: "تعاون متوازن — أُساهم بالرؤية وأطلب من الذكاء الاصطناعي تطويرها", textEn: "Balanced collaboration — I contribute the vision and ask AI to develop it" },
      { id: "AI02-d", textAr: "أُحدّد المشكلة وأدع الذكاء الاصطناعي يُقترح حلولاً أُقيّمها", textEn: "I define the problem and let AI suggest solutions for me to evaluate" },
    ],
  },

  {
    id: "AI03",
    block: "AI-Use Scenario",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "عندما تطرح فكرة على الذكاء الاصطناعي، ماذا تتوقع منه؟",
    questionEn: "When you present an idea to AI, what do you expect from it?",
    options: [
      { id: "AI03-a", textAr: "يتحدى الفكرة ويكشف نقاط ضعفها ومخاطرها", textEn: "It challenges the idea and reveals its weaknesses and risks" },
      { id: "AI03-b", textAr: "يدعم الفكرة ويساعدني على تطويرها وتقويتها", textEn: "It supports the idea and helps me develop and strengthen it" },
      { id: "AI03-c", textAr: "يُقيّم الفكرة بموضوعية ويُعطيني صورة متوازنة شاملة", textEn: "It evaluates the idea objectively and gives me a balanced comprehensive picture" },
      { id: "AI03-d", textAr: "يُقارنها بأفكار مماثلة ويُعطيني سياقاً أوسع لها", textEn: "It compares it to similar ideas and gives me a broader context for it" },
    ],
  },

  {
    id: "AI04",
    block: "AI-Use Scenario",
    selectionMode: "single",
    displayCondition: "always",
    questionAr: "ما الذي يُعرقل تجربتك مع الذكاء الاصطناعي أكثر من غيره؟",
    questionEn: "What disrupts your experience with AI the most?",
    options: [
      { id: "AI04-a", textAr: "ردود طويلة ومفصّلة لا تصل للنقطة المطلوبة", textEn: "Long detailed responses that don't get to the required point" },
      { id: "AI04-b", textAr: "ردود غامضة أو عامة لا تُعالج وضعي المحدد", textEn: "Vague or generic responses that don't address my specific situation" },
      { id: "AI04-c", textAr: "عدم الاتساق والتناقض في الردود المتعاقبة", textEn: "Inconsistency and contradiction in successive responses" },
      { id: "AI04-d", textAr: "ردود متحفظة مفرطة أو رفض غير مبرر للطلبات", textEn: "Excessively cautious responses or unjustified refusal of requests" },
    ],
  },
];

export const REQUIRED_V2_QUESTION_IDS = V2_QUESTIONS.map((q) => q.id);
