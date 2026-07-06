---
name: ui-ux-concept-implementation
description: Implement frontend UI/UX from user-approved concepts, mockups, screenshots, visual references, or a website the user wants to emulate or clone. Use when Codex must generate and compare UI concepts, recommend a concept as a technical leader, predict the user's likely preference, persist the chosen concept outside commits, recreate a reference site's look and interactions in an existing project, or verify before/after UI with Playwright, Playwright MCP, Chrome DevTools MCP, screenshots, and responsive checks.
---

# UI/UX Concept Implementation

## Overview

Use this skill to turn a selected visual direction into working UI while keeping concept decisions traceable, project-local, and verifiable in a real browser.

## Source Of Truth

- Start from the existing project instructions, design system, routes, components, tokens, global styles, assets, and UI conventions.
- Use existing components, wrappers, layout primitives, icon libraries, typography, colors, spacing, motion, and accessibility patterns before inventing new ones.
- For concept or screenshot tasks, collect the target concept, current rendered UI, relevant viewport sizes, states, and user constraints before editing.
- For website clone requests, treat the target site as a visual and interaction reference. Do not copy proprietary source code, private assets, trademarks, logos, paid media, or brand-identifying content unless the user owns or supplies rights.
- If the target is an admin, internal, dashboard, CRM, CRUD, reporting, or back-office surface, combine this skill with the repository's dashboard-specific UI skill when available.

## Concept Decision Contract

When the task includes generating concepts or comparing multiple UI directions:

1. Present each concept with a short stable label such as `Concept A`, `Concept B`, or `Concept C`.
2. Summarize the main layout, visual language, tradeoffs, implementation risk, and fit with the current project for each concept.
3. Always include `Technical Leader recommendation`: choose the concept you would ship as the technical lead and explain the engineering reason.
4. Always include `Likely user preference`: name the concept the user is most likely to prefer based on their request, product context, tone, and visual taste signals.
5. Ask the user to choose before implementing when the concepts materially differ.

If the user already chose a concept or provided a single target, skip concept generation and continue with implementation.

## Persist The Selected Concept

After the user chooses a concept, save the selected concept immediately inside the target project, but keep it out of commits:

1. Prefer an existing ignored temp folder if the project has one, such as `.tmp/`, `tmp/`, `.cache/`, or `.codex/`.
2. Otherwise create `.tmp/ui-ux-concepts/` in the project root.
3. Save the selected concept as a markdown file with the concept label, source request, decision rationale, target routes/components, visual notes, and verification plan.
4. If the project is a Git repository, add the temp folder to `.git/info/exclude` when it is not already ignored. Avoid changing committed ignore files unless the user asks for a durable rule.
5. Never stage, commit, or include files from the temp concept folder in a PR.
6. Mention the saved concept path in progress updates and the final response.

## Goal And Browser Verification

When the environment supports persistent Goals, suggest that the user create a Goal to track the UI task from current state through completed after-state verification. Do not create a Goal unless the user explicitly agrees or the environment instructions allow it.

Use real-browser verification with this priority:

1. Playwright MCP
2. Chrome DevTools MCP
3. Local Playwright CLI or another browser automation path
4. Manual browser checks only when automation is unavailable

If both Playwright MCP and Chrome DevTools MCP are available, use Playwright MCP first.

Before editing:

- Capture the current page, component, or region at the relevant viewport.
- Prefer element or region screenshots before full-page screenshots unless page-level composition matters.
- Record route, viewport, theme, data state, account state, and any interaction needed to reproduce the view.

After editing:

- Capture the same viewports and states.
- Compare the selected concept, before screenshot, and after screenshot.
- Verify responsive layout, overflow, text fit, hover/focus where practical, loading/empty/error states when relevant, and keyboard-visible focus.

## Implementation Workflow

1. Map the concept to project-owned source files, components, styles, tokens, routes, and assets.
2. Identify reusable UI surfaces before creating new components or CSS.
3. Translate the concept into concrete layout, typography, color, spacing, imagery, interaction, and responsive rules.
4. Implement the smallest cohesive slice that proves the direction, then complete the remaining states.
5. Keep page files focused on composition and keep domain logic, data fetching, styles, and reusable primitives in the project's established boundaries.
6. Use real content, representative data, or project fixtures when available. Avoid placeholder-heavy UI unless the task is explicitly a prototype.
7. Do not add a new dependency unless existing project tools cannot reasonably achieve the concept and the tradeoff is clear.

For reference-site implementation:

- Capture reference screenshots at the same viewport sizes used for the target project.
- Recreate structure, hierarchy, rhythm, and interaction intent with project-owned code and assets.
- Adapt visual details to the user's product, brand, content, accessibility requirements, and legal constraints.
- Avoid copying tracking scripts, analytics, hidden implementation details, or vendor-specific markup from the reference site.

## Final Handoff

Report:

- Which concept was selected and where it was saved.
- Files changed.
- Browser verification performed, including screenshot paths when available.
- Any states or viewports not verified.
- Confirmation that the temporary concept artifact was not staged or committed.
