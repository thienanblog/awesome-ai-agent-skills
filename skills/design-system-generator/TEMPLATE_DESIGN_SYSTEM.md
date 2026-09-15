# Design System

Use this skeleton as a topic menu. Replace prompts with project decisions, omit inapplicable sections, and link existing owners instead of copying their rules. Do not publish unresolved placeholders.

## Scope

Name the product surfaces, supported devices/themes, language/RTL constraints, and the source of approved visual direction.

## Tokens and foundations

Identify token source files and whether they are edited or generated. Document the relevant color roles, type scale, spacing/layout, borders/shadows, and motion. Explain how to extend the system for a real gap without introducing competing token sources.

## Components and behavior

Link shared components and their usage examples. State ownership, naming, extension rules, and relevant interaction states. Document local styling exceptions only where the project needs them. Cover only the frameworks and rendering modes the application uses.

## Accessibility

Specify the product's accessibility target and practical checks for semantics, keyboard operation, focus visibility, contrast, and reduced motion. Link existing standards or test owners. Do not claim compliance from this document alone.

## Assets and delivery

Include only design-owned image, icon, font, and loading decisions. Link the actual asset/build pipeline for cache invalidation and production packaging. Document a manifest when the pipeline uses one; do not require a new bundler or manifest solely to fill this section.

## Visual verification

Identify representative components, routes, states, and viewports. Follow the host browser policy, compare equivalent conditions, and capture the region or page needed to demonstrate the result. Annotate unclear references only when that helps resolve a material question. Keep manual visual evidence distinct from automated regression coverage.

## Examples

Add a small project-valid token or component example when it clarifies correct use. Link maintained examples instead of duplicating a large component inventory.
