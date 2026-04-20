---
name: ask-questions-if-underspecified
description: "Clarify requirements before implementing by asking targeted questions to eliminate ambiguity. Use when a task has multiple plausible interpretations, unclear scope, undefined acceptance criteria, or missing constraints. Do not activate automatically — only when explicitly invoked."
author: Tibo (Codex Team)
context: fork
---

# Ask Questions If Underspecified

Ask the minimum set of clarifying questions needed to avoid wrong work. Do not start implementing until must-have questions are answered or the user explicitly approves proceeding with stated assumptions.

## Workflow

### Step 1: Assess Whether the Request Is Underspecified

Treat a request as underspecified if any of the following remain unclear after initial exploration:

| Dimension | What to check |
|-----------|--------------|
| Objective | What should change vs stay the same |
| Done criteria | Acceptance criteria, examples, edge cases |
| Scope | Which files, components, or users are in or out |
| Constraints | Compatibility, performance, style, dependencies, time |
| Environment | Language/runtime versions, OS, build/test runner |
| Safety | Data migration, rollout/rollback plan, reversibility |

If multiple plausible interpretations exist, treat it as underspecified.

### Step 2: Ask Must-Have Questions (1–5 Max)

Prefer questions that eliminate whole branches of work. Structure questions for fast, scannable responses:

- Use numbered questions with lettered options
- Bold the recommended/default choice
- Include a fast-path response (e.g., reply `defaults` to accept all defaults)
- Include a "Not sure — use default" option when helpful
- Separate "Need to know" from "Nice to know" if that reduces friction

**Example format:**

```text
1) Scope?
   a) Minimal change **(default)**
   b) Refactor while touching the area
   c) Not sure — use default

2) Compatibility target?
   a) Current project defaults **(default)**
   b) Also support older versions: <specify>
   c) Not sure — use default

Reply with: defaults (or 1a 2a)
```

### Step 3: Pause Before Acting

Until must-have answers arrive:
- Do not run commands, edit files, or produce plans that depend on unknowns
- Low-risk discovery is allowed (e.g., inspect repo structure, read config files) as long as it does not commit to a direction

If the user asks to proceed without answers:
1. State assumptions as a short numbered list
2. Ask for confirmation before proceeding

### Step 4: Confirm Interpretation and Proceed

Restate the requirements in 1–3 sentences (including key constraints and what success looks like), then begin implementation.

## Question Templates

- "Before I start, I need: (1) ..., (2) ..., (3) .... If you don't care about (2), I'll assume ...."
- "Which of these should it be? A) ... B) ... C) ... (pick one)"
- "What would you consider 'done'? For example: ..."
- "Any constraints I must follow (versions, performance, style, deps)? If none, I'll target existing project defaults."

## Anti-Patterns

- Do not ask questions answerable through low-risk discovery (e.g., reading configs, existing patterns, docs)
- Do not ask open-ended questions when a tight multiple-choice or yes/no would eliminate ambiguity faster
- Do not ask more than 5 questions in the first pass — prioritize by impact on the implementation direction
