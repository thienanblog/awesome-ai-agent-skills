# Component Recipes

Use this reference after choosing the page archetype. These recipes describe portable UI patterns, not library-specific APIs.

## Recipe selection rule

- Pick the smallest set of recipes that produces a clear page.
- A good office page usually has:
  - one title/context region
  - one summary region if needed
  - one controls region
  - one dominant working surface
- If every recipe appears on the same page, the page is probably overdesigned.

## Page hero / header band

### Purpose

Give the page a clear title region with context, status, and top-level actions.

### Required regions

- title and subtitle or status context
- optional icon or product marker
- action cluster

### Visual treatment

- restrained pages use a compact header band or elevated title region
- expressive pages may use gradient, glass, blur, or layered backgrounds
- keep readability higher than decoration
- the hero should establish the page story in under one screenful

### Interaction states

- actions must have obvious hover and focus states
- badges or status pills must remain readable in both themes

### When to use

- use on dashboards, reports, and important module entry pages
- use a compact version on CRUD and form pages

### When to avoid

- avoid a large hero on pages where the table or form is the only real focus

### Semantic locator examples

- `inventory-report-page__hero`
- `customers-page__header`

## Stats card grid

### Purpose

Show a small set of high-signal metrics in a scannable block.

### Required regions

- grid wrapper
- repeated stat cards
- label, value, and optional trend or caption

### Visual treatment

- cards may use subtle gradients or tinted surfaces
- one stronger accent per card is enough; do not decorate every layer
- reserve the strongest color treatment for the most important or exceptional metric
- one lead card or one stronger metric is often better than four equal cards

### Interaction states

- hover may slightly elevate cards if they are actionable
- selected or drill-down cards need a persistent active state

### When to use

- dashboards, reports, and contextual summaries above dense content

### When to avoid

- avoid large stat grids when a page only needs one inline summary

### Semantic locator examples

- `sales-dashboard-page__stats-grid`
- `sales-dashboard-page__stat-card`

## Summary strip inside hero

### Purpose

Keep 2-5 key summary items close to the page title on summary-first pages.

### Required regions

- strip wrapper
- repeated summary items

### Visual treatment

- lightweight glass or tinted surfaces work well inside a hero
- keep the strip compact so it supports the title instead of replacing it

### Interaction states

- usually static
- if interactive, each item needs a full-row hover and focus treatment

### When to use

- reports and dashboards with a strong context header

### When to avoid

- avoid when the page already has a large stats grid directly below the header

### Semantic locator examples

- `inventory-report-page__summary-strip`
- `inventory-report-page__summary-item`

## Action cluster

### Purpose

Group top-level page actions by intent.

### Required regions

- primary action slot
- secondary action group
- optional refresh or export controls

### Visual treatment

- primary action should visually lead
- secondary actions can share a quieter surface or pill group

### Interaction states

- hover, active, loading, and disabled must be obvious
- avoid placing destructive actions in the same visual emphasis as safe actions

### When to use

- any page with top-level actions

### When to avoid

- do not mix row-level actions into this cluster

### Semantic locator examples

- `customers-page__action-bar`
- `warehouse-stats-page__hero-actions`

## Filter bar

### Purpose

Collect search, filters, presets, and quick scopes into one clear working region.

### Required regions

- filter wrapper
- grouped filter controls
- optional quick presets
- optional apply and clear actions

### Visual treatment

- filters should read as a working surface separate from row actions
- use spacing and grouping before adding more color
- quick presets should look like workflow tools, not like navigation tabs unless they truly behave like navigation

### Interaction states

- active filters should have a clear selected treatment
- loading and disabled states should remain readable

### When to use

- CRUD pages, reports, and data-heavy modules

### When to avoid

- do not create a large filter bar for pages with only one simple search field

### Semantic locator examples

- `customers-page__filter-bar`
- `product-items-report-page__filter-bar`

## Search input

### Purpose

Provide a high-visibility search control without blending into row actions.

### Required regions

- search wrapper
- icon or label
- input field

### Visual treatment

- the search input should feel like a stable tool, not a stray form field
- icon-led inputs are fine when spacing keeps the text readable

### Interaction states

- focus ring or border change must be obvious
- placeholder contrast must remain readable in dark mode

### When to use

- inside filter bars or page tool regions

### When to avoid

- avoid hiding the only important filter behind a tiny icon button

### Semantic locator examples

- `customers-page__search`
- `orders-page__search`

## Table wrapper

### Purpose

Give dense data tables a strong, readable container with room for states and supporting controls.

### Required regions

- wrapper surface
- optional header or toolbar
- table body
- empty/loading state region

### Visual treatment

- keep the wrapper restrained so the table remains dominant
- use stronger borders, header styling, and row states instead of decorative backgrounds
- wrapper chrome should support scanning, not compete with the data

### Interaction states

- row hover should tint the whole actionable area
- selected and active states must survive without hover
- loading and empty states should look intentional

### When to use

- any table-heavy admin surface

### When to avoid

- avoid putting tables directly on the page background with no clear containment

### Semantic locator examples

- `customers-page__table-wrap`
- `inventory-report-page__report-table-wrap`

## Mobile record cards for dense datasets

### Purpose

Replace or supplement wide tables on smaller screens with scannable record cards.

### Required regions

- mobile list wrapper
- repeated record cards
- inline action row

### Visual treatment

- keep cards compact and label/value driven
- maintain the same data hierarchy as the table
- actions should stay discoverable without making each card visually noisy

### Interaction states

- row actions need generous hit targets
- card hover is optional; focus and pressed states still matter

### When to use

- CRUD pages where wide columns collapse poorly on mobile

### When to avoid

- avoid duplicating both full table and cards at the same breakpoint without a clear rule

### Semantic locator examples

- `customers-page__mobile-record-list`
- `customers-page__record-card`

## Empty, loading, and error states

### Purpose

Make non-happy states feel intentional and informative.

### Required regions

- state wrapper
- icon or visual marker
- primary message
- optional recovery action

### Visual treatment

- empty states can be light and inviting
- loading states should align with the surrounding surface
- error states should feel serious without overwhelming the page
- use the same design family as the surrounding page, not a disconnected placeholder block

### Interaction states

- retry or recovery actions need the same quality as primary buttons

### When to use

- every table, dashboard module, and async support panel

### When to avoid

- avoid raw placeholder text such as "No data" with no context

### Semantic locator examples

- `customers-page__empty-state`
- `warehouse-stats-page__loading-state`
- `quote-workspace-page__error-state`

## Utility side panels / inspector panels

### Purpose

Support the main workspace with notes, history, filters, or record inspectors.

### Required regions

- panel root
- header
- content
- optional collapse handle or tabs

### Visual treatment

- panel should feel secondary to the main workspace
- floating or docked surfaces work well when width must be protected

### Interaction states

- collapse, expand, hover-reveal, and close behavior must be explicit
- panel tabs or sections should have clear active states

### When to use

- workspace/detail pages and advanced reporting tools

### When to avoid

- avoid permanent wide side panels for optional content on dense CRUD pages

### Semantic locator examples

- `quote-workspace-page__activity-panel`
- `order-review-page__inspector-panel`

## Recipe usage rule

Pick only the recipes the page actually needs. A polished office page usually comes from a few well-composed regions, not from stacking every pattern at once.
