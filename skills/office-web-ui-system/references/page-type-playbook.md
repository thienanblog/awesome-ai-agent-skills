# Page Type Playbook

Use this reference to decide how a page should be composed before choosing detailed styling.

## Mandatory step

Choose one page archetype before styling:
- dashboard/report
- CRUD/list
- workspace/detail
- form/wizard

This choice controls layout, density, action placement, and visual intensity.

## Visual intensity scale

- Restrained: mostly neutral surfaces, minimal decoration, emphasis on clarity and width
- Balanced: one expressive area plus restrained working surfaces
- Expressive: stronger gradients, glass, overlap, and richer stat treatments where context benefits from it

Do not choose intensity in isolation. Match it to the page archetype.

## Dashboard / report

### Use when

- the page summarizes many metrics or trends
- the page combines high-level context with charts, cards, or a report table
- users need orientation before drilling into detail

### Default structure

- page root
- optional hero or header band
- summary strip or stats grid near the title
- filters and export actions
- charts, report modules, or report table

### Recommended intensity

- Balanced by default
- Expressive only when the page is genuinely summary-first

### Actions

- primary actions live in the page header area
- secondary actions and quick ranges live near filters
- export belongs with report controls, not mixed into row actions

### Hero / overlap / glass

- Hero is appropriate when it clarifies the reporting context
- Hero summary cards can live inside the hero if they remain readable
- Overlap is optional; use it only when the hero and main content are visually distinct

### Responsive behavior

- collapse multi-card summary grids cleanly
- keep header actions wrapping into rows on smaller screens
- charts may stack before tables on mobile

### Anti-patterns

- decorative hero with no useful summary
- oversized hero that pushes critical report controls below the fold
- dashboard cards with no hierarchy or no clear difference between primary and secondary metrics

### Semantic class examples

- `sales-dashboard-page`
- `sales-dashboard-page__hero`
- `sales-dashboard-page__summary-strip`
- `sales-dashboard-page__stats-grid`
- `sales-dashboard-page__report-table-wrap`

## CRUD / list

### Use when

- the page is mainly for searching, filtering, sorting, or batch-operating on records
- the table or record list is the primary workspace

### Default structure

- page root
- restrained header band or compact page header
- action cluster
- filter bar and search
- table wrapper
- mobile record cards if the data needs a narrower presentation

### Recommended intensity

- Restrained by default
- Balanced only when the module needs stronger status context

### Actions

- create, refresh, import, and batch actions live above the filter bar or beside the title
- row actions stay inside the table or mobile cards

### Hero / overlap / glass

- use only a light header band or restrained hero
- avoid large expressive hero treatments on dense table pages
- keep the table visually dominant

### Responsive behavior

- filters wrap into rows without hiding primary actions
- tables may switch to record cards on small screens
- maintain clear pagination and bulk action access

### Anti-patterns

- huge decorative hero above a simple table
- filters visually mixed with row actions
- cramped search and filter controls with tiny click targets

### Semantic class examples

- `customers-page`
- `customers-page__header`
- `customers-page__action-bar`
- `customers-page__filter-bar`
- `customers-page__table-wrap`
- `customers-page__mobile-record-list`

## Workspace / detail

### Use when

- the page centers on a single record plus supporting tools
- users need inspectors, notes, histories, docks, or related panels while working

### Default structure

- page root
- contextual header
- main workspace
- support panel stack, dock, or inspector region
- optional summary cards for the active record

### Recommended intensity

- Balanced by default
- Restrained for highly operational tools

### Actions

- primary record actions stay near the page header
- local actions stay inside the panel or section they affect
- inspector actions stay inside the side panel, not in the global topbar

### Hero / overlap / glass

- usually avoid a large hero
- a restrained contextual header or elevated title region is enough
- use floating support panels or docks when they preserve main workspace width

### Responsive behavior

- support panels collapse, dock, or move below the main workspace
- critical record information remains visible without opening every panel

### Anti-patterns

- optional panels permanently consuming too much width
- one giant undifferentiated page with no main vs support hierarchy
- forcing mobile drawer behavior on desktop inspectors

### Semantic class examples

- `quote-workspace-page`
- `quote-workspace-page__main`
- `quote-workspace-page__side-panel-stack`
- `quote-workspace-page__dock`
- `quote-workspace-page__activity-panel`

## Form / wizard

### Use when

- the page is mainly about data entry, review, and submission
- the user is progressing through one or more sections with validation states

### Default structure

- page root
- compact context header
- form sections or step panels
- sticky or repeated action bar when needed
- optional summary or debug region

### Recommended intensity

- Restrained by default
- Balanced only when the form needs stronger onboarding context

### Actions

- save, continue, submit, and cancel remain close to the form context
- do not bury primary form actions inside unrelated side content

### Hero / overlap / glass

- avoid expressive hero by default
- if used at all, keep it compact and supportive

### Responsive behavior

- form fields should stack cleanly
- action bars remain reachable without forcing excessive scrolling
- step indicators wrap or collapse without losing clarity

### Anti-patterns

- decorative page header that competes with validation and field hierarchy
- important submit actions only at the very bottom of a long wizard
- mixing debug or support content directly into the main form flow

### Semantic class examples

- `order-create-page`
- `order-create-page__header`
- `order-create-page__form-sections`
- `order-create-page__action-bar`
- `order-create-page__debug-panel`

## Selection heuristics

- If the table is the main product, choose CRUD/list.
- If metrics and summaries lead the story, choose dashboard/report.
- If one record plus supporting tools dominate the screen, choose workspace/detail.
- If validation and structured entry dominate the screen, choose form/wizard.

When a page has mixed traits, choose the archetype for the primary task and borrow only the needed secondary recipes.
