# Locator Class Contract

Use this reference to make important UI regions easy to find and discuss.

## Goal

Users and agents should be able to say “the flyout header”, “the quote side panel”, or “the topbar tools pill” and land in the right file quickly.

## When classes help

Use readable semantic classes when existing semantic markup, accessible names, component boundaries, or project locators do not identify a region clearly. Keep working conventions; do not add classes to unrelated regions merely to satisfy this reference.

Useful candidates include:
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

## Applying a locator

When a semantic class is useful, place it on the region's existing container where possible and verify that source search identifies it. Preserve accessible markup and existing tests; a locator does not replace an accessible name. Avoid introducing wrappers that change layout solely for naming.

## Practical heuristics

- Prefer feature prefix for page-local components.
- Prefer `layout-` prefix for global shell components.
- Prefer `*-page__*` for page-specific regions.
- Prefer `*-panel`, `*-dock`, `*-toolbar`, `*-filter-bar`, `*-table-wrap` for high-signal regions.
- Prefer `*-page__hero`, `*-page__stats-grid`, `*-page__summary-strip`, `*-page__action-bar` for repeated dashboard and report structures.

## Scanner usage

Run:

```bash
python3 "<skill-directory>/scripts/scan_ui_locators.py" "<project-root>"
```

The optional scanner maps supported semantic classes to files and line numbers. Direct source search is sufficient when the location is already clear; scanner warnings alone are not design or accessibility failures.
