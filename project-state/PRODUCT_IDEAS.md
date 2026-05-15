# INSPIRE Product Ideas

This file is the lightweight discussion backlog for product ideas before implementation. It should capture the idea, why it may help, how it should feel to the customer, and the guardrails that protect the current product.

## Idea 1: Add Positive Work Pattern Insights To The Report

### Status
Discussion candidate. Do not implement yet.

### Product Direction
Add a short report section that helps the customer see:
- what already works well in their work pattern
- what deserves attention or deliberate improvement
- why these points matter in real work, not only when using AI

The section should strengthen the Operating Pattern Report without turning it into a personality test, psychological assessment, or harsh performance review.

### Recommended Section Framing
Avoid direct labels such as:
- Weaknesses
- نقاط ضعف
- عيوب
- Problems
- Development Areas, if it conflicts with current legacy-report restrictions

Better English options:
- What Works in Your Favor
- What to Watch and Improve
- Practical Working Advantages
- Improvement Focus
- Your Useful Work Patterns

Better Arabic options:
- ما يعمل لصالحك
- ما يستحق الانتباه والتحسين
- ما يساعدك على الأداء الأفضل
- مجالات تحسين عملية
- أنماط عملية تخدمك

Recommended pair:
- English: `What Works in Your Favor` and `What to Watch and Improve`
- Arabic: `ما يعمل لصالحك` and `ما يستحق الانتباه والتحسين`

### Writing Basis
Each point must be grounded in the already interpreted INSPIRE profile, not invented from general advice.

Allowed foundations:
- selected work pattern signals from the answers
- operating roles, such as builder, reviewer, organizer, explainer, or thinking partner
- recurring behavior patterns, such as starting style, ambiguity handling, review style, learning style, communication style, and response to repeated problems
- selected instruction/output behaviors already used by the report writer
- balancing guidance, such as speed versus review, structure versus flexibility, independence versus asking one focused question
- practical context, such as domain, project context, and report language

Avoid basing points on:
- raw question IDs or selected option IDs
- scores, percentages, thresholds, or matrix internals
- psychological labels
- unsupported traits
- moral judgment
- fixed generic productivity advice

### Tone Rules
The section should feel:
- honest
- encouraging
- practical
- specific
- respectful
- useful without flattering

Do not write:
- "You are weak at..."
- "You struggle with..."
- "Your problem is..."
- "You lack..."
- "You are the kind of person who..."

Use safer wording:
- "Your work improves when..."
- "This pattern helps you..."
- "This can work in your favor when..."
- "A useful watch point is..."
- "You may get better results by..."
- "When this pattern appears, add..."

### Customer Value
The customer should leave with two feelings:
- Recognition: "This describes how I actually work."
- Agency: "I know what to use more deliberately and what to improve next."

The section should not make the customer feel judged. It should make the report feel more personal, useful, and worth paying for.

### Example Direction
Good:
- "You move forward faster when unclear work is turned into a first practical step. This works in your favor because it prevents long pauses when the full picture is not ready."
- "A useful watch point is to add a short review step before final decisions, especially when you move quickly from idea to action."
- "Your pattern benefits from practical examples and small tests; use them when a new topic feels too abstract."

Avoid:
- "You are impatient."
- "Your weakness is poor planning."
- "You overthink."
- "You are a perfectionist."
- "You lack confidence."

### Possible Report Placement
Best placement:
1. Operating Snapshot
2. What Works in Your Favor / What to Watch and Improve
3. Personalized Recommendations
4. How to Use AI Better
5. Copy-Ready AI Instructions

Reason:
The new section bridges the short snapshot and the actionable recommendations. It explains what is useful in the customer's pattern and what to improve before giving recommendations.

### Implementation Notes For Later
This likely requires a report content contract change from `operating_pattern` `v1` to a new version, or a backwards-compatible optional section.

Do not change the matrix or questions just to add this section. The current answer set already supports it.

Before implementation, decide:
- exact section names in English and Arabic
- number of bullets per side
- whether the section is AI-generated, rule-generated, or mixed
- whether PDF/share views should include it
- how to update report writer validation without allowing old legacy labels or internal terms

