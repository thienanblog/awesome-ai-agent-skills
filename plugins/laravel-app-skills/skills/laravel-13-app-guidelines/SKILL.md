---
name: laravel-13-app-guidelines
description: Guidelines and workflow for creating, upgrading, and changing Laravel 13 applications. Use when a task targets laravel/framework ^13.0 or a Laravel 12-to-13 upgrade, including API-only apps and Blade, Livewire 4, or Inertia 3 with React, Vue, or Svelte, plus starter kits, Tailwind CSS 4, Fortify or WorkOS AuthKit, Wayfinder, Pest 4 or PHPUnit 12, Pint, Laravel Boost 2, the Laravel AI SDK, JSON:API resources, and search. Detect installed versions and repository conventions before applying version-specific guidance.
---

# Laravel 13 App Guidelines

## Overview

Use a repository-first workflow for Laravel 13 work. Detect the actual framework,
packages, frontend, command runner, and local conventions before selecting a
Laravel pattern; do not turn optional Laravel 13 capabilities into dependencies.

Run this skill in the main conversation. Do not spawn subagents, agent teams, or
delegated parallel workers unless the user explicitly approves the proposed
agent count and scope after being told that delegation can increase usage. Ask
again before expanding the approved scope.

## Execute the Workflow

1. Read repository instructions such as `AGENTS.md`, `CLAUDE.md`, and relevant
   `docs/` files before making decisions.
2. Inspect `composer.json`, `composer.lock`, `package.json`, frontend lockfiles,
   `bootstrap/app.php`, `bootstrap/providers.php`, routes, configuration, and
   tests. Use `php artisan about` or `composer show` when dependencies are
   installed and the repository's command runner permits it.
3. Identify the supported command path: host PHP, Sail, Docker Compose, or a
   repository wrapper. Reuse that path consistently and do not assume Sail.
4. Confirm the application shape: API-only or full-stack; Blade, Livewire, or
   Inertia; frontend framework and major version; authentication; test runner;
   queue, cache, search, and database drivers.
5. Consult version-matched guidance before changing framework behavior. Prefer
   Laravel Boost `search-docs` when Boost is installed and available; otherwise
   use Laravel 13.x or the installed package's official documentation.
6. Follow existing architecture and naming. Implement the smallest coherent
   change, add or update focused tests, and run focused checks for the affected
   surface. After implementation is complete, ask the user whether to run any
   broader or full suite.

Do not install, upgrade, or replace packages merely because this skill lists
them. Confirm a task requirement and compatibility first.

## Apply the Laravel 13 Baseline

- Require PHP 8.3 or newer for Laravel 13 and respect the exact platform range
  declared by the repository and its deployment environment.
- Configure application routing, middleware, and exception handling through
  `bootstrap/app.php` when the project follows the modern skeleton. Register
  application providers through `bootstrap/providers.php`.
- Treat `routes/web.php` and `routes/console.php` as fresh-application defaults.
  `routes/api.php` and `routes/channels.php` are optional and may be installed by
  `install:api` and `install:broadcasting`; do not assume they exist.
- Preserve an upgraded application's established structure when it remains
  supported. Do not reorganize it to resemble a fresh Laravel 13 application
  unless the task requires that migration.
- Use named arguments for Laravel framework methods cautiously because parameter
  names are outside Laravel's backward-compatibility promise.

## Design HTTP and Domain Changes

- Keep controllers and route closures thin. Put reusable domain behavior in the
  application's existing action, service, job, model, or domain layer instead
  of introducing a new abstraction by default.
- Use Form Requests for reusable or non-trivial validation and authorization.
  Inline validation remains reasonable for a small one-off endpoint when it
  matches local conventions.
- Enforce authorization with policies, gates, or the repository's established
  authorization layer; validation is not authorization.
- Prefer Eloquent models and relationships for domain-oriented work. Use the
  query builder or bound raw expressions when they make bulk or complex queries
  clearer and measurable; never interpolate untrusted SQL.
- Prevent N+1 queries with deliberate eager loading, constrain selected columns
  when useful, and use `whenLoaded` in API resources. Paginate, cursor, or chunk
  large result sets according to consistency and memory requirements.
- Wrap multi-write invariants in transactions and make queued side effects safe
  for retries. Dispatch after commit when consumers require committed data.
- When changing a column with `change()`, restate every modifier that must be
  retained because omitted modifiers are dropped. Inspect the current schema
  first and make migrations reversible when practical.
- Ask for explicit approval before destructive database commands or migrations,
  including `migrate:fresh`, `db:wipe`, broad deletes, and irreversible drops.

## Build APIs Deliberately

- Add or use `routes/api.php` only when the project exposes a stateless API. Use
  `install:api` only when adding that surface is part of the requested change.
- Follow the existing response envelope, error format, pagination, and versioning
  contract. Use standard API Resources by default when the project uses them.
- Use Laravel 13 JSON:API Resources only when the API contract requires JSON:API;
  do not silently convert an established API format.
- Detect Sanctum, Passport, session authentication, WorkOS AuthKit, or custom
  authentication from installed packages and configuration. Preserve its guard
  and token semantics.
- Keep API-only work independent of Vite, Tailwind, and Node unless those tools
  are already part of the requested surface.

## Follow the Detected Frontend Stack

- Discover page, component, and layout paths from the repository; casing and
  locations vary. Do not assume `resources/js/Pages`.
- For Inertia, use the APIs supported by the installed Inertia major version.
  Official Laravel 13 starter kits use Inertia 3 for React, Vue, and Svelte, but
  existing Laravel 13 apps may use another compatible version.
- Use Inertia links, forms, visits, partial reloads, deferred data, and SSR only
  where the installed adapter and local patterns support them. Provide loading,
  empty, validation, and error states for affected interactions.
- Use Wayfinder only when installed. Prefer generated named imports where the
  project supports them and run the repository's route-generation or build
  command after route changes.
- For Livewire, follow the installed Livewire version and component style. Use
  Flux UI only when present; do not replace Blade or existing components merely
  to match a starter kit.
- For Tailwind CSS 4, preserve the project's CSS-first configuration, tokens,
  component library, responsive rules, and dark-mode strategy. Do not migrate a
  working Tailwind 3 setup unless requested.
- Read `references/stack-guidance.md` when the task touches starter kits,
  authentication, Inertia, Livewire, Blade, Wayfinder, or Tailwind.

## Adopt Laravel 13 Features Only When They Fit

Laravel 13 adds first-party AI primitives, JSON:API resources, semantic and
vector search, and stronger request-forgery defaults. Treat each as an optional
design choice with package, provider, database, security, cost, and operational
consequences. Read `references/laravel-13-features-and-upgrade.md` before using a
new Laravel 13 feature or upgrading an application from Laravel 12.

## Test, Format, and Verify

- Preserve Pest or PHPUnit according to the repository. Laravel 13 supports both;
  do not force PHPUnit into a Pest project or vice versa.
- Prefer feature tests for behavior crossing framework boundaries and focused
  unit tests for isolated logic. Add regression tests for bug fixes.
- Confirm generator flags with `php artisan help make:test` before using them.
  For upgrades, expect Pest 4 or PHPUnit 12 only after dependency compatibility
  has been verified.
- Run the smallest relevant test target. Use the repository wrapper and test
  database; never point tests at production.
- Run focused formatting, static analysis, frontend lint, type-check, build, and
  browser or E2E checks when they can fail for the changed surface. After
  implementation and focused verification are complete, list the broader
  affected or full-suite commands and ask the user whether to run them. Do not
  run them without explicit approval unless higher-priority repository
  instructions require it.
- Report the exact checks run, results, and any checks that could not run.

## Use Laravel Boost Safely

- Read application information before relying on framework or package versions.
- Use `search-docs` with short topic queries before implementing version-sensitive
  behavior. Let Boost filter documentation by installed package versions.
- Discover the tools exposed by the installed Boost server instead of assuming
  every Boost release has the same names or capabilities.
- Keep database inspection read-only and scope executable-code tools to local or
  test environments. Never use Tinker or database tools to mutate production
  data without explicit authorization.
- Read `references/boost-tools.md` for the current tool-selection and fallback
  workflow.

## Preserve Project Integrity

- Reuse existing dependencies, components, factories, policies, resources, and
  conventions before creating replacements.
- Keep credentials in environment configuration and never expose secrets in
  logs, fixtures, frontend bundles, or agent output.
- Update durable documentation when behavior, setup, public APIs, or operational
  procedures change.
- Distinguish framework facts from recommendations and from repository-specific
  conventions in the final handoff.
