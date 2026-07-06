# UI/UX Concept Routing

Use this reference from `project-development-mindset` when a task includes UI/UX concepts, mockups, screenshots, visual references, or a request to emulate or clone a website.

## Route To The Optional Skill

Use `ui-ux-concept-implementation` when the sibling skill exists and the task centers on:

- generating UI concepts before implementation
- implementing a user-selected concept
- matching a screenshot, mockup, or visual reference
- recreating the look and interaction pattern of a reference website
- verifying visual before and after states with browser screenshots

Stay in `project-development-mindset` for small local UI fixes that do not need concept selection, screenshot matching, or reference-site reconstruction.

Use `design-system-generator` when the project needs a durable `docs/DESIGN_SYSTEM.md` or design-token rules. Use `testing-verification` when browser verification, screenshot comparison, acceptance criteria, or visual QA is the main risk area.

## Concept Selection Rules

When the task includes creating concepts:

- Label each concept with a stable name.
- Always state which concept you would choose as Technical Leader and why.
- Always state which concept the user is most likely to prefer and why.
- Ask the user to decide before implementation when the concepts materially differ.

After the user chooses:

- Save the selected concept immediately in a project-local temporary folder.
- Prefer an existing ignored temp folder; otherwise use `.tmp/ui-ux-concepts/`.
- If the project uses Git, add the temp folder to `.git/info/exclude` when needed.
- Never stage or commit the saved concept artifact.

## Verification Preference

Suggest a Goal when the environment supports persistent goals so the agent can keep verifying the concept, current state, and final after-state until the UI work is complete.

Use browser tooling in this order:

1. Playwright MCP
2. Chrome DevTools MCP
3. Local Playwright CLI or equivalent browser automation
4. Manual browser checks only when automation is unavailable

If Playwright MCP and Chrome DevTools MCP both exist, use Playwright MCP first.
