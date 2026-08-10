# Laravel 13 Features and Upgrade Guide

Use this reference when adopting a Laravel 13-specific capability or upgrading
from Laravel 12. Re-check the versioned official documentation because minor
releases can add capabilities without breaking changes.

## Version Baseline

- Laravel 13 was released on March 17, 2026.
- Laravel 13 requires PHP 8.3 or newer.
- Use `^13.0` for `laravel/framework` unless the repository has a deliberate
  alternative constraint.
- Laravel does not include named parameter names in its backward-compatibility
  promise; prefer positional arguments for framework APIs when parameter names
  may change.

Official sources:

- <https://laravel.com/docs/13.x/releases>
- <https://laravel.com/docs/13.x/upgrade>

## Laravel AI SDK

Laravel 13 introduces a first-party SDK for provider-agnostic agents, text,
structured output, tools, embeddings, audio, images, and vector stores.

Before adoption:

- Confirm `laravel/ai` installation, provider support, model capabilities, and
  environment variables from the current docs.
- Define timeouts, retries, rate limits, cost controls, observability, and a
  user-visible failure path.
- Validate tool inputs and authorize every tool action independently of model
  output. Treat prompts and retrieved content as untrusted input.
- Avoid sending secrets, regulated data, or unnecessary personal data to model
  providers. Document retention and provider boundaries.
- Fake provider responses in deterministic tests; keep opt-in integration tests
  separate from the default suite.

Official source: <https://laravel.com/docs/13.x/ai-sdk>

## JSON:API Resources

Laravel 13 includes first-party JSON:API resources for resource objects,
relationships, includes, sparse fieldsets, links, metadata, and compliant
response headers.

Use them only for endpoints whose public contract is JSON:API. Before migrating
an existing endpoint, evaluate client compatibility, relationship-loading cost,
pagination, error-object shape, content negotiation, and rollout strategy.

Official source: <https://laravel.com/docs/13.x/eloquent-resources#json-api-resources>

## Search and Vector Data

Choose the smallest search architecture that meets measured requirements:

1. Use ordinary indexed queries for exact matching and filters.
2. Use database full-text search for ranked keyword search on supported MariaDB,
   MySQL, or PostgreSQL deployments.
3. Use Scout when model-index synchronization or a swappable engine is useful.
4. Use semantic/vector search only for meaning-based retrieval that justifies
   embedding generation, storage, provider cost, and operational complexity.

Laravel's vector search requires the AI SDK and a supported vector database.
PostgreSQL requires `pgvector`; dimensions and index settings must match the
chosen embedding model. Apply tenant or authorization filters in the database
query rather than filtering unauthorized results after retrieval.

Official source: <https://laravel.com/docs/13.x/search>

## Request-Forgery Protection

Laravel 13 formalizes CSRF middleware as `PreventRequestForgery` and adds
origin-aware verification using `Sec-Fetch-Site`. `VerifyCsrfToken` and
`ValidateCsrfToken` remain deprecated aliases.

- Update direct middleware imports, test exclusions, and custom middleware
  configuration to `PreventRequestForgery` during an upgrade.
- Do not broaden exclusions to work around failed requests. Verify trusted
  origins, proxies, browser behavior, and webhook route placement.
- Keep token-based CSRF defenses and test both accepted same-origin requests and
  rejected cross-site requests.

Official source: <https://laravel.com/docs/13.x/upgrade#request-forgery-protection>

## Upgrade Laravel 12 to 13

1. Read the complete Laravel 13 upgrade guide and repository-specific deployment
   documentation before changing constraints.
2. Verify PHP 8.3+ locally, in CI, containers, and production. Check Composer
   platform configuration and extensions.
3. Review dependency compatibility before updating constraints. The official
   baseline includes `laravel/framework ^13.0`, `laravel/boost ^2.0`,
   `laravel/tinker ^3.0`, PHPUnit 12, and Pest 4 when those packages are used.
4. Update the lockfile through the repository's normal Composer command. Do not
   hand-edit resolved package versions.
5. Address high-impact request-forgery changes first, then review every medium-
   and low-impact item relevant to the application's cache, database, routes,
   queues, serialization, pagination, and custom contract implementations.
6. Pay special attention to Laravel 13's cache `serializable_classes` allow-list
   when the application stores objects in cache. Prefer scalar or array payloads
   when practical.
7. Test route matching, authentication, sessions, cache continuity, jobs,
   database writes, pagination, and custom framework integrations. Run the full
   locally reproducible CI suite.
8. Keep deployment rollback compatible with schema and cache changes. Document
   any cache flush, worker restart, or environment update required.

Laravel Boost 2 can provide an `/upgrade-laravel-v13` prompt in supported agents.
Treat its output as an aid: inspect the diff and run the same compatibility and
verification gates.

Official source: <https://laravel.com/docs/13.x/upgrade>
