---
name: design-system-generator
description: Create or revise a project design system covering tokens, components, accessibility, motion, and visual verification. Use when the durable design-system document is the deliverable, rather than a one-off UI edit.
---

# Design System Generator

Produce a concise design system grounded in the product's actual stack and visual language. Document decisions that make future UI work consistent.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Inspect before proposing

Read existing design docs, brand references, representative screens, shared components, theme configuration, tokens, and build tooling. Infer framework, CSS approach, themes, browser support, and export formats from those sources. Ask only about unresolved product choices that materially affect the document; do not require a questionnaire.

Preserve an established coherent system. For a new product, recommend one suitable direction within the user's constraints; compare alternatives only when useful or requested. Do not add a component library or migrate build tooling merely to match this skill's examples.

## Write the project contract

Use [TEMPLATE_DESIGN_SYSTEM.md](TEMPLATE_DESIGN_SYSTEM.md) as a menu of topics. Omit inapplicable sections and replace examples with verified project decisions. Cover the relevant:

- surfaces, themes, devices, and language or RTL constraints;
- token ownership, typography, color, spacing, layout, and motion;
- shared components and the interaction states each actually supports;
- extension rules for tokens, components, utilities, and local exceptions;
- keyboard interaction, visible focus, contrast targets, semantic markup, and reduced motion;
- visual verification at comparable states and viewports;
- asset loading and cache invalidation responsibilities when the design system owns them.

Link to existing build or deployment guidance for pipeline details. Hashed filenames and manifests are one cache strategy, not a required new build system. Avoid documenting support for frameworks or themes the product does not use.

Keep statements actionable and project-specific. The document serves the product team; omit prompt-writing advice and generic framework tutorials.

## Outputs

Update the existing design-system owner or create `DESIGN_SYSTEM.md` at the repository's conventional location. Export CSS or JSON tokens only when requested or needed by the agreed implementation. Read [examples/tokens.css](examples/tokens.css) and [examples/design-tokens.json](examples/design-tokens.json) only for those formats; [examples/manifest.example.json](examples/manifest.example.json) is relevant only to a manifest-based pipeline.

If discoverability needs an instruction-file link, use the minimal pattern in [examples/AGENTS.patch.md](examples/AGENTS.patch.md), preserving any existing `AGENTS.md`/`CLAUDE.md` ownership or symlink. Do not add duplicate instruction files or repeated design rules.

## Verify

Check documented paths, token names, component APIs, and build claims against their owners. Inspect representative rendered components when making visual decisions or changing tokens; report when visual validation could not run. Remove placeholders, contradictions, and duplicate sources of truth.

Report the document and any exports, the material decisions, verification performed, and unresolved choices. A documentation task alone does not require an application-wide test suite.
