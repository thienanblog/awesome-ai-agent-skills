# Supported Tech Stacks

This document lists all officially supported tech stacks and their features.

## PHP Stacks

### Laravel (Full Support)

| Feature | Supported |
|---------|-----------|
| PHP 8.1/8.2/8.3 | Yes |
| MySQL/MariaDB/PostgreSQL | Yes |
| Redis | Yes |
| Queue Workers (Supervisor) | Yes |
| Scheduler | Yes |
| Horizon | Yes |
| Mailpit/MailHog | Yes |
| Opcache (dev optimized) | Yes |

### WordPress (Full Support)

| Feature | Supported |
|---------|-----------|
| PHP 8.0/8.1/8.2/8.3 | Yes |
| WP-CLI | Yes |
| MySQL/MariaDB | Yes |
| Redis Object Cache | Yes |
| Debug Plugins | Yes |
| ImageMagick | Yes |

### Drupal (Full Support)

| Feature | Supported |
|---------|-----------|
| PHP 8.1/8.2/8.3 | Yes |
| Drush | Yes |
| MySQL/MariaDB/PostgreSQL | Yes |
| Redis | Yes |
| Development Services | Yes |

### Joomla (Full Support)

| Feature | Supported |
|---------|-----------|
| PHP 8.1/8.2/8.3 | Yes |
| MySQL/MariaDB | Yes |
| Debug Mode | Yes |
| CLI Tools | Yes |

## Node.js Stacks

### Express/NestJS/Fastify (Full Support)

| Feature | Supported |
|---------|-----------|
| Node 18/20/22 | Yes |
| npm/yarn/pnpm/bun | Yes |
| PM2 | Yes |
| Hot Reload | Yes |
| MySQL/PostgreSQL | Yes |
| Redis | Yes |

### Next.js (Full Support)

| Feature | Supported |
|---------|-----------|
| Node 18/20/22 | Yes |
| Development Mode | Yes |
| Production Build | Yes |
| API Routes | Yes |

## Python Stacks

### Django (Full Support)

| Feature | Supported |
|---------|-----------|
| Python 3.10/3.11/3.12 | Yes |
| pip/poetry/pipenv | Yes |
| Gunicorn | Yes |
| Celery | Yes |
| PostgreSQL/MySQL | Yes |
| Redis | Yes |
| Static Files | Yes |

### FastAPI (Full Support)

| Feature | Supported |
|---------|-----------|
| Python 3.10/3.11/3.12 | Yes |
| Uvicorn | Yes |
| Hot Reload | Yes |
| PostgreSQL/MySQL | Yes |
| Redis | Yes |

### Flask (Partial Support)

| Feature | Supported |
|---------|-----------|
| Python 3.10/3.11/3.12 | Yes |
| Gunicorn | Yes |
| Database | Yes |
| Redis | Partial |

## Adding Support for New Stacks

If your stack is not listed, the skill will:
1. Warn you that the stack is not officially supported
2. Proceed with generic configuration
3. Encourage you to contribute improvements

See [CONTRIBUTING.md](./CONTRIBUTING.md.template) for how to add support.
