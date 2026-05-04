# INSPIRE v2 Decision Engine Notes

This note documents the added scoring/allocation layer for the current 21-question INSPIRE v2 routing matrix. It does not rewrite the questions or change the existing option routes.

## Added Route Fields

Each option route now has:

- `questionWeight`: question-level importance.
- `optionStrengthWeight`: option-level signal strength.
- `inspireAllocation`: normalized distribution across the seven final INSPIRE instruction sections. Values must sum to `1.00`.
- `roleHints`: 0, 1, or 2 point hints for the six role candidates.
- `contradictionTags`: possible tension tags for later interpretation.
- `confidenceEffect`: `1`, `0`, or `-1` based on behavioral clarity.

## Final INSPIRE Sections

- `IdentityRole`
- `NormsBoundaries`
- `StyleTone`
- `PrecisionSelfCheck`
- `InternalEvaluation`
- `ResponseStructure`
- `EnhancementAdaptation`

## Role Hints

- `ExecutorBuilder`
- `StrategicOrganizer`
- `CriticalReviewer`
- `ThinkingPartner`
- `TeacherSimplifier`
- `AudienceTranslator`

## Weighting Assumptions

- Current `Setup / Behavioral Bridge` questions are treated as Secondary questions: `1.5`.
- Current `Behavioral Backbone` questions are treated as Core questions: `3`.
- Current `AI-Use Scenario` questions are treated as AI-specific behavioral questions: `2`.
- The current matrix does not yet identify dedicated Consistency, General Calibration, or Open-ended scored questions, so those weights are not assigned in this pass.
- Existing route `strength` maps to `optionStrengthWeight`: `primary = 1.0`, `secondary = 0.6`, and `weak/contextual = 0.3`.
- Current routing sections are not treated as final INSPIRE sections. They are mapped into the seven final instruction sections and normalized per option.

## Calculation Flow

For each selected answer:

1. Calculate `weightedScore = questionWeight * optionStrengthWeight`.
2. Add `weightedScore * inspireAllocation[section]` into each INSPIRE section score.
3. Add `weightedScore * roleHints[role]` into each role score.
4. Count contradiction tags.
5. Add `weightedScore * confidenceEffect` into the confidence score.

The engine then passes calculated allocation scores, role scores, primary role, optional secondary role, contradiction tags, and confidence index to the AI writer. The AI writer must write from these calculated decisions and must not infer the profile directly from raw answers.

## Debug Profile Output

`computeInspireV2Profile` returns a deterministic `computedProfile` object before prompt generation. It includes selected answers, section scores, section percentages, role scores, primary and secondary roles, contradiction tags, generated contradiction handling rules, confidence index, evidence labels, selected instruction rules, output rules, red lines, and risk guards.

## Domain Role vs Operating Mode

INSPIRE v2 separates domain expertise from behavioral delivery style.

Domain fields:

- `domain`: mandatory selected domain for the product flow. Allowed setup values are Coding / Software Development, IT / Systems & Support, Marketing, Education, Finance, Operations, Sales / Customer Service, HR, Healthcare, Legal, and Other.
- `customDomain`: required only when `domain` is Other.
- `domainSpecialization`: optional short specialization inside the selected or custom domain.
- `projectContext`: optional free-text project, idea, use case, or project name. It enriches context and examples, but must not automatically become the domain role.
- `domainRole`: derived from `domain` first, then refined only by explicit `domainSpecialization`.
- `domainSource`: where the domain came from. New product flow uses `selected_domain`.
- `domainConfidence`: `high` when domain and specialization are explicit, `medium` when only domain exists, and `low` only when domain is unavailable due to data error.

Operating fields:

- `primaryOperatingArchetype`: computed from the 21 behavioral questions and role hints.
- `secondaryOperatingMode`: optional computed secondary mode.
- `operatingModeTriggers`: conditions for using the secondary mode.

Backward-compatible aliases remain temporarily:

- `primaryRole` = `primaryOperatingArchetype`
- `secondaryRole` = `secondaryOperatingMode`

Behavioral answers must never invent a domain sub-specialization. `projectContext` must not be turned into professional specialization unless the user explicitly phrases it as specialization.

The proof script is:

```bash
node scripts/prove-inspire-v2-decision-engine.mjs
```

It runs five fixed profiles and prints the full computed profiles as JSON.

## Contradiction Handling Rules

Contradiction tags are not only collected. They generate handling rules before AI writing:

- `speed_vs_precision`: provide a quick actionable first version, then apply concise verification.
- `autonomy_vs_guidance`: proceed independently on clear tasks, ask one focused question when requirements are missing.
- `brevity_vs_depth`: start concise, then offer expandable detail for complex tasks.
- `creativity_vs_structure`: offer creative options inside a structured comparison.
- `critique_vs_support`: challenge weak logic without harsh or motivational language.
- `adaptation_vs_stability`: adapt to repeated corrections while preserving stable rules unless explicitly changed.

## Open Answer Overlay

Open-ended answers exist outside the numeric matrix. They are passed to the AI writer as qualitative context only.

They may affect:

- tone
- examples/domain
- red lines
- adaptation rules

They must not directly affect:

- INSPIRE section scores
- role scores
- primary role
- secondary role

## Option Strength Audit

Current `optionStrengthWeight` distribution is intentionally left unchanged in the matrix until reviewed. The proof script prints an audit-only suggested changes table using this calibration principle:

- `1.0`: explicit/strong behavior.
- `0.6`: contextual or moderate behavior.
- `0.3`: weak, ambiguous, or persistence/adaptation-only behavior.

The script does not apply these suggestions.

## Hard-To-Allocate Areas

- Some `ruleTextAr`, `ruleTextEn`, and `riskGuard` values are currently truncated with ellipses. Their allocations use available route metadata rather than complete prose.
- `universal_quality_rules` routes are retained in the matrix but mapped only into fixed operating dimensions such as `PrecisionSelfCheck` and `NormsBoundaries`; the AI is still instructed not to generate universal rules.
- Role hints are heuristic in this pass because the previous matrix had no explicit role columns.
- The current strength distribution is heavily skewed: almost all routes are `primary`, with only one `secondary`. Future calibration may need more `secondary` or `weak/contextual` routes.
- There are no explicit consistency-check questions yet, so contradictions are detected through route tags rather than pairwise answer conflict logic.
