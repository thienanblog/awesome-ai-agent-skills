# Tech Stack Detection Reference

This document defines the file patterns and indicators used to auto-detect project tech stacks.

## Detection Priority

When multiple frameworks are detected, prioritize based on:
1. Primary backend framework (Laravel, Express, Django, etc.)
2. Primary frontend framework (Vue, React, Angular, etc.)
3. Build tools and package managers
4. Testing frameworks
5. Linting/formatting tools

## Backend Framework Detection

### Laravel
**Confidence: HIGH if 3+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Composer dependency | `composer.json` contains `"laravel/framework"` | HIGH |
| Artisan CLI | `artisan` file exists in root | HIGH |
| App config | `config/app.php` exists | HIGH |
| Routes | `routes/web.php` or `routes/api.php` exists | MEDIUM |
| Migrations | `database/migrations/` directory exists | MEDIUM |
| Eloquent models | `app/Models/` directory exists | MEDIUM |

**Version Detection:**
```json
// composer.json
"require": {
    "laravel/framework": "^11.0"  // Extract major version
}
```

**Sub-framework Detection:**
- Laravel Sail: `laravel/sail` in composer.json dev dependencies
- Laravel Sanctum: `laravel/sanctum` in composer.json
- Laravel Fortify: `laravel/fortify` in composer.json
- Inertia.js: `inertiajs/inertia-laravel` in composer.json

### Express.js / Node.js
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Express dependency | `package.json` contains `"express"` | HIGH |
| Server file | `server.js`, `app.js`, or `index.js` with express import | HIGH |
| npm scripts | `package.json` has `"start"` script | MEDIUM |

### Django
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| manage.py | `manage.py` exists in root | HIGH |
| Django dependency | `requirements.txt` or `pyproject.toml` contains `django` | HIGH |
| Settings | `settings.py` or `settings/` directory exists | HIGH |

### Flask
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Flask dependency | `requirements.txt` contains `flask` | HIGH |
| App file | `app.py` with Flask import | HIGH |

### Ruby on Rails
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Gemfile | `Gemfile` contains `rails` | HIGH |
| Config | `config/routes.rb` exists | HIGH |
| Bin rails | `bin/rails` exists | HIGH |

---

## Frontend Framework Detection

### Vue.js
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Vue dependency | `package.json` contains `"vue"` | HIGH |
| Vue files | `.vue` files exist in project | HIGH |
| Vite config | `vite.config.ts` or `vite.config.js` with vue plugin | MEDIUM |
| Vue config | `vue.config.js` exists | MEDIUM |

**Version Detection:**
```json
// package.json
"dependencies": {
    "vue": "^3.4.0"  // Vue 3
}
```

**Sub-framework Detection:**
- Nuxt.js: `nuxt` in package.json, `nuxt.config.ts` exists
- Pinia: `pinia` in package.json
- Vue Router: `vue-router` in package.json
- Vuetify: `vuetify` in package.json
- PrimeVue: `primevue` in package.json

### React
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| React dependency | `package.json` contains `"react"` | HIGH |
| JSX/TSX files | `.jsx` or `.tsx` files exist | HIGH |
| React DOM | `package.json` contains `"react-dom"` | MEDIUM |

**Sub-framework Detection:**
- Next.js: `next` in package.json, `next.config.js` exists
- Remix: `@remix-run/react` in package.json
- Inertia React: `@inertiajs/react` in package.json
- Redux: `redux` or `@reduxjs/toolkit` in package.json
- React Query: `@tanstack/react-query` in package.json

### Angular
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Angular config | `angular.json` exists | HIGH |
| Angular core | `package.json` contains `"@angular/core"` | HIGH |

### Svelte
**Confidence: HIGH if 2+ indicators present**

| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Svelte dependency | `package.json` contains `"svelte"` | HIGH |
| Svelte config | `svelte.config.js` exists | HIGH |
| Svelte files | `.svelte` files exist | HIGH |

---

## UI Library Detection

### TailwindCSS
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Tailwind dependency | `package.json` contains `"tailwindcss"` | HIGH |
| Tailwind config | `tailwind.config.js` or `tailwind.config.ts` | HIGH |
| CSS import | CSS file contains `@tailwind` or `@import "tailwindcss"` | HIGH |

**Version Detection:**
- v3: `tailwind.config.js` with `module.exports`
- v4: CSS-based config with `@theme` directive

### Bootstrap
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Bootstrap dependency | `package.json` contains `"bootstrap"` | HIGH |
| Bootstrap CSS | CSS/SCSS imports bootstrap | MEDIUM |

---

## Package Manager Detection

| Package Manager | Lock File | Confidence |
|-----------------|-----------|------------|
| npm | `package-lock.json` | HIGH |
| Yarn | `yarn.lock` | HIGH |
| pnpm | `pnpm-lock.yaml` | HIGH |
| Bun | `bun.lockb` | HIGH |
| Composer | `composer.lock` | HIGH |
| pip | `requirements.txt` | MEDIUM |
| Poetry | `poetry.lock` | HIGH |

---

## Testing Framework Detection

### PHP Testing
| Framework | Detection Pattern | Confidence |
|-----------|-------------------|------------|
| PHPUnit | `phpunit.xml` or `phpunit.xml.dist` exists | HIGH |
| Pest | `pestphp/pest` in composer.json | HIGH |

### JavaScript Testing
| Framework | Detection Pattern | Confidence |
|-----------|-------------------|------------|
| Jest | `jest.config.js` or `jest` in package.json | HIGH |
| Vitest | `vitest.config.ts` or `vitest` in package.json | HIGH |
| Mocha | `mocha` in package.json | HIGH |
| Cypress | `cypress.config.js` or `cypress` in package.json | HIGH |
| Playwright | `playwright.config.ts` or `@playwright/test` in package.json | HIGH |

### Python Testing
| Framework | Detection Pattern | Confidence |
|-----------|-------------------|------------|
| pytest | `pytest.ini`, `conftest.py`, or `pytest` in requirements | HIGH |
| unittest | `test_*.py` files with `unittest` imports | MEDIUM |

---

## Code Style/Linting Detection

### PHP
| Tool | Detection Pattern | Confidence |
|------|-------------------|------------|
| Laravel Pint | `pint.json` exists or `laravel/pint` in composer.json | HIGH |
| PHP CS Fixer | `.php-cs-fixer.php` or `.php-cs-fixer.dist.php` | HIGH |
| PHPStan | `phpstan.neon` or `phpstan/phpstan` in composer.json | HIGH |

### JavaScript/TypeScript
| Tool | Detection Pattern | Confidence |
|------|-------------------|------------|
| ESLint | `.eslintrc.*` or `eslint.config.js` | HIGH |
| Prettier | `.prettierrc.*` or `prettier.config.js` | HIGH |
| Biome | `biome.json` | HIGH |

---

## Container/Environment Detection

### Docker
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Docker Compose | `docker-compose.yml` or `docker-compose.yaml` | HIGH |
| Dockerfile | `Dockerfile` in root or subdirectory | HIGH |
| Laravel Sail | `laravel/sail` in composer.json | HIGH |

**Service Detection (from docker-compose.yml):**
```yaml
services:
  app:        # PHP/Laravel container
  web:        # Nginx/Apache
  db:         # Database (mysql, postgres, mariadb)
  redis:      # Cache/Queue
  node:       # Node.js for frontend builds
```

### Dev Containers
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| VS Code Dev Container | `.devcontainer/devcontainer.json` | HIGH |
| GitHub Codespaces | `.devcontainer/` directory | HIGH |

---

## Database Detection

| Database | Detection Pattern | Confidence |
|----------|-------------------|------------|
| MySQL | `.env` contains `DB_CONNECTION=mysql` | HIGH |
| PostgreSQL | `.env` contains `DB_CONNECTION=pgsql` | HIGH |
| SQLite | `database/*.sqlite` files exist | HIGH |
| MariaDB | docker-compose uses `mariadb` image | HIGH |
| MongoDB | `mongoose` in package.json | HIGH |
| Redis | `redis` in composer.json or docker-compose | MEDIUM |

---

## Scan Depth File Lists

### Quick Scan (Root Level Only)
```
package.json
package-lock.json / yarn.lock / pnpm-lock.yaml / bun.lockb
composer.json
composer.lock
docker-compose.yml / docker-compose.yaml
Dockerfile
.env.example
pyproject.toml
requirements.txt
Gemfile
go.mod
Cargo.toml
artisan
manage.py
```

### Medium Scan (Root + Common Directories)
All Quick Scan files, plus:
```
src/
  *.vue, *.jsx, *.tsx (first level only)
app/
  Http/Controllers/ (scan for patterns)
  Models/ (scan for patterns)
config/
  app.php, database.php (Laravel)
routes/
  web.php, api.php
resources/
  js/ (check for Inertia)
  views/ (check for Blade)
components/ (first level)
pages/ (first level)
```

### Deep Scan (Full Tree)
All Medium Scan files, plus:
```
tests/
  **/*.php, **/*.js, **/*.ts
docs/
  **/*.md
scripts/
  **/*
public/
  index.php, index.html
storage/
  (skip - runtime files)
vendor/
  (skip - dependencies)
node_modules/
  (skip - dependencies)
```

---

## Confidence Scoring

**HIGH (90%+)**: Primary framework indicators present
**MEDIUM (60-89%)**: Secondary indicators or config files
**LOW (< 60%)**: Inferred from file patterns only

When presenting to user, show confidence levels:
```
Backend:
  - Laravel 11 (HIGH confidence - composer.json + artisan + config)
  - PHP 8.3 (HIGH confidence - composer.json require)

Frontend:
  - Vue.js 3 (HIGH confidence - package.json + .vue files)
  - TailwindCSS v4 (MEDIUM confidence - package.json only)
```

---

## CI/CD Detection

| CI/CD Platform | Detection Pattern | Confidence |
|----------------|-------------------|------------|
| GitHub Actions | `.github/workflows/*.yml` or `.github/workflows/*.yaml` | HIGH |
| GitLab CI | `.gitlab-ci.yml` in root | HIGH |
| CircleCI | `.circleci/config.yml` | HIGH |
| Jenkins | `Jenkinsfile` in root | HIGH |
| Travis CI | `.travis.yml` in root | HIGH |
| Azure Pipelines | `azure-pipelines.yml` or `.azure-pipelines/` | HIGH |
| Bitbucket Pipelines | `bitbucket-pipelines.yml` | HIGH |

**Workflow Detection (from GitHub Actions):**
```yaml
# Look for common workflow patterns
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:      # Testing workflow
  build:     # Build workflow
  deploy:    # Deployment workflow
```

---

## Mobile App Detection

### React Native
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| React Native dependency | `package.json` contains `"react-native"` | HIGH |
| Metro config | `metro.config.js` exists | HIGH |
| iOS directory | `ios/` directory with `.xcodeproj` or `.xcworkspace` | HIGH |
| Android directory | `android/` directory with `build.gradle` | HIGH |
| Expo | `package.json` contains `"expo"` | HIGH |

### Flutter
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Pubspec | `pubspec.yaml` exists | HIGH |
| Flutter SDK | `pubspec.yaml` contains `flutter:` dependency | HIGH |
| Dart files | `lib/*.dart` files exist | HIGH |
| iOS directory | `ios/Runner.xcodeproj` exists | MEDIUM |
| Android directory | `android/app/build.gradle` exists | MEDIUM |

---

## Monorepo Detection

### Nx
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Nx config | `nx.json` exists | HIGH |
| Nx workspace | `workspace.json` or `project.json` files | HIGH |
| Nx dependency | `package.json` contains `"nx"` | HIGH |

### Turborepo
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Turbo config | `turbo.json` exists | HIGH |
| Turbo dependency | `package.json` contains `"turbo"` | HIGH |

### Lerna
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Lerna config | `lerna.json` exists | HIGH |
| Lerna dependency | `package.json` contains `"lerna"` | HIGH |

### pnpm Workspaces
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| pnpm workspace | `pnpm-workspace.yaml` exists | HIGH |
| Workspace packages | `packages/` or `apps/` directories with package.json | MEDIUM |

### Yarn Workspaces
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Workspace config | `package.json` contains `"workspaces"` array | HIGH |

---

## API Documentation Detection

| Documentation Type | Detection Pattern | Confidence |
|--------------------|-------------------|------------|
| OpenAPI/Swagger | `openapi.yaml`, `openapi.json`, `swagger.yaml`, `swagger.json` | HIGH |
| OpenAPI in docs | `docs/api/openapi.*` or `api-docs/openapi.*` | HIGH |
| Postman Collection | `*.postman_collection.json` | HIGH |
| Insomnia | `.insomnia/` directory | HIGH |
| API Blueprint | `*.apib` files | HIGH |
| Laravel Scribe | `scribephp/scribe` in composer.json | HIGH |
| Swagger PHP | `zircote/swagger-php` in composer.json | HIGH |
| FastAPI docs | FastAPI auto-generates at `/docs` (runtime only) | MEDIUM |
| DRF Spectacular | `drf-spectacular` in requirements.txt | HIGH |

---

## Python Detection (Additional)

### Django
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| manage.py | `manage.py` exists in root | HIGH |
| Django dependency | `requirements.txt` or `pyproject.toml` contains `django` | HIGH |
| Settings module | `settings.py` or `settings/` directory | HIGH |
| Django apps | `apps/` or `<app>/apps.py` files | MEDIUM |

### Flask
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| Flask dependency | `requirements.txt` contains `flask` or `Flask` | HIGH |
| App file | `app.py` or `wsgi.py` with Flask import | HIGH |
| Flask factory | `create_app` function detected | MEDIUM |

### FastAPI
| Indicator | File/Pattern | Confidence |
|-----------|--------------|------------|
| FastAPI dependency | `requirements.txt` or `pyproject.toml` contains `fastapi` | HIGH |
| Main file | `main.py` with FastAPI import | HIGH |
| Uvicorn | `uvicorn` in requirements | MEDIUM |

### Python Tools
| Tool | Detection Pattern | Confidence |
|------|-------------------|------------|
| Black | `pyproject.toml` contains `[tool.black]` or `black` in requirements | HIGH |
| Ruff | `ruff.toml` or `pyproject.toml` contains `[tool.ruff]` | HIGH |
| isort | `pyproject.toml` contains `[tool.isort]` | HIGH |
| mypy | `mypy.ini` or `pyproject.toml` contains `[tool.mypy]` | HIGH |
| pytest | `pytest.ini`, `pyproject.toml` with `[tool.pytest]`, or `conftest.py` | HIGH |
| Poetry | `pyproject.toml` with `[tool.poetry]` | HIGH |
| Pipenv | `Pipfile` exists | HIGH |
