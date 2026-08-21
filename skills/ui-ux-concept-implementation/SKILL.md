---
name: ui-ux-concept-implementation
description: Coordinator-routed implementation specialist for a selected UI concept, single mockup/screenshot, visual reference, or reference site. Use after project-development-mindset makes visual matching primary, or directly when explicitly invoked or installed standalone. Multiple unselected concepts use independent brainstorm-first; operational dashboards use office-web-ui-system when available. Do not use for routine UI edits or supporting browser checks.
---

# UI/UX Concept Implementation

## Overview

Use this skill to turn a selected visual direction into working UI while keeping concept decisions traceable, project-local, and verifiable in a real browser.

Run this skill in the main conversation. Do not spawn subagents, agent teams, or
delegated parallel workers unless the user explicitly approves the proposed
count and scope after being told that doing so can increase usage. Ask again
before expanding an approved scope.

## Source Of Truth

- Start from the existing project instructions, design system, routes, components, tokens, global styles, assets, and UI conventions.
- Use existing components, wrappers, layout primitives, icon libraries, typography, colors, spacing, motion, and accessibility patterns before inventing new ones.
- For concept or screenshot tasks, collect the target concept, current rendered UI, relevant viewport sizes, states, and user constraints before editing.
- For website clone requests, treat the target site as a visual and interaction reference. Do not copy proprietary source code, private assets, trademarks, logos, paid media, or brand-identifying content unless the user owns or supplies rights.
- If the target is an admin, internal, dashboard, CRM, CRUD, reporting, or
  back-office surface and a dashboard-specific UI skill is available, return
  routing control to `project-development-mindset` and use that specialist
  instead of combining two full UI workflows.

## Selection Gate

This skill starts after the visual direction is selected. A user-supplied single
mockup, screenshot, or reference site counts as a selected target.

When the user asks to generate or compare multiple unselected directions, stop
before implementation and use `brainstorm-first` independently when available.
Do not preload this implementation workflow during that decision phase. If
`brainstorm-first` is unavailable, present the routing limitation and obtain a
selection before implementing.

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

1. the environment's built-in Browser and its instructions when available
2. a project-owned source-controlled browser test for repeatable regression coverage
3. another available browser automation path documented as a fallback
4. manual browser checks only when automation is unavailable

Keep an exploratory browser pass distinct from source-controlled automated E2E
coverage in the final report.

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
