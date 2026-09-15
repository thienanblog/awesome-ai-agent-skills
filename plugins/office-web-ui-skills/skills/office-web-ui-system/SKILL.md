---
name: office-web-ui-system
description: Build or improve operational dashboards, admin tools, CRM/ERP, CRUD, reporting, and record-management interfaces. Use for dense workflows and dashboard reference matching; excludes marketing and unrelated consumer UI.
---

# Office Web UI System

Create a clear operational interface that supports scanning, filtering, comparing, editing, and managing records. Preserve usable space and the product's visual identity.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Establish the page's job

Inspect the framework, component library, design-system sources, tokens, shared shell, and representative screens. Infer whether the work is an operational surface from the request and project; ask only if that distinction remains unclear and would change the design.

Identify the primary task and dominant region. Use dashboard/report, CRUD/list, workspace/detail, and form/wizard as composition guides, not a required classification exercise. Read [page-type-playbook.md](references/page-type-playbook.md) for an unfamiliar page type.

For screenshot-driven work, establish what should match and what should adapt to the existing product. A supplied target already expresses a direction; do not require another concept-selection phase.

## Compose for real work

- Make title, context, primary action, filters, and data hierarchy clear. Preserve table and form width before adding supporting panels.
- Keep dense CRUD surfaces restrained. Use expressive summary or hero treatments only when they help users understand the page.
- Group metrics by their meaning and define date ranges, units, comparisons, and drilldowns where relevant. Avoid decorative statistics without a user task.
- Reuse shared components, tokens, utilities, and motion rules. Add local exceptions only for a concrete visual or behavior gap.
- Support relevant loading, empty, error, validation, selection, disabled, and focus states. Preserve keyboard access, touch usability, and readability in supported themes and viewports.
- Adapt primitives to the installed framework and library; do not force a new shell, pill topbar, glass style, or dark theme onto a coherent existing product.

Consult [visual-language.md](references/visual-language.md), [navigation-and-panels.md](references/navigation-and-panels.md), and [component-recipes.md](references/component-recipes.md) for the component being designed. Use [framework-adaptation.md](references/framework-adaptation.md) for library internals or scoped-style issues.

## Keep regions discoverable

Use semantic markup, accessible names, existing component boundaries, or stable project locators to identify important regions. Add readable semantic classes when they solve a real discovery problem; do not normalize unrelated markup just to satisfy a class scheme.

Read [locator-class-contract.md](references/locator-class-contract.md) when adding such classes. The optional scanner maps those classes to files:

```bash
python3 "<skill-directory>/scripts/scan_ui_locators.py" "<project-root>" --match layout-sidebar
```

Use direct source search when it already identifies the target. The scanner does not validate accessibility or replace browser inspection.

## Verify the result

Follow the host's browser policy and inspect the actual rendered page. Capture the region or page that demonstrates the change; use equivalent viewport, theme, account, and data for before/after or reference comparison. Annotate ambiguous images only when that helps resolve a consequential question.

Check hierarchy, density, overflow, text fit, table interactions, keyboard-visible focus, and supported themes/responsive states. Inspect the real rendered library nodes when overrides affect dark mode. Fix material differences from the selected target or report the limitation when rendering is unavailable.

Run focused project checks and relevant regression coverage. Report the user-visible change, evidence, browser surface, and remaining gaps; keep manual screenshots distinct from automated E2E coverage.
