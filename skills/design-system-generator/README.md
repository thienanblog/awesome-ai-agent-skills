# Design System Generator

Creates or updates a project-specific design-system document from existing components, tokens, product references, and constraints. Framework and styling choices come from the project; the skill asks only about unresolved decisions that affect the result.

## Outputs

- The existing design-system owner or `DESIGN_SYSTEM.md` at the repository's conventional location.
- CSS or JSON token exports when requested or required by the agreed implementation.
- A short instruction-file link when discoverability needs it, preserving existing ownership and symlinks.

The template is a topic menu. Keep applicable token, component, accessibility, motion, and visual-verification decisions. Asset manifests, alternative framework support, and new libraries are included only when the product actually needs them.

See [SKILL.md](SKILL.md) for the workflow and [TEMPLATE_DESIGN_SYSTEM.md](TEMPLATE_DESIGN_SYSTEM.md) for a starting structure. Examples illustrate formats; they are not mandatory output or evidence that a product has been visually validated.
