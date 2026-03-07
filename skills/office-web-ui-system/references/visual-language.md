# Visual Language

Use this reference for the visual defaults behind the skill.

## Core direction

- Favor modern minimalism with professional density.
- Keep interfaces clean, high-signal, and data-first.
- Use depth deliberately: blur, subtle gradients, soft shadows, glass surfaces.
- Preserve strong hierarchy with spacing, contrast, and grouping instead of noisy decoration.
- Prefer interfaces that feel intentional over generic dashboard boilerplate.

## Shell and page composition

- Treat office apps as shells, not isolated pages.
- Use a stable navigation shell first, then build page content inside it.
- For table-heavy pages, bias toward full-width layouts.
- For content-heavy pages, use constrained widths only when readability benefits.
- Use overlap, hero, and elevated content cards only when they improve hierarchy without wasting space.

## Surfaces

- Use card, pill, panel, and flyout surfaces with soft borders and clear separation.
- Keep radii generous on major containers.
- Prefer translucent or layered surfaces over flat, lifeless blocks when the app already supports that language.
- Do not stack heavy shadows everywhere; reserve stronger elevation for overlays, flyouts, and active surfaces.

## Density

- Admin/internal apps may be dense, but interaction targets must remain forgiving.
- On compact tools, prioritize usable width for the primary workspace.
- Secondary information belongs in side panels, docks, or collapsible surfaces when possible.

## Interaction states

- Hover must be obvious on actionable rows, tiles, and menu items.
- Focus must remain visible for keyboard users.
- Active route or selected state must survive without hover.
- Loading, empty, and error states should feel designed, not bolted on.

## Dark mode

- Verify real readability in both light and dark mode.
- Use dark translucent surfaces, not flat black slabs.
- For custom CSS in scoped styles, target the actual runtime selector and real component internals.
- Inspect computed styles on the true rendered node when overrides seem correct but do not apply.

## Good defaults for internal web apps

- Clear page title and status context
- Action clusters grouped by intent
- Search and filters visually distinct from row actions
- Strong table wrappers for data-heavy pages
- Utility panels that can collapse without breaking the main workspace

## Anti-patterns

- Utility-only markup on important layout regions
- Huge hero treatments on pages that are mostly tables
- Weak hover contrast on dense list items
- Full-width solid bars where pill grouping would be clearer
- New visual directions that ignore the host app’s established language
