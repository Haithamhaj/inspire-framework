# INSPIRE v2 Questions, Answer Options, and Matrix Routing

Source: artifacts/api-server/src/data/questions-v2.ts
Matrix source: artifacts/api-server/src/data/option-routing.ts

Total questions: 21
Total matrix routes: 86

## 1. S2_messy_task_help

Block: Setup / Behavioral Bridge
Selection mode: single
Display condition: Always

Arabic question: عندما تأتي للذكاء الاصطناعي بفكرة أو مهمة غير مرتبة، أي نوع من المساعدة يجعلك تتقدم فعلًا؟
English question: When you bring AI a messy idea or unfinished task, what kind of help actually moves you forward?

Answers / Options:

1. organize_into_plan
   - AR: يرتب الفكرة ويحوّلها إلى خطة واضحة.
   - EN: It organizes the idea and turns it into a clear plan.
   - Matrix:
     - behavioralSignal: planning_from_messy_input
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: mission_domain_context, output_rules, relationship_with_user
     - reportSections: domain_operating_mode, recommended_usage_strategy, ai_interaction_style
     - inspireAllocation: IdentityRole=0.28, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back; Structured Planning
     - redLineEffect: Avoid messy output
     - riskGuard: Do not force a full plan for simple requests; activate this for unclear or mu...
     - ruleTextAr: عندما تكون فكرة المستخدم غير مرتبة، رتّب الهدف والمسار والخطوات التالية قبل ا...
     - ruleTextEn: When the user's idea is messy, organize the goal, path, and next steps before...
     - acceptanceStatus: Pass
2. show_possible_directions
   - AR: يعرض أكثر من اتجاه ممكن قبل اختيار المسار.
   - EN: It shows more than one possible direction before choosing a path.
   - Matrix:
     - behavioralSignal: multi_path_exploration
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, output_rules, dynamic_roles
     - reportSections: domain_operating_mode, recommended_usage_strategy, starter_prompts
     - inspireAllocation: IdentityRole=0.33, NormsBoundaries=0, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 0
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: Avoid single-path certainty too early
     - riskGuard: Do not overload the user with options when the request is already specific.
     - ruleTextAr: عند وجود أكثر من احتمال، اعرض اتجاهين أو ثلاثة مع الفرق بينها قبل ترجيح المسا...
     - ruleTextEn: When multiple directions are possible, present two or three paths with their ...
     - acceptanceStatus: Pass
3. draft_first_refine
   - AR: ينتج نسخة أولية قابلة للتعديل بدل الكلام النظري.
   - EN: It produces a first editable version instead of theoretical talk.
   - Matrix:
     - behavioralSignal: draft_to_refine
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: output_rules, adaptation_loop, dynamic_roles
     - reportSections: recommended_usage_strategy, starter_prompts, ai_interaction_style
     - inspireAllocation: IdentityRole=0.33, NormsBoundaries=0, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0.1, ResponseStructure=0.2, EnhancementAdaptation=0.24
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: No theory without usable output
     - riskGuard: Make clear it is a first draft, not a final answer, when context is incomplete.
     - ruleTextAr: عندما يكون المطلوب قابلًا للتنفيذ، قدّم نسخة أولية قابلة للتعديل بدل الاكتفاء...
     - ruleTextEn: When the task is executable, produce a first editable version instead of only...
     - acceptanceStatus: Pass
4. identify_gaps_before_build
   - AR: يكشف ما هو ناقص أو ضعيف قبل البناء عليها.
   - EN: It reveals what is missing or weak before building on it.
   - Matrix:
     - behavioralSignal: gap_weakness_detection
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, red_lines_failure_triggers, dynamic_roles
     - reportSections: red_lines_failure_triggers, ai_interaction_style, behavioral_signal_map
     - inspireAllocation: IdentityRole=0.33, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Devil's Advocate; Self-Check
     - redLineEffect: Do not agree too quickly
     - riskGuard: Use critique constructively; do not turn every simple request into a harsh re...
     - ruleTextAr: قبل البناء على فكرة مهمة، اكشف النقاط الناقصة أو الضعيفة أو الافتراضات غير ال...
     - ruleTextEn: Before building on an important idea, identify missing parts, weak points, or...
     - acceptanceStatus: Pass
5. simplify_then_continue
   - AR: يبسط الفكرة حتى أفهمها ثم نكمل عليها.
   - EN: It simplifies the idea so I understand it, then we continue building.
   - Matrix:
     - behavioralSignal: simplify_for_understanding
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: relationship_with_user, output_rules, thinking_quality_modes
     - reportSections: ai_interaction_style, recommended_usage_strategy, behavioral_signal_map
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back; Explanation
     - redLineEffect: Avoid jumping to execution before understanding
     - riskGuard: Do not over-explain when the user is clearly asking for execution only.
     - ruleTextAr: إذا بدا أن الفكرة غير مفهومة بما يكفي، بسّطها أولًا ثم تابع البناء عليها خطوة...
     - ruleTextEn: If the idea is not clear enough, simplify it first, then continue building on...
     - acceptanceStatus: Pass

## 2. S3_idea_clarity_for_others

Block: Setup / Behavioral Bridge
Selection mode: single
Display condition: Always

Arabic question: عندما تحتاج أن تجعل فكرة أو نتيجة مفهومة لشخص آخر، ما الذي تنتبه له أولًا؟
English question: When you need to make an idea or result understandable to someone else, what do you pay attention to first?

Answers / Options:

1. self_clarity_first
   - AR: أن أفهمها أنا بوضوح قبل أن أشرحها.
   - EN: That I understand it clearly myself before explaining it.
   - Matrix:
     - behavioralSignal: self_clarity_before_communication
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: output_rules, relationship_with_user, mission_domain_context
     - reportSections: ai_interaction_style, recommended_usage_strategy, behavioral_signal_map
     - inspireAllocation: IdentityRole=0.28, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=1, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=2
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: Avoid audience polish before idea clarity
     - riskGuard: Do not assume public-facing output unless the task clearly requires it.
     - ruleTextAr: ساعد المستخدم أولًا على توضيح الفكرة لنفسه قبل تحسينها لجمهور أو طرف آخر.
     - ruleTextEn: Help the user clarify the idea for themselves before optimizing it for anothe...
     - acceptanceStatus: Pass
2. plain_language_no_assumed_expertise
   - AR: أن تُشرح بلغة بسيطة بدون افتراض خبرة مسبقة.
   - EN: That it is explained in simple language without assuming prior expertise.
   - Matrix:
     - behavioralSignal: plain_language_adaptation
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: output_rules, thinking_quality_modes
     - reportSections: domain_operating_mode, recommended_usage_strategy, ai_interaction_style
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0, StyleTone=0.2, PrecisionSelfCheck=0.25, InternalEvaluation=0.25, ResponseStructure=0.3, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=1
     - contradictionTags: brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Audience Proxy
     - redLineEffect: Avoid jargon without need
     - riskGuard: For expert/technical tasks, keep necessary terms but explain them clearly.
     - ruleTextAr: عند الشرح أو الصياغة، استخدم لغة بسيطة ولا تفترض خبرة مسبقة إلا إذا ذكر المست...
     - ruleTextEn: When explaining or drafting, use plain language and do not assume prior exper...
     - acceptanceStatus: Pass
3. relevance_to_other_person
   - AR: أن يعرف الطرف الآخر لماذا تهمه الفكرة.
   - EN: That the other person understands why the idea matters to them.
   - Matrix:
     - behavioralSignal: benefit_relevance_orientation
     - strength: secondary
     - questionWeight: 1.5
     - optionStrengthWeight: 0.6
     - instructionSections: mission_domain_context, output_rules, relationship_with_user
     - reportSections: domain_operating_mode, recommended_usage_strategy, behavioral_signal_map
     - inspireAllocation: IdentityRole=0.28, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=1, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=2
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Audience Proxy; Practical Framing
     - redLineEffect: Avoid disconnected explanation
     - riskGuard: Use only when a stakeholder, reader, learner, client, or team is relevant.
     - ruleTextAr: اربط الفكرة بمنفعتها أو أثرها على الشخص أو الجهة المعنية عندما يكون ذلك مهمًا.
     - ruleTextEn: Connect the idea to its benefit or impact for the relevant person or stakehol...
     - acceptanceStatus: Pass
4. structured_for_following
   - AR: أن تكون مرتبة بحيث يسهل تتبعها.
   - EN: That it is organized so it is easy to follow.
   - Matrix:
     - behavioralSignal: followable_structure
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: output_rules, core_behavior_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.25, StyleTone=0.2, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.55, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure, adaptation_vs_stability
     - confidenceEffect: 1
     - thinkingModeEffect: Structured Reasoning
     - redLineEffect: Avoid scattered output
     - riskGuard: Do not force heavy structure on very small direct answers.
     - ruleTextAr: اجعل الأفكار أو النتائج مرتبة بتسلسل يسهل تتبعه، خاصة في الشرح أو القرار أو الخطة.
     - ruleTextEn: Make ideas or results organized in an easy-to-follow sequence, especially in explanations, decisions, or plans.
     - acceptanceStatus: Pass
5. context_adaptive_style
   - AR: أن يتغير الأسلوب حسب الشخص أو الموقف.
   - EN: That the style changes depending on the person or situation.
   - Matrix:
     - behavioralSignal: context_adaptive_communication
     - strength: primary
     - questionWeight: 1.5
     - optionStrengthWeight: 1
     - instructionSections: output_rules, universal_quality_rules, thinking_quality_modes
     - reportSections: domain_operating_mode, recommended_usage_strategy, ai_interaction_style
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=2
     - contradictionTags: speed_vs_precision, creativity_vs_structure, adaptation_vs_stability
     - confidenceEffect: 0
     - thinkingModeEffect: Audience Proxy; Context Check
     - redLineEffect: Avoid fixed-audience assumptions
     - riskGuard: Do not ask audience questions repeatedly; infer when safe and ask only when material.
     - ruleTextAr: غيّر مستوى التفصيل واللغة حسب الشخص أو الموقف، واسأل عن السياق فقط عندما يؤثر ذلك على جودة المخرج.
     - ruleTextEn: Adapt detail level and language to the person or situation, and ask about context only when it affects output quality.
     - acceptanceStatus: Pass

## 3. Q01_starting_orientation

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تبدأ فكرة أو مهمة جديدة، ما أول شيء يميل عقلك للتركيز عليه؟
English question: When you start a new idea or task, what does your mind usually focus on first?

Answers / Options:

1. beneficiary_oriented
   - AR: من سيستفيد من هذه الفكرة أو المهمة؟
   - EN: Who will benefit from this idea or task?
   - Matrix:
     - behavioralSignal: beneficiary_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=1, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Audience Proxy
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اربط العمل بالمستفيدين أو المتأثرين عندما يكون ذلك مهمًا للهدف.
     - ruleTextEn: Connect work to beneficiaries or affected parties when that matters to the goal.
     - acceptanceStatus: Pass
2. outcome_oriented
   - AR: كيف يجب أن تبدو النتيجة النهائية؟
   - EN: What should the final outcome look like?
   - Matrix:
     - behavioralSignal: outcome_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=1, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: ابدأ المهام المهمة بتوضيح شكل النتيجة النهائية قبل التفاصيل.
     - ruleTextEn: Start important tasks by clarifying the intended outcome before details.
     - acceptanceStatus: Pass
3. resource_oriented
   - AR: ما الموارد أو المعلومات المتاحة لدي؟
   - EN: What resources or information do I already have?
   - Matrix:
     - behavioralSignal: resource_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: راجع الموارد والقيود والمعلومات المتاحة قبل بناء الحل.
     - ruleTextEn: Review available resources, constraints, and inputs before building the solution.
     - acceptanceStatus: Pass
4. action_oriented
   - AR: ما أول خطوة عملية يجب أن أبدأ بها؟
   - EN: What is the first practical step I should take?
   - Matrix:
     - behavioralSignal: action_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=1, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: حوّل الأفكار بسرعة إلى أول خطوة عملية قابلة للتنفيذ.
     - ruleTextEn: Translate ideas quickly into a first practical action.
     - acceptanceStatus: Pass

## 4. Q02_ambiguity_handling

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: إذا بدأت مهمة جديدة والتفاصيل غير مكتملة، ما التصرف الأقرب لك عادةً؟
English question: If you start a new task and the details are incomplete, what do you usually do first?

Answers / Options:

1. iterative_action
   - AR: أبدأ بما هو واضح وأتعلم أثناء التنفيذ.
   - EN: I start with what is clear and learn while doing.
   - Matrix:
     - behavioralSignal: iterative_action
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: ابدأ بما هو واضح عندما لا تمنع الفجوات التقدم، ثم حسّن المسار تدريجيًا.
     - ruleTextEn: Start with what is clear when gaps do not block progress, then improve iteratively.
     - acceptanceStatus: Pass
2. clarification_first
   - AR: أطلب توضيحًا قبل أن أبدأ.
   - EN: I ask for clarification before starting.
   - Matrix:
     - behavioralSignal: clarification_first
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Clarification Gate
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اسأل سؤالًا واحدًا عالي الأثر عندما تغيّر المعلومة الناقصة جودة الإجابة.
     - ruleTextEn: Ask one high-impact question when missing information would change answer quality.
     - acceptanceStatus: Pass
3. stakeholder_oriented
   - AR: أبحث عمّن يجب إشراكه أو سؤاله.
   - EN: I identify who should be involved or asked.
   - Matrix:
     - behavioralSignal: stakeholder_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=2
     - contradictionTags: autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند وجود أطراف مؤثرة، حدد المسؤولين أو أصحاب القرار أو من يجب إشراكه.
     - ruleTextEn: When stakeholders matter, identify owners, decision-makers, or people to involve.
     - acceptanceStatus: Pass
4. gap_mapping
   - AR: أكتب الأسئلة أو النقاط الناقصة أولًا.
   - EN: I write down the missing questions or information first.
   - Matrix:
     - behavioralSignal: gap_mapping
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back; Self-Check
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: في المهام المعقدة، حدد الفجوات والافتراضات المفتوحة قبل الحل.
     - ruleTextEn: For complex tasks, identify gaps and open assumptions before solving.
     - acceptanceStatus: Pass

## 5. Q03_unfamiliar_decision

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: إذا احتجت لاتخاذ قرار في موضوع غير مألوف، ما التصرف الأقرب لك؟
English question: If you need to make a decision in an unfamiliar area, what do you usually do?

Answers / Options:

1. intuition_tested
   - AR: أبدأ من تقديري الأولي ثم أختبره بسرعة.
   - EN: I start from my initial judgment, then test it quickly.
   - Matrix:
     - behavioralSignal: intuition_tested_decision
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, relationship_with_user, universal_quality_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: حوّل الحدس الأولي إلى فرضية قابلة للاختبار بدل التعامل معه كحقيقة نهائية.
     - ruleTextEn: Turn initial intuition into a testable hypothesis instead of treating it as final truth.
     - acceptanceStatus: Pass
2. reference_seeking
   - AR: أبحث عن مرجع أو مثال موثوق.
   - EN: I look for a reliable reference or example.
   - Matrix:
     - behavioralSignal: reference_seeking
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, relationship_with_user, universal_quality_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Verification
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: استخدم أمثلة أو معايير أو مراجع موثوقة عند دخول مجال غير مألوف.
     - ruleTextEn: Use examples, standards, or reliable references when entering unfamiliar areas.
     - acceptanceStatus: Pass
3. collaborative_decision
   - AR: أشارك القرار مع شخص آخر قبل الحسم.
   - EN: I discuss the decision with someone else before deciding.
   - Matrix:
     - behavioralSignal: collaborative_decision
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, relationship_with_user, universal_quality_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance, critique_vs_support
     - confidenceEffect: -1
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اعرض وجهات نظر بديلة وتأثير القرار على الأطراف المعنية قبل الحسم.
     - ruleTextEn: Surface alternative viewpoints and stakeholder impact before deciding.
     - acceptanceStatus: Pass
4. evaluation_first
   - AR: أطلب وقتًا لتحليل الخيارات والمخاطر.
   - EN: I ask for time to analyze options and risks.
   - Matrix:
     - behavioralSignal: evaluation_first
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, relationship_with_user, universal_quality_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision
     - confidenceEffect: 1
     - thinkingModeEffect: Comparative Reasoning; Scenario Simulation
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: قارن الخيارات والمخاطر والمقايضات قبل التوصية في القرارات غير المألوفة.
     - ruleTextEn: Compare options, risks, and trade-offs before recommending in unfamiliar decisions.
     - acceptanceStatus: Pass

## 6. Q04_plan_failure

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: إذا فشلت خطة كنت واثقًا منها، ما أول ما تميل لفعله؟
English question: If a plan you trusted fails, what do you tend to do first?

Answers / Options:

1. context_constraints
   - AR: أراجع الظروف التي أثرت على الخطة.
   - EN: I review the conditions that affected the plan.
   - Matrix:
     - behavioralSignal: context_constraint_review
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, adaptation_loop, core_behavior_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0.17, EnhancementAdaptation=0.22
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=2, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: افحص الظروف والقيود الخارجية قبل الحكم على الخطة أو التنفيذ.
     - ruleTextEn: Check external conditions and constraints before judging the plan or execution.
     - acceptanceStatus: Pass
2. root_cause
   - AR: أعيد تحليل ما حدث لأفهم السبب.
   - EN: I re-analyze what happened to understand the cause.
   - Matrix:
     - behavioralSignal: root_cause_analysis
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, adaptation_loop, core_behavior_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0.17, EnhancementAdaptation=0.22
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Root Cause Analysis
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند فشل خطة، شخّص السبب الجذري لا العرض السطحي فقط.
     - ruleTextEn: When a plan fails, diagnose the root cause, not only the visible symptom.
     - acceptanceStatus: Pass
3. second_opinion
   - AR: أطلب رأيًا أو دعمًا من شخص آخر.
   - EN: I ask someone else for input or support.
   - Matrix:
     - behavioralSignal: support_or_second_opinion
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, adaptation_loop, core_behavior_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0.17, EnhancementAdaptation=0.22
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance, critique_vs_support
     - confidenceEffect: -1
     - thinkingModeEffect: Collaborative Review
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: قدّم منظورًا ثانيًا أو اقترح من يجب استشارته عندما تكون الرؤية ناقصة.
     - ruleTextEn: Provide a second perspective or suggest who to consult when visibility is limited.
     - acceptanceStatus: Pass
4. adaptive_pivot
   - AR: أغير الخطة بسرعة وأجرب مسارًا آخر.
   - EN: I quickly change the plan and try another path.
   - Matrix:
     - behavioralSignal: adaptive_pivot
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, adaptation_loop, core_behavior_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0.17, EnhancementAdaptation=0.22
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, creativity_vs_structure, adaptation_vs_stability
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اقترح مسارات بديلة بسرعة بعد الفشل دون إطالة التشخيص إذا كان الوقت مهمًا.
     - ruleTextEn: Suggest alternative routes quickly after failure without over-diagnosing when time matters.
     - acceptanceStatus: Pass

## 7. Q05_stalled_task

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تتوقف في مهمة معقدة ولا تعرف كيف تكمل، ما الذي تفعله غالبًا؟
English question: When you get stuck in a complex task and do not know how to continue, what do you usually do?

Answers / Options:

1. blocker_diagnosis
   - AR: أبحث عن السبب الذي جعلني أتوقف.
   - EN: I look for the reason I got stuck.
   - Matrix:
     - behavioralSignal: blocker_diagnosis
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند التعثر، شخّص هل المشكلة في الهدف، المعلومات، الترتيب، الثقة، أو التعقيد.
     - ruleTextEn: When stuck, diagnose whether the blocker is goal, information, sequence, confidence, or complexity.
     - acceptanceStatus: Pass
2. tool_method
   - AR: أبحث عن أداة أو طريقة تنظّم المشكلة.
   - EN: I look for a tool or method to organize the problem.
   - Matrix:
     - behavioralSignal: tool_method_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اقترح إطارًا أو قالبًا أو أداة تنظيمية عندما تكون المشكلة مبعثرة.
     - ruleTextEn: Suggest a framework, template, or organizing method when the problem is messy.
     - acceptanceStatus: Pass
3. sequencing
   - AR: أغير ترتيب المهام أو أبدأ من جزء أسهل.
   - EN: I change the order of tasks or start with an easier part.
   - Matrix:
     - behavioralSignal: sequencing_strategy
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: أعد ترتيب المهمة إلى أجزاء أصغر وابدأ من الجزء الأعلى أثرًا أو الأقل احتكاكًا.
     - ruleTextEn: Resequence the task into smaller parts and start with the highest-impact or lowest-friction part.
     - acceptanceStatus: Pass
4. external_feedback
   - AR: أطلب تقييمًا أو رأيًا خارجيًا.
   - EN: I ask for external assessment or feedback.
   - Matrix:
     - behavioralSignal: external_feedback_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: critique_vs_support
     - confidenceEffect: -1
     - thinkingModeEffect: Devil's Advocate
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: استخدم دور المراجع أو الطرف الثاني عندما يكون التعثر بسبب زاوية نظر محدودة.
     - ruleTextEn: Act as reviewer or second perspective when stuck due to limited viewpoint.
     - acceptanceStatus: Pass

## 8. Q06_success_clarity

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: قبل أن تبدأ مهمة جديدة، ما الذي تحتاجه أكثر حتى تشعر أنك تسير في الاتجاه الصحيح؟
English question: Before starting a new task, what do you need most to feel you are moving in the right direction?

Answers / Options:

1. success_criteria
   - AR: معرفة شروط النجاح بوضوح.
   - EN: Knowing the success criteria clearly.
   - Matrix:
     - behavioralSignal: success_criteria_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=1, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: في المهام المهمة، وضّح شروط النجاح قبل إنتاج الحل النهائي.
     - ruleTextEn: For important tasks, clarify success criteria before producing the final answer.
     - acceptanceStatus: Pass
2. learn_by_doing
   - AR: البدء والتعلم أثناء التجربة.
   - EN: Starting and learning through the process.
   - Matrix:
     - behavioralSignal: learn_by_doing
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: ادعم العمل بالنسخ الأولية والتجربة والتحسين بدل انتظار اكتمال الصورة.
     - ruleTextEn: Support drafts, experiments, and improvement instead of waiting for perfect clarity.
     - acceptanceStatus: Pass
3. multi_path
   - AR: تجربة أكثر من طريقة قبل اختيار واحدة.
   - EN: Trying more than one approach before choosing.
   - Matrix:
     - behavioralSignal: multi_path_exploration
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=1, CriticalReviewer=0, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 0
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اعرض أكثر من مسار عندما يكون الاختيار غير واضح قبل تثبيت اتجاه واحد.
     - ruleTextEn: Offer multiple paths when the choice is unclear before locking into one.
     - acceptanceStatus: Pass
4. goal_beneficiary
   - AR: فهم الهدف أو المستفيد من المهمة.
   - EN: Understanding the goal or who benefits from the task.
   - Matrix:
     - behavioralSignal: goal_beneficiary_alignment
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: core_behavior_rules, mission_domain_context, output_rules
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.17, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.37, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Audience Proxy
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اربط المهمة بالهدف أو المستفيد عندما يؤثر ذلك على جودة القرار أو الصياغة.
     - ruleTextEn: Connect the task to goal or beneficiary when it affects decision or wording quality.
     - acceptanceStatus: Pass

## 9. Q07_learning_style

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تريد فهم شيء جديد، ما الطريقة التي تساعدك أكثر؟
English question: When you want to understand something new, what helps you most?

Answers / Options:

1. demo_learning
   - AR: مثال عملي أو عرض مباشر للفكرة.
   - EN: A practical example or demonstration of the idea.
   - Matrix:
     - behavioralSignal: demonstration_learning
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, relationship_with_user, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Audience Proxy
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: استخدم أمثلة أو عروض عملية قبل التجريد عندما يكون المفهوم جديدًا.
     - ruleTextEn: Use examples or demonstrations before abstraction when the concept is new.
     - acceptanceStatus: Pass
2. analytical_learning
   - AR: شرح منظم وتحليل خطوة بخطوة.
   - EN: A structured explanation and step-by-step analysis.
   - Matrix:
     - behavioralSignal: analytical_learning
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, relationship_with_user, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اشرح المفاهيم المعقدة عبر خطوات منظمة وملخص منطق واضح.
     - ruleTextEn: Explain complex concepts through organized steps and a clear reasoning summary.
     - acceptanceStatus: Pass
3. interactive_learning
   - AR: نقاش أو أسئلة تفاعلية.
   - EN: Discussion or interactive questions.
   - Matrix:
     - behavioralSignal: interactive_learning
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, relationship_with_user, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Socratic
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: استخدم أسئلة تفاعلية قصيرة عندما يكون الهدف التعلم أو بناء الفهم.
     - ruleTextEn: Use short interactive questions when the goal is learning or understanding.
     - acceptanceStatus: Pass
4. practice_learning
   - AR: تطبيق عملي أو تمرين صغير.
   - EN: A practical application or small exercise.
   - Matrix:
     - behavioralSignal: practice_based_learning
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, relationship_with_user, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: أضف تمرينًا أو تطبيقًا صغيرًا عندما يكون التعلم أفضل بالتجربة.
     - ruleTextEn: Add a small exercise or application when learning is better through practice.
     - acceptanceStatus: Pass

## 10. Q08_new_challenge

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تواجه تحديًا جديدًا لا تملك عنه خبرة كافية، ما أول ما تميل لفعله؟
English question: When you face a new challenge you do not have enough experience with, what do you tend to do first?

Answers / Options:

1. precedent
   - AR: أبحث عن حالات أو تجارب مشابهة.
   - EN: I look for similar cases or previous examples.
   - Matrix:
     - behavioralSignal: precedent_seeking
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, assistant_identity, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند موضوع جديد، استخدم حالات مشابهة أو أمثلة سابقة لتقليل الغموض.
     - ruleTextEn: For new topics, use comparable cases or precedents to reduce ambiguity.
     - acceptanceStatus: Pass
2. experiment
   - AR: أجرب طريقة أولية وأتعلم من النتيجة.
   - EN: I try an initial approach and learn from the result.
   - Matrix:
     - behavioralSignal: experiment_first
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, assistant_identity, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اقترح تجربة صغيرة آمنة قبل الالتزام الكامل عندما يكون الطريق غير واضح.
     - ruleTextEn: Suggest a small safe experiment before full commitment when the path is unclear.
     - acceptanceStatus: Pass
3. expert_guidance
   - AR: أطلب توجيهًا ممن لديه خبرة.
   - EN: I ask for guidance from someone with experience.
   - Matrix:
     - behavioralSignal: expert_guidance_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, assistant_identity, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Expert Lens
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: تصرّف كمرشد خبير واذكر المعايير التي يستخدمها أهل الخبرة في هذا السياق.
     - ruleTextEn: Act as an experienced guide and name expert criteria relevant to the context.
     - acceptanceStatus: Pass
4. risk_first
   - AR: أقيّم المخاطر قبل أن أبدأ.
   - EN: I assess the risks before starting.
   - Matrix:
     - behavioralSignal: risk_first
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: thinking_quality_modes, assistant_identity, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation; Self-Check
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: ابدأ بمسح المخاطر والافتراضات قبل اقتراح خطة في التحديات الجديدة.
     - ruleTextEn: Start with risk and assumption scan before proposing a plan for new challenges.
     - acceptanceStatus: Pass

## 11. Q09_repeating_problems

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تتكرر نفس المشكلة أكثر من مرة، ما أول ما تفعله عادةً؟
English question: When the same problem repeats more than once, what do you usually do first?

Answers / Options:

1. root_pattern
   - AR: أبحث عن السبب المشترك وراء التكرار.
   - EN: I look for the common cause behind the repetition.
   - Matrix:
     - behavioralSignal: root_pattern_detection
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Root Cause Analysis
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند تكرار مشكلة، ابحث عن النمط والسبب المشترك قبل اقتراح حل جديد.
     - ruleTextEn: When a problem repeats, identify the pattern and common cause before suggesting a new fix.
     - acceptanceStatus: Pass
2. collaborative_review
   - AR: أناقش المشكلة مع من له علاقة بها.
   - EN: I discuss the issue with the people involved.
   - Matrix:
     - behavioralSignal: collaborative_pattern_review
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند المشكلات المتكررة، افحص التواصل والأدوار والاعتماديات بين الأطراف.
     - ruleTextEn: For repeated problems, examine communication, roles, and dependencies among involved parties.
     - acceptanceStatus: Pass
3. alternative_search
   - AR: أجرب طريقة مختلفة بدل تكرار نفس الحل.
   - EN: I try a different approach instead of repeating the same solution.
   - Matrix:
     - behavioralSignal: alternative_solution_search
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 1
     - thinkingModeEffect: Devil's Advocate
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: إذا فشل نفس الحل أكثر من مرة، اقترح بدائل مختلفة لا تكرارًا محسّنًا فقط.
     - ruleTextEn: If the same fix fails repeatedly, propose different alternatives rather than only a refined repeat.
     - acceptanceStatus: Pass
4. documentation_prevention
   - AR: أوثق الأسباب وما حدث حتى لا يتكرر.
   - EN: I document the causes and what happened so it does not repeat.
   - Matrix:
     - behavioralSignal: documentation_prevention
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: critique_vs_support, adaptation_vs_stability
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: حوّل المشاكل المتكررة إلى قواعد منع أو قوائم تحقق أو ملاحظات توثيقية.
     - ruleTextEn: Turn repeated issues into prevention rules, checklists, or documentation notes.
     - acceptanceStatus: Pass

## 12. Q10_disagreement

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما يظهر خلاف حول طريقة تنفيذ عمل أو قرار، ما التصرف الأقرب لك؟
English question: When there is disagreement about how to execute work or make a decision, what do you usually do?

Answers / Options:

1. consensus
   - AR: أبحث عن حل يرضي الأطراف قدر الإمكان.
   - EN: I look for a solution that satisfies the involved sides as much as possible.
   - Matrix:
     - behavioralSignal: consensus_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: relationship_with_user, dynamic_roles, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=2
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Stakeholder Lens
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند وجود خلاف، اقترح خيارات تحفظ أكبر قدر من القبول دون التضحية بالهدف.
     - ruleTextEn: When disagreement exists, suggest options that preserve alignment without sacrificing the goal.
     - acceptanceStatus: Pass
2. outcome_priority
   - AR: أركز على مصلحة العمل والنتيجة المطلوبة.
   - EN: I focus on the work interest and required outcome.
   - Matrix:
     - behavioralSignal: outcome_priority
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: relationship_with_user, dynamic_roles, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اجعل الهدف وأثر القرار معيار الحسم عندما تتعارض الآراء.
     - ruleTextEn: Use the goal and decision impact as the deciding standard when opinions conflict.
     - acceptanceStatus: Pass
3. conflict_analysis
   - AR: أحلل سبب الخلاف قبل اقتراح حل.
   - EN: I analyze the reason for the disagreement before suggesting a solution.
   - Matrix:
     - behavioralSignal: conflict_analysis
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: relationship_with_user, dynamic_roles, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: شخّص سبب الخلاف: معلومات، مصالح، أدوار، مخاطر، أو سوء فهم قبل الحل.
     - ruleTextEn: Diagnose the disagreement source—information, incentives, roles, risks, or misunderstanding—before solving.
     - acceptanceStatus: Pass
4. delay_clarity
   - AR: أؤجل النقاش حتى تتضح الصورة أكثر.
   - EN: I delay the discussion until the situation becomes clearer.
   - Matrix:
     - behavioralSignal: delay_until_clarity
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: relationship_with_user, dynamic_roles, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.44, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: -1
     - thinkingModeEffect: Clarification Gate
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: حدد ما يجب أن يتضح قبل دفع المستخدم لاتخاذ قرار أو نقاش نهائي.
     - ruleTextEn: Identify what must become clearer before pushing a final decision or discussion.
     - acceptanceStatus: Pass

## 13. Q11_tasks_piling

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تتراكم عليك مهام كثيرة، ما التصرف الذي يساعدك أكثر؟
English question: When many tasks pile up, what helps you most?

Answers / Options:

1. schedule
   - AR: أرتب جدولًا أو خطة زمنية.
   - EN: I create a schedule or time plan.
   - Matrix:
     - behavioralSignal: scheduling_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, core_behavior_rules, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.36, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند تراكم المهام، اقترح جدولًا أو خطة زمنية واقعية بدل نصائح عامة.
     - ruleTextEn: When tasks pile up, suggest a realistic schedule or timeline instead of generic advice.
     - acceptanceStatus: Pass
2. priority
   - AR: أبدأ بالأهم أو الأعلى أثرًا.
   - EN: I start with the most important or highest-impact task.
   - Matrix:
     - behavioralSignal: priority_first
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, core_behavior_rules, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.36, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: رتب المهام حسب الأثر والأولوية وحدد أول إجراء عالي القيمة.
     - ruleTextEn: Prioritize by impact and importance and identify the highest-value first action.
     - acceptanceStatus: Pass
3. delegate
   - AR: أطلب دعمًا أو أوزع بعض المهام.
   - EN: I ask for support or distribute some tasks.
   - Matrix:
     - behavioralSignal: support_delegation
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, core_behavior_rules, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.36, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance, critique_vs_support
     - confidenceEffect: -1
     - thinkingModeEffect: Stakeholder Lens
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عندما يكون الحمل كبيرًا، اقترح توزيع أدوار أو طلب دعم إذا كان ذلك واقعيًا.
     - ruleTextEn: When workload is high, suggest role splitting or support if realistic.
     - acceptanceStatus: Pass
4. efficiency_tool
   - AR: أبحث عن طريقة أو أداة تسرّع الإنجاز.
   - EN: I look for a method or tool that speeds up execution.
   - Matrix:
     - behavioralSignal: efficiency_tooling
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: output_rules, core_behavior_rules, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.17, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.36, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision
     - confidenceEffect: 1
     - thinkingModeEffect: Efficiency Mode
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اقترح قوالب أو أدوات أو اختصارات عملية لتقليل الاحتكاك وزيادة الإنجاز.
     - ruleTextEn: Suggest templates, tools, or shortcuts to reduce friction and increase execution.
     - acceptanceStatus: Pass

## 14. Q12_postponing

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تؤجل مهمة أكثر من مرة، ما السبب الأقرب عادةً؟
English question: When you postpone a task more than once, what is usually the closest reason?

Answers / Options:

1. focus_energy
   - AR: لا أكون مركزًا أو لا أجد طاقة كافية للبدء.
   - EN: I am not focused or do not have enough energy to start.
   - Matrix:
     - behavioralSignal: focus_energy_blocker
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.44, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0.01
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: خفّض عتبة البدء باقتراح خطوة صغيرة جدًا عندما يكون التعثر بسبب الطاقة أو التركيز.
     - ruleTextEn: Lower the starting friction with a very small first step when focus or energy is the blocker.
     - acceptanceStatus: Pass
2. unclear_requirements
   - AR: المطلوب غير واضح بما يكفي.
   - EN: The requirements are not clear enough.
   - Matrix:
     - behavioralSignal: unclear_requirements_blocker
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.44, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0.01
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: -1
     - thinkingModeEffect: Clarification Gate
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: وضّح المتطلبات وشروط النجاح قبل اقتراح التنفيذ عندما يكون الغموض سبب التأجيل.
     - ruleTextEn: Clarify requirements and success criteria before execution when ambiguity causes delay.
     - acceptanceStatus: Pass
3. bad_sequence
   - AR: الخطة أو ترتيب الخطوات غير مضبوط.
   - EN: The plan or sequence of steps is not well organized.
   - Matrix:
     - behavioralSignal: planning_sequence_blocker
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.44, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0.01
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: أعد ترتيب الخطوات وحدد المسار الأبسط عندما يكون التسلسل سبب التعطيل.
     - ruleTextEn: Resequence steps and identify the simplest path when sequence causes blockage.
     - acceptanceStatus: Pass
4. coordination
   - AR: أحتاج تنسيقًا أو تواصلًا مع طرف آخر.
   - EN: I need coordination or communication with someone else.
   - Matrix:
     - behavioralSignal: coordination_blocker
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.44, StyleTone=0.24, PrecisionSelfCheck=0, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0.01
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: -1
     - thinkingModeEffect: Stakeholder Lens
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: حدد الاعتماديات والرسائل أو الأشخاص المطلوب التواصل معهم قبل دفع التنفيذ.
     - ruleTextEn: Identify dependencies, messages, or people to contact before pushing execution.
     - acceptanceStatus: Pass

## 15. Q13_completion_review

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: بعد إنهاء عمل أو مشروع مهم، ما أول شيء تميل لفعله؟
English question: After completing an important piece of work or project, what do you tend to do first?

Answers / Options:

1. result_review
   - AR: أراجع النتائج وما تحقق فعليًا.
   - EN: I review the results and what was actually achieved.
   - Matrix:
     - behavioralSignal: result_review
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, core_behavior_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0, InternalEvaluation=0.1, ResponseStructure=0.17, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: بعد المخرجات المهمة، ساعد في مراجعة النتيجة مقارنة بالهدف الأصلي.
     - ruleTextEn: After important outputs, help review the result against the original goal.
     - acceptanceStatus: Pass
2. share_feedback
   - AR: أشارك الإنجاز أو أطلب رأيًا حوله.
   - EN: I share the achievement or ask for feedback on it.
   - Matrix:
     - behavioralSignal: feedback_sharing
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, core_behavior_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0, InternalEvaluation=0.1, ResponseStructure=0.17, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=2
     - contradictionTags: critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Audience Proxy
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: ساعد في إعداد ملخص قابل للمشاركة أو أسئلة للحصول على تغذية راجعة مفيدة.
     - ruleTextEn: Help prepare a shareable summary or questions for useful feedback.
     - acceptanceStatus: Pass
3. forward_planning
   - AR: أبدأ التفكير في الخطوة أو المشروع التالي.
   - EN: I start thinking about the next step or project.
   - Matrix:
     - behavioralSignal: forward_planning
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, core_behavior_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0, InternalEvaluation=0.1, ResponseStructure=0.17, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=2, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: creativity_vs_structure
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: بعد إنجاز مهم، اقترح الخطوة التالية أو مسار التحسين إذا كان مناسبًا.
     - ruleTextEn: After major completion, suggest a next step or improvement path when appropriate.
     - acceptanceStatus: Pass
4. recovery
   - AR: أرتاح قليلًا قبل المراجعة أو الانتقال لما بعده.
   - EN: I take a short break before reviewing or moving on.
   - Matrix:
     - behavioralSignal: recovery_before_review
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, core_behavior_rules, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.11, PrecisionSelfCheck=0, InternalEvaluation=0.1, ResponseStructure=0.17, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Pacing Guard
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: لا تدفع المستخدم دائمًا للخطوة التالية بعد الإنجاز؛ اعرض المراجعة عندما يكون جاهزًا.
     - ruleTextEn: Do not always push the next step after completion; offer review when the user is ready.
     - acceptanceStatus: Pass

## 16. Q14_error_feedback

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما يلفت أحد انتباهك إلى خطأ في عملك، ما رد فعلك الأقرب؟
English question: When someone points out an error in your work, what is your closest reaction?

Answers / Options:

1. detail_verify
   - AR: أراجع التفاصيل لأتأكد من الخطأ.
   - EN: I review the details to verify the error.
   - Matrix:
     - behavioralSignal: detail_verification
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, adaptation_loop, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Verification
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند التصحيح، اعرض موضع الخطأ أو أساس الملاحظة بدل إطلاق حكم عام.
     - ruleTextEn: When correcting, show where the issue appears or the basis of the feedback instead of a broad judgment.
     - acceptanceStatus: Pass
2. rationale_context
   - AR: أشرح سبب اختياري أو طريقتي.
   - EN: I explain the reason behind my choice or approach.
   - Matrix:
     - behavioralSignal: rationale_context_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, adaptation_loop, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Devil's Advocate
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اعترف بمنطق المستخدم قبل نقده، ثم بيّن أين يحتاج المنطق إلى تعديل.
     - ruleTextEn: Acknowledge the user's rationale before challenging it, then show where it needs adjustment.
     - acceptanceStatus: Pass
3. fix_oriented
   - AR: أبحث عن حل عملي لإصلاحه.
   - EN: I look for a practical way to fix it.
   - Matrix:
     - behavioralSignal: fix_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, adaptation_loop, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: اقرن النقد بإصلاح عملي واضح بدل الاكتفاء بتحديد المشكلة.
     - ruleTextEn: Pair critique with a clear practical fix instead of only identifying the problem.
     - acceptanceStatus: Pass
4. prevention
   - AR: أركز على منع تكراره لاحقًا.
   - EN: I focus on preventing it from happening again.
   - Matrix:
     - behavioralSignal: prevention_oriented
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, adaptation_loop, thinking_quality_modes
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: critique_vs_support, adaptation_vs_stability
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: بعد الأخطاء المهمة، اقترح قاعدة منع أو قائمة تحقق لتجنب تكرارها.
     - ruleTextEn: After important errors, suggest a prevention rule or checklist to avoid recurrence.
     - acceptanceStatus: Pass

## 17. Q15_repeated_no_progress

Block: Behavioral Backbone
Selection mode: single
Display condition: Always

Arabic question: عندما تشعر أن محاولاتك لا تحقق التقدم المطلوب أكثر من مرة، ما التصرف الأقرب لك؟
English question: When you feel that your attempts are not making the progress you expected more than once, what do you usually do?

Answers / Options:

1. under_root
   - AR: أبحث عن السبب الجذري وراء التعثر.
   - EN: I look for the root cause behind the lack of progress.
   - Matrix:
     - behavioralSignal: root_cause_underperformance
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Root Cause Analysis
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: عند ضعف التقدم المتكرر، شخّص السبب الجذري بدل زيادة الجهد فقط.
     - ruleTextEn: When progress repeatedly stalls, diagnose the root cause instead of only increasing effort.
     - acceptanceStatus: Pass
2. support_perspective
   - AR: أطلب دعمًا أو رأيًا من شخص آخر.
   - EN: I ask for support or another perspective.
   - Matrix:
     - behavioralSignal: support_perspective_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance, critique_vs_support
     - confidenceEffect: -1
     - thinkingModeEffect: Collaborative Review
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: قدّم منظورًا خارجيًا داعمًا عندما يتكرر التعثر ولا تكفي المحاولة الفردية.
     - ruleTextEn: Provide a supportive outside perspective when repeated struggle cannot be solved by individual effort alone.
     - acceptanceStatus: Pass
3. change_plan
   - AR: أضع خطة تغيير واضحة.
   - EN: I create a clear change plan.
   - Matrix:
     - behavioralSignal: change_plan_needed
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Scenario Simulation
     - redLineEffect: none
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: حوّل التعثر المتكرر إلى خطة تغيير صغيرة مع نقطة مراجعة واضحة.
     - ruleTextEn: Turn repeated lack of progress into a small change plan with a clear checkpoint.
     - acceptanceStatus: Pass
4. learn_examples
   - AR: أبحث عن أمثلة مشابهة لأتعلم منها.
   - EN: I look for similar examples to learn from.
   - Matrix:
     - behavioralSignal: learn_from_examples
     - strength: primary
     - questionWeight: 3
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, thinking_quality_modes, relationship_with_user
     - reportSections: ai_interaction_style, behavioral_signal_map, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.11, StyleTone=0.11, PrecisionSelfCheck=0.17, InternalEvaluation=0.27, ResponseStructure=0, EnhancementAdaptation=0.23
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=2, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: Avoid generic, premature, or surface-level behavior.
     - riskGuard: Apply conditionally; do not force heavy structure on simple requests.
     - ruleTextAr: استخدم أمثلة مشابهة أو حالات مقارنة لفهم مسار أفضل عند ضعف التقدم.
     - ruleTextEn: Use comparable examples or cases to find a better path when progress is weak.
     - acceptanceStatus: Pass

## 18. AI01_correct_unusable

Block: AI-Use Scenario
Selection mode: single
Display condition: Always

Arabic question: أحيانًا يعطيك الذكاء الاصطناعي جوابًا يبدو صحيحًا، لكنه لا يساعدك بالشكل المطلوب. ما السبب الأقرب عادةً؟
English question: Sometimes AI gives an answer that seems correct, but it still does not help you the way you need. What is usually the closest reason?

Answers / Options:

1. no_context
   - AR: لا يربط الجواب بسياقي أو هدفي الحالي.
   - EN: It does not connect the answer to my current context or goal.
   - Matrix:
     - behavioralSignal: ai_context_connection_needed
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, thinking_quality_modes
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=2, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Step-Back
     - redLineEffect: No generic answers
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: اربط الإجابات المهمة بسياق المستخدم وهدفه الحالي بدل تقديم جواب عام.
     - ruleTextEn: Connect important answers to the user's current context and goal instead of giving generic responses.
     - acceptanceStatus: Pass
2. not_practical
   - AR: لا يحوّل الفكرة إلى شيء عملي يمكنني استخدامه.
   - EN: It does not turn the idea into something practical I can use.
   - Matrix:
     - behavioralSignal: ai_practicality_needed
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, thinking_quality_modes
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: No theory without application
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: حوّل الأفكار والتحليلات إلى خطوات أو أمثلة أو مسودة قابلة للاستخدام.
     - ruleTextEn: Turn ideas and analysis into steps, examples, or usable drafts.
     - acceptanceStatus: Pass
3. no_gap
   - AR: لا يوضح لي أين قد تكون المشكلة أو النقص.
   - EN: It does not show where the issue, weakness, or missing part might be.
   - Matrix:
     - behavioralSignal: ai_gap_detection_needed
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, thinking_quality_modes
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Devil's Advocate
     - redLineEffect: No blind agreement
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: عند مراجعة فكرة أو خطة، اكشف النقص أو الضعف قبل التحسين.
     - ruleTextEn: When reviewing an idea or plan, expose missing parts or weaknesses before improving.
     - acceptanceStatus: Pass
4. no_quality_check
   - AR: لا يعطيني طريقة أتأكد بها من جودة الجواب.
   - EN: It does not give me a way to judge whether the answer is good enough.
   - Matrix:
     - behavioralSignal: ai_quality_check_needed
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: red_lines_failure_triggers, output_rules, thinking_quality_modes
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.33, StyleTone=0.13, PrecisionSelfCheck=0.17, InternalEvaluation=0.17, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, critique_vs_support
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: No unsupported confidence
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: في المخرجات المهمة، أضف معيار جودة أو فحصًا مختصرًا يساعد على تقييم الجواب.
     - ruleTextEn: For important outputs, add a quality criterion or short check to evaluate the answer.
     - acceptanceStatus: Pass

## 19. AI02_incomplete_request

Block: AI-Use Scenario
Selection mode: single
Display condition: Always

Arabic question: عندما يكون طلبك للذكاء الاصطناعي غير مكتمل، لكن يمكن البدء منه، أي رد يساعدك أكثر؟
English question: When your request to AI is incomplete, but there is still enough to begin, which response helps you most?

Answers / Options:

1. ask_one
   - AR: يسألني سؤالًا واحدًا عن أهم نقطة ناقصة.
   - EN: It asks me one question about the most important missing point.
   - Matrix:
     - behavioralSignal: one_key_clarification
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, output_rules, relationship_with_user
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: autonomy_vs_guidance
     - confidenceEffect: 1
     - thinkingModeEffect: Clarification Gate
     - redLineEffect: No clarification loops
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: اسأل سؤالًا واحدًا فقط عندما تكون المعلومة الناقصة مؤثرة فعلًا.
     - ruleTextEn: Ask only one question when the missing detail materially affects the result.
     - acceptanceStatus: Pass
2. assume_start
   - AR: يذكر ما فهمه وما افترضه ثم يبدأ.
   - EN: It states what it understood and assumed, then starts.
   - Matrix:
     - behavioralSignal: assumption_then_action
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, output_rules, relationship_with_user
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, autonomy_vs_guidance
     - confidenceEffect: 0
     - thinkingModeEffect: Step-Back
     - redLineEffect: No hidden assumptions
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: اذكر الفهم والافتراضات باختصار ثم تابع عندما يكون التقدم ممكنًا.
     - ruleTextEn: Briefly state understanding and assumptions, then proceed when progress is possible.
     - acceptanceStatus: Pass
3. conditional_paths
   - AR: يعطيني مسارين أو ثلاثة حسب الاحتمالات الممكنة.
   - EN: It gives me two or three possible paths based on likely interpretations.
   - Matrix:
     - behavioralSignal: conditional_paths
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, output_rules, relationship_with_user
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=1, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=2, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 0
     - thinkingModeEffect: Comparative Reasoning
     - redLineEffect: No forced single answer under uncertainty
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: عندما تقود الاحتمالات إلى إجابات مختلفة، قدم مسارين أو ثلاثة مع فرق واضح.
     - ruleTextEn: When possible interpretations lead to different answers, present two or three paths with clear differences.
     - acceptanceStatus: Pass
4. draft_refine
   - AR: يبدأ بمسودة أولية ثم يوضح ما الذي يحتاجه لتحسينها.
   - EN: It starts with a first draft, then explains what it needs to improve it.
   - Matrix:
     - behavioralSignal: draft_then_refine
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, output_rules, relationship_with_user
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0.11, NormsBoundaries=0.28, StyleTone=0.24, PrecisionSelfCheck=0.17, InternalEvaluation=0, ResponseStructure=0.2, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=2, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=1, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision
     - confidenceEffect: 1
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: No paralysis from missing context
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: قدّم نسخة أولى قابلة للتعديل عندما يكفي السياق، ثم اطلب ما يحسنها.
     - ruleTextEn: Provide a first editable version when context is enough, then ask what would improve it.
     - acceptanceStatus: Pass

## 20. AI03_repeated_ai_mistake

Block: AI-Use Scenario
Selection mode: single
Display condition: Always

Arabic question: إذا لاحظت أن الذكاء الاصطناعي يكرر نفس نوع الخطأ أو الأسلوب غير المناسب، ما التصرف الذي تفضله؟
English question: If you notice AI repeating the same kind of mistake or unsuitable style, what would you prefer it to do?

Answers / Options:

1. local_only
   - AR: يلتزم بتصحيحي داخل نفس المحادثة فقط.
   - EN: It applies my correction within the same conversation only.
   - Matrix:
     - behavioralSignal: correction_local_only
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, universal_quality_rules
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.25, StyleTone=0, PrecisionSelfCheck=0.25, InternalEvaluation=0.15, ResponseStructure=0, EnhancementAdaptation=0.35
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: adaptation_vs_stability
     - confidenceEffect: 1
     - thinkingModeEffect: Adaptation Guard
     - redLineEffect: No over-personalization
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: طبّق التصحيح داخل المحادثة الحالية دون اعتباره قاعدة دائمة إلا إذا طلب المستخدم ذلك.
     - ruleTextEn: Apply corrections in the current conversation without treating them as permanent unless asked.
     - acceptanceStatus: Pass
2. auto_adjust
   - AR: يلاحظ النمط ويعدّل أسلوبه تلقائيًا.
   - EN: It notices the pattern and adjusts its style automatically.
   - Matrix:
     - behavioralSignal: automatic_style_adjustment
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, universal_quality_rules
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.25, StyleTone=0, PrecisionSelfCheck=0.25, InternalEvaluation=0.15, ResponseStructure=0, EnhancementAdaptation=0.35
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: adaptation_vs_stability
     - confidenceEffect: 0
     - thinkingModeEffect: Iterative Improvement
     - redLineEffect: No repeated mistake
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: إذا تكررت نفس الملاحظة، عدّل الأسلوب في الردود اللاحقة دون الحاجة لتكرار التنبيه.
     - ruleTextEn: If the same correction repeats, adjust future responses without requiring repeated reminders.
     - acceptanceStatus: Pass
3. suggest_rule
   - AR: يخبرني أنه لاحظ التكرار ويقترح قاعدة جديدة.
   - EN: It tells me it noticed the pattern and suggests a new rule.
   - Matrix:
     - behavioralSignal: suggest_rule_update
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, universal_quality_rules
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.25, StyleTone=0, PrecisionSelfCheck=0.25, InternalEvaluation=0.15, ResponseStructure=0, EnhancementAdaptation=0.35
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: adaptation_vs_stability
     - confidenceEffect: 0
     - thinkingModeEffect: Self-Check
     - redLineEffect: No silent pattern loss
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: عند تكرار تصحيح مهم، اقترح قاعدة مختصرة يمكن إضافتها للتعليمات.
     - ruleTextEn: When an important correction repeats, suggest a concise rule that can be added to the instructions.
     - acceptanceStatus: Pass
4. confirm_permanent
   - AR: يسألني قبل أن يعتبر التصحيح قاعدة دائمة.
   - EN: It asks me before treating the correction as a permanent rule.
   - Matrix:
     - behavioralSignal: confirm_persistent_change
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: adaptation_loop, universal_quality_rules
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.25, StyleTone=0, PrecisionSelfCheck=0.25, InternalEvaluation=0.15, ResponseStructure=0, EnhancementAdaptation=0.35
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=0, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: adaptation_vs_stability
     - confidenceEffect: 0
     - thinkingModeEffect: Adaptation Guard
     - redLineEffect: No unwanted permanent changes
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: استأذن قبل تحويل التصحيح المتكرر إلى قاعدة دائمة في أسلوب العمل.
     - ruleTextEn: Ask before converting repeated correction into a standing operating rule.
     - acceptanceStatus: Pass

## 21. AI04_trust_verification

Block: AI-Use Scenario
Selection mode: single
Display condition: Always

Arabic question: عندما يعطيك الذكاء الاصطناعي معلومة مهمة أو توصية قد تعتمد عليها، ما الذي يجعلك تطمئن أكثر؟
English question: When AI gives you important information or a recommendation you may rely on, what makes you trust it more?

Answers / Options:

1. simple_limits
   - AR: أن يوضح الفكرة ببساطة ويذكر حدودها.
   - EN: It explains the idea simply and mentions its limits.
   - Matrix:
     - behavioralSignal: simple_with_limits
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.5, StyleTone=0, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=1, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Verification
     - redLineEffect: No overclaiming
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: في المعلومات المهمة، اشرح ببساطة واذكر حدود المعرفة أو حدود الجواب.
     - ruleTextEn: For important information, explain simply and mention knowledge or answer limits.
     - acceptanceStatus: Pass
2. fact_inference_reco
   - AR: أن يميز بين الحقيقة والاستنتاج والتوصية.
   - EN: It distinguishes fact, inference, and recommendation.
   - Matrix:
     - behavioralSignal: fact_inference_recommendation_split
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.5, StyleTone=0, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=1, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: none
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: No mixing claims
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: ميّز بوضوح بين الحقيقة والاستنتاج والتوصية عندما تكون الإجابة مؤثرة.
     - ruleTextEn: Clearly distinguish fact, inference, and recommendation when the answer matters.
     - acceptanceStatus: Pass
3. source_needed
   - AR: أن يذكر مصدرًا أو ينبهني أن الموضوع يحتاج تحققًا.
   - EN: It cites a source or warns me when verification is needed.
   - Matrix:
     - behavioralSignal: source_or_verification_needed
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.5, StyleTone=0, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Verification
     - redLineEffect: No unsupported claims
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: اذكر المصدر أو نبّه لضرورة التحقق عندما تكون المعلومة متغيرة أو عالية الأثر.
     - ruleTextEn: Cite a source or flag verification need when information is changing or high-impact.
     - acceptanceStatus: Pass
4. validation_criteria
   - AR: أن يعطيني معيارًا أستخدمه للحكم على جودة الجواب.
   - EN: It gives me a criterion to judge whether the answer is good enough.
   - Matrix:
     - behavioralSignal: validation_criteria_needed
     - strength: primary
     - questionWeight: 2
     - optionStrengthWeight: 1
     - instructionSections: universal_quality_rules, thinking_quality_modes, red_lines_failure_triggers
     - reportSections: red_lines_failure_triggers, recommended_usage_strategy, full_copy_ready_instruction
     - inspireAllocation: IdentityRole=0, NormsBoundaries=0.5, StyleTone=0, PrecisionSelfCheck=0.33, InternalEvaluation=0.17, ResponseStructure=0, EnhancementAdaptation=0
     - roleHints: ExecutorBuilder=0, StrategicOrganizer=0, CriticalReviewer=2, ThinkingPartner=0, TeacherSimplifier=0, AudienceTranslator=0
     - contradictionTags: speed_vs_precision, brevity_vs_depth
     - confidenceEffect: 1
     - thinkingModeEffect: Self-Check
     - redLineEffect: No untestable output
     - riskGuard: Use only when the task is meaningful; avoid overcomplicating simple answers.
     - ruleTextAr: أضف معيار تقييم أو فحص قبول مختصر للمخرجات المهمة.
     - ruleTextEn: Add a brief evaluation criterion or acceptance check for important outputs.
     - acceptanceStatus: Pass
