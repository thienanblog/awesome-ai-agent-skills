---
name: office-web-ui-system
description: Design and refactor polished office-style web app interfaces for admin, internal, and back-office products. Use when an AI agent needs to build or improve dashboards, stat cards, page heroes, filter/search bars, data tables, shells, side panels, semantic locator classes, or reusable page composition that stays portable across Vue, React, Laravel, and other web stacks with or without PrimeVue.
author: Official
---

# Office Web UI System

## Overview

Use this skill to build or evolve internal web app UI with office-style structure, strong visual hierarchy, and reusable composition while keeping the result portable across frameworks and component libraries.

This skill is written as the source of truth in `SKILL.md` so it can be reused across AI tools that support skills, prompt packs, or custom instructions. Tool-specific metadata should stay in adapter files only and must not change the core workflow.

Prioritize two outcomes at the same time:
- deliver a clear, high-density, professional interface
- make important UI regions easy for humans and AI agents to identify by name

This skill is not only for shells and navigation. Use it when the user needs a polished:
- dashboard or report page
- CRUD/list page
- workspace/detail page
- form or wizard page
- stat card system
- filter/search/action region
- table-heavy admin page with stronger UI states

When the user asks for a page to feel "beautiful", "modern", "premium", or "like a real web app", do not answer with generic dashboard boilerplate.

Default expectation:
- choose a page archetype
- choose a visual weight
- define a clear hierarchy for title, summary, actions, filters, and main data
- use only a few intentional visual ideas instead of decorating every surface
- preserve usable width and dark-mode readability

## Workflow

### 1. Inspect before designing

Inspect the real project first:
- identify the framework, CSS strategy, and component library
- identify whether the app already has a shell pattern for topbar, sidebar, cards, panels, tables, filters, and page headers
- preserve the existing visual language when it is coherent

Read these references as needed:
- `references/visual-language.md`
- `references/navigation-and-panels.md`
- `references/page-type-playbook.md`
- `references/framework-adaptation.md`

### 2. Choose the page archetype before styling

Before choosing gradients, cards, or hero treatments, classify the page into one of these archetypes:
- dashboard/report
- CRUD/list
- workspace/detail
- form/wizard

This decision is mandatory. The page archetype controls density, action placement, and how expressive the page should be.

Read:
- `references/page-type-playbook.md`

### 3. Choose the visual weight

Decide whether the page should be:
- restrained
- balanced
- expressive

Use this to control how much gradient, glass, overlap, and decorative depth the page gets.

Rules:
- prefer restrained surfaces on table-heavy CRUD pages
- use expressive hero or glass treatment only when it clarifies hierarchy
- do not overuse hero sections on pages where the table or form is the real focus

Read:
- `references/visual-language.md`

### 4. Add semantic locator structure early

Before deeper UI changes, add or normalize semantic classes on important regions.

Read `references/locator-class-contract.md` and apply these rules:
- important UI regions must have readable semantic classes
- do not rely on Tailwind-only class strings as the only way to identify a major region
- keep semantic classes stable and specific enough that a user can point to the correct area

Use utility classes freely for low-level styling, but pair them with semantic wrappers for:
- page containers
- shells
- sidebars and topbars
- flyouts
- panels and docks
- toolbar and filter rows
- table wrappers
- action bars

### 5. Compose the shell and page regions

After the archetype and visual weight are chosen, compose the page in this order:
1. shell or page root
2. page title and context
3. actions, filters, and summary regions
4. primary data surface
5. optional support surfaces such as side panels or utility docks

Use portable recipes for the recurring pieces:
- page hero or header band
- stats card grid
- summary strip
- action cluster
- filter bar
- search input
- table wrapper
- mobile record cards
- empty, loading, and error states
- utility side panels or inspector panels

Read:
- `references/component-recipes.md`

Before implementing, be able to state:
- what the page is for in one sentence
- which region should dominate the screen
- which 2 or 3 components are carrying the page's visual identity
- which regions must remain restrained so the page stays usable

### 6. Build with office-web-app defaults

When the project does not already define a better pattern, use these defaults:
- topbar as a transparent shell with readable pill surfaces
- desktop navigation with expanded sidebar or icon rail + flyout
- a page header that explains context before controls
- stats and summaries grouped near the page title, not scattered randomly
- floating panels and docks that do not steal content width unless the UX requires it
- large interaction targets for dense admin workflows
- clear hover, focus, active, loading, and empty states
- strong dark-mode readability, not color inversion for its own sake

Read:
- `references/visual-language.md`
- `references/navigation-and-panels.md`
- `references/component-recipes.md`

### 7. Stay behavior-first, not library-first

Describe and implement UI in terms of behavior and structure first.

Do not overfit patterns to PrimeVue or any single library. Library-specific handling belongs in adaptation details only.

Read `references/framework-adaptation.md` when:
- the project uses PrimeVue
- the project uses a different component library
- scoped CSS or third-party internals make dark mode or overrides brittle

### 8. Verify the page reads like a product, not a wireframe

Before handoff, check:
- the page has one obvious focal region
- stat cards, filters, and table surfaces belong to one coherent family
- the page does not look like interchangeable SaaS boilerplate
- the decorative treatment stops before it hurts density or readability

### 9. Verify density, dark mode, and locator clarity

Run the bundled scanner before asking the user where a UI element lives:

```bash
python3 scripts/scan_ui_locators.py /path/to/repo
```

Useful modes:

```bash
python3 scripts/scan_ui_locators.py /path/to/repo --match layout-sidebar
python3 scripts/scan_ui_locators.py /path/to/repo --prefix quote-create-page__
python3 scripts/scan_ui_locators.py /path/to/repo --json
```

Use the scanner to:
- map semantic classes to files and line numbers
- detect ambiguous major-region classes
- confirm that a proposed class name is discoverable and specific enough

Also verify:
- the chosen visual weight still fits the page archetype
- table-heavy pages keep usable width
- empty and loading states feel designed, not placeholder-only
- dark mode readability is preserved on the true rendered nodes

## Rules

- Preserve an existing good design language instead of forcing one visual language everywhere.
- Choose the page archetype before styling.
- Choose the visual weight before adding expressive treatments.
- Prefer semantic wrappers for important regions even in utility-first codebases.
- Keep major interactive regions identifiable by class name.
- Use modifiers like `--collapsed`, `--active`, `--open`, `--rail` for state, not entirely different base names.
- Favor layout patterns that maximize usable width for table-heavy admin work.
- Prefer restrained surfaces on CRUD and other dense table pages unless stronger expression clearly improves hierarchy.
- Use hero sections, overlap cards, and glass surfaces deliberately, not by default.
- Use a small number of strong visual ideas per page instead of many weak decorative effects.
- Make the page feel product-specific through hierarchy, grouping, and summary design before adding more color or motion.
- Keep hover/focus targets generous on dense interfaces.
- Treat dark mode as a first-class state during design and verification.
- Keep examples portable; adapt primitives to the host stack instead of cloning one framework's exact API.

## References

- `references/visual-language.md`
- `references/navigation-and-panels.md`
- `references/page-type-playbook.md`
- `references/component-recipes.md`
- `references/locator-class-contract.md`
- `references/framework-adaptation.md`

## Resources

### scripts/

- `scripts/scan_ui_locators.py`: scan semantic UI locator classes, report files and line numbers, and warn when major-region classes are ambiguous.
