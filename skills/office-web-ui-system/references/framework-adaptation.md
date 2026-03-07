# Framework Adaptation

Use this reference to carry the same UI rules across different stacks.

## General rule

Translate the behavior and structure first. Bind it to the current component library second.

## PrimeVue projects

- Wrap important PrimeVue-heavy regions in semantic classes even when PrimeVue already provides internal classes.
- Use scoped CSS carefully; PrimeVue internals often need stronger selectors.
- For dark mode in scoped styles, target the actual runtime selector and real PrimeVue nodes.
- Keep semantic wrappers outside complex PrimeVue markup so agents can still locate regions reliably.

## Non-PrimeVue Vue projects

- Keep the same locator and shell rules.
- Use semantic wrappers around headless components, custom components, and slot-heavy structures.
- Do not replace clear semantic wrappers with composable-only indirection.

## React and other SPA stacks

- Apply the same page, shell, panel, and flyout naming contract.
- Use `className` semantic wrappers for important regions even if styling is utility-first.
- If the project uses CSS Modules, expose stable semantic hooks where agents and humans still need shared naming.

## Laravel / Blade / server-rendered UIs

- Add semantic classes directly to Blade partials and layout shells.
- Keep shared shell regions in predictable partials or layout templates.
- Treat repeated partials like reusable regions with stable names.

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

## Migration heuristic

When moving an office-style admin UI pattern into another project:
1. keep the interaction contract
2. keep the locator contract
3. adapt the visual layer to the host system
4. only reuse the reference visual treatment directly if the host app has no stronger language
