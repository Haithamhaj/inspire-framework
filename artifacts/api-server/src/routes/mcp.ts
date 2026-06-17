import { Router, type IRouter, type Request, type Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { V2_QUESTIONS } from "../data/questions-v2";

const router: IRouter = Router();

const APP_URL = "https://inspire.next-stepai.com";
const OPENAI_APPS_CHALLENGE_TOKEN = "lmpRZFnqYlV6TIe_uzgZFngmLsuvFFd1E4NGCjudEEY";

const toolAnnotations = {
  readOnlyHint: true,
  openWorldHint: false,
  destructiveHint: false,
};

function sendOpenAiAppsChallenge(_req: Request, res: Response): void {
  res.type("text/plain").send(OPENAI_APPS_CHALLENGE_TOKEN);
}

const textResult = (text: string, structuredContent: Record<string, unknown>) => ({
  content: [{ type: "text" as const, text }],
  structuredContent,
});

function localizedQuestion(
  question: (typeof V2_QUESTIONS)[number],
  language: "ar" | "en",
) {
  return {
    id: question.id,
    block: question.block,
    question: language === "ar" ? question.questionAr : question.questionEn,
    options: question.options.map((option) => ({
      id: option.id,
      text: language === "ar" ? option.textAr : option.textEn,
    })),
  };
}

function createInspireMcpServer(): McpServer {
  const server = new McpServer({
    name: "inspire",
    version: "0.1.0",
  });

  server.registerTool(
    "get_inspire_app_info",
    {
      title: "Get INSPIRE app info",
      description:
        "Returns a concise overview of INSPIRE, its AI Operating Profile category, supported AI systems, and website link.",
      annotations: toolAnnotations,
      outputSchema: {
        appName: z.string(),
        primaryCategory: z.string(),
        functionalCategory: z.string(),
        seoBridge: z.string(),
        description: z.string(),
        supportedAiSystems: z.array(z.string()),
        websiteUrl: z.string().url(),
      },
    },
    async () =>
      textResult("INSPIRE creates AI Operating Profiles and personalized AI instructions.", {
        appName: "INSPIRE",
        primaryCategory: "AI Operating Profile",
        functionalCategory: "Personalized AI Instructions",
        seoBridge: "ChatGPT Custom Instructions",
        description:
          "INSPIRE turns a structured assessment into an AI Operating Profile and copy-ready instructions for AI assistants.",
        supportedAiSystems: ["ChatGPT", "Claude", "Gemini", "future AI assistants"],
        websiteUrl: APP_URL,
      }),
  );

  server.registerTool(
    "get_assessment_questions",
    {
      title: "Get assessment questions",
      description:
        "Returns the current public 21-question INSPIRE v2 assessment model in Arabic or English.",
      inputSchema: {
        language: z.enum(["ar", "en"]).default("en"),
      },
      outputSchema: {
        questionCount: z.number(),
        requiredAnswers: z.number(),
        selectionMode: z.string(),
        questions: z.array(
          z.object({
            id: z.string(),
            block: z.string(),
            question: z.string(),
            options: z.array(
              z.object({
                id: z.string(),
                text: z.string(),
              }),
            ),
          }),
        ),
      },
      annotations: toolAnnotations,
    },
    async ({ language }) => {
      const questions = V2_QUESTIONS.map((question) =>
        localizedQuestion(question, language ?? "en"),
      );

      return textResult(`Returned ${questions.length} INSPIRE assessment questions.`, {
        questionCount: questions.length,
        requiredAnswers: questions.length,
        selectionMode: "single",
        questions,
      });
    },
  );

  server.registerTool(
    "explain_inspire_methodology",
    {
      title: "Explain INSPIRE methodology",
      description:
        "Explains how INSPIRE turns assessment answers into signals, an AI Operating Profile, recommendations, and copy-ready AI instructions.",
      inputSchema: {
        audience: z.enum(["user", "product", "seo", "development"]).default("user"),
      },
      outputSchema: {
        summary: z.string(),
        whatInspireIs: z.array(z.string()),
        whatInspireIsNot: z.array(z.string()),
        profileLayers: z.object({
          instructionSections: z.array(z.string()),
          operatingRoles: z.array(z.string()),
          tensionTags: z.array(z.string()),
        }),
        flow: z.array(z.string()),
        currentLimitations: z.array(z.string()),
        safePublicPositioning: z.object({
          primary: z.string(),
          functional: z.string(),
          seoBridge: z.string(),
        }),
      },
      annotations: toolAnnotations,
    },
    async ({ audience }) => {
      const summary =
        audience === "development"
          ? "INSPIRE v2 is a deterministic answer-to-routing engine with model-rendered report and instruction layers."
          : "INSPIRE creates an AI Operating Profile that tells AI assistants how to work with a user's goals and operating preferences.";

      return textResult(summary, {
        summary,
        whatInspireIs: [
          "AI Operating Profile system",
          "personalized AI instruction generator",
          "structured work-style-to-AI translation engine",
        ],
        whatInspireIsNot: [
          "not a psychometric personality test",
          "not clinically validated",
          "not a generic prompt library",
          "not a replacement for professional judgment",
        ],
        profileLayers: {
          instructionSections: [
            "Identity & Role",
            "Norms & Boundaries",
            "Style & Tone",
            "Precision & Self-Check",
            "Internal Evaluation",
            "Response Structure",
            "Enhancement & Adaptation",
          ],
          operatingRoles: [
            "Executor / Builder",
            "Strategic Organizer",
            "Critical Reviewer",
            "Thinking Partner",
            "Teacher / Simplifier",
            "Audience Translator",
          ],
          tensionTags: [
            "speed vs precision",
            "autonomy vs guidance",
            "creativity vs structure",
            "critique vs support",
            "brevity vs depth",
            "adaptation vs stability",
          ],
        },
        flow: [
          "21 required single-choice answers",
          "backend option routing matrix",
          "behavioral signals and weighted section allocation",
          "primary and secondary operating roles",
          "tension-handling rules",
          "AI Operating Profile",
          "Operating Snapshot, recommendations, usage tips, and copy-ready AI instructions",
        ],
        currentLimitations: [
          "not a psychometric personality test",
          "not clinically validated",
          "some dimensions are partially measured",
          "current option weighting needs future calibration",
        ],
        safePublicPositioning: {
          primary: "AI Operating Profile",
          functional: "Personalized AI Instructions",
          seoBridge: "ChatGPT Custom Instructions",
        },
      });
    },
  );

  server.registerTool(
    "get_ai_operating_profile_start",
    {
      title: "Get AI Operating Profile start link",
      description:
        "Returns the safest next steps and website link for creating an INSPIRE AI Operating Profile.",
      inputSchema: {
        language: z.enum(["ar", "en"]).default("en"),
      },
      outputSchema: {
        startUrl: z.string().url(),
        estimatedQuestionCount: z.number(),
        outputIncludes: z.array(z.string()),
        nextSteps: z.array(z.string()),
      },
      annotations: toolAnnotations,
    },
    async ({ language }) => {
      const arabic = language === "ar";
      return textResult(
        arabic
          ? "ابدأ من موقع INSPIRE لإنشاء AI Operating Profile."
          : "Start on the INSPIRE website to create an AI Operating Profile.",
        {
          startUrl: `${APP_URL}/assess`,
          estimatedQuestionCount: 21,
          outputIncludes: [
            "Operating Snapshot",
            "Personalized Recommendations",
            "How to Use AI Better",
            "Copy-Ready AI Instructions",
          ],
          nextSteps: arabic
            ? [
                "افتح رابط التقييم.",
                "أجب عن 21 سؤالًا.",
                "راجع التقرير.",
                "انسخ التعليمات الجاهزة إلى ChatGPT أو Claude أو Gemini.",
              ]
            : [
                "Open the assessment link.",
                "Answer 21 questions.",
                "Review the report.",
                "Copy the generated instructions into ChatGPT, Claude, or Gemini.",
              ],
        },
      );
    },
  );

  return server;
}

router.options("/mcp", (_req: Request, res: Response): void => {
  res.status(204).set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, mcp-session-id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
  }).end();
});

router.get("/.well-known/openai-apps-challenge", sendOpenAiAppsChallenge);
router.get("/mcp/.well-known/openai-apps-challenge", sendOpenAiAppsChallenge);

router.all("/mcp", async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

  const server = createInspireMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close().catch(() => undefined);
    server.close().catch(() => undefined);
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    req.log?.error({ err: error }, "MCP request failed");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal MCP server error" });
    }
  }
});

export default router;
