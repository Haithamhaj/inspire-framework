# INSPIRE v2 Methodology

## Purpose

This document defines the current INSPIRE v2 methodology as implemented in the assessment engine. It is intended to keep product positioning, homepage copy, SEO content, report language, and future development aligned with the real system.

This is an internal product and methodology document. It describes what INSPIRE currently does, what it does not do, which claims are safe, and which claims should be avoided.

## 1. What INSPIRE Is

INSPIRE is an AI Operating Profile system.

It uses a structured 21-question assessment to identify how a person prefers an AI assistant to help them think, decide, plan, clarify, execute, review, adapt, and communicate. The system then converts those answers into a personalized operating profile for AI tools such as ChatGPT, Claude, Gemini, and future AI systems.

The practical output of INSPIRE is not only a written report. The core product is a portable set of personalized AI operating instructions that tell an AI assistant how to work with the user.

INSPIRE currently functions as:

- An AI operating profile generator.
- A personalized AI instruction generator.
- A practical work-style-to-AI translation engine.
- A structured method for turning user preferences into assistant behavior rules.
- A bridge between human operating patterns and AI response behavior.

INSPIRE separates three important layers:

1. The user's domain and project context.
2. The user's operating pattern.
3. The assistant behavior that should be produced from that pattern.

This distinction matters. INSPIRE is not simply asking, "What prompt do you want?" It is asking, "How should AI operate around you so its answers become more useful?"

## 2. What INSPIRE Is Not

INSPIRE is not a psychometric personality test.

It does not diagnose personality traits, mental health, workplace fitness, intelligence, emotional state, or clinical characteristics. It should not be positioned as a DISC, MBTI, Big Five, therapy, coaching, hiring, or clinical assessment.

INSPIRE is also not:

- A generic prompt generator.
- A prompt library.
- A chatbot.
- A productivity quiz.
- A clinical or psychological instrument.
- A validated behavioral science assessment.
- A replacement for expert judgment in high-stakes decisions.
- A system that proves stable personality traits.

INSPIRE should describe operating patterns, not personal identity. Its language should focus on practical work behavior and AI usage, not fixed traits.

Preferred framing:

- "You get better AI results when..."
- "Your AI assistant should..."
- "This profile helps AI respond with..."
- "Your operating pattern suggests..."

Avoid framing:

- "You are the type of person who..."
- "Your personality is..."
- "This proves that you..."
- "INSPIRE diagnoses..."

## 3. Assessment Flow

The current full INSPIRE v2 assessment follows this flow:

1. User creates or signs into an account.
2. User provides setup context:
   - domain
   - custom domain when needed
   - optional domain specialization
   - project context
   - report language
3. User answers 21 required single-choice questions.
4. User may provide an optional open-ended answer.
5. Backend validates:
   - exactly 21 answers
   - all required question IDs are present
   - every selected option belongs to its question
6. Backend computes a deterministic decision snapshot.
7. Decision snapshot stores:
   - selected answers
   - matrix evidence
   - section scores
   - role scores
   - contradiction tags
   - confidence index
   - selected rules
   - selected red lines
   - selected output rules
8. The report writer receives a safe interpreted packet, not raw scoring logic.
9. The instruction writer receives a separate safe packet and produces copy-ready AI instructions.
10. The user sees an Operating Pattern Report and Copy-Ready AI Instructions.

Important implementation principle:

The AI writer is not supposed to infer the user's profile directly from raw answers. The deterministic decision engine interprets the answers first, then the AI writer turns the interpreted packet into user-facing language.

## 4. The 21-Question Model

The current v2 assessment contains 21 required single-choice questions grouped into three blocks.

### Setup / Behavioral Bridge

These questions connect everyday AI usage needs with broader operating behavior.

1. `S2_messy_task_help`
   - Measures what kind of AI help moves the user forward when the input is messy.
   - Options cover planning, exploring directions, drafting, gap detection, and simplification.

2. `S3_idea_clarity_for_others`
   - Measures how the user thinks about making an idea understandable to someone else.
   - Options cover self-clarity, plain language, relevance, structure, and adaptation to context.

### Behavioral Backbone

These questions capture practical work and decision behavior.

3. `Q01_starting_orientation`
   - What the user focuses on first when starting a task.

4. `Q02_ambiguity_handling`
   - How the user handles incomplete details.

5. `Q03_unfamiliar_decision`
   - How the user makes decisions in unfamiliar areas.

6. `Q04_plan_failure`
   - How the user responds when a trusted plan fails.

7. `Q05_stalled_task`
   - How the user recovers when stuck.

8. `Q06_success_clarity`
   - What the user needs before feeling on track.

9. `Q07_learning_style`
   - How the user prefers to understand something new.

10. `Q08_new_challenge`
    - How the user approaches unfamiliar challenges.

11. `Q09_repeating_problems`
    - How the user handles repeated problems.

12. `Q10_disagreement`
    - How the user handles disagreement about execution or decisions.

13. `Q11_tasks_piling`
    - How the user handles accumulated tasks.

14. `Q12_postponing`
    - What usually causes repeated postponement.

15. `Q13_completion_review`
    - What the user does after completing important work.

16. `Q14_error_feedback`
    - How the user responds when an error is pointed out.

17. `Q15_repeated_no_progress`
    - How the user responds when repeated attempts do not create progress.

### AI-Use Scenario

These questions capture AI-specific interaction preferences.

18. `AI01_correct_unusable`
    - Why a technically correct AI answer may still be unusable.

19. `AI02_incomplete_request`
    - How AI should respond when the user's request is incomplete but usable.

20. `AI03_repeated_ai_mistake`
    - How AI should adapt when it repeats a mistake or unsuitable style.

21. `AI04_trust_verification`
    - What makes important AI information or recommendations more trustworthy.

## 5. Three-Layer Profile Model

INSPIRE v2 uses a three-layer model to translate answers into an AI Operating Profile.

### Layer 1: Instruction Sections

Instruction Sections define which parts of the final AI instructions should receive the most emphasis.

Current sections:

1. `IdentityRole`
   - Defines the AI assistant's role, project context, domain role, and main operating identity.

2. `NormsBoundaries`
   - Defines boundaries, red lines, safeguards, and what the assistant should avoid.

3. `StyleTone`
   - Defines communication style, directness, level of detail, and tone.

4. `PrecisionSelfCheck`
   - Defines how the assistant handles accuracy, uncertainty, facts, sources, validation, and unsupported claims.

5. `InternalEvaluation`
   - Defines how the assistant checks quality before responding.

6. `ResponseStructure`
   - Defines how the assistant structures answers, steps, options, bullets, tables, and copy-ready outputs.

7. `EnhancementAdaptation`
   - Defines how the assistant adapts to feedback, repeated corrections, changing needs, and scope control.

### Layer 2: Operating Roles

Operating Roles describe the dominant assistant behavior that best fits the user's pattern.

Current roles:

1. `ExecutorBuilder`
   - The assistant should move toward usable output, practical steps, drafts, implementation, and action.

2. `StrategicOrganizer`
   - The assistant should organize ideas, clarify goals, sequence work, define priorities, and create structure.

3. `CriticalReviewer`
   - The assistant should review assumptions, identify weak points, check quality, and challenge unsupported logic.

4. `ThinkingPartner`
   - The assistant should explore possibilities, compare paths, ask useful questions, and help the user reason.

5. `TeacherSimplifier`
   - The assistant should explain clearly, simplify concepts, use examples, and support understanding.

6. `AudienceTranslator`
   - The assistant should adapt ideas for other people, audiences, stakeholders, or situations.

The highest-scoring role becomes the primary operating archetype. A secondary role may be selected if it is strong enough relative to the primary role.

### Layer 3: Tension Tags

Tension Tags identify balancing rules. They do not mean the user is contradictory. They identify preferences that need careful handling inside AI behavior.

Current tags:

1. `speed_vs_precision`
   - Balance quick usable output with verification.

2. `autonomy_vs_guidance`
   - Proceed independently when possible, but ask a focused question when missing information matters.

3. `creativity_vs_structure`
   - Explore multiple paths while keeping comparison structured.

4. `critique_vs_support`
   - Challenge weak logic without becoming harsh or overly motivational.

5. `brevity_vs_depth`
   - Start concise, then expand when complexity requires it.

6. `adaptation_vs_stability`
   - Adapt to repeated corrections while preserving stable rules unless the user explicitly changes them.

## 6. How Answers Become Signals

Each answer maps to a backend-only option route. The public question shows only the question and choices. The backend route contains the interpretation metadata.

Each option route can include:

- behavioral signal
- instruction sections affected
- report sections affected
- question weight
- option strength weight
- allocation across instruction sections
- role hints
- tension tags
- confidence effect
- rule text
- thinking mode effect
- red line effect
- risk guard

The basic scoring formula is:

```text
weightedScore = questionWeight * optionStrengthWeight
```

Then the engine distributes that score:

```text
sectionScore[section] += weightedScore * inspireAllocation[section]
roleScore[role] += weightedScore * roleHints[role]
confidenceScore += weightedScore * confidenceEffect
```

Tension tags are counted:

```text
contradictionTagCount[tag] += 1
```

The open-ended answer is treated differently. It is passed as qualitative context only. It may affect tone, examples, domain wording, red lines, or adaptation language. It must not directly change numeric section scores, role scores, the primary role, or the secondary role.

## 7. How Signals Become an AI Operating Profile

The decision engine converts selected answer routes into a computed profile.

The computed profile includes:

- selected answer evidence
- weighted behavioral signals
- instruction section scores
- instruction section percentages
- low-coverage notes
- role scores
- primary operating archetype
- secondary operating mode when applicable
- operating mode triggers
- tension tag counts
- generated balancing rules
- confidence index
- top evidence labels
- selected instruction rules
- selected output rules
- selected red lines
- selected risk guards
- open answer overlay
- selected thinking modes
- domain role and domain confidence

The domain model is separate from the operating model.

Domain fields define what kind of assistant the AI should be for the user's context. Operating fields define how that assistant should behave.

Example distinction:

- Domain role: "marketing strategy assistant"
- Operating role: "Critical Reviewer"

This means the assistant should operate as a marketing strategy assistant, but with a critical review behavior pattern.

## 8. How the Profile Becomes User-Facing Output

INSPIRE produces two major output streams:

1. Operating Pattern Report
2. Copy-Ready AI Instructions

These are related but not the same.

### Operating Snapshot

The Operating Snapshot is a short user-facing summary generated from the interpreted profile. It should explain how the user tends to work and what that means for AI usage.

Inputs include:

- primary operating archetype
- secondary operating mode
- domain role
- top instruction behaviors
- output behaviors
- balancing guidance
- selected thinking modes

The snapshot should be practical and concise. It should not expose raw scores, question IDs, option IDs, internal labels, or matrix logic.

### Personalized Recommendations

Personalized Recommendations turn the operating pattern into practical actions.

They may cover:

- better decision behavior
- better execution behavior
- better communication
- better planning
- better review habits
- better AI usage

These recommendations are generated from the safe interpreted packet, not from raw answer text.

### How to Use AI Better

This section combines:

1. Custom AI usage tips generated from the profile.
2. A fixed CRAFT prompt framework.
3. A link to Smart Prompt Engineer.

The purpose is to help the user apply the profile immediately when working with AI.

### Copy-Ready AI Instructions

Copy-Ready AI Instructions are the most important functional output.

They translate the AI Operating Profile into direct instructions for a future AI assistant. The instructions tell the assistant how to behave across:

- identity and role
- norms and boundaries
- style and tone
- precision and self-check
- internal evaluation
- response structure
- enhancement and adaptation
- thinking modes when useful

These instructions are intentionally portable. They are designed to be usable in ChatGPT, Claude, Gemini, and future AI systems that support custom instructions, project instructions, system prompts, or assistant behavior settings.

## 9. Current Limitations

### Not a Psychometric Personality Test

INSPIRE should not claim to measure stable personality traits. It measures practical operating preferences for AI interaction and work support.

### Not Clinically Validated

INSPIRE is not clinically validated and should not be presented as a clinical, psychological, medical, hiring, or diagnostic tool.

### Partially Measured Dimensions

The system partially measures several useful dimensions, including:

- decision style
- learning style
- communication style
- ambiguity handling
- review orientation
- risk and verification orientation
- execution style
- structure preference
- independence versus guidance
- collaboration preference
- creativity versus structure
- exploration versus efficiency
- reflection versus action
- analytical versus intuitive reasoning

These are currently inferred through option routing and weighted signals. They are not independent validated scales.

### Current Weighting Calibration Limits

The current model has calibration limits:

- Most option strength weights are currently strong/default values.
- The weighting model is deterministic but not psychometrically validated.
- Some dimensions are inferred indirectly rather than measured with multiple dedicated questions.
- Tension tags are counted from selected option metadata, not from a pairwise contradiction analysis.
- The open-ended answer is qualitative and does not change numeric scoring.
- Some route metadata may require future refinement as more user data and report quality evidence become available.

### Generated Language Variability

The computed profile is deterministic. The final report language and instruction wording are generated from safe packets, so wording may vary between generations. The system controls structure, source material, and constraints, but the final phrasing is still model-generated.

## 10. Recommended Public Positioning

INSPIRE should use a layered positioning model.

### Primary Category

AI Operating Profile

This is the strongest category because it describes the real product: a profile that tells AI how to operate around the user.

Recommended use:

- "Create your AI Operating Profile."
- "INSPIRE turns your working style into an AI Operating Profile."
- "Give AI a clear operating profile for how to support you."

### Functional Category

Personalized AI Instructions

This explains the practical output in simple terms.

Recommended use:

- "Get personalized AI instructions you can use in ChatGPT, Claude, Gemini, and other AI tools."
- "INSPIRE creates copy-ready instructions for your AI assistant."
- "Turn your work preferences into instructions AI can follow."

### SEO Bridge

ChatGPT Custom Instructions

This connects INSPIRE to existing search demand without reducing the product to ChatGPT only.

Recommended use:

- "Beyond ChatGPT Custom Instructions."
- "Create better ChatGPT Custom Instructions from a structured assessment."
- "Use INSPIRE instructions in ChatGPT, Claude, Gemini, or other AI systems."

Positioning rule:

Use "ChatGPT Custom Instructions" as the entry point for search and user familiarity. Use "AI Operating Profile" as the product category INSPIRE owns.

## 11. Safe Claims and Claims to Avoid

### Safe Claims

These claims are aligned with the current system:

- INSPIRE creates a personalized AI Operating Profile.
- INSPIRE turns assessment answers into copy-ready AI instructions.
- INSPIRE helps AI understand how to support your work style.
- INSPIRE is broader than ChatGPT Custom Instructions.
- INSPIRE instructions can be used with ChatGPT, Claude, Gemini, and similar AI systems.
- INSPIRE helps translate your preferences into assistant behavior rules.
- INSPIRE identifies practical operating patterns for AI use.
- INSPIRE can help improve the relevance, structure, clarity, and usefulness of AI responses.
- INSPIRE separates domain context from assistant behavior style.
- INSPIRE produces an Operating Pattern Report and Copy-Ready AI Instructions.

### Claims That Need Caution

These claims may be usable only with careful wording:

- "understands your work style"
  - Safer: "helps AI respond according to your stated work preferences."

- "personalized to you"
  - Safer: "personalized from your assessment answers and project context."

- "measures decision style"
  - Safer: "captures decision-related preferences that affect AI instructions."

- "AI learns how you think"
  - Safer: "INSPIRE translates your answers into guidance for how AI should respond."

### Claims to Avoid

Avoid these claims:

- INSPIRE is a personality test.
- INSPIRE is scientifically validated.
- INSPIRE clinically assesses the user.
- INSPIRE diagnoses work style.
- INSPIRE proves how someone thinks.
- INSPIRE predicts job performance.
- INSPIRE replaces coaching, therapy, expert review, legal advice, medical advice, or professional judgment.
- INSPIRE guarantees better AI answers.
- INSPIRE works perfectly across every AI system.
- INSPIRE fully measures personality, decision making, learning style, or risk profile.

## 12. Guidance for Product, Marketing, SEO, and Development

### Product Guidance

Future product changes should preserve the core idea:

```text
answers -> behavioral signals -> operating profile -> AI instructions
```

The report should explain the profile, but the profile and instructions are the core product.

### Marketing Guidance

Marketing should avoid making INSPIRE sound like a quiz, generic prompt tool, or personality test.

The strongest message is:

```text
INSPIRE creates an AI Operating Profile that tells AI how to work with you.
```

### SEO Guidance

SEO content can capture demand around:

- ChatGPT Custom Instructions
- custom instructions examples
- ChatGPT project instructions
- Claude project instructions
- Gemini personalization
- prompt engineering

But every SEO path should ladder up to the broader category:

```text
AI Operating Profile
```

### Development Guidance

Future development should prioritize:

- clearer dimension calibration
- richer option-strength weighting
- dedicated measurement for currently partial dimensions
- improved explainability of why a profile was selected
- stronger validation of generated report quality
- clearer portability behavior by AI platform
- versioned methodology changes when scoring logic changes

## 13. One-Sentence Methodology Summary

INSPIRE v2 is a structured AI personalization method that converts 21 assessment answers into behavioral signals, maps those signals into instruction sections, operating roles, and tension-handling rules, then generates an AI Operating Profile with practical recommendations and copy-ready instructions for AI systems.
