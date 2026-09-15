---
name: laravel-11-12-app-guidelines
description: Implement changes in Laravel 11 or 12 using the installed framework, frontend, and command runner. Select by composer evidence; Laravel 12-to-13 upgrades use laravel-13-app-guidelines.
---

# Laravel 11/12 App Guidelines

## Overview

Apply a consistent workflow for Laravel 11/12 apps with optional frontend stacks, Dockerized commands, and Laravel Boost tooling.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Quick Start

- Read applicable repository instructions and relevant documentation owners or indexes when present. Do not assume a `docs/README.md` exists.
- Detect installed versions, the stack, and command locations; do not guess.
- Use Laravel Boost `search-docs` for version-matched ecosystem guidance; use official versioned Laravel or package documentation if Boost is unavailable.
- Follow repo conventions for naming, UI language, docs-first policies, and existing component patterns.

## Stack Detection

- Check `composer.json`, `composer.lock`, `package.json`, frontend lockfiles,
  `bootstrap/app.php`, `docker-compose.*`, and `config/*` to confirm:
  - Docker Compose/Sail vs host commands
  - API-only vs full-stack
  - Frontend framework (Inertia with React, Vue, or Svelte; Livewire; Blade)
  - Auth (Fortify, Sanctum, Passport, custom)

## Laravel 11/12 Core Conventions

- When the application uses the modern Laravel 11/12 skeleton, configure
  middleware, exceptions, and routes in `bootstrap/app.php`; register service
  providers in `bootstrap/providers.php`; define closure commands and schedules
  in `routes/console.php`. Preserve a supported upgraded structure unless the
  task requires reorganizing it.
- Prefer Eloquent models and relationships for domain-oriented work. Use the
  query builder or bound raw expressions when bulk or complex queries are
  clearer; never interpolate untrusted SQL.
- Use Form Request classes for reusable or non-trivial validation and
  authorization. Inline validation is acceptable for a small one-off flow when
  it matches repository conventions.
- Prefer named routes and `route()` for URL generation.
- When modifying an existing column with `change()`, restate every modifier that
  must be retained because omitted modifiers are dropped.
- Destructive database operations such as reset, rollback, or fresh require authorization for the target and data loss; reuse explicit permission already given.

## API-Only Mode

- Use `routes/api.php` when it exists. Fresh Laravel 11/12 applications may omit
  it; run `install:api` only when adding an API and Sanctum is intended.
- Prefer API Resources and versioning if the repo already uses them.
- Follow the repo's auth stack (Sanctum/Passport/custom) and response format conventions.
- Do not require Vite/Tailwind/NPM unless the repo already includes them.

## Inertia + Wayfinder (if present)

- Use `Inertia::render()` for server-side responses and discover page paths from
  the application's page resolver; do not assume a directory or casing.
- Use form APIs supported by the installed Inertia version; add loading, empty,
  validation, and error states where relevant.
- Use `<Link>` or `router.visit()` for navigation.
- Use Wayfinder named imports for tree-shaking; avoid default imports; regenerate routes after changes if required.

## Livewire / Blade (if present)

- Follow existing component patterns and conventions; do not mix frameworks unless the repo already does.
- Keep UI strings in the repo's expected language.

## Tailwind CSS v4 (if present)

- Use `@import "tailwindcss";` and `@theme` for tokens.
- Avoid deprecated utilities; use replacements (e.g., `shrink-*`, `grow-*`, `text-ellipsis`).
- Use `gap-*` for spacing between items; follow existing dark mode conventions if present.

## Testing and Formatting

- Preserve the repository's Pest or PHPUnit test runner. Confirm generator flags
  with `php artisan help make:test`; generally prefer feature tests for behavior
  that crosses framework boundaries.
- Run the smallest relevant test target (`php artisan test <file>` or `--filter=`), plus checks required by the repository. Add regression coverage when it protects meaningful behavior. Broaden only for an affected contract or unresolved risk, respecting explicit suite budgets.
- Run the configured formatter on changed code; use `vendor/bin/pint --dirty` when Pint is installed and that scope fits. Reuse passing checks until relevant changes invalidate them.

## Laravel Boost MCP Tools (when available)

- Read application information, then use `search-docs` for uncertain or
  version-sensitive framework behavior.
- Discover the tools exposed by the installed Boost server; tool names and
  capabilities can vary by release.
- Use available route, Artisan, schema, log, browser, and URL tools for
  inspection. Keep database queries read-only and executable-code tools scoped
  to local or test environments unless explicitly authorized.
- See `references/boost-tools.md` for query patterns and tool usage tips.

## Output Expectations

- Preserve existing architecture, structure, and dependencies unless the user explicitly requests changes.
- Reuse existing components and follow local patterns.
- Report changed behavior, verification, and any unresolved material assumption.
