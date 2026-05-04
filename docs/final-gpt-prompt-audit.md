# Final GPT Prompt Audit

## Files And Functions

- Final V2 prompt assembly: `artifacts/api-server/src/lib/prompt-builder.ts` → `buildPromptV2`.
- OpenAI call: `artifacts/api-server/src/lib/ai-engine.ts` → `tryOpenAI`.
- Claude fallback call: `artifacts/api-server/src/lib/ai-engine.ts` → `tryClaude`.

## Provider Message Shape

There is no separate system or developer message for report generation.

OpenAI receives:

```ts
messages: [{ role: "user", content: prompt }]
```

Claude receives:

```ts
messages: [{ role: "user", content: prompt }]
```

The entire final GPT prompt is therefore the string returned by `buildPromptV2`.

## Raw Answer Injection

Raw answers are not injected into the final V2 prompt.

The prompt does not send question text, option text, or selected answer objects. It sends:

- authoritative computed profile JSON
- INSPIRE section scores and percentages
- role scores
- mandatory domain, optional custom domain for Other, optional domain specialization, optional project context, and computed domain role
- computed primary operating archetype and secondary operating mode
- contradiction tags and generated contradiction rules
- top evidence labels
- selected instruction rules
- selected output rules
- selected red lines
- selected risk guards
- optional open-answer overlay

Evidence labels are explicitly marked as supporting labels only. They must not be used to reinterpret the profile.

## Current Prompt Safety Rules

The current prompt now states:

```text
You are an INSPIRE report writer, not a behavioral scorer.

You are not analyzing the user from scratch.
The profile has already been computed by the INSPIRE decision engine.
Your task is only to write a clear user-facing report and a copy-ready system instruction using the computed profile.
Do not change the computed roles, scores, contradictions, selected rules, or risk guards.
Do not re-score answers.
Do not re-analyze raw answers.
Do not choose a new primaryRole or secondaryRole.
Do not invent unsupported personality traits.
Do not add generic advice that is not backed by selectedInstructionRules, selectedOutputRules, selectedRedLines, selectedRiskGuards, topEvidenceLabels, or the open-answer overlay.
```

## Current Prompt Structure

The prompt contains:

1. Role constraint: report writer, not scorer.
2. Subject profile metadata.
3. Authoritative computed profile JSON.
4. Human-readable computed score summary.
5. Supporting evidence labels.
6. Optional open-answer overlay marked as non-scoring.
7. Output task.
8. Required output markers.
9. A fixed seven-section INSPIRE system instruction format.

## Fixed System Instruction Format

The copy-ready system instruction must use exactly:

1. Identity & Role
2. Norms & Boundaries
3. Style & Tone
4. Precision & Self-Check
5. Internal Evaluation
6. Response Structure
7. Enhancement & Adaptation

## Audit Findings

- Passed: computedProfile is the source of truth.
- Passed: domain role is separated from operating archetype.
- Passed: domain specialization is not inferred from behavioral answers.
- Passed: project context is preserved as use-case/background context and is not treated as professional specialization.
- Passed: prompt explicitly forbids re-scoring.
- Passed: prompt explicitly forbids raw-answer re-analysis.
- Passed: prompt explicitly forbids choosing new roles.
- Passed: prompt explicitly forbids unsupported personality traits.
- Passed: prompt restricts advice to computed profile fields and open-answer overlay.
- Passed: final system instruction now uses the seven-section INSPIRE format.
- Passed: report explanation is separate from copy-ready system instruction.
- Passed: user-facing report and model-facing system instruction are distinguished.

## Remaining Risk

The generation call still sends the prompt as a single `user` message rather than using a provider-level `system` or `developer` message. The prompt itself is now restrictive, but a future hardening pass could move the non-negotiable constraints into a provider-level system/developer message for stronger instruction priority.
