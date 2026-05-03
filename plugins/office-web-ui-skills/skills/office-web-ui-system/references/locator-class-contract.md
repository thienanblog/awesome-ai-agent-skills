# Locator Class Contract

Use this reference to make important UI regions easy to find and discuss.

## Goal

Users and agents should be able to say “the flyout header”, “the quote side panel”, or “the topbar tools pill” and land in the right file quickly.

## Rule

Important UI regions must have readable semantic classes.

Do not rely on raw utility strings alone for:
- page roots
- shell regions
- topbars and sidebars
- flyouts
- panels and docks
- toolbar and filter rows
- search wrappers
- table wrappers
- action groups
- major cards or grouped card stacks

## Recommended naming shapes

- Page root: `feature-page`
- Page section: `feature-page__section`
- Panel root: `feature-panel`
- Panel subregion: `feature-panel__header`
- Dock root: `feature-dock`
- Shell element: `layout-topbar-tools-pill`
- State modifier: `feature-panel--collapsed`

## Preferred patterns

- Use one stable base name per feature or shell region.
- Use `__` for structural subregions.
- Use `--` for state or variants.
- Keep names human-readable.
- Prefer nouns that describe UI purpose, not implementation detail.

## Good examples

- `layout-sidebar-flyout`
- `layout-topbar-status-pill`
- `sales-dashboard-page`
- `sales-dashboard-page__hero`
- `sales-dashboard-page__stats-grid`
- `sales-dashboard-page__filter-bar`
- `sales-dashboard-page__table-wrap`
- `inventory-report-page__summary-strip`
- `quote-create-page__side-panel-stack`
- `quote-workspace-dock__section-actions`
- `technical-orders-page__filter-bar`

## Bad examples

- `div-3`
- `main-box`
- `content-wrapper-2`
- a page root identified only by `min-h-screen bg-gray-50 dark:bg-gray-900`
- a flyout identified only by `absolute top-0 right-0 rounded-xl shadow-lg`

## Uniqueness policy

- Major-region classes should usually map to one place within a page or shell.
- Repeated classes are acceptable for:
  - list items
  - table rows
  - cards in a repeated collection
  - stat cards inside one named stats grid
  - mobile record cards inside one named record list
  - repeated controls inside one component family
- If a major-region class appears across unrelated files, rename it to be feature-specific.

## Locator-first implementation rule

When editing a major UI region:
1. add or confirm the semantic locator class
2. group related markup under that class
3. apply utilities or component-library props underneath it
4. verify the class can be found by scanner and by repo search

## Practical heuristics

- Prefer feature prefix for page-local components.
- Prefer `layout-` prefix for global shell components.
- Prefer `*-page__*` for page-specific regions.
- Prefer `*-panel`, `*-dock`, `*-toolbar`, `*-filter-bar`, `*-table-wrap` for high-signal regions.
- Prefer `*-page__hero`, `*-page__stats-grid`, `*-page__summary-strip`, `*-page__action-bar` for repeated dashboard and report structures.

## Scanner usage

Run:

```bash
python3 scripts/scan_ui_locators.py /path/to/repo
```

Use the scanner before asking the user where something lives.
