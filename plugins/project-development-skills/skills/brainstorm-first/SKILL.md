---
name: brainstorm-first
description: Independent pre-implementation workflow for explicit brainstorming, three-way comparison, reality checks, diagnosis options, UI concept generation, or ambiguous high-impact decisions. Produce exactly three practical options, recommend one, and stop for selection. Do not combine with project-development-mindset or implementation specialists before selection; do not use for ordinary fixes or an approved approach.
---

# Brainstorm First

Turn an uncertain request into a reality-checked decision before implementation. Preserve the user's goal, but do not endorse an impractical feature or preferred solution merely because the user proposed it.

## Non-negotiable gates

- Do not change project or external state, make purchases, deploy, or take other implementation actions before the user chooses an option. Read-only discovery and safe diagnostic checks are allowed when they help clarify the decision. In UI/UX concept mode, temporary preview images explicitly requested for comparison are also allowed, but do not treat them as production assets or add them to the project before selection.
- Inspect available context before asking questions. Do not ask the user for facts that can be found safely in supplied artifacts, the repository, logs, configuration, or authoritative documentation.
- Do not silently assume a material product, architecture, behavior, scope, cost, or design choice. State unresolved material assumptions and ask about them.
- Challenge requirements when evidence, constraints, user value, accessibility, security, maintenance, compatibility, cost, or operational reality makes the current request weak. Explain the concrete issue and offer a better framing; do not be contrarian without evidence.
- Present exactly three meaningfully different, viable options and recommend one. Do not create cosmetic variants merely to reach three.
- Include the required scores and deductions in every completed decision package after the brief is decision-ready. Do not score an incomplete clarification turn. Scores are structured judgments, not measured facts; do not inflate them or imply false precision.
- After presenting the decision package, stop and wait for the user to choose, revise, or reject the options. Do not continue with the recommendation automatically.

## Workflow

### 1. Route and investigate

Choose the mode that owns the uncertainty:

- **Requirements:** unclear scope, product behavior, architecture, workflow, or implementation direction.
- **Diagnosis:** a bug, failure, regression, or unexpected behavior whose cause is not yet established.
- **UI/UX concepts:** the user wants three visual interface directions before implementation.

This skill independently owns the pre-implementation decision phase. Do not
preload `project-development-mindset`, debugging, UI implementation, or other
implementation specialists alongside it. Gather the read-only evidence needed
for the decision here. After the user selects an option, exit this workflow and
start implementation with the available project coordinator, which may then
route to one specialist if needed.

Gather the minimum evidence needed to understand the current state. Separate observed facts, evidence-backed inferences, user preferences, and open questions.

In diagnosis mode, reproduce the problem or establish equivalent evidence when practical. Trace the failure far enough to distinguish a confirmed cause from competing hypotheses. Do not manufacture three root causes; the requirement for three applies to solution options after the investigation.

### 2. Clarify material uncertainty

Ask one to three focused questions per round when answers could materially change the outcome. Continue until the request can be restated as a decision-ready brief containing:

- desired outcome and target users;
- current problem or opportunity;
- in-scope and out-of-scope behavior;
- constraints and non-negotiables;
- success criteria;
- known evidence and unresolved uncertainty.

If a material unknown still prevents responsible comparison, ask the next focused question and stop that response. Do not fill the gap with an unspoken assumption.

### 3. Run a reality review

Review the clarified brief once more before proposing solutions. Test it against:

- whether it solves the underlying user problem rather than only the requested surface feature;
- feasibility within the actual technical, time, budget, data, and platform constraints;
- complexity relative to expected value;
- failure modes, edge cases, accessibility, privacy, security, and abuse potential when relevant;
- maintenance, migration, compatibility, observability, and operating cost;
- evidence quality and remaining uncertainty.

Call out contradictions, unnecessary scope, weak assumptions, and improvements that would materially raise the expected outcome. When the original request is infeasible or inadvisable, say so directly and make at least one of the three options a corrected version of the underlying goal.

### 4. Score request readiness

Report a whole-number **Request readiness score** from 0 to 100 using this rubric:

- problem and outcome clarity: 20;
- real-world user value: 20;
- feasibility under known constraints: 20;
- risk and edge-case coverage: 15;
- usability and long-term maintainability: 15;
- evidence quality and uncertainty control: 10.

List every material deduction and how the score could improve. Use 100 only when every category is fully supported and there is no known material gap. A low score does not force rejection, but its unresolved risks must remain visible in the options.

### 5. Present exactly three options

For each option, provide:

- the core approach and what makes it distinct;
- how it satisfies the clarified brief;
- benefits and expected value;
- costs, risks, limitations, and prerequisites;
- a whole-number **Option fit score** from 0 to 100 and its material deductions.

Use the same option-fit rubric for all three:

- fit to the desired outcome: 30;
- practical and technical feasibility: 25;
- risk and maintenance profile: 20;
- user experience and adoption: 15;
- evidence confidence: 10.

Make tradeoffs comparable. Do not hide a preferred option's weaknesses or lower another option's score to justify the recommendation.

### 6. Recommend and stop

Recommend one option based on the evidence and constraints, even when it differs from the user's initial preference. Explain why it is the best practical choice and identify the condition that would change the recommendation.

End with a direct decision request to choose option 1, 2, or 3, or to request a revised set. Stop without implementation. If the user requests a material hybrid or changes the requirements, update the brief, rerun the reality review and scores, present a fresh set of three options, and stop again.

Once the user selects an option, treat that selection as approval to implement within the clarified scope. Ask again only if implementation reveals a new material decision, meaningful scope expansion, or separately permissioned action.

## Mode-specific output

### Requirements mode

Use this decision-package order:

1. Clarified brief
2. Reality review and constructive challenge
3. Request readiness score and deductions
4. Three options with option-fit scores
5. Recommendation
6. Decision required

### Diagnosis mode

Before the decision package, report:

- observed failure and reproduction evidence;
- confirmed root cause, or clearly labeled hypotheses if confirmation is not yet possible;
- affected scope and confidence limits.

Then provide three remediation options, a recommendation, and the required stop. Do not implement the fix during the investigation-and-selection phase.

### UI/UX concept mode

Clarify the product, audience, platform, key screen or flow, content, brand constraints, accessibility needs, and desired fidelity. Inspect an existing product and design system when available before inventing a new visual language.

After the reality review, define three strategically distinct directions, such as conservative, balanced, and bold, while keeping the same functional brief and comparable content. When the environment provides `$imagegen`, use it to generate three separate preview images, one per concept, with a separate prompt or call for each direction. Inspect the outputs for requirement fit before presenting them.

If `$imagegen` or an equivalent image-generation capability is unavailable, report the blocker and ask whether the user accepts text-only concept briefs. Do not silently replace requested images with placeholders.

For each concept, show the preview, rationale, important interaction implications, tradeoffs, and option-fit score. Recommend one concept and stop for selection before writing implementation code or treating a preview as a production asset.

## Delegation

Run this skill in the main conversation by default. Do not invoke subagents, agent teams, or delegated workers unless the user explicitly requests delegation. Before delegating, warn that delegation can increase usage, present the proposed agent count and scope, and obtain approval. Ask again before expanding either the approved count or scope.
