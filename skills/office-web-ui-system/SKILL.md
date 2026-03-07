---
name: office-web-ui-system
description: Design and refactor office-style web app interfaces for admin, internal, and back-office products. Use when an AI agent needs to build or improve navigation shells, flyout menus, side panels, docks, table-heavy workspaces, semantic locator classes, or reusable UI structure that stays portable across Vue, React, Laravel, and other web stacks with or without PrimeVue.
author: Official
---

# Office Web UI System

## Overview

Use this skill to build or evolve internal web app UI with office-style structure and polish while keeping the result portable across frameworks and component libraries.

This skill is written as the source of truth in `SKILL.md` so it can be reused across AI tools that support skills, prompt packs, or custom instructions. Tool-specific metadata should stay in adapter files only and must not change the core workflow.

Prioritize two outcomes at the same time:
- deliver a clear, high-density, professional interface
- make important UI regions easy for humans and AI agents to identify by name

## Workflow

### 1. Inspect before designing

Inspect the real project first:
- identify the framework, CSS strategy, and component library
- identify whether the app already has a shell pattern for topbar, sidebar, cards, panels, tables, and filters
- preserve the existing visual language when it is coherent

Read these references as needed:
- `references/visual-language.md`
- `references/navigation-and-panels.md`
- `references/framework-adaptation.md`

### 2. Add semantic locator structure first

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

### 3. Build with office-web-app defaults

When the project does not already define a better pattern, use these defaults:
- topbar as a transparent shell with readable pill surfaces
- desktop navigation with expanded sidebar or icon rail + flyout
- floating panels and docks that do not steal content width unless the UX requires it
- large interaction targets for dense admin workflows
- clear hover, focus, active, loading, and empty states
- strong dark-mode readability, not color inversion for its own sake

Read:
- `references/visual-language.md`
- `references/navigation-and-panels.md`

### 4. Stay behavior-first, not library-first

Describe and implement UI in terms of behavior and structure first.

Do not overfit patterns to PrimeVue. PrimeVue-specific handling belongs in adaptation details only.

Read `references/framework-adaptation.md` when:
- the project uses PrimeVue
- the project uses a different component library
- scoped CSS or third-party internals make dark mode or overrides brittle

### 5. Verify locator clarity

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

## Rules

- Preserve an existing good design language instead of forcing one visual language everywhere.
- Prefer semantic wrappers for important regions even in utility-first codebases.
- Keep major interactive regions identifiable by class name.
- Use modifiers like `--collapsed`, `--active`, `--open`, `--rail` for state, not entirely different base names.
- Favor layout patterns that maximize usable width for table-heavy admin work.
- Keep hover/focus targets generous on dense interfaces.
- Treat dark mode as a first-class state during design and verification.

## References

- `references/visual-language.md`
- `references/navigation-and-panels.md`
- `references/locator-class-contract.md`
- `references/framework-adaptation.md`

## Resources

### scripts/

- `scripts/scan_ui_locators.py`: scan semantic UI locator classes, report files and line numbers, and warn when major-region classes are ambiguous.
