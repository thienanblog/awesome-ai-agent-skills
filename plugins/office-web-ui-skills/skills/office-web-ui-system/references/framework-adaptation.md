# Framework Adaptation

Use this reference to carry the same UI rules across different stacks.

## General rule

Translate the behavior and structure first. Bind it to the current component library second.

For every page recipe:
- keep the page archetype choice
- keep the semantic locator skeleton
- keep the interaction contract
- adapt the primitives to the host stack

## PrimeVue projects

- Wrap important PrimeVue-heavy regions in semantic classes even when PrimeVue already provides internal classes.
- Use scoped CSS carefully; PrimeVue internals often need stronger selectors.
- For dark mode in scoped styles, target the actual runtime selector and real PrimeVue nodes.
- Keep semantic wrappers outside complex PrimeVue markup so agents can still locate regions reliably.
- Map recipes like this:
  - hero or header band: regular template markup plus PrimeVue buttons, tags, and badges
  - stats cards: native markup or `Card` only if it does not fight the layout
  - filter bar: PrimeVue inputs, selects, date pickers, and buttons inside one semantic wrapper
  - table wrapper: semantic wrapper around `DataTable`, with empty and loading slots treated as designed states
- Do not let PrimeVue defaults decide the whole visual hierarchy. PrimeVue is the primitive layer, not the page-composition layer.

## Non-PrimeVue Vue projects

- Keep the same locator and shell rules.
- Use semantic wrappers around headless components, custom components, and slot-heavy structures.
- Do not replace clear semantic wrappers with composable-only indirection.
- Keep recipe structure visible in the template even if the internals come from composables or slots.

## React and other SPA stacks

- Apply the same page, shell, panel, and flyout naming contract.
- Use `className` semantic wrappers for important regions even if styling is utility-first.
- If the project uses CSS Modules, expose stable semantic hooks where agents and humans still need shared naming.
- For shadcn or headless stacks:
  - use `Card`, `Tabs`, `Sheet`, `Table`, and similar primitives as surface building blocks
  - keep page hero, stats grid, filter bar, and table wrapper as explicit composition regions above those primitives
  - prefer composition wrappers over editing third-party base components
- In React admin apps, avoid defaulting to a symmetric grid of identical `Card` components for every dashboard.
- If using shadcn, create the page personality with composition, spacing, and wrapper structure rather than by modifying base `ui/*` primitives.
- If the stack uses charts, keep chart containers visually subordinate to the page title and summary region.

## Laravel / Blade / server-rendered UIs

- Add semantic classes directly to Blade partials and layout shells.
- Keep shared shell regions in predictable partials or layout templates.
- Treat repeated partials like reusable regions with stable names.
- For page recipes:
  - render the page skeleton in Blade sections or partials first
  - keep action bars and filter bars as named partials when repeated
  - keep repeated record cards or summary cards under stable feature-prefixed class names
- Avoid server-rendered markup that hides all meaningful structure behind generic includes with no semantic wrapper.

## Utility-first codebases

- Utility classes are fine for visual expression.
- They are not enough as the only locator for a major UI region.
- Pair utility-heavy markup with one stable semantic class at the important boundary.

## Component-library codebases

- Use the library for primitives, not for naming the whole UI.
- Wrap third-party primitives with semantic region classes.
- Keep behavior contracts portable:
  - flyout alignment
  - hit area size
  - hover coverage
  - reserved padding around collapsed tabs or handles
  - filter grouping
  - table containment
  - designed empty and loading states

## Migration heuristic

When moving an office-style admin UI pattern into another project:
1. keep the interaction contract
2. keep the locator contract
3. adapt the visual layer to the host system
4. only reuse the reference visual treatment directly if the host app has no stronger language

## Recipe translation shortcuts

- `page hero / header band`
  - Vue: semantic wrapper with library buttons or tags inside
  - React: semantic wrapper with `Button`, `Badge`, `Card`, or plain div structure
  - Blade: semantic wrapper with partials for actions and status blocks
- `stats card grid`
  - Vue: repeat semantic card wrappers with utility classes
  - React: map over data into `Card` or div-based stat blocks
  - Blade: repeated component partials are fine if each card still carries a stable class
- `filter bar`
  - Vue: place all controls in one `__filter-bar` wrapper
  - React: keep filters in one `div` or toolbar region; avoid scattering them across components
  - Blade: render the full filter row together so the working region stays obvious
- `table wrapper`
  - Vue: wrap `DataTable` or table markup in a semantic container
  - React: wrap headless or shadcn table pieces in a semantic container
  - Blade: wrap native tables or included partials the same way

## React / shadcn composition shortcuts

- Use layout wrappers such as `dashboard-page`, `dashboard-page__hero`, `dashboard-page__stats-grid`, and `dashboard-page__table-wrap` as plain `div` structure around shadcn primitives.
- Prefer building stat cards as one shared wrapper pattern plus small internal variants instead of many unrelated custom cards.
- Use `Sheet` or `Dialog` for mobile or temporary inspector behavior, and `Card` or bordered panels for persistent desktop support regions.
- Keep `Tabs` for true view switching or scoped filters, not as decoration for ordinary action clusters.
