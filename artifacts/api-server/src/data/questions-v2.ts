export interface V2Option {
  id: string;
  textAr: string;
  textEn: string;
}

export interface V2Question {
  id: string;
  block: "Setup / Behavioral Bridge" | "Behavioral Backbone" | "AI-Use Scenario";
  selectionMode: "single";
  displayCondition: string;
  questionAr: string;
  questionEn: string;
  options: V2Option[];
}

export const V2_QUESTIONS: V2Question[] = [
  {
    "id": "S2_messy_task_help",
    "block": "Setup / Behavioral Bridge",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تأتي للذكاء الاصطناعي بفكرة أو مهمة غير مرتبة، أي نوع من المساعدة يجعلك تتقدم فعلًا؟",
    "questionEn": "When you bring AI a messy idea or unfinished task, what kind of help actually moves you forward?",
    "options": [
      {
        "id": "organize_into_plan",
        "textAr": "يرتب الفكرة ويحوّلها إلى خطة واضحة.",
        "textEn": "It organizes the idea and turns it into a clear plan."
      },
      {
        "id": "show_possible_directions",
        "textAr": "يعرض أكثر من اتجاه ممكن قبل اختيار المسار.",
        "textEn": "It shows more than one possible direction before choosing a path."
      },
      {
        "id": "draft_first_refine",
        "textAr": "ينتج نسخة أولية قابلة للتعديل بدل الكلام النظري.",
        "textEn": "It produces a first editable version instead of theoretical talk."
      },
      {
        "id": "identify_gaps_before_build",
        "textAr": "يكشف ما هو ناقص أو ضعيف قبل البناء عليها.",
        "textEn": "It reveals what is missing or weak before building on it."
      },
      {
        "id": "simplify_then_continue",
        "textAr": "يبسط الفكرة حتى أفهمها ثم نكمل عليها.",
        "textEn": "It simplifies the idea so I understand it, then we continue building."
      }
    ]
  },
  {
    "id": "S3_idea_clarity_for_others",
    "block": "Setup / Behavioral Bridge",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تحتاج أن تجعل فكرة أو نتيجة مفهومة لشخص آخر، ما الذي تنتبه له أولًا؟",
    "questionEn": "When you need to make an idea or result understandable to someone else, what do you pay attention to first?",
    "options": [
      {
        "id": "self_clarity_first",
        "textAr": "أن أفهمها أنا بوضوح قبل أن أشرحها.",
        "textEn": "That I understand it clearly myself before explaining it."
      },
      {
        "id": "plain_language_no_assumed_expertise",
        "textAr": "أن تُشرح بلغة بسيطة بدون افتراض خبرة مسبقة.",
        "textEn": "That it is explained in simple language without assuming prior expertise."
      },
      {
        "id": "relevance_to_other_person",
        "textAr": "أن يعرف الطرف الآخر لماذا تهمه الفكرة.",
        "textEn": "That the other person understands why the idea matters to them."
      },
      {
        "id": "structured_for_following",
        "textAr": "أن تكون مرتبة بحيث يسهل تتبعها.",
        "textEn": "That it is organized so it is easy to follow."
      },
      {
        "id": "context_adaptive_style",
        "textAr": "أن يتغير الأسلوب حسب الشخص أو الموقف.",
        "textEn": "That the style changes depending on the person or situation."
      }
    ]
  },
  {
    "id": "Q01_starting_orientation",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تبدأ فكرة أو مهمة جديدة، ما أول شيء يميل عقلك للتركيز عليه؟",
    "questionEn": "When you start a new idea or task, what does your mind usually focus on first?",
    "options": [
      {
        "id": "beneficiary_oriented",
        "textAr": "من سيستفيد من هذه الفكرة أو المهمة؟",
        "textEn": "Who will benefit from this idea or task?"
      },
      {
        "id": "outcome_oriented",
        "textAr": "كيف يجب أن تبدو النتيجة النهائية؟",
        "textEn": "What should the final outcome look like?"
      },
      {
        "id": "resource_oriented",
        "textAr": "ما الموارد أو المعلومات المتاحة لدي؟",
        "textEn": "What resources or information do I already have?"
      },
      {
        "id": "action_oriented",
        "textAr": "ما أول خطوة عملية يجب أن أبدأ بها؟",
        "textEn": "What is the first practical step I should take?"
      }
    ]
  },
  {
    "id": "Q02_ambiguity_handling",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "إذا بدأت مهمة جديدة والتفاصيل غير مكتملة، ما التصرف الأقرب لك عادةً؟",
    "questionEn": "If you start a new task and the details are incomplete, what do you usually do first?",
    "options": [
      {
        "id": "iterative_action",
        "textAr": "أبدأ بما هو واضح وأتعلم أثناء التنفيذ.",
        "textEn": "I start with what is clear and learn while doing."
      },
      {
        "id": "clarification_first",
        "textAr": "أطلب توضيحًا قبل أن أبدأ.",
        "textEn": "I ask for clarification before starting."
      },
      {
        "id": "stakeholder_oriented",
        "textAr": "أبحث عمّن يجب إشراكه أو سؤاله.",
        "textEn": "I identify who should be involved or asked."
      },
      {
        "id": "gap_mapping",
        "textAr": "أكتب الأسئلة أو النقاط الناقصة أولًا.",
        "textEn": "I write down the missing questions or information first."
      }
    ]
  },
  {
    "id": "Q03_unfamiliar_decision",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "إذا احتجت لاتخاذ قرار في موضوع غير مألوف، ما التصرف الأقرب لك؟",
    "questionEn": "If you need to make a decision in an unfamiliar area, what do you usually do?",
    "options": [
      {
        "id": "intuition_tested",
        "textAr": "أبدأ من تقديري الأولي ثم أختبره بسرعة.",
        "textEn": "I start from my initial judgment, then test it quickly."
      },
      {
        "id": "reference_seeking",
        "textAr": "أبحث عن مرجع أو مثال موثوق.",
        "textEn": "I look for a reliable reference or example."
      },
      {
        "id": "collaborative_decision",
        "textAr": "أشارك القرار مع شخص آخر قبل الحسم.",
        "textEn": "I discuss the decision with someone else before deciding."
      },
      {
        "id": "evaluation_first",
        "textAr": "أطلب وقتًا لتحليل الخيارات والمخاطر.",
        "textEn": "I ask for time to analyze options and risks."
      }
    ]
  },
  {
    "id": "Q04_plan_failure",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "إذا فشلت خطة كنت واثقًا منها، ما أول ما تميل لفعله؟",
    "questionEn": "If a plan you trusted fails, what do you tend to do first?",
    "options": [
      {
        "id": "context_constraints",
        "textAr": "أراجع الظروف التي أثرت على الخطة.",
        "textEn": "I review the conditions that affected the plan."
      },
      {
        "id": "root_cause",
        "textAr": "أعيد تحليل ما حدث لأفهم السبب.",
        "textEn": "I re-analyze what happened to understand the cause."
      },
      {
        "id": "second_opinion",
        "textAr": "أطلب رأيًا أو دعمًا من شخص آخر.",
        "textEn": "I ask someone else for input or support."
      },
      {
        "id": "adaptive_pivot",
        "textAr": "أغير الخطة بسرعة وأجرب مسارًا آخر.",
        "textEn": "I quickly change the plan and try another path."
      }
    ]
  },
  {
    "id": "Q05_stalled_task",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تتوقف في مهمة معقدة ولا تعرف كيف تكمل، ما الذي تفعله غالبًا؟",
    "questionEn": "When you get stuck in a complex task and do not know how to continue, what do you usually do?",
    "options": [
      {
        "id": "blocker_diagnosis",
        "textAr": "أبحث عن السبب الذي جعلني أتوقف.",
        "textEn": "I look for the reason I got stuck."
      },
      {
        "id": "tool_method",
        "textAr": "أبحث عن أداة أو طريقة تنظّم المشكلة.",
        "textEn": "I look for a tool or method to organize the problem."
      },
      {
        "id": "sequencing",
        "textAr": "أغير ترتيب المهام أو أبدأ من جزء أسهل.",
        "textEn": "I change the order of tasks or start with an easier part."
      },
      {
        "id": "external_feedback",
        "textAr": "أطلب تقييمًا أو رأيًا خارجيًا.",
        "textEn": "I ask for external assessment or feedback."
      }
    ]
  },
  {
    "id": "Q06_success_clarity",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "قبل أن تبدأ مهمة جديدة، ما الذي تحتاجه أكثر حتى تشعر أنك تسير في الاتجاه الصحيح؟",
    "questionEn": "Before starting a new task, what do you need most to feel you are moving in the right direction?",
    "options": [
      {
        "id": "success_criteria",
        "textAr": "معرفة شروط النجاح بوضوح.",
        "textEn": "Knowing the success criteria clearly."
      },
      {
        "id": "learn_by_doing",
        "textAr": "البدء والتعلم أثناء التجربة.",
        "textEn": "Starting and learning through the process."
      },
      {
        "id": "multi_path",
        "textAr": "تجربة أكثر من طريقة قبل اختيار واحدة.",
        "textEn": "Trying more than one approach before choosing."
      },
      {
        "id": "goal_beneficiary",
        "textAr": "فهم الهدف أو المستفيد من المهمة.",
        "textEn": "Understanding the goal or who benefits from the task."
      }
    ]
  },
  {
    "id": "Q07_learning_style",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تريد فهم شيء جديد، ما الطريقة التي تساعدك أكثر؟",
    "questionEn": "When you want to understand something new, what helps you most?",
    "options": [
      {
        "id": "demo_learning",
        "textAr": "مثال عملي أو عرض مباشر للفكرة.",
        "textEn": "A practical example or demonstration of the idea."
      },
      {
        "id": "analytical_learning",
        "textAr": "شرح منظم وتحليل خطوة بخطوة.",
        "textEn": "A structured explanation and step-by-step analysis."
      },
      {
        "id": "interactive_learning",
        "textAr": "نقاش أو أسئلة تفاعلية.",
        "textEn": "Discussion or interactive questions."
      },
      {
        "id": "practice_learning",
        "textAr": "تطبيق عملي أو تمرين صغير.",
        "textEn": "A practical application or small exercise."
      }
    ]
  },
  {
    "id": "Q08_new_challenge",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تواجه تحديًا جديدًا لا تملك عنه خبرة كافية، ما أول ما تميل لفعله؟",
    "questionEn": "When you face a new challenge you do not have enough experience with, what do you tend to do first?",
    "options": [
      {
        "id": "precedent",
        "textAr": "أبحث عن حالات أو تجارب مشابهة.",
        "textEn": "I look for similar cases or previous examples."
      },
      {
        "id": "experiment",
        "textAr": "أجرب طريقة أولية وأتعلم من النتيجة.",
        "textEn": "I try an initial approach and learn from the result."
      },
      {
        "id": "expert_guidance",
        "textAr": "أطلب توجيهًا ممن لديه خبرة.",
        "textEn": "I ask for guidance from someone with experience."
      },
      {
        "id": "risk_first",
        "textAr": "أقيّم المخاطر قبل أن أبدأ.",
        "textEn": "I assess the risks before starting."
      }
    ]
  },
  {
    "id": "Q09_repeating_problems",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تتكرر نفس المشكلة أكثر من مرة، ما أول ما تفعله عادةً؟",
    "questionEn": "When the same problem repeats more than once, what do you usually do first?",
    "options": [
      {
        "id": "root_pattern",
        "textAr": "أبحث عن السبب المشترك وراء التكرار.",
        "textEn": "I look for the common cause behind the repetition."
      },
      {
        "id": "collaborative_review",
        "textAr": "أناقش المشكلة مع من له علاقة بها.",
        "textEn": "I discuss the issue with the people involved."
      },
      {
        "id": "alternative_search",
        "textAr": "أجرب طريقة مختلفة بدل تكرار نفس الحل.",
        "textEn": "I try a different approach instead of repeating the same solution."
      },
      {
        "id": "documentation_prevention",
        "textAr": "أوثق الأسباب وما حدث حتى لا يتكرر.",
        "textEn": "I document the causes and what happened so it does not repeat."
      }
    ]
  },
  {
    "id": "Q10_disagreement",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما يظهر خلاف حول طريقة تنفيذ عمل أو قرار، ما التصرف الأقرب لك؟",
    "questionEn": "When there is disagreement about how to execute work or make a decision, what do you usually do?",
    "options": [
      {
        "id": "consensus",
        "textAr": "أبحث عن حل يرضي الأطراف قدر الإمكان.",
        "textEn": "I look for a solution that satisfies the involved sides as much as possible."
      },
      {
        "id": "outcome_priority",
        "textAr": "أركز على مصلحة العمل والنتيجة المطلوبة.",
        "textEn": "I focus on the work interest and required outcome."
      },
      {
        "id": "conflict_analysis",
        "textAr": "أحلل سبب الخلاف قبل اقتراح حل.",
        "textEn": "I analyze the reason for the disagreement before suggesting a solution."
      },
      {
        "id": "delay_clarity",
        "textAr": "أؤجل النقاش حتى تتضح الصورة أكثر.",
        "textEn": "I delay the discussion until the situation becomes clearer."
      }
    ]
  },
  {
    "id": "Q11_tasks_piling",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تتراكم عليك مهام كثيرة، ما التصرف الذي يساعدك أكثر؟",
    "questionEn": "When many tasks pile up, what helps you most?",
    "options": [
      {
        "id": "schedule",
        "textAr": "أرتب جدولًا أو خطة زمنية.",
        "textEn": "I create a schedule or time plan."
      },
      {
        "id": "priority",
        "textAr": "أبدأ بالأهم أو الأعلى أثرًا.",
        "textEn": "I start with the most important or highest-impact task."
      },
      {
        "id": "delegate",
        "textAr": "أطلب دعمًا أو أوزع بعض المهام.",
        "textEn": "I ask for support or distribute some tasks."
      },
      {
        "id": "efficiency_tool",
        "textAr": "أبحث عن طريقة أو أداة تسرّع الإنجاز.",
        "textEn": "I look for a method or tool that speeds up execution."
      }
    ]
  },
  {
    "id": "Q12_postponing",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تؤجل مهمة أكثر من مرة، ما السبب الأقرب عادةً؟",
    "questionEn": "When you postpone a task more than once, what is usually the closest reason?",
    "options": [
      {
        "id": "focus_energy",
        "textAr": "لا أكون مركزًا أو لا أجد طاقة كافية للبدء.",
        "textEn": "I am not focused or do not have enough energy to start."
      },
      {
        "id": "unclear_requirements",
        "textAr": "المطلوب غير واضح بما يكفي.",
        "textEn": "The requirements are not clear enough."
      },
      {
        "id": "bad_sequence",
        "textAr": "الخطة أو ترتيب الخطوات غير مضبوط.",
        "textEn": "The plan or sequence of steps is not well organized."
      },
      {
        "id": "coordination",
        "textAr": "أحتاج تنسيقًا أو تواصلًا مع طرف آخر.",
        "textEn": "I need coordination or communication with someone else."
      }
    ]
  },
  {
    "id": "Q13_completion_review",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "بعد إنهاء عمل أو مشروع مهم، ما أول شيء تميل لفعله؟",
    "questionEn": "After completing an important piece of work or project, what do you tend to do first?",
    "options": [
      {
        "id": "result_review",
        "textAr": "أراجع النتائج وما تحقق فعليًا.",
        "textEn": "I review the results and what was actually achieved."
      },
      {
        "id": "share_feedback",
        "textAr": "أشارك الإنجاز أو أطلب رأيًا حوله.",
        "textEn": "I share the achievement or ask for feedback on it."
      },
      {
        "id": "forward_planning",
        "textAr": "أبدأ التفكير في الخطوة أو المشروع التالي.",
        "textEn": "I start thinking about the next step or project."
      },
      {
        "id": "recovery",
        "textAr": "أرتاح قليلًا قبل المراجعة أو الانتقال لما بعده.",
        "textEn": "I take a short break before reviewing or moving on."
      }
    ]
  },
  {
    "id": "Q14_error_feedback",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما يلفت أحد انتباهك إلى خطأ في عملك، ما رد فعلك الأقرب؟",
    "questionEn": "When someone points out an error in your work, what is your closest reaction?",
    "options": [
      {
        "id": "detail_verify",
        "textAr": "أراجع التفاصيل لأتأكد من الخطأ.",
        "textEn": "I review the details to verify the error."
      },
      {
        "id": "rationale_context",
        "textAr": "أشرح سبب اختياري أو طريقتي.",
        "textEn": "I explain the reason behind my choice or approach."
      },
      {
        "id": "fix_oriented",
        "textAr": "أبحث عن حل عملي لإصلاحه.",
        "textEn": "I look for a practical way to fix it."
      },
      {
        "id": "prevention",
        "textAr": "أركز على منع تكراره لاحقًا.",
        "textEn": "I focus on preventing it from happening again."
      }
    ]
  },
  {
    "id": "Q15_repeated_no_progress",
    "block": "Behavioral Backbone",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما تشعر أن محاولاتك لا تحقق التقدم المطلوب أكثر من مرة، ما التصرف الأقرب لك؟",
    "questionEn": "When you feel that your attempts are not making the progress you expected more than once, what do you usually do?",
    "options": [
      {
        "id": "under_root",
        "textAr": "أبحث عن السبب الجذري وراء التعثر.",
        "textEn": "I look for the root cause behind the lack of progress."
      },
      {
        "id": "support_perspective",
        "textAr": "أطلب دعمًا أو رأيًا من شخص آخر.",
        "textEn": "I ask for support or another perspective."
      },
      {
        "id": "change_plan",
        "textAr": "أضع خطة تغيير واضحة.",
        "textEn": "I create a clear change plan."
      },
      {
        "id": "learn_examples",
        "textAr": "أبحث عن أمثلة مشابهة لأتعلم منها.",
        "textEn": "I look for similar examples to learn from."
      }
    ]
  },
  {
    "id": "AI01_correct_unusable",
    "block": "AI-Use Scenario",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "أحيانًا يعطيك الذكاء الاصطناعي جوابًا يبدو صحيحًا، لكنه لا يساعدك بالشكل المطلوب. ما السبب الأقرب عادةً؟",
    "questionEn": "Sometimes AI gives an answer that seems correct, but it still does not help you the way you need. What is usually the closest reason?",
    "options": [
      {
        "id": "no_context",
        "textAr": "لا يربط الجواب بسياقي أو هدفي الحالي.",
        "textEn": "It does not connect the answer to my current context or goal."
      },
      {
        "id": "not_practical",
        "textAr": "لا يحوّل الفكرة إلى شيء عملي يمكنني استخدامه.",
        "textEn": "It does not turn the idea into something practical I can use."
      },
      {
        "id": "no_gap",
        "textAr": "لا يوضح لي أين قد تكون المشكلة أو النقص.",
        "textEn": "It does not show where the issue, weakness, or missing part might be."
      },
      {
        "id": "no_quality_check",
        "textAr": "لا يعطيني طريقة أتأكد بها من جودة الجواب.",
        "textEn": "It does not give me a way to judge whether the answer is good enough."
      }
    ]
  },
  {
    "id": "AI02_incomplete_request",
    "block": "AI-Use Scenario",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما يكون طلبك للذكاء الاصطناعي غير مكتمل، لكن يمكن البدء منه، أي رد يساعدك أكثر؟",
    "questionEn": "When your request to AI is incomplete, but there is still enough to begin, which response helps you most?",
    "options": [
      {
        "id": "ask_one",
        "textAr": "يسألني سؤالًا واحدًا عن أهم نقطة ناقصة.",
        "textEn": "It asks me one question about the most important missing point."
      },
      {
        "id": "assume_start",
        "textAr": "يذكر ما فهمه وما افترضه ثم يبدأ.",
        "textEn": "It states what it understood and assumed, then starts."
      },
      {
        "id": "conditional_paths",
        "textAr": "يعطيني مسارين أو ثلاثة حسب الاحتمالات الممكنة.",
        "textEn": "It gives me two or three possible paths based on likely interpretations."
      },
      {
        "id": "draft_refine",
        "textAr": "يبدأ بمسودة أولية ثم يوضح ما الذي يحتاجه لتحسينها.",
        "textEn": "It starts with a first draft, then explains what it needs to improve it."
      }
    ]
  },
  {
    "id": "AI03_repeated_ai_mistake",
    "block": "AI-Use Scenario",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "إذا لاحظت أن الذكاء الاصطناعي يكرر نفس نوع الخطأ أو الأسلوب غير المناسب، ما التصرف الذي تفضله؟",
    "questionEn": "If you notice AI repeating the same kind of mistake or unsuitable style, what would you prefer it to do?",
    "options": [
      {
        "id": "local_only",
        "textAr": "يلتزم بتصحيحي داخل نفس المحادثة فقط.",
        "textEn": "It applies my correction within the same conversation only."
      },
      {
        "id": "auto_adjust",
        "textAr": "يلاحظ النمط ويعدّل أسلوبه تلقائيًا.",
        "textEn": "It notices the pattern and adjusts its style automatically."
      },
      {
        "id": "suggest_rule",
        "textAr": "يخبرني أنه لاحظ التكرار ويقترح قاعدة جديدة.",
        "textEn": "It tells me it noticed the pattern and suggests a new rule."
      },
      {
        "id": "confirm_permanent",
        "textAr": "يسألني قبل أن يعتبر التصحيح قاعدة دائمة.",
        "textEn": "It asks me before treating the correction as a permanent rule."
      }
    ]
  },
  {
    "id": "AI04_trust_verification",
    "block": "AI-Use Scenario",
    "selectionMode": "single",
    "displayCondition": "Always",
    "questionAr": "عندما يعطيك الذكاء الاصطناعي معلومة مهمة أو توصية قد تعتمد عليها، ما الذي يجعلك تطمئن أكثر؟",
    "questionEn": "When AI gives you important information or a recommendation you may rely on, what makes you trust it more?",
    "options": [
      {
        "id": "simple_limits",
        "textAr": "أن يوضح الفكرة ببساطة ويذكر حدودها.",
        "textEn": "It explains the idea simply and mentions its limits."
      },
      {
        "id": "fact_inference_reco",
        "textAr": "أن يميز بين الحقيقة والاستنتاج والتوصية.",
        "textEn": "It distinguishes fact, inference, and recommendation."
      },
      {
        "id": "source_needed",
        "textAr": "أن يذكر مصدرًا أو ينبهني أن الموضوع يحتاج تحققًا.",
        "textEn": "It cites a source or warns me when verification is needed."
      },
      {
        "id": "validation_criteria",
        "textAr": "أن يعطيني معيارًا أستخدمه للحكم على جودة الجواب.",
        "textEn": "It gives me a criterion to judge whether the answer is good enough."
      }
    ]
  }
];

export const REQUIRED_V2_QUESTION_IDS = V2_QUESTIONS.map((q) => q.id);
