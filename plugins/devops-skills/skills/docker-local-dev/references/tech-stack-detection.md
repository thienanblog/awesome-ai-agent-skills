# Tech Stack Detection Reference

This document describes how to detect various tech stacks automatically before using AI analysis.

## Detection Priority

1. Run `scripts/detect-stack.sh` first (saves AI tokens)
2. If detection fails or user disagrees, use AI analysis
3. If stack is unsupported, warn user and proceed with generic config

## PHP Detection

### Laravel

**Primary indicators:**
- `composer.json` exists AND contains `laravel/framework`
- `artisan` file exists in project root

**Version detection:**
```bash
# From composer.json
grep '"laravel/framework"' composer.json | grep -oE '[0-9]+\.[0-9]+'
```

**Additional detection:**
- `config/app.php` - Laravel configuration
- `routes/web.php` - Laravel routes
- `app/Http/Kernel.php` - HTTP kernel

**Laravel Sail detection:**
- `docker-compose.yml` with `sail` references
- `.env` with `SAIL_` variables
- Warn user to avoid conflicts with existing Sail setup

### WordPress

**Primary indicators:**
- `wp-config.php` exists
- `wp-content/` directory exists
- `wp-includes/` directory exists

**Version detection:**
```bash
# From wp-includes/version.php
grep '$wp_version' wp-includes/version.php | grep -oE '[0-9]+\.[0-9]+'
```

**Theme/Plugin detection:**
- `wp-content/themes/` - active theme
- `wp-content/plugins/` - installed plugins

### Drupal

**Primary indicators:**
- `core/` directory with Drupal core
- `sites/default/` directory
- `core/lib/Drupal.php` exists

**Version detection:**
```bash
# From core/lib/Drupal.php
grep 'const VERSION' core/lib/Drupal.php | grep -oE '[0-9]+\.[0-9]+'
```

**Drush detection:**
- `vendor/bin/drush` exists
- `drush/` directory in project

### Joomla

**Primary indicators:**
- `configuration.php` exists
- `administrator/` directory exists
- `libraries/src/` or `libraries/joomla/` exists

**Version detection:**
```bash
# From libraries/src/Version.php
grep 'MAJOR_VERSION\|MINOR_VERSION' libraries/src/Version.php
```

## Node.js Detection

### Framework Detection

**Next.js:**
- `package.json` contains `"next"`
- `next.config.js` or `next.config.ts` exists

**NestJS:**
- `package.json` contains `"@nestjs/core"`
- `nest-cli.json` exists

**Express:**
- `package.json` contains `"express"`
- Common patterns: `app.js`, `server.js`, `index.js`

**Fastify:**
- `package.json` contains `"fastify"`

### Version Detection

```bash
# From .nvmrc
cat .nvmrc | tr -d 'v'

# From package.json engines
grep '"node"' package.json | grep -oE '[0-9]+'
```

### Package Manager Detection

| Lock File | Package Manager |
|-----------|-----------------|
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `bun.lockb` | bun |
| `package-lock.json` | npm |

## Python Detection

### Framework Detection

**Django:**
- `manage.py` exists
- `requirements.txt` or `pyproject.toml` contains `django`
- `settings.py` in project

**FastAPI:**
- `requirements.txt` or `pyproject.toml` contains `fastapi`
- `main.py` with FastAPI app

**Flask:**
- `requirements.txt` or `pyproject.toml` contains `flask`
- `app.py` or `application.py`

### Version Detection

```bash
# From pyproject.toml
grep 'python' pyproject.toml | grep -oE '[0-9]+\.[0-9]+'

# From runtime.txt (Heroku style)
cat runtime.txt | grep -oE '[0-9]+\.[0-9]+'

# From .python-version (pyenv)
cat .python-version
```

### Package Manager Detection

| File | Package Manager |
|------|-----------------|
| `poetry.lock` | Poetry |
| `Pipfile.lock` | Pipenv |
| `requirements.txt` | pip |

## Database Detection

### From .env File

```bash
# MySQL
grep -E 'DB_CONNECTION=mysql|DATABASE_URL.*mysql' .env

# PostgreSQL
grep -E 'DB_CONNECTION=pgsql|DATABASE_URL.*postgres' .env

# SQLite
grep -E 'DB_CONNECTION=sqlite' .env
```

### From Framework Config

**Laravel:**
- `config/database.php` - default connection
- `.env` - `DB_CONNECTION`

**Django:**
- `settings.py` - `DATABASES` dict
- Look for `mysql`, `postgresql`, `psycopg`

**Node.js:**
- `config/database.js` or similar
- `.env` for connection string

## Redis Detection

**From .env:**
```bash
grep -E 'REDIS_HOST|CACHE_DRIVER=redis|SESSION_DRIVER=redis|QUEUE_CONNECTION=redis' .env
```

**From package.json:**
```bash
grep -E '"redis"|"ioredis"|"bull"' package.json
```

**From requirements.txt:**
```bash
grep -iE '^redis|^celery|^django-redis' requirements.txt
```

## Queue Detection

**Laravel:**
- `QUEUE_CONNECTION=redis` or `database` in `.env`
- `app/Jobs/` directory exists

**Node.js:**
- `bull` or `bullmq` in `package.json`

**Python:**
- `celery` in requirements

## Existing Docker Detection

Check for these files:
- `docker-compose.yml`
- `docker-compose.yaml`
- `Dockerfile`
- `.dockerignore`

If found, ask user how to proceed:
1. Merge with existing
2. Replace (backup first)
3. Cancel

## Detection Output Format

```json
{
  "detected": true,
  "language": "php",
  "languageVersion": "8.3",
  "framework": "laravel",
  "frameworkVersion": "11.0",
  "cms": null,
  "packageManager": "composer",
  "database": "mysql",
  "redis": true,
  "queue": true,
  "existingDocker": false,
  "supported": true
}
```

## Supported Stack List

| Stack | Fully Supported |
|-------|-----------------|
| Laravel | Yes |
| WordPress | Yes |
| Drupal | Yes |
| Joomla | Yes |
| Next.js | Yes |
| NestJS | Yes |
| Express | Yes |
| Django | Yes |
| FastAPI | Yes |
| Flask | Yes |

For unsupported stacks, the skill will:
1. Warn the user
2. Proceed with generic configuration
3. Encourage contribution to improve support
