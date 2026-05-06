import {
  expectedInstructionExplanationInclude,
  validateReportWriterOutputContract,
  type ReportLanguage,
  type ReportWriterOutput,
} from "../inspire-types";

export const SMART_PROMPT_ENGINEER_URL =
  "https://chatgpt.com/g/g-67fe5939b39c8191a7ad597fd6fb0192-smart-prompt-engineer-mhnds-lmtlbt-ldhky";

export type OperatingPatternReportContent = {
  title: string;
  reportLanguage: ReportLanguage;
  sections: {
    operatingSnapshot: {
      heading: string;
      bullets: string[];
    };
    personalizedRecommendations: {
      heading: string;
      bullets: string[];
    };
    howToUseAiBetter: {
      heading: string;
      customBullets: string[];
      fixedCraftFramework: {
        title: string;
        bullets: string[];
      };
      smartPromptEngineer: {
        label: string;
        url: string;
      };
    };
    copyReadyAiInstructions: {
      heading: string;
      language: "en";
      notice: string;
      markdown: string;
    };
    instructionExplanation: {
      include: boolean;
      heading: string;
      bullets: string[];
    };
  };
};

const localizedHeading = (
  reportLanguage: ReportLanguage,
  english: string,
  arabic: string
): string => {
  if (reportLanguage === "ar") return arabic;
  if (reportLanguage === "both") return `${arabic} / ${english}`;
  return english;
};

const fixedCraftBullets = (reportLanguage: ReportLanguage): string[] => {
  if (reportLanguage === "ar") {
    return [
      "Context: اذكر السياق والهدف قبل الطلب.",
      "Role: حدد الدور العملي الذي تريد من الذكاء الاصطناعي أن يتخذه.",
      "Action: اطلب الفعل أو الناتج المطلوب بوضوح.",
      "Format: حدد شكل المخرجات المناسب.",
      "Tone: وضح النبرة ومستوى التفصيل المطلوب.",
    ];
  }
  if (reportLanguage === "both") {
    return [
      "Context: اذكر السياق والهدف. / State the context and goal.",
      "Role: حدد الدور العملي. / Define the practical role.",
      "Action: اطلب الناتج بوضوح. / Ask clearly for the output.",
      "Format: حدد شكل المخرجات. / Specify the output format.",
      "Tone: وضح النبرة والتفصيل. / Set tone and detail level.",
    ];
  }
  return [
    "Context: state the situation, goal, and relevant constraints.",
    "Role: define the practical role you want AI to take.",
    "Action: ask clearly for the output or next step.",
    "Format: specify the structure you want back.",
    "Tone: set the level of directness, detail, and language style.",
  ];
};

export function buildOperatingPatternReportContent(
  writerOutput: ReportWriterOutput,
  options: {
    reportLanguage: ReportLanguage;
    projectName: string;
    copyReadyInstructionMarkdown: string;
  }
): OperatingPatternReportContent {
  const validation = validateReportWriterOutputContract(writerOutput, options.reportLanguage);
  if (!validation.success) {
    throw new Error(`Invalid Operating Pattern Report content: ${validation.error.message}`);
  }

  const explanationExpected = expectedInstructionExplanationInclude(options.reportLanguage);

  return {
    title: localizedHeading(
      options.reportLanguage,
      `${options.projectName} Operating Pattern Report`,
      `تقرير نمط التشغيل - ${options.projectName}`
    ),
    reportLanguage: options.reportLanguage,
    sections: {
      operatingSnapshot: {
        heading: localizedHeading(options.reportLanguage, "Operating Snapshot", "لمحة التشغيل"),
        bullets: writerOutput.operatingSnapshot.bullets,
      },
      personalizedRecommendations: {
        heading: localizedHeading(
          options.reportLanguage,
          "Personalized Recommendations",
          "توصيات مخصصة"
        ),
        bullets: writerOutput.personalizedRecommendations.bullets,
      },
      howToUseAiBetter: {
        heading: localizedHeading(options.reportLanguage, "How to Use AI Better", "كيف تستخدم الذكاء الاصطناعي بشكل أفضل"),
        customBullets: writerOutput.customAiUsageTips.bullets,
        fixedCraftFramework: {
          title: localizedHeading(options.reportLanguage, "CRAFT Prompt Framework", "إطار CRAFT لكتابة الطلبات"),
          bullets: fixedCraftBullets(options.reportLanguage),
        },
        smartPromptEngineer: {
          label: localizedHeading(
            options.reportLanguage,
            "Smart Prompt Engineer",
            "Smart Prompt Engineer"
          ),
          url: SMART_PROMPT_ENGINEER_URL,
        },
      },
      copyReadyAiInstructions: {
        heading: localizedHeading(
          options.reportLanguage,
          "Copy-Ready AI Instructions",
          "تعليمات الذكاء الاصطناعي الجاهزة للنسخ"
        ),
        language: "en",
        notice: localizedHeading(
          options.reportLanguage,
          "These copy-ready instructions are intentionally written in English.",
          "هذه التعليمات الجاهزة للنسخ مكتوبة بالإنجليزية عمدا."
        ),
        markdown: options.copyReadyInstructionMarkdown,
      },
      instructionExplanation: {
        include: explanationExpected,
        heading: localizedHeading(
          options.reportLanguage,
          "Instruction Explanation",
          "شرح التعليمات"
        ),
        bullets: explanationExpected ? writerOutput.instructionExplanation.bullets : [],
      },
    },
  };
}
