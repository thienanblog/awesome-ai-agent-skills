# Laravel 13 Stack Guidance

Use this reference only for the frontend, starter-kit, authentication, or API
branch involved in the task. Detect installed package versions and repository
paths before applying any pattern.

## Official Laravel 13 Starter-Kit Baseline

Fresh Laravel 13 starter kits currently provide these choices:

- React 19, TypeScript, Inertia 3, Tailwind CSS 4, and shadcn/ui.
- Vue with the Composition API, TypeScript, Inertia 3, Tailwind CSS 4, and
  shadcn-vue.
- Svelte 5, TypeScript, Inertia 3, Tailwind CSS 4, and shadcn-svelte.
- Livewire 4, Tailwind CSS 4, and Flux UI.

These are fresh-application defaults, not requirements for every Laravel 13
application. Preserve an existing compatible stack unless the user requests a
migration.

Official source: <https://laravel.com/docs/13.x/starter-kits>

## Inertia

- Inspect `composer.lock` and the JavaScript lockfile for server and client
  adapter versions.
- Discover the page resolver and directory from the app entry point. Official
  starter kits use `resources/js/pages`, but older or customized applications
  may use another path or casing.
- Keep route authorization and primary data loading server-side. Use deferred or
  optional props only for data that can arrive after the initial response.
- Use the installed adapter's form and navigation APIs. Do not copy examples from
  a different Inertia major version.
- Treat SSR as a separate runtime: verify the SSR build and development scripts
  when SSR-rendered code changes.

Official sources:

- <https://laravel.com/docs/13.x/starter-kits#inertia-ssr>
- <https://inertiajs.com/>

## Wayfinder

- Confirm `laravel/wayfinder` and its frontend integration are installed before
  importing generated routes or actions.
- Prefer named imports when available so bundlers can tree-shake unused output.
- Regenerate route definitions through the repository's normal Vite, Artisan, or
  package script after changing routes or controller actions.
- Remove stale frontend references when disabling authentication features; an
  unresolved generated route can fail the frontend build.

Official source: <https://github.com/laravel/wayfinder>

## Livewire and Blade

- Detect Livewire 3 versus 4 and whether the repository uses class components,
  single-file components, Volt, or a local convention.
- Keep state ownership and validation consistent with neighboring components.
- Use stable `wire:key` values for repeated elements and test loading, validation,
  authorization, and empty states.
- Use Flux UI only when installed. Reuse local Blade components and design tokens
  before introducing another component system.

Official sources:

- <https://livewire.laravel.com/docs/4.x/quickstart>
- <https://laravel.com/docs/13.x/blade>

## Authentication

- Inspect guards, providers, middleware, Fortify features, Sanctum stateful
  domains, Passport clients, and route configuration before changing auth.
- Laravel starter kits include built-in authentication and can use an optional
  WorkOS AuthKit variant. WorkOS is not a default dependency for existing apps.
- Keep Fortify action classes as the customization point when the starter kit
  already uses them.
- When disabling registration, verification, password reset, or two-factor
  authentication, remove corresponding backend and frontend references and test
  both access control and navigation.

Official sources:

- <https://laravel.com/docs/13.x/starter-kits#authentication>
- <https://laravel.com/docs/13.x/authentication>
- <https://laravel.com/docs/13.x/fortify>
- <https://laravel.com/docs/13.x/sanctum>

## API-Only Applications

- Fresh applications do not include `routes/api.php` by default. `php artisan
  install:api` creates the API routing surface and installs Sanctum, so run it
  only when both outcomes are intended.
- Keep API routes stateless unless the chosen authentication flow deliberately
  uses first-party SPA session authentication.
- Preserve existing response and error contracts. Standard Eloquent API
  Resources and Laravel 13 JSON:API Resources solve different contracts.
- Test authentication failures, authorization failures, validation errors,
  pagination, rate limits, and serialization of unloaded relationships.

Official sources:

- <https://laravel.com/docs/13.x/structure#the-routes-directory>
- <https://laravel.com/docs/13.x/eloquent-resources>
