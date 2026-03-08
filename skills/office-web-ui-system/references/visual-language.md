# Visual Language

Use this reference for the visual defaults behind the skill.

## Core direction

- Favor modern minimalism with professional density.
- Keep interfaces clean, high-signal, and data-first.
- Use depth deliberately: blur, subtle gradients, soft shadows, glass surfaces.
- Preserve strong hierarchy with spacing, contrast, and grouping instead of noisy decoration.
- Prefer interfaces that feel intentional over generic dashboard boilerplate.

## Visual hierarchy

Build office pages in this order:
1. shell first
2. page title and context second
3. actions and filters third
4. data surface fourth

If decoration competes with that order, reduce the decoration.

## Expressive vs restrained

- Restrained pages use mostly neutral surfaces, light tinting, and minimal decorative depth.
- Balanced pages allow one expressive region, usually the page header or summary area.
- Expressive pages may use stronger gradients, glass, overlap, and richer stat cards, but only when they help users orient quickly.

Choose expressive treatment sparingly:
- dashboards and reports can support it
- table-heavy CRUD pages usually should not
- forms and workspace tools should stay clearer than they are dramatic

## Make it feel like a product

- Give each page a visual point of view, not just a collection of components.
- Usually that point of view comes from one of these:
  - a strong title and summary band
  - a distinct stats system
  - a disciplined filter and table composition
  - a clear main-workspace vs support-panel relationship
- Do not try to make every component special. Pick a few signature regions and let the rest support them.

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
- When using glass, keep text contrast and edge definition strong enough that the surface still reads as a container.

## Gradients, glass, and decoration

- Use gradients to define major context regions, not every component.
- One gradient header plus restrained content surfaces is often stronger than many tinted cards.
- Decorative shapes, blurs, and glow effects should stay behind content and never obscure labels or controls.
- Overlap cards are useful when they clarify the transition from page context to working surface.
- If the host app already uses flat surfaces, adapt the reference style into softer borders and tinting instead of forcing glass everywhere.

## Stat card coloring

- Give each stat card one visual idea: status tint, accent icon, or trend treatment.
- Use semantic color families intentionally:
  - blue or indigo for default metrics
  - green for healthy or positive metrics
  - amber for warnings
  - red for risk, loss, or destructive metrics
- Avoid rainbow dashboards where every card fights for equal attention.
- Reserve the strongest accent for the most important metric or exceptional condition.

## Dashboard aesthetics

- Keep one anchor metric or summary region more prominent than the rest.
- Mix scale intentionally:
  - one larger summary band or lead card
  - a supporting grid of quieter cards
- Use repetition to make the page feel designed:
  - consistent radii
  - repeated icon container shapes
  - repeated internal spacing rhythm
- If charts are present, keep them subordinate to the page story instead of letting the page become chart clutter.

## Rhythm and spacing

- Major page sections should feel block-based and deliberate, not evenly padded by habit.
- Use tighter spacing inside working surfaces and more generous spacing between major regions.
- Let title, summary, filters, and table read as separate bands of information.

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
- Designed empty, loading, and error states that fit the surrounding page
- Restrained working surfaces underneath any expressive header treatment

## Anti-patterns

- Utility-only markup on important layout regions
- Huge hero treatments on pages that are mostly tables
- Hero sections used by default even when a compact header would be clearer
- Every card using a different gradient or accent treatment
- Pages where all summary cards have identical visual weight
- Weak hover contrast on dense list items
- Glass, blur, and shadow applied to every layer
- Stat cards with random accent colors and no hierarchy
- Full-width solid bars where pill grouping would be clearer
- New visual directions that ignore the host app’s established language
