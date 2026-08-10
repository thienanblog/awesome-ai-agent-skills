# Tech Stack Detection

Use detection to reduce questions, not to make irreversible decisions. Confirm results from manifests, lockfiles, runtime files, and existing commands.

## Contents

- [Repository inventory](#repository-inventory)
- [Runtime and framework signals](#runtime-and-framework-signals)
- [Service signals](#service-signals)
- [Monorepos](#monorepos)
- [Detection output](#detection-output)

## Repository Inventory

Inspect Docker-related files before generating anything:

```bash
rg --files -g 'compose*.yml' -g 'compose*.yaml' \
  -g 'docker-compose*.yml' -g 'docker-compose*.yaml' \
  -g 'Dockerfile*' -g '.dockerignore' -g '.devcontainer/**'
```

Also inspect project instructions, Git status, env examples, Makefiles, package scripts, runtime-version files, and CI commands. Existing Compose overrides, profiles, project names, volumes, and external networks can encode intentional team workflows.

Run the detector from the skill directory:

```bash
./scripts/detect-stack.sh "<project-root>"
```

Parse stdout as JSON. Treat stderr as diagnostics. Do not source application env files or print secret values.

## Runtime and Framework Signals

Use the strongest available constraints:

### PHP

- `composer.json` and `composer.lock`
- `artisan` plus `laravel/framework`
- `wp-config.php`, `wp-content/`, or Composer-based WordPress layout
- Drupal `core/`, `sites/default/`, and Composer metadata
- Joomla `configuration.php`, `administrator/`, and version sources

Extract supported PHP ranges rather than guessing the newest version. Prefer project-local Drush, WP-CLI, and framework CLIs over unpinned global downloads.

### Node.js

- `packageManager` in `package.json`
- Corepack metadata and lockfile: npm, pnpm, Yarn, or Bun
- `.nvmrc`, `.node-version`, `.tool-versions`, Volta, or `engines.node`
- framework packages and actual development scripts

Do not infer a framework from a script name. Preserve the detected package manager and frozen/immutable install semantics.

### Python

- `pyproject.toml`, lockfiles, `requirements*.txt`, `Pipfile.lock`, `uv.lock`
- `.python-version`, `.tool-versions`, or project constraints
- Django, FastAPI, Flask, Celery, and ASGI/WSGI packages

Do not assume `requirements.txt` when a project uses Poetry, uv, PDM, Pipenv, or another locked workflow.

## Service Signals

Check both configuration and source usage before adding optional infrastructure:

- database driver, URL scheme, migrations, and ORM packages
- Redis/cache/session configuration and client packages
- queue driver, worker packages, queued jobs, and dispatch calls
- scheduler declarations and commands
- SMTP/mail configuration and test requirements
- object storage, search, browser, websocket, or other supporting services explicitly used by the project

An env key alone is not proof that a service is active; examples and stale defaults are common. Conversely, an absent local env file does not prove the service is unused.

Recognize SQLite and externally hosted services. Do not add a local database container automatically.

## Monorepos

Locate workspace roots and app manifests without traversing dependency or build directories:

```bash
rg --files -g 'pnpm-workspace.yaml' -g 'package.json' -g 'composer.json' \
  -g 'pyproject.toml' -g 'turbo.json' -g 'nx.json' -g 'lerna.json' \
  -g '!node_modules/**' -g '!vendor/**' -g '!dist/**' -g '!build/**'
```

For each app in scope, determine:

- path, role, dev command, and internal port
- dependency installation root and lockfile
- shared packages that must reload
- build context and Dockerfile path
- public hostname or proxy route
- required internal services

Use the repository root as build context only when root lockfiles or shared packages require it. Mount or sync the narrowest paths that preserve workspace resolution.

## Detection Output

The detector reports hints for language, runtime, framework/CMS, package manager, database, Redis, queue usage, existing Docker files, and support status.

If detection is incomplete:

1. inspect the relevant manifests directly
2. summarize what is known and uncertain
3. ask one grouped question about only the choices that change the generated design

For unsupported stacks, apply generic Compose principles and avoid pretending framework-specific support. Do not solicit contributions in the middle of completing the user's task.
