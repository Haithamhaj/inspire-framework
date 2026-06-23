import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteUrl = "https://inspire.next-stepai.com";
const imageUrl = `${siteUrl}/opengraph.jpg`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const here = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(here, "..");
const outDir = path.resolve(projectDir, "dist/public");
const templatePath = path.join(outDir, "index.html");

const sourceLinks = [
  "INSPIRE & CRAFTS research paper",
  "OpenAI prompt engineering guide",
  "Anthropic Claude prompt engineering docs",
  "Google Vertex AI prompt design strategies",
];

const guides = [
  {
    slug: "how-to-write-better-ai-instructions",
    title: "How to Write Better AI Instructions for ChatGPT, Claude, and Gemini",
    titleAr: "كيف تكتب تعليمات أفضل للذكاء الاصطناعي مع ChatGPT وClaude وGemini",
    metaTitle: "How to Write Better AI Instructions for ChatGPT, Claude, and Gemini — INSPIRE",
    metaTitleAr: "كيف تكتب تعليمات أفضل للذكاء الاصطناعي — INSPIRE",
    description:
      "Learn how to write AI instructions using the INSPIRE seven-section structure. These examples are general educational excerpts, not a substitute for a personalized profile based on project context and assessment answers.",
    descriptionAr:
      "دليل عملي لكتابة تعليمات موجهة للمساعد نفسه باستخدام أقسام INSPIRE السبعة. هذه أمثلة تعليمية عامة وليست بديلاً عن ملف مخصص حسب سياق المشروع وإجابات الاختبار.",
    sections: [
      ["1. Identity & Role", "These examples are general. A real INSPIRE profile changes based on the project, domain, working style, behavioral pattern, and assessment answers. Write this section as instructions to the AI assistant, not as a biography of the user. Example: Act as a consulting strategy assistant for client-facing business work."],
      ["2. Norms & Boundaries", "Tell the assistant what to do, what to avoid, when to stop, and when to clarify. Example: Do not give generic advice or unsupported claims."],
      ["3. Style & Tone", "Define how the assistant should sound and how much detail it should use. Example: Be direct, practical, and calm. Start concise, then expand when useful."],
      ["4. Precision & Self-Check", "Tell the assistant how to handle uncertainty, facts, assumptions, and claims. Example: Separate facts, assumptions, and recommendations when accuracy matters."],
      ["5. Internal Evaluation", "Define the assistant's final quality check before it answers. Example: Check whether the answer is coherent, useful, aligned with the goal, and missing obvious risks."],
      ["6. Response Structure", "Tell the assistant how to organize answers. Example: Lead with the recommendation, then cover assumptions, options, trade-offs, and next steps."],
      ["7. Enhancement & Adaptation", "Tell the assistant how to adapt when corrected, when a task repeats, or when scope starts drifting. Example: Preserve stable rules unless explicitly changed."],
      ["Six general role examples", "These are educational excerpts, not complete INSPIRE profiles. Founder: Act as a founder's strategic planning assistant for early-stage product decisions. Project manager: Act as a project execution and coordination assistant. Student or researcher: Act as a study and research assistant. Marketing and content: Act as a practical marketing and content strategy assistant. Team lead and operations: Act as an operations and team coordination assistant. HR and people operations: Act as a people operations assistant for workplace communication and process design."],
      ["Where to use these instructions in ChatGPT, Claude, and Gemini", "Paste the AI Operating Profile where each tool supports persistent behavior or project instructions. In ChatGPT, use Custom Instructions for general behavior, Projects for project-specific instructions, or Custom GPT instructions for a specialized assistant. In Claude, use Claude Projects and add project instructions plus relevant project knowledge. In Gemini, create a Gem through Gems or Gem manager, paste the instructions, test it, and save it for repeated workflows."],
    ],
    sectionsAr: [
      ["1. Identity & Role", "هذه الأمثلة عامة. ملف INSPIRE الحقيقي يتغير حسب المشروع، المجال، أسلوب العمل، النمط السلوكي، وإجابات الاختبار. اكتب هذا القسم كتعليمات للذكاء الاصطناعي، لا كسيرة ذاتية للمستخدم. مثال: تصرف كمساعد استراتيجي للاستشارات في العمل الموجه للعملاء."],
      ["2. Norms & Boundaries", "قل للمساعد ماذا يفعل، ماذا يتجنب، متى يتوقف، ومتى يطلب توضيحاً. مثال: لا تقدم نصائح عامة أو ادعاءات غير مدعومة."],
      ["3. Style & Tone", "حدد كيف يجب أن يتحدث المساعد وكم مستوى التفصيل المطلوب. مثال: كن مباشراً وعملياً وهادئاً. ابدأ باختصار ثم وسّع عند الحاجة."],
      ["4. Precision & Self-Check", "قل للمساعد كيف يتعامل مع عدم اليقين والحقائق والافتراضات والادعاءات. مثال: افصل بين الحقائق والافتراضات والتوصيات عندما تكون الدقة مهمة."],
      ["5. Internal Evaluation", "حدد فحص الجودة الداخلي الذي يقوم به المساعد قبل الرد. مثال: تحقق أن الإجابة متماسكة ومفيدة ومرتبطة بالهدف ولا تنقصها مخاطر واضحة."],
      ["6. Response Structure", "قل للمساعد كيف يرتب الإجابات. مثال: ابدأ بالتوصية، ثم اعرض الافتراضات والخيارات والمفاضلات والخطوات التالية."],
      ["7. Enhancement & Adaptation", "قل للمساعد كيف يتكيف عند التصحيح أو تكرار المهمة أو توسع النطاق. مثال: احفظ القواعد المستقرة ما لم يتم تغييرها صراحة."],
      ["ستة أمثلة عامة حسب الدور", "هذه مقتطفات تعليمية وليست ملفات INSPIRE كاملة. المؤسس: تصرف كمساعد تخطيط استراتيجي لمؤسس في قرارات منتج مبكرة. مدير المشروع: تصرف كمساعد تنفيذ وتنسيق للمشاريع. الطالب أو الباحث: تصرف كمساعد دراسة وبحث. التسويق والمحتوى: تصرف كمساعد عملي لاستراتيجية التسويق والمحتوى. قائد الفريق والعمليات: تصرف كمساعد عمليات وتنسيق فريق. الموارد البشرية: تصرف كمساعد عمليات أفراد للتواصل الداخلي وتصميم الإجراءات."],
      ["أين تستخدم هذه التعليمات في ChatGPT وClaude وGemini", "الصق AI Operating Profile في المكان الذي تدعم فيه الأداة سلوكاً ثابتاً أو تعليمات مشروع. في ChatGPT استخدم Custom Instructions للسلوك العام، أو Projects لتعليمات المشروع، أو Custom GPT instructions لمساعد متخصص. في Claude استخدم Claude Projects مع project instructions وproject knowledge عند الحاجة. في Gemini أنشئ Gem من Gems أو Gem manager، الصق التعليمات، اختبرها، ثم احفظها لسير العمل المتكرر."],
    ],
    faqs: [
      ["Should AI instructions describe me or instruct the AI?", "They should instruct the AI. You can include user and project context, but the wording should tell the assistant what role to play, how to behave, what to avoid, and how to structure answers."],
      ["Can I paste these examples directly into ChatGPT or Claude?", "Yes, but treat them as general educational excerpts. They will not fit every person or project because a strong operating profile changes with project context, domain, behavioral pattern, and assessment answers."],
    ],
    faqsAr: [
      ["هل التعليمات تصفني أنا أم توجه الذكاء الاصطناعي؟", "يجب أن توجه الذكاء الاصطناعي. يمكن إدخال سياق المستخدم والمشروع، لكن الصياغة النهائية تخبر المساعد ما دوره، كيف يتصرف، ماذا يتجنب، وكيف يرتب الإجابة."],
      ["هل أستطيع نسخ هذه الأمثلة مباشرة إلى ChatGPT أو Claude؟", "نعم، لكن تعامل معها كمقتطفات تعليمية عامة. هي لا تناسب كل شخص أو كل مشروع لأن ملف التشغيل القوي يتغير حسب سياق المشروع، المجال، النمط السلوكي، وإجابات الاختبار."],
    ],
  },
  {
    slug: "ai-operating-profile-examples",
    title: "AI Operating Profile Examples",
    titleAr: "أمثلة AI Operating Profile",
    metaTitle: "AI Operating Profile Examples for ChatGPT, Claude, and Gemini — INSPIRE",
    metaTitleAr: "أمثلة AI Operating Profile — INSPIRE",
    description:
      "See general AI Operating Profile examples for founders, consultants, project managers, and researchers, with guidance for ChatGPT, Claude, and Gemini.",
    descriptionAr:
      "أمثلة عملية لمقتطفات AI Operating Profile مع ChatGPT وClaude وGemini، مكتوبة كأمثلة عامة وليست ملفات INSPIRE مخصصة كاملة.",
    sections: [
      ["How to read these examples", "These are general excerpts, not complete INSPIRE profiles. A real profile changes based on project, domain, language preference, behavioral pattern, and assessment answers."],
      ["Founder example", "Act as a founder's strategic planning assistant for early-stage product decisions. Help compare options, expose assumptions, identify the highest-value next action, and turn unclear ideas into practical experiments."],
      ["Consultant example", "Act as a consulting strategy assistant for client-facing business work. Help turn unclear client goals into practical options, trade-offs, recommendations, and next steps."],
      ["Project manager example", "Act as a project execution and coordination assistant. Help clarify scope, dependencies, owners, risks, deadlines, and next actions."],
      ["Researcher example", "Act as a research and synthesis assistant. Help turn broad questions into a clear research path, compare sources, summarize evidence, and separate confirmed information from interpretation."],
    ],
    sectionsAr: [
      ["كيف تقرأ هذه الأمثلة", "هذه مقتطفات عامة وليست ملفات INSPIRE كاملة. الملف الحقيقي يتغير حسب المشروع والمجال وتفضيل اللغة والنمط السلوكي وإجابات الاختبار."],
      ["مثال للمؤسس", "تصرف كمساعد تخطيط استراتيجي لمؤسس في قرارات منتج مبكرة. ساعد في مقارنة الخيارات وكشف الافتراضات وتحديد أعلى خطوة قيمة وتحويل الأفكار غير الواضحة إلى تجارب عملية."],
      ["مثال للمستشار", "تصرف كمساعد استراتيجي للاستشارات في العمل الموجه للعملاء. ساعد في تحويل أهداف العميل غير الواضحة إلى خيارات عملية ومفاضلات وتوصيات وخطوات تالية."],
      ["مثال لمدير المشروع", "تصرف كمساعد تنفيذ وتنسيق للمشاريع. ساعد في توضيح النطاق والاعتماديات والمسؤولين والمخاطر والمواعيد والخطوات التالية."],
      ["مثال للباحث", "تصرف كمساعد بحث وتلخيص. ساعد في تحويل الأسئلة الواسعة إلى مسار بحث واضح ومقارنة المصادر وتلخيص الأدلة وفصل المعلومات المؤكدة عن التفسير."],
    ],
    faqs: [
      ["Can I copy these AI Operating Profile examples?", "You can use them as starting excerpts, but they are intentionally general. INSPIRE creates a personalized profile from project context, domain, behavioral pattern, and assessment answers."],
      ["Where can I use an AI Operating Profile?", "You can adapt it for ChatGPT Custom Instructions, ChatGPT Projects, Custom GPTs, Claude Projects, Gemini Gems, or the first message of a project-specific chat."],
    ],
    faqsAr: [
      ["هل أستطيع نسخ أمثلة AI Operating Profile كما هي؟", "يمكن استخدامها كنقطة بداية، لكنها عامة عمداً. INSPIRE ينشئ ملفاً مخصصاً من سياق المشروع والمجال والنمط السلوكي وإجابات الاختبار."],
      ["أين أستخدم AI Operating Profile؟", "يمكن تكييفه مع ChatGPT Custom Instructions أو ChatGPT Projects أو Custom GPTs أو Claude Projects أو Gemini Gems أو بداية محادثة خاصة بمشروع."],
    ],
  },
  {
    slug: "ai-operating-profile-for-founders",
    title: "AI Operating Profile for Founders",
    titleAr: "AI Operating Profile للمؤسسين",
    metaTitle: "AI Operating Profile for Founders — INSPIRE",
    metaTitleAr: "AI Operating Profile للمؤسسين — INSPIRE",
    description:
      "A founder-focused AI Operating Profile guide for using ChatGPT, Claude, and Gemini in product decisions, planning, strategy, and execution.",
    descriptionAr:
      "دليل AI Operating Profile موجه للمؤسسين لاستخدام ChatGPT وClaude وGemini في قرارات المنتج والتخطيط والاستراتيجية والتنفيذ.",
    sections: [
      ["What founders need from AI", "Founders often use AI across product, sales, hiring, strategy, operations, and content. A useful AI Operating Profile keeps the assistant focused on decisions and execution rather than generic startup advice."],
      ["Founder instruction excerpt", "Act as a founder's strategic planning assistant for early-stage product decisions. Help compare options, expose assumptions, identify risks, and turn unclear ideas into practical experiments."],
      ["Where to use it", "Use the general behavior layer in ChatGPT Custom Instructions. Use project-specific versions inside ChatGPT Projects, Claude Projects, Custom GPTs, or Gemini Gems."],
    ],
    sectionsAr: [
      ["ماذا يحتاج المؤسسون من AI؟", "يستخدم المؤسسون AI في المنتج والمبيعات والتوظيف والاستراتيجية والعمليات والمحتوى. AI Operating Profile مفيد عندما يبقي المساعد مركزاً على القرار والتنفيذ بدلاً من نصائح عامة."],
      ["مقتطف تعليمات للمؤسس", "تصرف كمساعد تخطيط استراتيجي لمؤسس في قرارات منتج مبكرة. ساعد في مقارنة الخيارات وكشف الافتراضات وتحديد المخاطر وتحويل الأفكار غير الواضحة إلى تجارب عملية."],
      ["أين تستخدمه؟", "استخدم طبقة السلوك العامة في ChatGPT Custom Instructions. واستخدم النسخ الخاصة بالمشروع داخل ChatGPT Projects أو Claude Projects أو Custom GPTs أو Gemini Gems."],
    ],
    faqs: [
      ["Is this a complete founder AI Operating Profile?", "No. It is a general excerpt. A complete INSPIRE profile should adapt to the founder's project, product stage, working style, constraints, and assessment answers."],
      ["What should founder AI instructions avoid?", "They should avoid generic startup advice, unsupported claims, and long lists of options without a clear recommendation or validation step."],
    ],
    faqsAr: [
      ["هل هذا ملف AI Operating Profile كامل للمؤسس؟", "لا. هذا مقتطف عام. ملف INSPIRE الكامل يجب أن يتكيف مع المشروع ومرحلة المنتج وأسلوب العمل والقيود وإجابات الاختبار."],
      ["ماذا يجب أن تتجنب تعليمات المؤسس؟", "يجب أن تتجنب نصائح الشركات الناشئة العامة والادعاءات غير المدعومة والقوائم الطويلة بدون توصية واضحة أو خطوة تحقق."],
    ],
  },
  {
    slug: "ai-operating-profile-for-consultants",
    title: "AI Operating Profile for Consultants",
    titleAr: "AI Operating Profile للمستشارين",
    metaTitle: "AI Operating Profile for Consultants — INSPIRE",
    metaTitleAr: "AI Operating Profile للمستشارين — INSPIRE",
    description:
      "A consultant-focused AI Operating Profile guide for client strategy, recommendations, analysis, and copy-ready advisory work.",
    descriptionAr:
      "دليل AI Operating Profile للمستشارين في الاستراتيجية، التوصيات، التحليل، والعمل الجاهز للاستخدام مع العملاء.",
    sections: [
      ["What consultants need from AI", "Consultants need AI to structure ambiguity, compare options, clarify trade-offs, and produce client-ready language."],
      ["Consultant instruction excerpt", "Act as a consulting strategy assistant for client-facing business work. Help convert vague client goals into clear options, decision criteria, trade-offs, and next steps."],
      ["Where to use it", "Use stable consulting behavior in ChatGPT Custom Instructions. Use client-specific or project-specific versions in ChatGPT Projects, Claude Projects, Custom GPTs, or Gemini Gems."],
    ],
    sectionsAr: [
      ["ماذا يحتاج المستشارون من AI؟", "يحتاج المستشارون إلى AI يرتب الغموض ويقارن الخيارات ويوضح المفاضلات وينتج لغة جاهزة للعميل."],
      ["مقتطف تعليمات للمستشار", "تصرف كمساعد استراتيجي للاستشارات في العمل الموجه للعملاء. ساعد في تحويل أهداف العميل غير الواضحة إلى خيارات ومعايير قرار ومفاضلات وخطوات تالية."],
      ["أين تستخدمه؟", "استخدم سلوك الاستشارات الثابت في ChatGPT Custom Instructions. واستخدم النسخ الخاصة بالعميل أو المشروع في ChatGPT Projects أو Claude Projects أو Custom GPTs أو Gemini Gems."],
    ],
    faqs: [
      ["Can consultants use one AI Operating Profile for all clients?", "Only for general working behavior. Client-specific context should usually live in project-specific instructions or the current chat."],
      ["What makes consultant AI instructions stronger?", "They should define decision criteria, client-ready structure, assumption checks, trade-off analysis, and clear next actions."],
    ],
    faqsAr: [
      ["هل يستخدم المستشار ملفاً واحداً لكل العملاء؟", "فقط للسلوك العام. سياق كل عميل يفضل أن يكون في تعليمات مشروع أو محادثة خاصة."],
      ["ما الذي يقوي تعليمات AI للمستشارين؟", "تحديد معايير القرار، بنية جاهزة للعميل، فحص الافتراضات، تحليل المفاضلات، وخطوات تالية واضحة."],
    ],
  },
  {
    slug: "ai-operating-profile-for-project-managers",
    title: "AI Operating Profile for Project Managers",
    titleAr: "AI Operating Profile لمديري المشاريع",
    metaTitle: "AI Operating Profile for Project Managers — INSPIRE",
    metaTitleAr: "AI Operating Profile لمديري المشاريع — INSPIRE",
    description:
      "A project-manager-focused AI Operating Profile guide for scope, risks, owners, timelines, meeting notes, and execution planning.",
    descriptionAr:
      "دليل AI Operating Profile لمديري المشاريع في النطاق، المخاطر، المسؤولين، الجداول، ملخصات الاجتماعات، وخطط التنفيذ.",
    sections: [
      ["What project managers need from AI", "Project managers need AI to reduce ambiguity, organize moving parts, and turn scattered updates into decisions, owners, and next actions."],
      ["Project manager instruction excerpt", "Act as a project execution and coordination assistant. Convert messy updates into scope, blockers, owners, decisions, risks, deadlines, and next steps."],
      ["Where to use it", "Use project-specific versions inside ChatGPT Projects or Claude Projects. Use Custom GPTs or Gemini Gems for repeated workflows such as weekly project reviews."],
    ],
    sectionsAr: [
      ["ماذا يحتاج مدير المشروع من AI؟", "يحتاج مدير المشروع إلى AI يقلل الغموض ويرتب الأجزاء المتحركة ويحول التحديثات المتفرقة إلى قرارات ومسؤولين وخطوات تالية."],
      ["مقتطف تعليمات لمدير المشروع", "تصرف كمساعد تنفيذ وتنسيق للمشاريع. حوّل التحديثات غير المرتبة إلى نطاق وعوائق ومسؤولين وقرارات ومخاطر ومواعيد وخطوات تالية."],
      ["أين تستخدمه؟", "استخدم النسخ الخاصة بالمشروع داخل ChatGPT Projects أو Claude Projects. واستخدم Custom GPTs أو Gemini Gems لسير عمل متكرر مثل مراجعات المشروع الأسبوعية."],
    ],
    faqs: [
      ["Should project manager instructions be general or project-specific?", "The operating style can be general, but scope, deadlines, stakeholders, and files should usually be project-specific."],
      ["What should project management AI instructions avoid?", "They should avoid overcomplicated process, vague status summaries, and plans without owners, dependencies, risks, or next actions."],
    ],
    faqsAr: [
      ["هل تكون تعليمات مدير المشروع عامة أم خاصة بالمشروع؟", "أسلوب التشغيل يمكن أن يكون عاماً، لكن النطاق والمواعيد وأصحاب المصلحة والملفات غالباً يجب أن تكون خاصة بالمشروع."],
      ["ماذا يجب أن تتجنب تعليمات إدارة المشاريع؟", "تجنب الإجراءات المبالغ فيها، ملخصات الحالة الغامضة، والخطط التي لا تحتوي مسؤولين أو اعتماديات أو مخاطر أو خطوات تالية."],
    ],
  },
  {
    slug: "ai-operating-profile-for-researchers",
    title: "AI Operating Profile for Researchers",
    titleAr: "AI Operating Profile للباحثين",
    metaTitle: "AI Operating Profile for Researchers — INSPIRE",
    metaTitleAr: "AI Operating Profile للباحثين — INSPIRE",
    description:
      "A researcher-focused AI Operating Profile guide for study, source comparison, synthesis, evidence checks, and research planning.",
    descriptionAr:
      "دليل AI Operating Profile للباحثين والطلاب في الدراسة، مقارنة المصادر، التلخيص، فحص الأدلة، وتخطيط البحث.",
    sections: [
      ["What researchers need from AI", "Researchers need AI to clarify questions, organize evidence, compare viewpoints, and summarize without inventing facts or sources."],
      ["Researcher instruction excerpt", "Act as a research and synthesis assistant. Help turn broad questions into a clear research path, compare sources, summarize evidence, and separate confirmed information from interpretation."],
      ["Where to use it", "Use this style in Claude Projects, ChatGPT Projects, or Gemini Gems when you have a research workspace with related files or notes."],
    ],
    sectionsAr: [
      ["ماذا يحتاج الباحثون من AI؟", "يحتاج الباحثون إلى AI يوضح السؤال ويرتب الأدلة ويقارن وجهات النظر ويلخص بدون اختراع حقائق أو مصادر."],
      ["مقتطف تعليمات للباحث", "تصرف كمساعد بحث وتلخيص. ساعد في تحويل الأسئلة الواسعة إلى مسار بحث واضح ومقارنة المصادر وتلخيص الأدلة وفصل المعلومات المؤكدة عن التفسير."],
      ["أين تستخدمه؟", "استخدم هذا الأسلوب في Claude Projects أو ChatGPT Projects أو Gemini Gems عندما يكون لديك مساحة بحث مع ملفات أو ملاحظات مرتبطة."],
    ],
    faqs: [
      ["Can AI Operating Profiles prevent fake citations?", "They can reduce the risk by explicitly telling the assistant not to invent citations and to separate verified information from interpretation, but users should still verify sources."],
      ["Is this only for academic researchers?", "No. The same pattern can help students, analysts, writers, founders, and teams doing source-based work."],
    ],
    faqsAr: [
      ["هل تمنع AI Operating Profiles المراجع الوهمية؟", "تقلل الخطر عندما تطلب صراحة عدم اختراع المراجع وفصل المعلومة المؤكدة عن التفسير، لكن يجب على المستخدم التحقق من المصادر."],
      ["هل هذا للباحثين الأكاديميين فقط؟", "لا. نفس النمط يفيد الطلاب والمحللين والكتاب والمؤسسين والفرق التي تعمل على محتوى قائم على مصادر."],
    ],
  },
  {
    slug: "how-to-write-better-prompts",
    title: "How to Write Better Prompts for AI",
    titleAr: "كيف تكتب مطالبات أفضل للذكاء الاصطناعي",
    metaTitle: "How to Write Better AI Prompts — INSPIRE Guide",
    metaTitleAr: "كيف تكتب مطالبات أفضل للذكاء الاصطناعي — INSPIRE",
    description:
      "Learn how to write better prompts for ChatGPT, Claude, and Gemini using goals, roles, constraints, examples, and quality rules.",
    descriptionAr:
      "دليل عملي لكتابة مطالبات أوضح مع ChatGPT وClaude وGemini باستخدام الدور والسياق والقيود وشكل المخرجات.",
    sections: [
      ["Start with the outcome, not the tool", "A strong prompt begins with the result you want: a decision, plan, draft, review, clearer thinking, or next action. Instead of asking a broad question, define the task, audience, constraints, format, and quality standard."],
      ["Give the assistant a working role", "Generic prompts often produce generic answers. Give the assistant a role that fits the job: strategy reviewer, writing editor, planning partner, customer-support analyst, or technical explainer."],
      ["Add constraints and red lines", "Good prompts say what the AI should avoid: long lists, unsupported claims, jargon, vague advice, or skipping risks. These red lines are especially useful for work contexts where quality and decision discipline matter."],
      ["Use examples to calibrate quality", "If you already know what a useful answer looks like, include a short example. Examples help the model understand structure, tone, and depth faster than abstract instructions."],
    ],
    sectionsAr: [
      ["ابدأ بالنتيجة، لا بالأداة", "المطالبة القوية تبدأ بالنتيجة التي تريدها: قرار، خطة، مسودة، مراجعة، تفكير أوضح، أو خطوة تالية. بدلاً من سؤال واسع، حدّد المهمة والجمهور والقيود وشكل المخرجات ومعيار الجودة."],
      ["أعط المساعد دوراً واضحاً", "المطالبات العامة تنتج إجابات عامة. حدّد دوراً يناسب المهمة: مراجع استراتيجي، محرر كتابة، شريك تخطيط، أو محلل دعم عملاء."],
      ["أضف القيود وخطوط الجودة", "المطالبة الجيدة توضّح ما يجب تجنبه: الإطالة، الادعاءات غير المدعومة، اللغة العامة، أو تجاهل المخاطر."],
      ["استخدم الأمثلة لضبط الجودة", "إذا كنت تعرف شكل الإجابة المفيدة، أضف مثالاً قصيراً. المثال يساعد النموذج على فهم البنية والنبرة والعمق بسرعة."],
    ],
    faqs: [
      ["What makes a prompt better?", "A better prompt gives the AI a clear outcome, role, context, constraints, format, and quality standard. The goal is to reduce guessing."],
      ["Do I need a different prompt for every AI tool?", "The exact wording may change, but the same core instructions can usually work across ChatGPT, Claude, Gemini, and similar assistants."],
    ],
  },
  {
    slug: "chatgpt-custom-instructions",
    title: "ChatGPT Custom Instructions: What to Include",
    titleAr: "ماذا تضع في تعليمات ChatGPT المخصصة",
    metaTitle: "ChatGPT Custom Instructions: What to Include — INSPIRE",
    metaTitleAr: "تعليمات ChatGPT المخصصة: ماذا تضع فيها — INSPIRE",
    description:
      "A practical guide to ChatGPT custom instructions, AI assistant behavior, reusable prompt rules, and personalized AI instructions.",
    descriptionAr:
      "دليل عملي لبناء تعليمات ChatGPT تساعد أدوات الذكاء الاصطناعي على فهم أهدافك وأسلوبك وقواعد الجودة.",
    sections: [
      ["Custom instructions should describe how you work", "The best custom instructions are not a biography. They explain your goals, preferred style, decision habits, and what kind of output helps you move forward."],
      ["Separate context from commands", "Permanent instructions should include stable preferences. Temporary project details should stay in the current chat so the instruction set stays useful over time."],
      ["Use instructions as a quality system", "A good instruction set tells the assistant how to handle uncertainty, when to ask questions, and how to structure answers."],
      ["Keep stable preferences separate", "Stable preferences belong in custom instructions: answer length, tone, formatting, risk tolerance, and preferred decision style."],
    ],
    sectionsAr: [
      ["التعليمات تصف طريقة عملك", "أفضل تعليمات مخصصة ليست سيرة ذاتية. هي توضّح أهدافك، أسلوبك المفضل، عادات القرار، ونوع المخرجات التي تساعدك."],
      ["افصل السياق الثابت عن تفاصيل المشروع", "التفضيلات الثابتة مكانها في التعليمات المخصصة. أما تفاصيل المشروع المؤقتة فالأفضل أن تبقى داخل المحادثة الحالية."],
      ["حوّل التعليمات إلى نظام جودة", "مجموعة التعليمات الجيدة تخبر المساعد كيف يتعامل مع عدم اليقين، متى يسأل، وكيف يرتّب الإجابة."],
      ["حافظ على التعليمات خفيفة وواضحة", "التعليمات الدائمة يجب أن تشمل نمط الإجابة، النبرة، الشكل، مستوى التفصيل، وحدود الجودة."],
    ],
    faqs: [
      ["What should I put in ChatGPT custom instructions?", "Include your goals, preferred answer style, formatting preferences, quality rules, and things the assistant should avoid."],
      ["Should custom instructions include personal details?", "Only include details that improve the work. Avoid sensitive information that the assistant does not need to answer well."],
    ],
  },
  {
    slug: "prompt-engineering-for-work",
    title: "Prompt Engineering for Work",
    titleAr: "هندسة المطالبات للعمل",
    metaTitle: "Prompt Engineering for Work — INSPIRE Guide",
    metaTitleAr: "هندسة المطالبات للعمل — INSPIRE",
    description:
      "Use prompt engineering at work for planning, writing, clearer thinking, bilingual communication, and productivity with ChatGPT, Claude, and Gemini.",
    descriptionAr:
      "استخدم هندسة المطالبات في التخطيط والكتابة والتفكير الأوضح والتواصل ثنائي اللغة مع ChatGPT وClaude وGemini.",
    sections: [
      ["Work prompts need business context", "In the workplace, prompts should include the goal, audience, constraints, decision criteria, and expected format."],
      ["The highest-value use cases", "Useful prompt patterns include summarizing documents, preparing meeting briefs, reviewing proposals, drafting bilingual communication, building plans, and checking assumptions."],
      ["Build reusable personalized instructions", "Personalized instructions make AI outputs more consistent. They give the assistant rules for tone, structure, risk, detail level, and decision support."],
      ["Use bilingual instructions deliberately", "Many workflows move between Arabic and English. Prompt instructions should define when to translate, when to preserve terms, and what audience the output is for."],
    ],
    sectionsAr: [
      ["مطالبات العمل تحتاج سياقاً تجارياً", "في العمل، المطالبة يجب أن تشمل الهدف والجمهور والقيود ومعايير القرار وشكل المخرجات المتوقع."],
      ["أعلى الاستخدامات قيمة", "من الاستخدامات المفيدة: تلخيص المستندات، تجهيز ملخصات الاجتماعات، مراجعة العروض، صياغة رسائل ثنائية اللغة، بناء الخطط، واختبار الافتراضات."],
      ["ابنِ تعليمات مخصصة قابلة لإعادة الاستخدام", "التعليمات المخصصة تجعل مخرجات الذكاء الاصطناعي أكثر اتساقاً، لأنها تحدد النبرة والبنية والمخاطر ومستوى التفصيل."],
      ["استخدم التعليمات ثنائية اللغة بوعي", "كثير من بيئات العمل تتحرك بين العربية والإنجليزية. لذلك يجب تحديد متى نترجم، ومتى نحافظ على المصطلح، ولمن تُكتب المخرجات."],
    ],
    faqs: [
      ["Why does prompt engineering matter at work?", "Work prompts carry more risk because outputs often affect decisions, customers, or internal alignment. Clear context and constraints improve usefulness."],
      ["What are good workplace AI use cases?", "Common use cases include meeting briefs, document summaries, proposal reviews, bilingual communication, planning, research synthesis, and decision support."],
    ],
  },
  {
    slug: "ai-operating-profile",
    title: "AI Operating Profile: Instructions for ChatGPT, Claude, and Gemini",
    titleAr: "AI Operating Profile: تعليمات قابلة للاستخدام مع ChatGPT وClaude وGemini",
    metaTitle: "AI Operating Profile: Instructions for ChatGPT, Claude, and Gemini",
    metaTitleAr: "AI Operating Profile: تعليمات قابلة للاستخدام مع ChatGPT وClaude وGemini",
    description:
      "Learn what an AI Operating Profile is and how reusable instructions help ChatGPT, Claude, and Gemini understand your goals, style, boundaries, and quality rules.",
    descriptionAr:
      "تعرف على AI Operating Profile وكيف يساعد ChatGPT وClaude وGemini على فهم هدفك، أسلوبك، حدودك، وقواعد الجودة التي تفضلها.",
    sections: [
      ["An AI Operating Profile is more than one prompt", "A prompt usually asks for one output. An AI Operating Profile defines how the assistant should think, respond, structure work, and avoid mistakes across many tasks."],
      ["What it contains", "Useful instructions include your goal context, preferred communication style, thinking modes, quality standards, red lines, and examples of useful outputs."],
      ["Why it matters for everyday AI users", "Most people lose time because every AI conversation starts from zero. An AI Operating Profile reduces repetition and helps the assistant adapt faster."],
      ["How it differs from a prompt library", "A prompt library gives you reusable task templates. An AI Operating Profile gives AI a reusable understanding of how to work with you."],
    ],
    sectionsAr: [
      ["AI Operating Profile أكثر من برومبت واحد", "البرومبت يطلب مخرجاً واحداً غالباً. أما AI Operating Profile فيحدد كيف يفكر المساعد ويرد ويرتب العمل ويتجنب الأخطاء عبر مهام متعددة."],
      ["ماذا تحتوي؟", "التعليمات المفيدة تشمل سياق الهدف، أسلوب التواصل المفضل، أنماط التفكير، معايير الجودة، الخطوط الحمراء، وأمثلة على المخرجات المفيدة."],
      ["لماذا يهم لأي مستخدم AI؟", "كثير من الناس يضيعون وقتاً لأن كل محادثة تبدأ من الصفر. AI Operating Profile يقلل التكرار ويساعد المساعد على التكيف أسرع."],
      ["كيف يختلف عن مكتبة المطالبات؟", "مكتبة المطالبات تعطيك قوالب للمهام. أما AI Operating Profile فيعطي المساعد فهماً متكرراً لطريقة العمل معك."],
    ],
    faqs: [
      ["Is an AI Operating Profile the same as a prompt?", "No. A prompt usually asks for one output. An AI Operating Profile defines repeated behavior across many tasks and conversations."],
      ["Can I use an AI Operating Profile across multiple AI tools?", "Yes. Well-written instructions can be adapted for ChatGPT, Claude, Gemini, and other assistants."],
    ],
    faqsAr: [
      ["هل AI Operating Profile هو نفسه البرومبت؟", "لا. البرومبت يطلب غالباً نتيجة واحدة، أما AI Operating Profile فيحدد سلوكاً متكرراً عبر مهام ومحادثات كثيرة."],
      ["هل أستطيع استخدام AI Operating Profile مع أكثر من أداة؟", "نعم. يمكن تكييف التعليمات الجيدة مع ChatGPT وClaude وGemini، مع مراعاة اختلاف مكان إدخال التعليمات في كل أداة."],
    ],
  },
  {
    slug: "ai-operating-profile-vs-chatgpt-custom-instructions",
    title: "AI Operating Profile vs ChatGPT Custom Instructions",
    titleAr: "AI Operating Profile vs ChatGPT Custom Instructions",
    metaTitle: "AI Operating Profile vs ChatGPT Custom Instructions — INSPIRE",
    metaTitleAr: "AI Operating Profile vs ChatGPT Custom Instructions — INSPIRE",
    description:
      "Compare AI Operating Profiles with ChatGPT Custom Instructions and learn when to use each for better ChatGPT, Claude, and Gemini results.",
    descriptionAr:
      "مقارنة عملية بين AI Operating Profile وتعليمات ChatGPT المخصصة، ومتى تستخدم كل واحد وكيف يربط INSPIRE بينهما.",
    sections: [
      ["The simple difference", "ChatGPT Custom Instructions are a place to store reusable preferences inside ChatGPT. An AI Operating Profile is the broader instruction design that decides what those preferences should be."],
      ["Why an operating profile comes first", "Most people write custom instructions by guessing. An AI Operating Profile starts by defining the user's goal, working style, useful assistant role, boundaries, output structure, self-check behavior, and adaptation rules."],
      ["Where INSPIRE fits", "INSPIRE turns assessment answers into a structured AI Operating Profile, then converts that profile into copy-ready instructions that can be used in ChatGPT, Claude, Gemini, and similar tools."],
      ["Which one should you use?", "Use ChatGPT Custom Instructions for a short preference layer inside ChatGPT. Use an AI Operating Profile when you want a reusable profile that can guide multiple AI tools, projects, and recurring workflows."],
    ],
    sectionsAr: [
      ["الفرق ببساطة", "تعليمات ChatGPT المخصصة هي مكان داخل ChatGPT تضع فيه تفضيلات ثابتة. أما AI Operating Profile فهو التصميم الأوسع الذي يحدد ما الذي يجب أن يوضع في هذه التعليمات."],
      ["لماذا يأتي AI Operating Profile أولاً؟", "كثير من الناس يكتبون تعليمات عامة بالتخمين. AI Operating Profile يبدأ بتحديد الهدف، أسلوب العمل، دور المساعد، الحدود، شكل المخرجات، قواعد الفحص، وطريقة التكيف."],
      ["أين يدخل INSPIRE؟", "INSPIRE يحوّل إجابات التقييم إلى AI Operating Profile منظم، ثم يحوّل هذا الملف إلى تعليمات جاهزة للنسخ يمكن استخدامها في ChatGPT وClaude وGemini وأدوات مشابهة."],
      ["أي واحد تستخدم؟", "استخدم ChatGPT Custom Instructions عندما تحتاج طبقة تفضيلات قصيرة داخل ChatGPT. واستخدم AI Operating Profile عندما تريد ملف تشغيل قابل لإعادة الاستخدام عبر أدوات ومشاريع متعددة."],
    ],
    faqs: [
      ["Are AI Operating Profiles and ChatGPT Custom Instructions competitors?", "No. They work together. The AI Operating Profile defines the assistant behavior, and ChatGPT Custom Instructions are one place where parts of that behavior can be pasted."],
      ["Can I use an AI Operating Profile outside ChatGPT?", "Yes. A well-written AI Operating Profile can be adapted for Claude, Gemini, Custom GPTs, project instructions, and other assistant settings."],
    ],
    faqsAr: [
      ["هل AI Operating Profile ينافس ChatGPT Custom Instructions؟", "لا. هما يعملان معاً. AI Operating Profile يحدد سلوك المساعد، وChatGPT Custom Instructions هي مكان يمكن لصق أجزاء من هذا السلوك فيه."],
      ["هل يمكن استخدام AI Operating Profile خارج ChatGPT؟", "نعم. يمكن تكييف AI Operating Profile جيد مع Claude وGemini وCustom GPTs وتعليمات المشاريع وإعدادات المساعدين الأخرى."],
    ],
  },
  {
    slug: "arabic-ai-prompts",
    title: "Arabic AI Prompts and Bilingual AI Instructions",
    titleAr: "مطالبات عربية وتعليمات ثنائية اللغة للذكاء الاصطناعي",
    metaTitle: "Arabic AI Prompts and Bilingual AI Instructions — INSPIRE",
    metaTitleAr: "مطالبات عربية وتعليمات ثنائية اللغة للذكاء الاصطناعي — INSPIRE",
    description:
      "Learn how Arabic-speaking users can write better AI prompts and bilingual instructions for ChatGPT, Claude, and Gemini.",
    descriptionAr:
      "تعلم كيف تكتب مطالبات عربية أوضح وتعليمات ثنائية اللغة مع ChatGPT وClaude وGemini.",
    sections: [
      ["Arabic prompts need clarity, not literal translation", "Good Arabic prompts should be clear about the task, tone, audience, and output format. Literal translation from English prompt templates often weakens the result."],
      ["Bilingual work benefits from stable instructions", "Many users switch between Arabic and English at work. Stable instructions can tell the AI when to preserve English terms and when to explain in Arabic."],
      ["INSPIRE supports bilingual AI usage", "INSPIRE can produce reports and instructions for users who work across Arabic and English contexts. The goal is better alignment, not just translation."],
      ["Avoid vague Arabic commands", "Short Arabic commands often produce generic answers. Add the audience, goal, context, tone, output format, and boundaries."],
    ],
    sectionsAr: [
      ["المطالبات العربية تحتاج وضوحاً لا ترجمة حرفية", "المطالبة العربية الجيدة توضّح المهمة والنبرة والجمهور وشكل المخرجات. الترجمة الحرفية من قوالب إنجليزية قد تضعف النتيجة."],
      ["العمل ثنائي اللغة يستفيد من تعليمات ثابتة", "كثير من المستخدمين ينتقلون بين العربية والإنجليزية في العمل. التعليمات الثابتة تحدد متى نحافظ على المصطلحات الإنجليزية ومتى نشرح بالعربية."],
      ["INSPIRE يدعم استخداماً ثنائي اللغة", "يمكن لـ INSPIRE توليد تقارير وتعليمات لمستخدمين يعملون بين العربية والإنجليزية. الهدف ليس الترجمة فقط، بل مواءمة طريقة عملك مع طريقة استجابة الذكاء الاصطناعي."],
      ["تجنب الأوامر العربية العامة", "أوامر قصيرة مثل “اكتب لي برومبت” تنتج غالباً إجابات عامة. أضف الجمهور والهدف والسياق والنبرة وشكل المخرجات والحدود."],
    ],
    faqs: [
      ["هل الأفضل أكتب البرومبت بالعربي أم بالإنجليزي؟", "اكتب باللغة التي تناسب المخرجات المطلوبة. إذا كان العمل عربي أو موجه لجمهور عربي، فالوضوح بالعربية أهم من الترجمة الحرفية."],
      ["كيف أحسن نتائج ChatGPT بالعربي؟", "حدد الدور، الهدف، الجمهور، النبرة، شكل المخرجات، والكلمات التي يجب الحفاظ عليها بالإنجليزية إن وجدت."],
    ],
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pathFor(basePath, locale) {
  if (locale === "ar") return basePath === "/" ? "/ar" : `/ar${basePath}`;
  return basePath;
}

function canonicalPath(routePath) {
  if (!routePath || routePath === "/") return "/";
  return `${routePath.replace(/\/+$/, "")}/`;
}

function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

function globalSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "INSPIRE Framework",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/logo.png`,
        email: "Haitham.haj@gmail.com",
        sameAs: [
          "https://www.linkedin.com/in/haithamhaj/",
          "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
          "https://dx.doi.org/10.2139/ssrn.5358595",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "INSPIRE Framework",
        url: `${siteUrl}/`,
        publisher: { "@id": organizationId },
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: "INSPIRE Framework",
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/`,
        description:
          "A self-serve digital assessment that creates an AI operating profile, copy-ready prompt instructions, starter prompts, and a report for working with AI tools.",
        publisher: { "@id": organizationId },
        offers: {
          "@type": "Offer",
          price: "10.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/pricing`,
        },
      },
    ],
  };
}

function pageSchema(page) {
  if (page.type === "guide") {
    const url = `${siteUrl}${page.path}`;
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: page.h1, path: page.path },
        ]),
        {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: page.h1,
          description: page.description,
          url,
          image: imageUrl,
          author: { "@type": "Organization", name: "INSPIRE Framework", url: siteUrl },
          publisher: { "@id": organizationId },
          mainEntityOfPage: url,
          inLanguage: page.locale,
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: page.faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        },
      ],
    };
  }

  if (page.type === "about") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: page.path }]),
        {
          "@type": "AboutPage",
          "@id": `${siteUrl}${page.path}#webpage`,
          url: `${siteUrl}${page.path}`,
          name: page.h1,
          description: page.description,
          isPartOf: { "@id": websiteId },
          publisher: { "@id": organizationId },
        },
      ],
    };
  }

  if (page.type === "contact") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: page.path }]),
        {
          "@type": "ContactPage",
          "@id": `${siteUrl}${page.path}#webpage`,
          url: `${siteUrl}${page.path}`,
          name: page.h1,
          isPartOf: { "@id": websiteId },
          publisher: { "@id": organizationId },
        },
      ],
    };
  }

  if (page.type === "research") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb([{ name: "Home", path: "/" }, { name: "Research", path: page.path }]),
        {
          "@type": "ScholarlyArticle",
          "@id": "https://dx.doi.org/10.2139/ssrn.5358595",
          name: "Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization",
          author: { "@type": "Person", name: "Haitham Hamadneh" },
          url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5358595",
          sameAs: "https://dx.doi.org/10.2139/ssrn.5358595",
        },
      ],
    };
  }

  return breadcrumb([{ name: "Home", path: "/" }, { name: page.h1, path: page.path }]);
}

function headHtml(page) {
  const canonical = `${siteUrl}${canonicalPath(page.path)}`;
  const enPath = pathFor(page.basePath, "en");
  const arPath = pathFor(page.basePath, "ar");
  const canonicalEnPath = canonicalPath(enPath);
  const canonicalArPath = canonicalPath(arPath);
  const schemas = [globalSchema(), pageSchema(page)];

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#070817" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${siteUrl}${canonicalEnPath}" />
    <link rel="alternate" hreflang="ar" href="${siteUrl}${canonicalArPath}" />
    <link rel="alternate" hreflang="x-default" href="${siteUrl}${canonicalEnPath}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/images/logo.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="INSPIRE Framework" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="INSPIRE Framework AI operating profile preview" />
    <meta property="og:locale" content="${page.locale === "ar" ? "ar_SA" : "en_US"}" />
    <meta property="og:locale:alternate" content="${page.locale === "ar" ? "en_US" : "ar_SA"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
${page.assets}
${schemas
  .map(
    (schema) => `    <script type="application/ld+json">${JSON.stringify(schema)}</script>`
  )
  .join("\n")}`;
}

function bodyHtml(page) {
  const dir = page.locale === "ar" ? "rtl" : "ltr";
  const links = [
    [pathFor("/", page.locale), page.locale === "ar" ? "الرئيسية" : "Home"],
    [pathFor("/guides", page.locale), page.locale === "ar" ? "الأدلة" : "Guides"],
    [pathFor("/about", page.locale), page.locale === "ar" ? "عن INSPIRE" : "About"],
    [pathFor("/research", page.locale), page.locale === "ar" ? "البحث" : "Research"],
    [pathFor("/pricing", page.locale), page.locale === "ar" ? "الأسعار" : "Pricing"],
  ];

  const sections = page.sections
    .map(([heading, text]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`)
    .join("\n");
  const faq = page.faqs?.length
    ? `<section><h2>FAQ</h2>${page.faqs
        .map(([q, a]) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`)
        .join("\n")}</section>`
    : "";

  return `<div id="root"><div class="seo-prerender" dir="${dir}">
    <nav>${links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join(" ")}</nav>
    <main>
      <article>
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.intro)}</p>
        ${sections}
        ${page.type === "guide" ? `<section><h2>${page.locale === "ar" ? "المنهج والمراجع" : "Method and references"}</h2><p>${sourceLinks.map(escapeHtml).join(" · ")}</p></section>` : ""}
        ${faq}
      </article>
    </main>
  </div></div>`;
}

function pageFilePath(routePath) {
  if (routePath === "/") return path.join(outDir, "index.html");
  return path.join(outDir, routePath.replace(/^\//, ""), "index.html");
}

function extractAssets(template) {
  const head = template.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  return head
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((tag) => tag.includes("/assets/"))
    .join("\n");
}

function render(template, page) {
  const htmlAttrs = `lang="${page.locale}"${page.locale === "ar" ? ' dir="rtl"' : ""}`;
  const body = template.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const scripts = body
    .split("\n")
    .filter((line) => line.includes("<script") && line.includes("/assets/"))
    .join("\n");
  return `<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
${headHtml(page)}
  </head>
  <body>
    ${bodyHtml(page)}
${scripts}
  </body>
</html>
`;
}

function makeBasePages() {
  const pages = [
    {
      basePath: "/",
      type: "home",
      title: "AI Operating Profile for ChatGPT, Claude, and Gemini | INSPIRE",
      titleAr: "AI Operating Profile لـ ChatGPT وClaude وGemini | INSPIRE",
      description:
        "Create an AI Operating Profile with reusable instructions for ChatGPT, Claude, and Gemini based on your goal, working style, boundaries, and preferred response format.",
      descriptionAr:
        "أنشئ AI Operating Profile وتعليمات قابلة لإعادة الاستخدام مع ChatGPT وClaude وGemini بناءً على هدفك وأسلوب عملك وحدودك وشكل الرد الذي تفضله.",
      h1: "AI Operating Profile for the way you work",
      h1Ar: "AI Operating Profile لطريقة عملك",
      intro:
        "INSPIRE turns your goals, working style, preferences, and red lines into a reusable AI operating profile for ChatGPT, Claude, Gemini, and similar tools.",
      introAr:
        "يحوّل INSPIRE أهدافك وأسلوب عملك وتفضيلاتك وحدودك إلى تعليمات مخصصة قابلة للاستخدام مع ChatGPT وClaude وGemini.",
      sections: [
        ["What INSPIRE creates", "A copy-ready instruction set, starter prompts, and a readable report that explains how AI should work with you."],
        ["Why it matters", "Most people repeat the same context in every AI conversation. INSPIRE makes that context reusable and easier to improve."],
      ],
      sectionsAr: [
        ["ماذا ينشئ INSPIRE", "تعليمات قابلة للنسخ، مطالبات بداية، وتقرير واضح يشرح كيف يجب أن يعمل الذكاء الاصطناعي معك."],
        ["لماذا يهم", "كثير من الناس يعيدون شرح نفس السياق في كل محادثة. INSPIRE يجعل هذا السياق قابلاً لإعادة الاستخدام والتحسين."],
      ],
    },
    {
      basePath: "/pricing",
      type: "pricing",
      title: "INSPIRE Pricing — $10 Personalized AI Instructions",
      titleAr: "أسعار INSPIRE — تعليمات ذكاء اصطناعي مخصصة",
      description:
        "Simple INSPIRE pricing: a free quick assessment and $10 one-time personalized AI instructions with copy-ready starter prompts.",
      descriptionAr:
        "تسعير واضح من INSPIRE: تقييم سريع مجاني وتعليمات مخصصة كاملة بقيمة 10 دولارات جاهزة للنسخ والاستخدام.",
      h1: "Simple pricing for personalized AI instructions",
      h1Ar: "تسعير واضح لتعليمات ذكاء اصطناعي مخصصة",
      intro:
        "Start with the free quick assessment or unlock the complete personalized instruction report for a one-time price.",
      introAr:
        "ابدأ بالتقييم السريع المجاني أو احصل على تقرير التعليمات المخصصة الكامل بسعر مرة واحدة.",
      sections: [["Plans", "The free quick assessment gives starter prompts. The complete report creates reusable instructions and a structured AI operating profile."]],
      sectionsAr: [["الخطط", "التقييم السريع المجاني يعطي مطالبات بداية. التقرير الكامل ينشئ تعليمات قابلة لإعادة الاستخدام وملف تشغيل للذكاء الاصطناعي."]],
    },
    {
      basePath: "/about",
      type: "about",
      title: "About INSPIRE Framework — Personalized AI Instructions",
      titleAr: "عن INSPIRE Framework — تعليمات مخصصة للذكاء الاصطناعي",
      description:
        "Learn about INSPIRE Framework, a digital assessment that creates personalized AI instructions for ChatGPT, Claude, and Gemini.",
      descriptionAr:
        "تعرّف على INSPIRE Framework، تقييم رقمي يحوّل أهدافك وأسلوب عملك إلى تعليمات مخصصة للذكاء الاصطناعي.",
      h1: "A practical framework for personal AI instructions",
      h1Ar: "إطار عملي لبناء تعليمات شخصية للذكاء الاصطناعي",
      intro:
        "INSPIRE Framework is a self-serve digital assessment that turns a person's goals, working style, preferences, and red lines into reusable personalized AI instructions.",
      introAr:
        "INSPIRE هو تقييم رقمي ذاتي يحوّل أهدافك، أسلوب عملك، تفضيلاتك، وحدودك إلى تعليمات مخصصة قابلة للاستخدام.",
      sections: [["What INSPIRE helps you unlock", "When AI understands your context and working style, its responses become clearer, more relevant, and easier to use."], ["Research-backed product method", "INSPIRE is connected to the INSPIRE & CRAFTS work by Haitham Hamadneh."]],
      sectionsAr: [["ماذا يضيف INSPIRE؟", "عندما يعرف الذكاء الاصطناعي سياقك وطريقة تفكيرك، تصبح إجاباته أقرب لما تحتاجه."], ["أساس بحثي ومنتج عملي", "يرتبط INSPIRE بعمل INSPIRE & CRAFTS من إعداد هيثم حمادنة."]],
    },
    {
      basePath: "/research",
      type: "research",
      title: "INSPIRE & CRAFTS Research — AI Interaction Customization",
      titleAr: "خلفية INSPIRE & CRAFTS البحثية — تخصيص التفاعل مع الذكاء الاصطناعي",
      description:
        "Read the research background behind INSPIRE Framework and the INSPIRE & CRAFTS approach to personalized AI interaction and prompt instructions.",
      descriptionAr:
        "اقرأ الخلفية البحثية وراء INSPIRE Framework ومنهج INSPIRE & CRAFTS لتخصيص التفاعل مع الذكاء الاصطناعي.",
      h1: "INSPIRE & CRAFTS research background",
      h1Ar: "خلفية INSPIRE & CRAFTS البحثية",
      intro:
        "INSPIRE Framework is informed by the paper Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization.",
      introAr:
        "يعتمد INSPIRE Framework على ورقة Inspire & Crafts: A Dual Framework for Individual AI Interaction Customization.",
      sections: [["Plain-language summary", "The research presents a practical way to customize how AI assistants work with individuals by defining goals, style, preferences, interaction rules, and quality standards."], ["From research to product", "INSPIRE turns this idea into structured questions, useful signals, and reusable personalized AI instructions."]],
      sectionsAr: [["ملخص مبسط", "توضح الورقة طريقة عملية لتخصيص تعامل الأفراد مع المساعدات الذكية من خلال تحديد الأهداف والأسلوب والتفضيلات وقواعد التفاعل ومعايير الجودة."], ["من البحث إلى المنتج", "يحوّل INSPIRE هذه الفكرة إلى أسئلة منظمة وإشارات مفيدة وتعليمات مخصصة قابلة للاستخدام."]],
    },
    {
      basePath: "/contact",
      type: "contact",
      title: "Contact INSPIRE Framework — Support and Product Questions",
      titleAr: "تواصل مع INSPIRE Framework — الدعم والاستفسارات",
      description:
        "Contact INSPIRE Framework for support, product questions, billing questions, and review inquiries for personalized AI instructions.",
      descriptionAr:
        "تواصل مع INSPIRE Framework لأسئلة المنتج، الدعم، الفواتير، أو مراجعة التقرير الرقمي المخصص للذكاء الاصطناعي.",
      h1: "Contact INSPIRE Framework",
      h1Ar: "تواصل مع INSPIRE Framework",
      intro:
        "For product questions, support, billing questions, or review inquiries, contact the INSPIRE team by email.",
      introAr:
        "للاستفسارات عن المنتج، الدعم، أو مراجعة الطلبات، يمكنك التواصل مع فريق INSPIRE عبر البريد الإلكتروني.",
      sections: [["Support email", "Use Haitham.haj@gmail.com and include the email used for your assessment if your question is about a report or account."]],
      sectionsAr: [["بريد الدعم", "استخدم Haitham.haj@gmail.com واكتب البريد المستخدم في التقييم إذا كان سؤالك متعلقاً بتقرير أو حساب."]],
    },
    {
      basePath: "/assess/mini",
      type: "assessment",
      title: "Free AI Prompt Assessment — INSPIRE Framework",
      titleAr: "تقييم سريع مجاني لمطالبات الذكاء الاصطناعي — INSPIRE",
      description:
        "Try a free quick AI working-style assessment and get starter prompts for better ChatGPT, Claude, and Gemini results.",
      descriptionAr:
        "جرّب تقييماً سريعاً مجانياً لأسلوب عملك مع الذكاء الاصطناعي واحصل على مطالبات بداية لتحسين نتائج ChatGPT وClaude وGemini.",
      h1: "Free AI prompt assessment",
      h1Ar: "تقييم سريع مجاني لمطالبات الذكاء الاصطناعي",
      intro:
        "Answer a short set of questions and get starter prompts that reflect your goal, working style, and preferred output format.",
      introAr:
        "أجب عن مجموعة قصيرة من الأسئلة واحصل على مطالبات بداية تعكس هدفك وأسلوب عملك وشكل المخرجات المفضل لديك.",
      sections: [["What you get", "The mini assessment provides a lightweight starting point for better AI instructions before the full INSPIRE report."]],
      sectionsAr: [["ماذا تحصل عليه", "يوفر التقييم السريع نقطة بداية خفيفة لتعليمات أفضل قبل تقرير INSPIRE الكامل."]],
    },
    {
      basePath: "/guides",
      type: "guides",
      title: "AI Prompt Guides and AI Operating Profile Guides — INSPIRE",
      titleAr: "أدلة عملية لكتابة تعليمات أفضل للذكاء الاصطناعي — INSPIRE",
      description:
        "Practical guides for AI Operating Profiles, ChatGPT custom instructions, prompt engineering, Arabic AI prompts, and personalized AI instructions.",
      descriptionAr:
        "أدلة عملية عن كتابة مطالبات أفضل، تعليمات ChatGPT، هندسة المطالبات، المطالبات العربية، وتعليمات الذكاء الاصطناعي المخصصة.",
      h1: "Practical guides for better AI prompts and instructions",
      h1Ar: "أدلة عملية لكتابة تعليمات أفضل للذكاء الاصطناعي",
      intro:
        "Learn how to write better prompts, use ChatGPT custom instructions, and build an AI Operating Profile that works with ChatGPT, Claude, and Gemini.",
      introAr:
        "تعرّف على طريقة كتابة مطالبات أوضح، واستخدام تعليمات ChatGPT، وبناء AI Operating Profile وتعليمات مخصصة تعمل مع ChatGPT وClaude وGemini.",
      sections: guides.map((guide) => [guide.title, guide.description]),
      sectionsAr: guides.map((guide) => [guide.titleAr, guide.descriptionAr]),
    },
    {
      basePath: "/terms",
      type: "legal",
      title: "Terms of Service — INSPIRE Framework",
      titleAr: "شروط الخدمة — INSPIRE Framework",
      description: "Terms for using INSPIRE Framework, a self-serve personalized AI instruction product.",
      descriptionAr: "شروط استخدام INSPIRE Framework، المنتج الرقمي الذاتي لإنشاء تعليمات مخصصة للذكاء الاصطناعي.",
      h1: "Terms of Service",
      h1Ar: "شروط الخدمة",
      intro: "These terms describe the use of INSPIRE Framework as a self-serve digital product.",
      introAr: "توضح هذه الشروط استخدام INSPIRE Framework كمنتج رقمي ذاتي.",
      sections: [["Digital product terms", "INSPIRE provides online assessments, generated reports, and related digital outputs for personal AI instruction workflows."]],
      sectionsAr: [["شروط المنتج الرقمي", "يوفر INSPIRE تقييمات رقمية وتقارير ومخرجات مرتبطة ببناء تعليمات شخصية للذكاء الاصطناعي."]],
    },
    {
      basePath: "/privacy",
      type: "legal",
      title: "Privacy Policy — INSPIRE Framework",
      titleAr: "سياسة الخصوصية — INSPIRE Framework",
      description: "How INSPIRE Framework collects and uses information to generate personalized AI instructions.",
      descriptionAr: "كيفية جمع INSPIRE Framework للمعلومات واستخدامها وحمايتها لتقديم تجربة التقييم والتقرير الرقمي المخصص للذكاء الاصطناعي.",
      h1: "Privacy Policy",
      h1Ar: "سياسة الخصوصية",
      intro: "This policy explains how INSPIRE handles information used to provide assessments and reports.",
      introAr: "توضح هذه السياسة كيفية تعامل INSPIRE مع المعلومات المستخدمة لتقديم التقييمات والتقارير.",
      sections: [["Information use", "Information is used to operate the assessment, create the report, support accounts, and improve the digital product."]],
      sectionsAr: [["استخدام المعلومات", "تستخدم المعلومات لتشغيل التقييم، إنشاء التقرير، دعم الحسابات، وتحسين المنتج الرقمي."]],
    },
    {
      basePath: "/refund-policy",
      type: "legal",
      title: "Refund Policy — INSPIRE Framework",
      titleAr: "سياسة الاسترداد — INSPIRE Framework",
      description: "Refund policy for the INSPIRE Framework personalized AI instruction product.",
      descriptionAr: "سياسة الاسترداد الخاصة بتقرير INSPIRE Framework الرقمي وطلبات الاسترداد المؤهلة للمنتج الرقمي المخصص للذكاء الاصطناعي.",
      h1: "Refund Policy",
      h1Ar: "سياسة الاسترداد",
      intro: "This policy explains refund handling for the INSPIRE personalized AI instruction product.",
      introAr: "توضح هذه السياسة آلية الاسترداد الخاصة بمنتج INSPIRE لتعليمات الذكاء الاصطناعي المخصصة.",
      sections: [["Digital delivery", "Refund eligibility depends on the status of digital report generation, access activation, and support review."]],
      sectionsAr: [["التسليم الرقمي", "تعتمد أهلية الاسترداد على حالة إنشاء التقرير الرقمي وتفعيل الوصول ومراجعة الدعم."]],
    },
  ];

  return pages.flatMap((page) => localizedPages(page));
}

function localizedPages(page) {
  return ["en", "ar"].map((locale) => ({
    ...page,
    locale,
    path: pathFor(page.basePath, locale),
    title: locale === "ar" ? page.titleAr : page.title,
    description: locale === "ar" ? page.descriptionAr : page.description,
    h1: locale === "ar" ? page.h1Ar : page.h1,
    intro: locale === "ar" ? page.introAr : page.intro,
    sections: locale === "ar" ? page.sectionsAr : page.sections,
    faqs: locale === "ar" ? page.faqsAr ?? page.faqs ?? [] : page.faqs ?? [],
  }));
}

function guidePages() {
  return guides.flatMap((guide) => {
    const basePath = `/guides/${guide.slug}`;
    return localizedPages({
      basePath,
      type: "guide",
      title: guide.metaTitle,
      titleAr: guide.metaTitleAr,
      description: guide.description,
      descriptionAr: guide.descriptionAr,
      h1: guide.title,
      h1Ar: guide.titleAr,
      intro: guide.description,
      introAr: guide.descriptionAr,
      sections: guide.sections,
      sectionsAr: guide.sectionsAr,
      faqs: guide.faqs,
      faqsAr: guide.faqsAr,
    });
  });
}

async function main() {
  const template = await readFile(templatePath, "utf8");
  const assets = extractAssets(template);
  const pages = [...makeBasePages(), ...guidePages()].map((page) => ({ ...page, assets }));

  for (const page of pages) {
    const filePath = pageFilePath(page.path);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, render(template, page), "utf8");
  }

  console.log(`Prerendered ${pages.length} SEO pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
