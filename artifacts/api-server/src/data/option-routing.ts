// ─── BACKEND-ONLY: Option Routing Matrix ─────────────────────────────────────
// This file is never imported by any frontend code.
// It maps each (questionId, optionId) to behavioral metadata used by buildPromptV2.

export type InstructionSection =
  | "assistant_identity"
  | "mission_domain_context"
  | "relationship_with_user"
  | "dynamic_roles"
  | "core_behavior_rules"
  | "thinking_quality_modes"
  | "output_rules"
  | "red_lines_failure_triggers"
  | "universal_quality_rules"
  | "adaptation_loop";

export type ReportSection =
  | "full_copy_ready_instruction"
  | "starter_prompts"
  | "red_lines_failure_triggers"
  | "recommended_usage_strategy"
  | "ai_interaction_style"
  | "recommended_identity"
  | "domain_operating_mode"
  | "strengths"
  | "risks_blindspots"
  | "behavioral_signal_map";

export type InspireInstructionSection =
  | "IdentityRole"
  | "NormsBoundaries"
  | "StyleTone"
  | "PrecisionSelfCheck"
  | "InternalEvaluation"
  | "ResponseStructure"
  | "EnhancementAdaptation";

export type InspireAllocation = Record<InspireInstructionSection, number>;

export type RoleHint =
  | "ExecutorBuilder"
  | "StrategicOrganizer"
  | "CriticalReviewer"
  | "ThinkingPartner"
  | "TeacherSimplifier"
  | "AudienceTranslator";

export type RoleHints = Record<RoleHint, 0 | 1 | 2>;

export type ContradictionTag =
  | "speed_vs_precision"
  | "autonomy_vs_guidance"
  | "creativity_vs_structure"
  | "critique_vs_support"
  | "brevity_vs_depth"
  | "adaptation_vs_stability";

export interface OptionRoute {
  questionId: string;
  optionId: string;
  optionAr: string;
  optionEn: string;
  behavioralSignal: string;
  instructionSections: InstructionSection[];
  reportSections: ReportSection[];
  strength: "primary" | "secondary";
  questionWeight: number;
  optionStrengthWeight: 1.0 | 0.6 | 0.3;
  inspireAllocation: InspireAllocation;
  roleHints: RoleHints;
  contradictionTags: ContradictionTag[];
  confidenceEffect: -1 | 0 | 1;
  ruleTextAr: string;
  ruleTextEn: string;
  thinkingModeEffect: string;
  redLineEffect: string | null;
  riskGuard: string;
  acceptanceStatus: string;
}

export const OPTION_ROUTES: OptionRoute[] = [
  {
    "questionId": "S2_messy_task_help",
    "optionId": "organize_into_plan",
    "optionAr": "يرتب الفكرة ويحوّلها إلى خطة واضحة.",
    "optionEn": "It organizes the idea and turns it into a clear plan.",
    "behavioralSignal": "planning_from_messy_input",
    "instructionSections": [
      "mission_domain_context",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "domain_operating_mode",
      "recommended_usage_strategy",
      "ai_interaction_style"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.28,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 1,
    "ruleTextAr": "عندما تكون فكرة المستخدم غير مرتبة، رتّب الهدف والمسار والخطوات التالية قبل ا...",
    "ruleTextEn": "When the user's idea is messy, organize the goal, path, and next steps before...",
    "thinkingModeEffect": "Step-Back; Structured Planning",
    "redLineEffect": "Avoid messy output",
    "riskGuard": "Do not force a full plan for simple requests; activate this for unclear or mu...",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S2_messy_task_help",
    "optionId": "show_possible_directions",
    "optionAr": "يعرض أكثر من اتجاه ممكن قبل اختيار المسار.",
    "optionEn": "It shows more than one possible direction before choosing a path.",
    "behavioralSignal": "multi_path_exploration",
    "instructionSections": [
      "thinking_quality_modes",
      "output_rules",
      "dynamic_roles"
    ],
    "reportSections": [
      "domain_operating_mode",
      "recommended_usage_strategy",
      "starter_prompts"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.33,
      NormsBoundaries: 0,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 0,
    "ruleTextAr": "عند وجود أكثر من احتمال، اعرض اتجاهين أو ثلاثة مع الفرق بينها قبل ترجيح المسا...",
    "ruleTextEn": "When multiple directions are possible, present two or three paths with their ...",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": "Avoid single-path certainty too early",
    "riskGuard": "Do not overload the user with options when the request is already specific.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S2_messy_task_help",
    "optionId": "draft_first_refine",
    "optionAr": "ينتج نسخة أولية قابلة للتعديل بدل الكلام النظري.",
    "optionEn": "It produces a first editable version instead of theoretical talk.",
    "behavioralSignal": "draft_to_refine",
    "instructionSections": [
      "output_rules",
      "adaptation_loop",
      "dynamic_roles"
    ],
    "reportSections": [
      "recommended_usage_strategy",
      "starter_prompts",
      "ai_interaction_style"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.33,
      NormsBoundaries: 0,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0.1,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0.24
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision"],
    "confidenceEffect": 1,
    "ruleTextAr": "عندما يكون المطلوب قابلًا للتنفيذ، قدّم نسخة أولية قابلة للتعديل بدل الاكتفاء...",
    "ruleTextEn": "When the task is executable, produce a first editable version instead of only...",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "No theory without usable output",
    "riskGuard": "Make clear it is a first draft, not a final answer, when context is incomplete.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S2_messy_task_help",
    "optionId": "identify_gaps_before_build",
    "optionAr": "يكشف ما هو ناقص أو ضعيف قبل البناء عليها.",
    "optionEn": "It reveals what is missing or weak before building on it.",
    "behavioralSignal": "gap_weakness_detection",
    "instructionSections": [
      "thinking_quality_modes",
      "red_lines_failure_triggers",
      "dynamic_roles"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "ai_interaction_style",
      "behavioral_signal_map"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.33,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "قبل البناء على فكرة مهمة، اكشف النقاط الناقصة أو الضعيفة أو الافتراضات غير ال...",
    "ruleTextEn": "Before building on an important idea, identify missing parts, weak points, or...",
    "thinkingModeEffect": "Devil's Advocate; Self-Check",
    "redLineEffect": "Do not agree too quickly",
    "riskGuard": "Use critique constructively; do not turn every simple request into a harsh re...",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S2_messy_task_help",
    "optionId": "simplify_then_continue",
    "optionAr": "يبسط الفكرة حتى أفهمها ثم نكمل عليها.",
    "optionEn": "It simplifies the idea so I understand it, then we continue building.",
    "behavioralSignal": "simplify_for_understanding",
    "instructionSections": [
      "relationship_with_user",
      "output_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "recommended_usage_strategy",
      "behavioral_signal_map"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "إذا بدا أن الفكرة غير مفهومة بما يكفي، بسّطها أولًا ثم تابع البناء عليها خطوة...",
    "ruleTextEn": "If the idea is not clear enough, simplify it first, then continue building on...",
    "thinkingModeEffect": "Step-Back; Explanation",
    "redLineEffect": "Avoid jumping to execution before understanding",
    "riskGuard": "Do not over-explain when the user is clearly asking for execution only.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S3_idea_clarity_for_others",
    "optionId": "self_clarity_first",
    "optionAr": "أن أفهمها أنا بوضوح قبل أن أشرحها.",
    "optionEn": "That I understand it clearly myself before explaining it.",
    "behavioralSignal": "self_clarity_before_communication",
    "instructionSections": [
      "output_rules",
      "relationship_with_user",
      "mission_domain_context"
    ],
    "reportSections": [
      "ai_interaction_style",
      "recommended_usage_strategy",
      "behavioral_signal_map"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.28,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 1,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 2
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "ساعد المستخدم أولًا على توضيح الفكرة لنفسه قبل تحسينها لجمهور أو طرف آخر.",
    "ruleTextEn": "Help the user clarify the idea for themselves before optimizing it for anothe...",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": "Avoid audience polish before idea clarity",
    "riskGuard": "Do not assume public-facing output unless the task clearly requires it.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S3_idea_clarity_for_others",
    "optionId": "plain_language_no_assumed_expertise",
    "optionAr": "أن تُشرح بلغة بسيطة بدون افتراض خبرة مسبقة.",
    "optionEn": "That it is explained in simple language without assuming prior expertise.",
    "behavioralSignal": "plain_language_adaptation",
    "instructionSections": [
      "output_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "domain_operating_mode",
      "recommended_usage_strategy",
      "ai_interaction_style"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0,
      StyleTone: 0.2,
      PrecisionSelfCheck: 0.25,
      InternalEvaluation: 0.25,
      ResponseStructure: 0.3,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 1
    },
    "contradictionTags": ["brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند الشرح أو الصياغة، استخدم لغة بسيطة ولا تفترض خبرة مسبقة إلا إذا ذكر المست...",
    "ruleTextEn": "When explaining or drafting, use plain language and do not assume prior exper...",
    "thinkingModeEffect": "Audience Proxy",
    "redLineEffect": "Avoid jargon without need",
    "riskGuard": "For expert/technical tasks, keep necessary terms but explain them clearly.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S3_idea_clarity_for_others",
    "optionId": "relevance_to_other_person",
    "optionAr": "أن يعرف الطرف الآخر لماذا تهمه الفكرة.",
    "optionEn": "That the other person understands why the idea matters to them.",
    "behavioralSignal": "benefit_relevance_orientation",
    "instructionSections": [
      "mission_domain_context",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "domain_operating_mode",
      "recommended_usage_strategy",
      "behavioral_signal_map"
    ],
    "strength": "secondary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 0.6,
    "inspireAllocation": {
      IdentityRole: 0.28,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 1,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 2
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اربط الفكرة بمنفعتها أو أثرها على الشخص أو الجهة المعنية عندما يكون ذلك مهمًا.",
    "ruleTextEn": "Connect the idea to its benefit or impact for the relevant person or stakehol...",
    "thinkingModeEffect": "Audience Proxy; Practical Framing",
    "redLineEffect": "Avoid disconnected explanation",
    "riskGuard": "Use only when a stakeholder, reader, learner, client, or team is relevant.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S3_idea_clarity_for_others",
    "optionId": "structured_for_following",
    "optionAr": "أن تكون مرتبة بحيث يسهل تتبعها.",
    "optionEn": "That it is organized so it is easy to follow.",
    "behavioralSignal": "followable_structure",
    "instructionSections": [
      "output_rules",
      "core_behavior_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.25,
      StyleTone: 0.2,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.55,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure", "adaptation_vs_stability"],
    "confidenceEffect": 1,
    "ruleTextAr": "اجعل الأفكار أو النتائج مرتبة بتسلسل يسهل تتبعه، خاصة في الشرح أو القرار أو الخطة.",
    "ruleTextEn": "Make ideas or results organized in an easy-to-follow sequence, especially in explanations, decisions, or plans.",
    "thinkingModeEffect": "Structured Reasoning",
    "redLineEffect": "Avoid scattered output",
    "riskGuard": "Do not force heavy structure on very small direct answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "S3_idea_clarity_for_others",
    "optionId": "context_adaptive_style",
    "optionAr": "أن يتغير الأسلوب حسب الشخص أو الموقف.",
    "optionEn": "That the style changes depending on the person or situation.",
    "behavioralSignal": "context_adaptive_communication",
    "instructionSections": [
      "output_rules",
      "universal_quality_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "domain_operating_mode",
      "recommended_usage_strategy",
      "ai_interaction_style"
    ],
    "strength": "primary",
    "questionWeight": 1.5,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 2
    },
    "contradictionTags": ["speed_vs_precision", "creativity_vs_structure", "adaptation_vs_stability"],
    "confidenceEffect": 0,
    "ruleTextAr": "غيّر مستوى التفصيل واللغة حسب الشخص أو الموقف، واسأل عن السياق فقط عندما يؤثر ذلك على جودة المخرج.",
    "ruleTextEn": "Adapt detail level and language to the person or situation, and ask about context only when it affects output quality.",
    "thinkingModeEffect": "Audience Proxy; Context Check",
    "redLineEffect": "Avoid fixed-audience assumptions",
    "riskGuard": "Do not ask audience questions repeatedly; infer when safe and ask only when material.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q01_starting_orientation",
    "optionId": "beneficiary_oriented",
    "optionAr": "من سيستفيد من هذه الفكرة أو المهمة؟",
    "optionEn": "Who will benefit from this idea or task?",
    "behavioralSignal": "beneficiary_oriented",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 1,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اربط العمل بالمستفيدين أو المتأثرين عندما يكون ذلك مهمًا للهدف.",
    "ruleTextEn": "Connect work to beneficiaries or affected parties when that matters to the goal.",
    "thinkingModeEffect": "Audience Proxy",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q01_starting_orientation",
    "optionId": "outcome_oriented",
    "optionAr": "كيف يجب أن تبدو النتيجة النهائية؟",
    "optionEn": "What should the final outcome look like?",
    "behavioralSignal": "outcome_oriented",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 1,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "ابدأ المهام المهمة بتوضيح شكل النتيجة النهائية قبل التفاصيل.",
    "ruleTextEn": "Start important tasks by clarifying the intended outcome before details.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q01_starting_orientation",
    "optionId": "resource_oriented",
    "optionAr": "ما الموارد أو المعلومات المتاحة لدي؟",
    "optionEn": "What resources or information do I already have?",
    "behavioralSignal": "resource_oriented",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "راجع الموارد والقيود والمعلومات المتاحة قبل بناء الحل.",
    "ruleTextEn": "Review available resources, constraints, and inputs before building the solution.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q01_starting_orientation",
    "optionId": "action_oriented",
    "optionAr": "ما أول خطوة عملية يجب أن أبدأ بها؟",
    "optionEn": "What is the first practical step I should take?",
    "behavioralSignal": "action_oriented",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 1,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision"],
    "confidenceEffect": 1,
    "ruleTextAr": "حوّل الأفكار بسرعة إلى أول خطوة عملية قابلة للتنفيذ.",
    "ruleTextEn": "Translate ideas quickly into a first practical action.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q02_ambiguity_handling",
    "optionId": "iterative_action",
    "optionAr": "أبدأ بما هو واضح وأتعلم أثناء التنفيذ.",
    "optionEn": "I start with what is clear and learn while doing.",
    "behavioralSignal": "iterative_action",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision"],
    "confidenceEffect": 1,
    "ruleTextAr": "ابدأ بما هو واضح عندما لا تمنع الفجوات التقدم، ثم حسّن المسار تدريجيًا.",
    "ruleTextEn": "Start with what is clear when gaps do not block progress, then improve iteratively.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q02_ambiguity_handling",
    "optionId": "clarification_first",
    "optionAr": "أطلب توضيحًا قبل أن أبدأ.",
    "optionEn": "I ask for clarification before starting.",
    "behavioralSignal": "clarification_first",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "اسأل سؤالًا واحدًا عالي الأثر عندما تغيّر المعلومة الناقصة جودة الإجابة.",
    "ruleTextEn": "Ask one high-impact question when missing information would change answer quality.",
    "thinkingModeEffect": "Clarification Gate",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q02_ambiguity_handling",
    "optionId": "stakeholder_oriented",
    "optionAr": "أبحث عمّن يجب إشراكه أو سؤاله.",
    "optionEn": "I identify who should be involved or asked.",
    "behavioralSignal": "stakeholder_oriented",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 2
    },
    "contradictionTags": ["autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند وجود أطراف مؤثرة، حدد المسؤولين أو أصحاب القرار أو من يجب إشراكه.",
    "ruleTextEn": "When stakeholders matter, identify owners, decision-makers, or people to involve.",
    "thinkingModeEffect": "Scenario Simulation",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q02_ambiguity_handling",
    "optionId": "gap_mapping",
    "optionAr": "أكتب الأسئلة أو النقاط الناقصة أولًا.",
    "optionEn": "I write down the missing questions or information first.",
    "behavioralSignal": "gap_mapping",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "في المهام المعقدة، حدد الفجوات والافتراضات المفتوحة قبل الحل.",
    "ruleTextEn": "For complex tasks, identify gaps and open assumptions before solving.",
    "thinkingModeEffect": "Step-Back; Self-Check",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q03_unfamiliar_decision",
    "optionId": "intuition_tested",
    "optionAr": "أبدأ من تقديري الأولي ثم أختبره بسرعة.",
    "optionEn": "I start from my initial judgment, then test it quickly.",
    "behavioralSignal": "intuition_tested_decision",
    "instructionSections": [
      "thinking_quality_modes",
      "relationship_with_user",
      "universal_quality_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "حوّل الحدس الأولي إلى فرضية قابلة للاختبار بدل التعامل معه كحقيقة نهائية.",
    "ruleTextEn": "Turn initial intuition into a testable hypothesis instead of treating it as final truth.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q03_unfamiliar_decision",
    "optionId": "reference_seeking",
    "optionAr": "أبحث عن مرجع أو مثال موثوق.",
    "optionEn": "I look for a reliable reference or example.",
    "behavioralSignal": "reference_seeking",
    "instructionSections": [
      "thinking_quality_modes",
      "relationship_with_user",
      "universal_quality_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "استخدم أمثلة أو معايير أو مراجع موثوقة عند دخول مجال غير مألوف.",
    "ruleTextEn": "Use examples, standards, or reliable references when entering unfamiliar areas.",
    "thinkingModeEffect": "Verification",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q03_unfamiliar_decision",
    "optionId": "collaborative_decision",
    "optionAr": "أشارك القرار مع شخص آخر قبل الحسم.",
    "optionEn": "I discuss the decision with someone else before deciding.",
    "behavioralSignal": "collaborative_decision",
    "instructionSections": [
      "thinking_quality_modes",
      "relationship_with_user",
      "universal_quality_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance", "critique_vs_support"],
    "confidenceEffect": -1,
    "ruleTextAr": "اعرض وجهات نظر بديلة وتأثير القرار على الأطراف المعنية قبل الحسم.",
    "ruleTextEn": "Surface alternative viewpoints and stakeholder impact before deciding.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q03_unfamiliar_decision",
    "optionId": "evaluation_first",
    "optionAr": "أطلب وقتًا لتحليل الخيارات والمخاطر.",
    "optionEn": "I ask for time to analyze options and risks.",
    "behavioralSignal": "evaluation_first",
    "instructionSections": [
      "thinking_quality_modes",
      "relationship_with_user",
      "universal_quality_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision"],
    "confidenceEffect": 1,
    "ruleTextAr": "قارن الخيارات والمخاطر والمقايضات قبل التوصية في القرارات غير المألوفة.",
    "ruleTextEn": "Compare options, risks, and trade-offs before recommending in unfamiliar decisions.",
    "thinkingModeEffect": "Comparative Reasoning; Scenario Simulation",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q04_plan_failure",
    "optionId": "context_constraints",
    "optionAr": "أراجع الظروف التي أثرت على الخطة.",
    "optionEn": "I review the conditions that affected the plan.",
    "behavioralSignal": "context_constraint_review",
    "instructionSections": [
      "thinking_quality_modes",
      "adaptation_loop",
      "core_behavior_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.22
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 2,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "افحص الظروف والقيود الخارجية قبل الحكم على الخطة أو التنفيذ.",
    "ruleTextEn": "Check external conditions and constraints before judging the plan or execution.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q04_plan_failure",
    "optionId": "root_cause",
    "optionAr": "أعيد تحليل ما حدث لأفهم السبب.",
    "optionEn": "I re-analyze what happened to understand the cause.",
    "behavioralSignal": "root_cause_analysis",
    "instructionSections": [
      "thinking_quality_modes",
      "adaptation_loop",
      "core_behavior_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.22
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند فشل خطة، شخّص السبب الجذري لا العرض السطحي فقط.",
    "ruleTextEn": "When a plan fails, diagnose the root cause, not only the visible symptom.",
    "thinkingModeEffect": "Root Cause Analysis",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q04_plan_failure",
    "optionId": "second_opinion",
    "optionAr": "أطلب رأيًا أو دعمًا من شخص آخر.",
    "optionEn": "I ask someone else for input or support.",
    "behavioralSignal": "support_or_second_opinion",
    "instructionSections": [
      "thinking_quality_modes",
      "adaptation_loop",
      "core_behavior_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.22
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance", "critique_vs_support"],
    "confidenceEffect": -1,
    "ruleTextAr": "قدّم منظورًا ثانيًا أو اقترح من يجب استشارته عندما تكون الرؤية ناقصة.",
    "ruleTextEn": "Provide a second perspective or suggest who to consult when visibility is limited.",
    "thinkingModeEffect": "Collaborative Review",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q04_plan_failure",
    "optionId": "adaptive_pivot",
    "optionAr": "أغير الخطة بسرعة وأجرب مسارًا آخر.",
    "optionEn": "I quickly change the plan and try another path.",
    "behavioralSignal": "adaptive_pivot",
    "instructionSections": [
      "thinking_quality_modes",
      "adaptation_loop",
      "core_behavior_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.22
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "creativity_vs_structure", "adaptation_vs_stability"],
    "confidenceEffect": 1,
    "ruleTextAr": "اقترح مسارات بديلة بسرعة بعد الفشل دون إطالة التشخيص إذا كان الوقت مهمًا.",
    "ruleTextEn": "Suggest alternative routes quickly after failure without over-diagnosing when time matters.",
    "thinkingModeEffect": "Scenario Simulation",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q05_stalled_task",
    "optionId": "blocker_diagnosis",
    "optionAr": "أبحث عن السبب الذي جعلني أتوقف.",
    "optionEn": "I look for the reason I got stuck.",
    "behavioralSignal": "blocker_diagnosis",
    "instructionSections": [
      "output_rules",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "عند التعثر، شخّص هل المشكلة في الهدف، المعلومات، الترتيب، الثقة، أو التعقيد.",
    "ruleTextEn": "When stuck, diagnose whether the blocker is goal, information, sequence, confidence, or complexity.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q05_stalled_task",
    "optionId": "tool_method",
    "optionAr": "أبحث عن أداة أو طريقة تنظّم المشكلة.",
    "optionEn": "I look for a tool or method to organize the problem.",
    "behavioralSignal": "tool_method_oriented",
    "instructionSections": [
      "output_rules",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اقترح إطارًا أو قالبًا أو أداة تنظيمية عندما تكون المشكلة مبعثرة.",
    "ruleTextEn": "Suggest a framework, template, or organizing method when the problem is messy.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q05_stalled_task",
    "optionId": "sequencing",
    "optionAr": "أغير ترتيب المهام أو أبدأ من جزء أسهل.",
    "optionEn": "I change the order of tasks or start with an easier part.",
    "behavioralSignal": "sequencing_strategy",
    "instructionSections": [
      "output_rules",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 1,
    "ruleTextAr": "أعد ترتيب المهمة إلى أجزاء أصغر وابدأ من الجزء الأعلى أثرًا أو الأقل احتكاكًا.",
    "ruleTextEn": "Resequence the task into smaller parts and start with the highest-impact or lowest-friction part.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q05_stalled_task",
    "optionId": "external_feedback",
    "optionAr": "أطلب تقييمًا أو رأيًا خارجيًا.",
    "optionEn": "I ask for external assessment or feedback.",
    "behavioralSignal": "external_feedback_needed",
    "instructionSections": [
      "output_rules",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["critique_vs_support"],
    "confidenceEffect": -1,
    "ruleTextAr": "استخدم دور المراجع أو الطرف الثاني عندما يكون التعثر بسبب زاوية نظر محدودة.",
    "ruleTextEn": "Act as reviewer or second perspective when stuck due to limited viewpoint.",
    "thinkingModeEffect": "Devil's Advocate",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q06_success_clarity",
    "optionId": "success_criteria",
    "optionAr": "معرفة شروط النجاح بوضوح.",
    "optionEn": "Knowing the success criteria clearly.",
    "behavioralSignal": "success_criteria_needed",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 1,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "في المهام المهمة، وضّح شروط النجاح قبل إنتاج الحل النهائي.",
    "ruleTextEn": "For important tasks, clarify success criteria before producing the final answer.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q06_success_clarity",
    "optionId": "learn_by_doing",
    "optionAr": "البدء والتعلم أثناء التجربة.",
    "optionEn": "Starting and learning through the process.",
    "behavioralSignal": "learn_by_doing",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "ادعم العمل بالنسخ الأولية والتجربة والتحسين بدل انتظار اكتمال الصورة.",
    "ruleTextEn": "Support drafts, experiments, and improvement instead of waiting for perfect clarity.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q06_success_clarity",
    "optionId": "multi_path",
    "optionAr": "تجربة أكثر من طريقة قبل اختيار واحدة.",
    "optionEn": "Trying more than one approach before choosing.",
    "behavioralSignal": "multi_path_exploration",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 1,
      CriticalReviewer: 0,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 0,
    "ruleTextAr": "اعرض أكثر من مسار عندما يكون الاختيار غير واضح قبل تثبيت اتجاه واحد.",
    "ruleTextEn": "Offer multiple paths when the choice is unclear before locking into one.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q06_success_clarity",
    "optionId": "goal_beneficiary",
    "optionAr": "فهم الهدف أو المستفيد من المهمة.",
    "optionEn": "Understanding the goal or who benefits from the task.",
    "behavioralSignal": "goal_beneficiary_alignment",
    "instructionSections": [
      "core_behavior_rules",
      "mission_domain_context",
      "output_rules"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.17,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.37,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اربط المهمة بالهدف أو المستفيد عندما يؤثر ذلك على جودة القرار أو الصياغة.",
    "ruleTextEn": "Connect the task to goal or beneficiary when it affects decision or wording quality.",
    "thinkingModeEffect": "Audience Proxy",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q07_learning_style",
    "optionId": "demo_learning",
    "optionAr": "مثال عملي أو عرض مباشر للفكرة.",
    "optionEn": "A practical example or demonstration of the idea.",
    "behavioralSignal": "demonstration_learning",
    "instructionSections": [
      "output_rules",
      "relationship_with_user",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": ["brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "استخدم أمثلة أو عروض عملية قبل التجريد عندما يكون المفهوم جديدًا.",
    "ruleTextEn": "Use examples or demonstrations before abstraction when the concept is new.",
    "thinkingModeEffect": "Audience Proxy",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q07_learning_style",
    "optionId": "analytical_learning",
    "optionAr": "شرح منظم وتحليل خطوة بخطوة.",
    "optionEn": "A structured explanation and step-by-step analysis.",
    "behavioralSignal": "analytical_learning",
    "instructionSections": [
      "output_rules",
      "relationship_with_user",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": ["brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "اشرح المفاهيم المعقدة عبر خطوات منظمة وملخص منطق واضح.",
    "ruleTextEn": "Explain complex concepts through organized steps and a clear reasoning summary.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q07_learning_style",
    "optionId": "interactive_learning",
    "optionAr": "نقاش أو أسئلة تفاعلية.",
    "optionEn": "Discussion or interactive questions.",
    "behavioralSignal": "interactive_learning",
    "instructionSections": [
      "output_rules",
      "relationship_with_user",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": ["brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "استخدم أسئلة تفاعلية قصيرة عندما يكون الهدف التعلم أو بناء الفهم.",
    "ruleTextEn": "Use short interactive questions when the goal is learning or understanding.",
    "thinkingModeEffect": "Socratic",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q07_learning_style",
    "optionId": "practice_learning",
    "optionAr": "تطبيق عملي أو تمرين صغير.",
    "optionEn": "A practical application or small exercise.",
    "behavioralSignal": "practice_based_learning",
    "instructionSections": [
      "output_rules",
      "relationship_with_user",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": ["brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "أضف تمرينًا أو تطبيقًا صغيرًا عندما يكون التعلم أفضل بالتجربة.",
    "ruleTextEn": "Add a small exercise or application when learning is better through practice.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q08_new_challenge",
    "optionId": "precedent",
    "optionAr": "أبحث عن حالات أو تجارب مشابهة.",
    "optionEn": "I look for similar cases or previous examples.",
    "behavioralSignal": "precedent_seeking",
    "instructionSections": [
      "thinking_quality_modes",
      "assistant_identity",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "عند موضوع جديد، استخدم حالات مشابهة أو أمثلة سابقة لتقليل الغموض.",
    "ruleTextEn": "For new topics, use comparable cases or precedents to reduce ambiguity.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q08_new_challenge",
    "optionId": "experiment",
    "optionAr": "أجرب طريقة أولية وأتعلم من النتيجة.",
    "optionEn": "I try an initial approach and learn from the result.",
    "behavioralSignal": "experiment_first",
    "instructionSections": [
      "thinking_quality_modes",
      "assistant_identity",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "اقترح تجربة صغيرة آمنة قبل الالتزام الكامل عندما يكون الطريق غير واضح.",
    "ruleTextEn": "Suggest a small safe experiment before full commitment when the path is unclear.",
    "thinkingModeEffect": "Scenario Simulation",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q08_new_challenge",
    "optionId": "expert_guidance",
    "optionAr": "أطلب توجيهًا ممن لديه خبرة.",
    "optionEn": "I ask for guidance from someone with experience.",
    "behavioralSignal": "expert_guidance_needed",
    "instructionSections": [
      "thinking_quality_modes",
      "assistant_identity",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "تصرّف كمرشد خبير واذكر المعايير التي يستخدمها أهل الخبرة في هذا السياق.",
    "ruleTextEn": "Act as an experienced guide and name expert criteria relevant to the context.",
    "thinkingModeEffect": "Expert Lens",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q08_new_challenge",
    "optionId": "risk_first",
    "optionAr": "أقيّم المخاطر قبل أن أبدأ.",
    "optionEn": "I assess the risks before starting.",
    "behavioralSignal": "risk_first",
    "instructionSections": [
      "thinking_quality_modes",
      "assistant_identity",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "ابدأ بمسح المخاطر والافتراضات قبل اقتراح خطة في التحديات الجديدة.",
    "ruleTextEn": "Start with risk and assumption scan before proposing a plan for new challenges.",
    "thinkingModeEffect": "Scenario Simulation; Self-Check",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q09_repeating_problems",
    "optionId": "root_pattern",
    "optionAr": "أبحث عن السبب المشترك وراء التكرار.",
    "optionEn": "I look for the common cause behind the repetition.",
    "behavioralSignal": "root_pattern_detection",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند تكرار مشكلة، ابحث عن النمط والسبب المشترك قبل اقتراح حل جديد.",
    "ruleTextEn": "When a problem repeats, identify the pattern and common cause before suggesting a new fix.",
    "thinkingModeEffect": "Root Cause Analysis",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q09_repeating_problems",
    "optionId": "collaborative_review",
    "optionAr": "أناقش المشكلة مع من له علاقة بها.",
    "optionEn": "I discuss the issue with the people involved.",
    "behavioralSignal": "collaborative_pattern_review",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند المشكلات المتكررة، افحص التواصل والأدوار والاعتماديات بين الأطراف.",
    "ruleTextEn": "For repeated problems, examine communication, roles, and dependencies among involved parties.",
    "thinkingModeEffect": "Scenario Simulation",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q09_repeating_problems",
    "optionId": "alternative_search",
    "optionAr": "أجرب طريقة مختلفة بدل تكرار نفس الحل.",
    "optionEn": "I try a different approach instead of repeating the same solution.",
    "behavioralSignal": "alternative_solution_search",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 1,
    "ruleTextAr": "إذا فشل نفس الحل أكثر من مرة، اقترح بدائل مختلفة لا تكرارًا محسّنًا فقط.",
    "ruleTextEn": "If the same fix fails repeatedly, propose different alternatives rather than only a refined repeat.",
    "thinkingModeEffect": "Devil's Advocate",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q09_repeating_problems",
    "optionId": "documentation_prevention",
    "optionAr": "أوثق الأسباب وما حدث حتى لا يتكرر.",
    "optionEn": "I document the causes and what happened so it does not repeat.",
    "behavioralSignal": "documentation_prevention",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["critique_vs_support", "adaptation_vs_stability"],
    "confidenceEffect": 1,
    "ruleTextAr": "حوّل المشاكل المتكررة إلى قواعد منع أو قوائم تحقق أو ملاحظات توثيقية.",
    "ruleTextEn": "Turn repeated issues into prevention rules, checklists, or documentation notes.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q10_disagreement",
    "optionId": "consensus",
    "optionAr": "أبحث عن حل يرضي الأطراف قدر الإمكان.",
    "optionEn": "I look for a solution that satisfies the involved sides as much as possible.",
    "behavioralSignal": "consensus_oriented",
    "instructionSections": [
      "relationship_with_user",
      "dynamic_roles",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 2
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "عند وجود خلاف، اقترح خيارات تحفظ أكبر قدر من القبول دون التضحية بالهدف.",
    "ruleTextEn": "When disagreement exists, suggest options that preserve alignment without sacrificing the goal.",
    "thinkingModeEffect": "Stakeholder Lens",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q10_disagreement",
    "optionId": "outcome_priority",
    "optionAr": "أركز على مصلحة العمل والنتيجة المطلوبة.",
    "optionEn": "I focus on the work interest and required outcome.",
    "behavioralSignal": "outcome_priority",
    "instructionSections": [
      "relationship_with_user",
      "dynamic_roles",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اجعل الهدف وأثر القرار معيار الحسم عندما تتعارض الآراء.",
    "ruleTextEn": "Use the goal and decision impact as the deciding standard when opinions conflict.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q10_disagreement",
    "optionId": "conflict_analysis",
    "optionAr": "أحلل سبب الخلاف قبل اقتراح حل.",
    "optionEn": "I analyze the reason for the disagreement before suggesting a solution.",
    "behavioralSignal": "conflict_analysis",
    "instructionSections": [
      "relationship_with_user",
      "dynamic_roles",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "شخّص سبب الخلاف: معلومات، مصالح، أدوار، مخاطر، أو سوء فهم قبل الحل.",
    "ruleTextEn": "Diagnose the disagreement source—information, incentives, roles, risks, or misunderstanding—before solving.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q10_disagreement",
    "optionId": "delay_clarity",
    "optionAr": "أؤجل النقاش حتى تتضح الصورة أكثر.",
    "optionEn": "I delay the discussion until the situation becomes clearer.",
    "behavioralSignal": "delay_until_clarity",
    "instructionSections": [
      "relationship_with_user",
      "dynamic_roles",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.44,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": -1,
    "ruleTextAr": "حدد ما يجب أن يتضح قبل دفع المستخدم لاتخاذ قرار أو نقاش نهائي.",
    "ruleTextEn": "Identify what must become clearer before pushing a final decision or discussion.",
    "thinkingModeEffect": "Clarification Gate",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q11_tasks_piling",
    "optionId": "schedule",
    "optionAr": "أرتب جدولًا أو خطة زمنية.",
    "optionEn": "I create a schedule or time plan.",
    "behavioralSignal": "scheduling_needed",
    "instructionSections": [
      "output_rules",
      "core_behavior_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.36,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "عند تراكم المهام، اقترح جدولًا أو خطة زمنية واقعية بدل نصائح عامة.",
    "ruleTextEn": "When tasks pile up, suggest a realistic schedule or timeline instead of generic advice.",
    "thinkingModeEffect": "Scenario Simulation",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q11_tasks_piling",
    "optionId": "priority",
    "optionAr": "أبدأ بالأهم أو الأعلى أثرًا.",
    "optionEn": "I start with the most important or highest-impact task.",
    "behavioralSignal": "priority_first",
    "instructionSections": [
      "output_rules",
      "core_behavior_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.36,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "رتب المهام حسب الأثر والأولوية وحدد أول إجراء عالي القيمة.",
    "ruleTextEn": "Prioritize by impact and importance and identify the highest-value first action.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q11_tasks_piling",
    "optionId": "delegate",
    "optionAr": "أطلب دعمًا أو أوزع بعض المهام.",
    "optionEn": "I ask for support or distribute some tasks.",
    "behavioralSignal": "support_delegation",
    "instructionSections": [
      "output_rules",
      "core_behavior_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.36,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance", "critique_vs_support"],
    "confidenceEffect": -1,
    "ruleTextAr": "عندما يكون الحمل كبيرًا، اقترح توزيع أدوار أو طلب دعم إذا كان ذلك واقعيًا.",
    "ruleTextEn": "When workload is high, suggest role splitting or support if realistic.",
    "thinkingModeEffect": "Stakeholder Lens",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q11_tasks_piling",
    "optionId": "efficiency_tool",
    "optionAr": "أبحث عن طريقة أو أداة تسرّع الإنجاز.",
    "optionEn": "I look for a method or tool that speeds up execution.",
    "behavioralSignal": "efficiency_tooling",
    "instructionSections": [
      "output_rules",
      "core_behavior_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.17,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.36,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision"],
    "confidenceEffect": 1,
    "ruleTextAr": "اقترح قوالب أو أدوات أو اختصارات عملية لتقليل الاحتكاك وزيادة الإنجاز.",
    "ruleTextEn": "Suggest templates, tools, or shortcuts to reduce friction and increase execution.",
    "thinkingModeEffect": "Efficiency Mode",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q12_postponing",
    "optionId": "focus_energy",
    "optionAr": "لا أكون مركزًا أو لا أجد طاقة كافية للبدء.",
    "optionEn": "I am not focused or do not have enough energy to start.",
    "behavioralSignal": "focus_energy_blocker",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.44,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0.01
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "خفّض عتبة البدء باقتراح خطوة صغيرة جدًا عندما يكون التعثر بسبب الطاقة أو التركيز.",
    "ruleTextEn": "Lower the starting friction with a very small first step when focus or energy is the blocker.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q12_postponing",
    "optionId": "unclear_requirements",
    "optionAr": "المطلوب غير واضح بما يكفي.",
    "optionEn": "The requirements are not clear enough.",
    "behavioralSignal": "unclear_requirements_blocker",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.44,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0.01
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": -1,
    "ruleTextAr": "وضّح المتطلبات وشروط النجاح قبل اقتراح التنفيذ عندما يكون الغموض سبب التأجيل.",
    "ruleTextEn": "Clarify requirements and success criteria before execution when ambiguity causes delay.",
    "thinkingModeEffect": "Clarification Gate",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q12_postponing",
    "optionId": "bad_sequence",
    "optionAr": "الخطة أو ترتيب الخطوات غير مضبوط.",
    "optionEn": "The plan or sequence of steps is not well organized.",
    "behavioralSignal": "planning_sequence_blocker",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.44,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0.01
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 1,
    "ruleTextAr": "أعد ترتيب الخطوات وحدد المسار الأبسط عندما يكون التسلسل سبب التعطيل.",
    "ruleTextEn": "Resequence steps and identify the simplest path when sequence causes blockage.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q12_postponing",
    "optionId": "coordination",
    "optionAr": "أحتاج تنسيقًا أو تواصلًا مع طرف آخر.",
    "optionEn": "I need coordination or communication with someone else.",
    "behavioralSignal": "coordination_blocker",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.44,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0.01
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": -1,
    "ruleTextAr": "حدد الاعتماديات والرسائل أو الأشخاص المطلوب التواصل معهم قبل دفع التنفيذ.",
    "ruleTextEn": "Identify dependencies, messages, or people to contact before pushing execution.",
    "thinkingModeEffect": "Stakeholder Lens",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q13_completion_review",
    "optionId": "result_review",
    "optionAr": "أراجع النتائج وما تحقق فعليًا.",
    "optionEn": "I review the results and what was actually achieved.",
    "behavioralSignal": "result_review",
    "instructionSections": [
      "adaptation_loop",
      "core_behavior_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0.1,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "بعد المخرجات المهمة، ساعد في مراجعة النتيجة مقارنة بالهدف الأصلي.",
    "ruleTextEn": "After important outputs, help review the result against the original goal.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q13_completion_review",
    "optionId": "share_feedback",
    "optionAr": "أشارك الإنجاز أو أطلب رأيًا حوله.",
    "optionEn": "I share the achievement or ask for feedback on it.",
    "behavioralSignal": "feedback_sharing",
    "instructionSections": [
      "adaptation_loop",
      "core_behavior_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0.1,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 2
    },
    "contradictionTags": ["critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "ساعد في إعداد ملخص قابل للمشاركة أو أسئلة للحصول على تغذية راجعة مفيدة.",
    "ruleTextEn": "Help prepare a shareable summary or questions for useful feedback.",
    "thinkingModeEffect": "Audience Proxy",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q13_completion_review",
    "optionId": "forward_planning",
    "optionAr": "أبدأ التفكير في الخطوة أو المشروع التالي.",
    "optionEn": "I start thinking about the next step or project.",
    "behavioralSignal": "forward_planning",
    "instructionSections": [
      "adaptation_loop",
      "core_behavior_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0.1,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 2,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["creativity_vs_structure"],
    "confidenceEffect": 1,
    "ruleTextAr": "بعد إنجاز مهم، اقترح الخطوة التالية أو مسار التحسين إذا كان مناسبًا.",
    "ruleTextEn": "After major completion, suggest a next step or improvement path when appropriate.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q13_completion_review",
    "optionId": "recovery",
    "optionAr": "أرتاح قليلًا قبل المراجعة أو الانتقال لما بعده.",
    "optionEn": "I take a short break before reviewing or moving on.",
    "behavioralSignal": "recovery_before_review",
    "instructionSections": [
      "adaptation_loop",
      "core_behavior_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0,
      InternalEvaluation: 0.1,
      ResponseStructure: 0.17,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "لا تدفع المستخدم دائمًا للخطوة التالية بعد الإنجاز؛ اعرض المراجعة عندما يكون جاهزًا.",
    "ruleTextEn": "Do not always push the next step after completion; offer review when the user is ready.",
    "thinkingModeEffect": "Pacing Guard",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q14_error_feedback",
    "optionId": "detail_verify",
    "optionAr": "أراجع التفاصيل لأتأكد من الخطأ.",
    "optionEn": "I review the details to verify the error.",
    "behavioralSignal": "detail_verification",
    "instructionSections": [
      "red_lines_failure_triggers",
      "adaptation_loop",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند التصحيح، اعرض موضع الخطأ أو أساس الملاحظة بدل إطلاق حكم عام.",
    "ruleTextEn": "When correcting, show where the issue appears or the basis of the feedback instead of a broad judgment.",
    "thinkingModeEffect": "Verification",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q14_error_feedback",
    "optionId": "rationale_context",
    "optionAr": "أشرح سبب اختياري أو طريقتي.",
    "optionEn": "I explain the reason behind my choice or approach.",
    "behavioralSignal": "rationale_context_needed",
    "instructionSections": [
      "red_lines_failure_triggers",
      "adaptation_loop",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "اعترف بمنطق المستخدم قبل نقده، ثم بيّن أين يحتاج المنطق إلى تعديل.",
    "ruleTextEn": "Acknowledge the user's rationale before challenging it, then show where it needs adjustment.",
    "thinkingModeEffect": "Devil's Advocate",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q14_error_feedback",
    "optionId": "fix_oriented",
    "optionAr": "أبحث عن حل عملي لإصلاحه.",
    "optionEn": "I look for a practical way to fix it.",
    "behavioralSignal": "fix_oriented",
    "instructionSections": [
      "red_lines_failure_triggers",
      "adaptation_loop",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اقرن النقد بإصلاح عملي واضح بدل الاكتفاء بتحديد المشكلة.",
    "ruleTextEn": "Pair critique with a clear practical fix instead of only identifying the problem.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q14_error_feedback",
    "optionId": "prevention",
    "optionAr": "أركز على منع تكراره لاحقًا.",
    "optionEn": "I focus on preventing it from happening again.",
    "behavioralSignal": "prevention_oriented",
    "instructionSections": [
      "red_lines_failure_triggers",
      "adaptation_loop",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["critique_vs_support", "adaptation_vs_stability"],
    "confidenceEffect": 1,
    "ruleTextAr": "بعد الأخطاء المهمة، اقترح قاعدة منع أو قائمة تحقق لتجنب تكرارها.",
    "ruleTextEn": "After important errors, suggest a prevention rule or checklist to avoid recurrence.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q15_repeated_no_progress",
    "optionId": "under_root",
    "optionAr": "أبحث عن السبب الجذري وراء التعثر.",
    "optionEn": "I look for the root cause behind the lack of progress.",
    "behavioralSignal": "root_cause_underperformance",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند ضعف التقدم المتكرر، شخّص السبب الجذري بدل زيادة الجهد فقط.",
    "ruleTextEn": "When progress repeatedly stalls, diagnose the root cause instead of only increasing effort.",
    "thinkingModeEffect": "Root Cause Analysis",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q15_repeated_no_progress",
    "optionId": "support_perspective",
    "optionAr": "أطلب دعمًا أو رأيًا من شخص آخر.",
    "optionEn": "I ask for support or another perspective.",
    "behavioralSignal": "support_perspective_needed",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance", "critique_vs_support"],
    "confidenceEffect": -1,
    "ruleTextAr": "قدّم منظورًا خارجيًا داعمًا عندما يتكرر التعثر ولا تكفي المحاولة الفردية.",
    "ruleTextEn": "Provide a supportive outside perspective when repeated struggle cannot be solved by individual effort alone.",
    "thinkingModeEffect": "Collaborative Review",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q15_repeated_no_progress",
    "optionId": "change_plan",
    "optionAr": "أضع خطة تغيير واضحة.",
    "optionEn": "I create a clear change plan.",
    "behavioralSignal": "change_plan_needed",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "حوّل التعثر المتكرر إلى خطة تغيير صغيرة مع نقطة مراجعة واضحة.",
    "ruleTextEn": "Turn repeated lack of progress into a small change plan with a clear checkpoint.",
    "thinkingModeEffect": "Scenario Simulation",
    "redLineEffect": null,
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "Q15_repeated_no_progress",
    "optionId": "learn_examples",
    "optionAr": "أبحث عن أمثلة مشابهة لأتعلم منها.",
    "optionEn": "I look for similar examples to learn from.",
    "behavioralSignal": "learn_from_examples",
    "instructionSections": [
      "adaptation_loop",
      "thinking_quality_modes",
      "relationship_with_user"
    ],
    "reportSections": [
      "ai_interaction_style",
      "behavioral_signal_map",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 3,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.11,
      StyleTone: 0.11,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.27,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.23
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 2,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "استخدم أمثلة مشابهة أو حالات مقارنة لفهم مسار أفضل عند ضعف التقدم.",
    "ruleTextEn": "Use comparable examples or cases to find a better path when progress is weak.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": "Avoid generic, premature, or surface-level behavior.",
    "riskGuard": "Apply conditionally; do not force heavy structure on simple requests.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI01_correct_unusable",
    "optionId": "no_context",
    "optionAr": "لا يربط الجواب بسياقي أو هدفي الحالي.",
    "optionEn": "It does not connect the answer to my current context or goal.",
    "behavioralSignal": "ai_context_connection_needed",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 2,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "اربط الإجابات المهمة بسياق المستخدم وهدفه الحالي بدل تقديم جواب عام.",
    "ruleTextEn": "Connect important answers to the user's current context and goal instead of giving generic responses.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": "No generic answers",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI01_correct_unusable",
    "optionId": "not_practical",
    "optionAr": "لا يحوّل الفكرة إلى شيء عملي يمكنني استخدامه.",
    "optionEn": "It does not turn the idea into something practical I can use.",
    "behavioralSignal": "ai_practicality_needed",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "حوّل الأفكار والتحليلات إلى خطوات أو أمثلة أو مسودة قابلة للاستخدام.",
    "ruleTextEn": "Turn ideas and analysis into steps, examples, or usable drafts.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "No theory without application",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI01_correct_unusable",
    "optionId": "no_gap",
    "optionAr": "لا يوضح لي أين قد تكون المشكلة أو النقص.",
    "optionEn": "It does not show where the issue, weakness, or missing part might be.",
    "behavioralSignal": "ai_gap_detection_needed",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "عند مراجعة فكرة أو خطة، اكشف النقص أو الضعف قبل التحسين.",
    "ruleTextEn": "When reviewing an idea or plan, expose missing parts or weaknesses before improving.",
    "thinkingModeEffect": "Devil's Advocate",
    "redLineEffect": "No blind agreement",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI01_correct_unusable",
    "optionId": "no_quality_check",
    "optionAr": "لا يعطيني طريقة أتأكد بها من جودة الجواب.",
    "optionEn": "It does not give me a way to judge whether the answer is good enough.",
    "behavioralSignal": "ai_quality_check_needed",
    "instructionSections": [
      "red_lines_failure_triggers",
      "output_rules",
      "thinking_quality_modes"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.33,
      StyleTone: 0.13,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0.17,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "critique_vs_support"],
    "confidenceEffect": 1,
    "ruleTextAr": "في المخرجات المهمة، أضف معيار جودة أو فحصًا مختصرًا يساعد على تقييم الجواب.",
    "ruleTextEn": "For important outputs, add a quality criterion or short check to evaluate the answer.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": "No unsupported confidence",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI02_incomplete_request",
    "optionId": "ask_one",
    "optionAr": "يسألني سؤالًا واحدًا عن أهم نقطة ناقصة.",
    "optionEn": "It asks me one question about the most important missing point.",
    "behavioralSignal": "one_key_clarification",
    "instructionSections": [
      "universal_quality_rules",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["autonomy_vs_guidance"],
    "confidenceEffect": 1,
    "ruleTextAr": "اسأل سؤالًا واحدًا فقط عندما تكون المعلومة الناقصة مؤثرة فعلًا.",
    "ruleTextEn": "Ask only one question when the missing detail materially affects the result.",
    "thinkingModeEffect": "Clarification Gate",
    "redLineEffect": "No clarification loops",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI02_incomplete_request",
    "optionId": "assume_start",
    "optionAr": "يذكر ما فهمه وما افترضه ثم يبدأ.",
    "optionEn": "It states what it understood and assumed, then starts.",
    "behavioralSignal": "assumption_then_action",
    "instructionSections": [
      "universal_quality_rules",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "autonomy_vs_guidance"],
    "confidenceEffect": 0,
    "ruleTextAr": "اذكر الفهم والافتراضات باختصار ثم تابع عندما يكون التقدم ممكنًا.",
    "ruleTextEn": "Briefly state understanding and assumptions, then proceed when progress is possible.",
    "thinkingModeEffect": "Step-Back",
    "redLineEffect": "No hidden assumptions",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI02_incomplete_request",
    "optionId": "conditional_paths",
    "optionAr": "يعطيني مسارين أو ثلاثة حسب الاحتمالات الممكنة.",
    "optionEn": "It gives me two or three possible paths based on likely interpretations.",
    "behavioralSignal": "conditional_paths",
    "instructionSections": [
      "universal_quality_rules",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 1,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 2,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 0,
    "ruleTextAr": "عندما تقود الاحتمالات إلى إجابات مختلفة، قدم مسارين أو ثلاثة مع فرق واضح.",
    "ruleTextEn": "When possible interpretations lead to different answers, present two or three paths with clear differences.",
    "thinkingModeEffect": "Comparative Reasoning",
    "redLineEffect": "No forced single answer under uncertainty",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI02_incomplete_request",
    "optionId": "draft_refine",
    "optionAr": "يبدأ بمسودة أولية ثم يوضح ما الذي يحتاجه لتحسينها.",
    "optionEn": "It starts with a first draft, then explains what it needs to improve it.",
    "behavioralSignal": "draft_then_refine",
    "instructionSections": [
      "universal_quality_rules",
      "output_rules",
      "relationship_with_user"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0.11,
      NormsBoundaries: 0.28,
      StyleTone: 0.24,
      PrecisionSelfCheck: 0.17,
      InternalEvaluation: 0,
      ResponseStructure: 0.2,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 2,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 1,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision"],
    "confidenceEffect": 1,
    "ruleTextAr": "قدّم نسخة أولى قابلة للتعديل عندما يكفي السياق، ثم اطلب ما يحسنها.",
    "ruleTextEn": "Provide a first editable version when context is enough, then ask what would improve it.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "No paralysis from missing context",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI03_repeated_ai_mistake",
    "optionId": "local_only",
    "optionAr": "يلتزم بتصحيحي داخل نفس المحادثة فقط.",
    "optionEn": "It applies my correction within the same conversation only.",
    "behavioralSignal": "correction_local_only",
    "instructionSections": [
      "adaptation_loop",
      "universal_quality_rules"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.25,
      StyleTone: 0,
      PrecisionSelfCheck: 0.25,
      InternalEvaluation: 0.15,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.35
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["adaptation_vs_stability"],
    "confidenceEffect": 1,
    "ruleTextAr": "طبّق التصحيح داخل المحادثة الحالية دون اعتباره قاعدة دائمة إلا إذا طلب المستخدم ذلك.",
    "ruleTextEn": "Apply corrections in the current conversation without treating them as permanent unless asked.",
    "thinkingModeEffect": "Adaptation Guard",
    "redLineEffect": "No over-personalization",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI03_repeated_ai_mistake",
    "optionId": "auto_adjust",
    "optionAr": "يلاحظ النمط ويعدّل أسلوبه تلقائيًا.",
    "optionEn": "It notices the pattern and adjusts its style automatically.",
    "behavioralSignal": "automatic_style_adjustment",
    "instructionSections": [
      "adaptation_loop",
      "universal_quality_rules"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.25,
      StyleTone: 0,
      PrecisionSelfCheck: 0.25,
      InternalEvaluation: 0.15,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.35
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["adaptation_vs_stability"],
    "confidenceEffect": 0,
    "ruleTextAr": "إذا تكررت نفس الملاحظة، عدّل الأسلوب في الردود اللاحقة دون الحاجة لتكرار التنبيه.",
    "ruleTextEn": "If the same correction repeats, adjust future responses without requiring repeated reminders.",
    "thinkingModeEffect": "Iterative Improvement",
    "redLineEffect": "No repeated mistake",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI03_repeated_ai_mistake",
    "optionId": "suggest_rule",
    "optionAr": "يخبرني أنه لاحظ التكرار ويقترح قاعدة جديدة.",
    "optionEn": "It tells me it noticed the pattern and suggests a new rule.",
    "behavioralSignal": "suggest_rule_update",
    "instructionSections": [
      "adaptation_loop",
      "universal_quality_rules"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.25,
      StyleTone: 0,
      PrecisionSelfCheck: 0.25,
      InternalEvaluation: 0.15,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.35
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["adaptation_vs_stability"],
    "confidenceEffect": 0,
    "ruleTextAr": "عند تكرار تصحيح مهم، اقترح قاعدة مختصرة يمكن إضافتها للتعليمات.",
    "ruleTextEn": "When an important correction repeats, suggest a concise rule that can be added to the instructions.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": "No silent pattern loss",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI03_repeated_ai_mistake",
    "optionId": "confirm_permanent",
    "optionAr": "يسألني قبل أن يعتبر التصحيح قاعدة دائمة.",
    "optionEn": "It asks me before treating the correction as a permanent rule.",
    "behavioralSignal": "confirm_persistent_change",
    "instructionSections": [
      "adaptation_loop",
      "universal_quality_rules"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.25,
      StyleTone: 0,
      PrecisionSelfCheck: 0.25,
      InternalEvaluation: 0.15,
      ResponseStructure: 0,
      EnhancementAdaptation: 0.35
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 0,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["adaptation_vs_stability"],
    "confidenceEffect": 0,
    "ruleTextAr": "استأذن قبل تحويل التصحيح المتكرر إلى قاعدة دائمة في أسلوب العمل.",
    "ruleTextEn": "Ask before converting repeated correction into a standing operating rule.",
    "thinkingModeEffect": "Adaptation Guard",
    "redLineEffect": "No unwanted permanent changes",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI04_trust_verification",
    "optionId": "simple_limits",
    "optionAr": "أن يوضح الفكرة ببساطة ويذكر حدودها.",
    "optionEn": "It explains the idea simply and mentions its limits.",
    "behavioralSignal": "simple_with_limits",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.5,
      StyleTone: 0,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 1,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "في المعلومات المهمة، اشرح ببساطة واذكر حدود المعرفة أو حدود الجواب.",
    "ruleTextEn": "For important information, explain simply and mention knowledge or answer limits.",
    "thinkingModeEffect": "Verification",
    "redLineEffect": "No overclaiming",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI04_trust_verification",
    "optionId": "fact_inference_reco",
    "optionAr": "أن يميز بين الحقيقة والاستنتاج والتوصية.",
    "optionEn": "It distinguishes fact, inference, and recommendation.",
    "behavioralSignal": "fact_inference_recommendation_split",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.5,
      StyleTone: 0,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 1,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": [],
    "confidenceEffect": 1,
    "ruleTextAr": "ميّز بوضوح بين الحقيقة والاستنتاج والتوصية عندما تكون الإجابة مؤثرة.",
    "ruleTextEn": "Clearly distinguish fact, inference, and recommendation when the answer matters.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": "No mixing claims",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI04_trust_verification",
    "optionId": "source_needed",
    "optionAr": "أن يذكر مصدرًا أو ينبهني أن الموضوع يحتاج تحققًا.",
    "optionEn": "It cites a source or warns me when verification is needed.",
    "behavioralSignal": "source_or_verification_needed",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.5,
      StyleTone: 0,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "اذكر المصدر أو نبّه لضرورة التحقق عندما تكون المعلومة متغيرة أو عالية الأثر.",
    "ruleTextEn": "Cite a source or flag verification need when information is changing or high-impact.",
    "thinkingModeEffect": "Verification",
    "redLineEffect": "No unsupported claims",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  },
  {
    "questionId": "AI04_trust_verification",
    "optionId": "validation_criteria",
    "optionAr": "أن يعطيني معيارًا أستخدمه للحكم على جودة الجواب.",
    "optionEn": "It gives me a criterion to judge whether the answer is good enough.",
    "behavioralSignal": "validation_criteria_needed",
    "instructionSections": [
      "universal_quality_rules",
      "thinking_quality_modes",
      "red_lines_failure_triggers"
    ],
    "reportSections": [
      "red_lines_failure_triggers",
      "recommended_usage_strategy",
      "full_copy_ready_instruction"
    ],
    "strength": "primary",
    "questionWeight": 2,
    "optionStrengthWeight": 1.0,
    "inspireAllocation": {
      IdentityRole: 0,
      NormsBoundaries: 0.5,
      StyleTone: 0,
      PrecisionSelfCheck: 0.33,
      InternalEvaluation: 0.17,
      ResponseStructure: 0,
      EnhancementAdaptation: 0
    },
    "roleHints": {
      ExecutorBuilder: 0,
      StrategicOrganizer: 0,
      CriticalReviewer: 2,
      ThinkingPartner: 0,
      TeacherSimplifier: 0,
      AudienceTranslator: 0
    },
    "contradictionTags": ["speed_vs_precision", "brevity_vs_depth"],
    "confidenceEffect": 1,
    "ruleTextAr": "أضف معيار تقييم أو فحص قبول مختصر للمخرجات المهمة.",
    "ruleTextEn": "Add a brief evaluation criterion or acceptance check for important outputs.",
    "thinkingModeEffect": "Self-Check",
    "redLineEffect": "No untestable output",
    "riskGuard": "Use only when the task is meaningful; avoid overcomplicating simple answers.",
    "acceptanceStatus": "Pass"
  }
];

// ─── Lookup helper ────────────────────────────────────────────────────────────

const _routeIndex = new Map<string, OptionRoute>();
for (const route of OPTION_ROUTES) {
  _routeIndex.set(`${route.questionId}::${route.optionId}`, route);
}

export function getOptionRoute(questionId: string, optionId: string): OptionRoute | undefined {
  return _routeIndex.get(`${questionId}::${optionId}`);
}

export const VALID_OPTION_IDS_BY_QUESTION = (() => {
  const map = new Map<string, Set<string>>();
  for (const route of OPTION_ROUTES) {
    if (!map.has(route.questionId)) map.set(route.questionId, new Set());
    map.get(route.questionId)!.add(route.optionId);
  }
  return map;
})();
