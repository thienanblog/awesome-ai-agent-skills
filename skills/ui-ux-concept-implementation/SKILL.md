---
name: ui-ux-concept-implementation
description: Implement an already-selected visual direction from a mockup, screenshot, or reference site in an existing project, using project-owned code and equivalent-state browser comparison. Use when visual fidelity is primary, directly or after project-development-mindset routing. Do not use for concept generation, routine UI edits, or supporting browser checks; prefer a dashboard-specific workflow for operational dashboards when available.
---

# UI/UX Concept Implementation

## Overview

Turn a selected visual direction into working UI while preserving the project's
product identity and producing browser evidence against the target.

Run this skill in the main conversation. Do not spawn subagents, agent teams, or
delegated parallel workers unless the user explicitly approves the proposed
count and scope after being told that doing so can increase usage. Ask again
before expanding an approved scope.

## Establish The Visual Contract

- Confirm that one direction is selected. A single user-supplied mockup,
  screenshot, or reference site is a selected target. If materially different
  concepts remain unselected, return to the coordinator or obtain the user's
  selection before implementation.
- If the selected target is an operational dashboard and a dashboard-specific
  workflow is available, return to the coordinator and use it. Otherwise
  continue with this general visual-reference workflow.
- Inspect the target and the current rendered UI at the relevant routes,
  viewports, themes, data states, and interaction states. Ask a narrow question
  only when unresolved ambiguity would produce materially different results.
- Classify the target's visible decisions as **exact** (must match),
  **adaptable** (translate into the product's visual language), or
  **unspecified** (follow established project conventions). Record only the
  distinctions needed to guide implementation and verification.
- Treat existing project instructions, design-system sources, components,
  tokens, content, assets, responsive conventions, and accessibility patterns
  as constraints. Do not replace suitable project identity merely because the
  reference uses a different system.
- Preserve the selected concept outside committed source only when later
  comparison genuinely needs a durable artifact. Prefer an existing ignored or
  environment-managed location; do not create project files or modify ignore
  configuration solely for transient persistence without authorization.

## Implement The Direction

- Map the visual contract to project-owned routes, components, styles, tokens,
  assets, and representative content. Reuse existing surfaces when their
  semantics fit; introduce new ones only for a concrete gap.
- Recreate the target's structure, hierarchy, rhythm, responsive intent, and
  interactions without copying proprietary source, private assets, tracking
  code, or brand-identifying content that the user is not authorized to use.
- Preserve product behavior and accessible semantics while adapting visual
  details. Cover only the loading, empty, error, validation, focus, or other
  states that the affected surface can meaningfully enter.
- Add a dependency only when project tools cannot reasonably satisfy a material
  part of the visual contract and the tradeoff is clear.

## Compare In A Real Rendering Environment

- Follow the host and project browser-testing policy instead of assuming one
  universal tool. Capture the smallest useful region, using full-page images
  only when composition, scrolling, or surrounding context matters.
- Compare the target, before state, and updated state at equivalent viewports,
  theme, data, account, and interaction state when practical. Disclose any
  mismatch in comparison conditions.
- Iterate on material differences in layout, hierarchy, spacing, typography,
  color, imagery, overflow, text fit, and interaction. Stop when the visual
  contract is satisfied or when a concrete blocker requires user direction.
- Verify relevant responsive behavior, keyboard-visible focus, and interaction
  states. Keep exploratory browser evidence distinct from source-controlled
  automated E2E coverage.
- If no real rendering environment is available, perform the closest useful
  source-level check, report the gap, and do not claim visual fidelity.

## Final Handoff

Report:

- The selected target and any important exact-versus-adaptable decisions.
- Files changed.
- Browser verification performed, including evidence paths when available.
- Remaining visual mismatches, unverified states or viewports, and comparison
  limitations.
- The location and uncommitted status of any temporary concept artifact, only
  when one was actually created.
