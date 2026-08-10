# Health Check Patterns

Use healthchecks to prove readiness at the narrowest reliable boundary. Do not confuse a running process with a usable application.

## Contents

- [Principles](#principles)
- [Compose healthchecks](#compose-healthchecks)
- [Application smoke checks](#application-smoke-checks)
- [Database checks](#database-checks)
- [Workers and one-shot services](#workers-and-one-shot-services)
- [Failure reporting](#failure-reporting)

## Principles

- Use a command available in the final image.
- Test readiness, not just process existence.
- Keep checks fast, deterministic, and free of persistent mutations.
- Escape container-side Compose variables as `$$VAR`.
- Add a realistic `start_period` for slow initialization.
- Avoid dependencies on host ports when the check can run inside the service network.
- Do not put secret values directly in healthcheck commands or generated logs.

## Compose Healthchecks

PostgreSQL:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
  interval: 5s
  timeout: 5s
  retries: 10
  start_period: 10s
```

MySQL or MariaDB:

```yaml
healthcheck:
  test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -u root --password=$${MYSQL_ROOT_PASSWORD} --silent"]
  interval: 5s
  timeout: 5s
  retries: 12
  start_period: 15s
```

Redis without authentication:

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 5s
  timeout: 3s
  retries: 10
```

HTTP application, only when the image contains the chosen client:

```yaml
healthcheck:
  test: ["CMD", "curl", "--fail", "--silent", "http://127.0.0.1:8000/health"]
  interval: 10s
  timeout: 5s
  retries: 6
  start_period: 15s
```

Do not use `php-fpm-healthcheck`, `curl`, or `wget` unless the Dockerfile or selected image provides it. For PHP-FPM, prefer an actual FastCGI readiness tool or verify through the web service.

Use health-gated dependencies when readiness matters:

```yaml
depends_on:
  db:
    condition: service_healthy
```

Applications should still retry transient dependency failures after startup.

## Application Smoke Checks

After Compose reports readiness, run the most relevant non-destructive check:

```bash
docker compose exec app php artisan about --no-interaction
docker compose run --rm wpcli core version
docker compose exec app ./vendor/bin/drush status
docker compose exec app python manage.py check
docker compose exec app python -c 'import app'
docker compose exec app node --version
```

Prefer a project-defined health endpoint that verifies only safe dependencies. Avoid returning secret, version, or infrastructure details from public health responses.

For published HTTP routes, derive the host address from `docker compose port` or use an explicitly configured `HEALTHCHECK_URL`. Do not probe a list of common localhost ports because an unrelated host process may answer.

## Database Checks

Use the bundled script for a connection and read-only query:

```bash
./scripts/db-test.sh
```

Use `--crud` only when explicitly requested. It uses a temporary table in one database session and should leave no persistent table:

```bash
./scripts/db-test.sh --crud
```

Pass service and credential configuration through documented environment variables when names differ from defaults. Never default to a production or shared database.

## Workers and One-Shot Services

For a worker, inspect the service state and run a framework-native status or safe test job only when the user approves queue mutation. Process-list matching alone is weak evidence.

For schedulers, distinguish configured infrastructure from actual scheduled tasks. An idle scheduler can be healthy without proving any task exists.

One-shot dependency installers should exit code 0:

```bash
docker compose ps -a
docker compose logs app-deps
```

List one-shot service names in `ONE_SHOT_SERVICES` when using `scripts/health-check.sh` and names do not end in `-deps` or `-installer`.

## Failure Reporting

On failure, collect focused evidence:

```bash
docker compose ps -a
docker compose logs --tail=150 <service>
docker inspect <container-id>
```

Report the failing service, observed state or exit code, healthcheck output, and next diagnostic command. Do not print resolved env files, full container environment, or secret-bearing Compose output.
