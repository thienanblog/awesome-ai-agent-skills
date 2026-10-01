---
name: laravel-11-12-app-guidelines
description: Implement changes in Laravel 11 or 12 using the installed framework, frontend, and command runner. Select by composer evidence; Laravel 12-to-13 upgrades use laravel-13-app-guidelines.
---

# Laravel 11/12 App Guidelines

Work from what the repository actually installs. Laravel 11 and 12 applications vary widely in skeleton, frontend, auth, and command runner, and most mistakes come from assuming a fresh-application default the project does not use.

## Delegation

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Detect before deciding

Read repository instructions and the relevant documentation owners, then confirm from `composer.json`, `composer.lock`, `package.json`, frontend lockfiles, `bootstrap/app.php`, Compose files, and `config/`:

- the command path: host PHP, Sail, Docker Compose, or a repository wrapper, used consistently;
- API-only or full-stack, and the frontend: Inertia with React, Vue, or Svelte; Livewire; or Blade;
- the auth stack (Fortify, Sanctum, Passport, or custom) and the test runner (Pest or PHPUnit).

For version-sensitive behavior, use Laravel Boost `search-docs` when Boost is available, since it filters by installed versions; otherwise use the official documentation for the installed major. [boost-tools.md](references/boost-tools.md) covers Boost usage and its data-safety limits.

Follow the repository's architecture, naming, UI language, and component patterns, and keep its dependencies unless the user asks for a change.

## Framework specifics that are easy to get wrong

- **Skeleton.** The modern skeleton configures middleware, exceptions, and routing in `bootstrap/app.php`, registers providers in `bootstrap/providers.php`, and defines closure commands and schedules in `routes/console.php`. An application upgraded from Laravel 10 may still use `app/Http/Kernel.php` and `app/Console/Kernel.php`; that structure remains supported, so keep it unless the task is to migrate it.
- **API routes.** Fresh applications omit `routes/api.php`. `install:api` creates it and installs Sanctum, so run it only when both are intended. API-only work should not pull in Vite, Tailwind, or Node.
- **Column changes.** `change()` drops every modifier that is not restated. Inspect the current column and repeat the modifiers that must survive.
- **Destructive database commands.** `migrate:fresh`, `migrate:reset`, rollbacks, and `db:wipe` need authorization that covers the target and its data loss; reuse permission already given.
- **Queries.** Bound raw expressions and the query builder are fine where they are clearer than Eloquent; untrusted input is never interpolated into SQL.
- **Inertia.** Discover the page directory and casing from the page resolver. Use the form and navigation APIs of the installed Inertia major; examples from another major do not transfer.
- **Wayfinder**, when installed: use named imports so output tree-shakes, and regenerate after route or controller changes.
- **Tailwind.** Detect v3 or v4 from the lockfile. v4 is configured in CSS (`@import "tailwindcss"`, `@theme`) and removes utilities that v3 deprecated; leave a working v3 setup on v3 unless a migration is requested.
- **Livewire and Blade.** Match the installed Livewire major and the component style neighbors use, without introducing a second frontend framework.

## Verify

Keep the repository's test runner and confirm generator flags with `php artisan help make:test`. Run the smallest relevant target (`php artisan test <file>` or `--filter=`) plus the checks the repository requires, and add regression coverage where it protects meaningful behavior. Broaden for an affected contract or unresolved risk, within any stated suite budget.

Run the configured formatter on changed code; `vendor/bin/pint --dirty` fits when Pint is installed.

Report the changed behavior, the checks run and their results, and any material assumption left unresolved.
