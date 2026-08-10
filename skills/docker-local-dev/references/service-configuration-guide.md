# Service Configuration Guide

Use this reference for image selection, process layout, dependencies, mounts, Dockerfiles, and local configuration.

## Contents

- [Image selection](#image-selection)
- [Service layout](#service-layout)
- [Stateful and optional services](#stateful-and-optional-services)
- [Source and dependency strategies](#source-and-dependency-strategies)
- [Dockerfile guidance](#dockerfile-guidance)
- [Environment and secrets](#environment-and-secrets)
- [Platform considerations](#platform-considerations)

## Image Selection

Choose images in this order:

1. project runtime constraints and lockfiles
2. team or production compatibility when parity matters
3. Docker Official Image or Verified Publisher provenance
4. a supported, explicit major/minor tag; use a digest when strict reproducibility is required
5. host architecture and native dependency compatibility
6. already-downloaded images as a final tie-breaker

Use `./scripts/detect-images.sh` only to identify cache opportunities. A cached image can be stale and must not override compatibility or security. Avoid floating `latest` and unqualified tags such as `redis:alpine` in generated files. Document the update policy for mutable major/minor tags and use `docker compose build --pull` when freshness is required.

Do not assume Alpine is always better. Prefer it when the project supports musl and the smaller image is useful; prefer Debian or Ubuntu slim variants when native modules, debugging tools, or glibc compatibility make them more reliable.

Keep local development and production separate:

| Concern | Local development | Production |
|---|---|---|
| Source | bind mount or Compose Watch | copied into immutable image |
| Dependencies | image layer or named volume | installed during image build |
| Commands | watcher or development server | production runtime command |
| Tooling | debugger and local utilities as needed | minimal runtime packages |
| Secrets | ignored local env/secrets | deployment secret mechanism |

## Service Layout

Run one concern per Compose service and keep its primary command in the foreground:

- web/API: framework development command
- worker: queue or background consumer command
- scheduler: scheduler command such as `php artisan schedule:work` or Celery Beat
- proxy: Nginx, Caddy, or Traefik only when the local routing requirement justifies it

Use the same built application image for web, worker, and scheduler services when possible. Add `init: true` when the primary process does not reliably reap or forward signals. Do not add Supervisor or PM2 by default; use them only when the repository already depends on them or the user requests production-parity behavior.

Use a stable top-level project name and ordinary service names:

```yaml
name: inventory-api

services:
  app:
    build: .
    init: true
  worker:
    build: .
    command: ["php", "artisan", "queue:work", "--sleep=3", "--tries=3"]
```

Do not add `container_name` unless a proven external integration requires it. Compose-generated names avoid collisions and permit scaling.

Use long-form `depends_on` only for real readiness or one-shot requirements:

```yaml
depends_on:
  db:
    condition: service_healthy
  app-deps:
    condition: service_completed_successfully
```

Every `service_healthy` dependency must define a healthcheck whose command exists in the selected image. Startup ordering is not a substitute for application retry logic.

## Stateful and Optional Services

Add a database only when the application needs a local database container. Preserve SQLite, remote development databases, and shared host services when those are intentional.

For MySQL/MariaDB and PostgreSQL:

- pin a project-compatible image version
- store data in a named volume
- keep the port internal unless a host SQL tool needs it
- use a non-root application user and separate root/admin credentials
- use image-supported `_FILE` variables or Compose secrets when practical
- define a readiness healthcheck using container-side variables escaped as `$$VAR`

Example:

```yaml
db:
  image: postgres:${POSTGRES_VERSION:?set POSTGRES_VERSION}
  environment:
    POSTGRES_DB: ${DB_DATABASE:?set DB_DATABASE}
    POSTGRES_USER: ${DB_USERNAME:?set DB_USERNAME}
    POSTGRES_PASSWORD_FILE: /run/secrets/db_password
  secrets:
    - db_password
  volumes:
    - db_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
    interval: 5s
    timeout: 5s
    retries: 10
    start_period: 10s
```

Add Redis only when configuration or source usage shows it is needed. Do not publish Redis to the host by default. Configure persistence only when local behavior needs it.

Prefer Mailpit for SMTP capture when email delivery needs browser inspection. Keep SMTP internal and publish only the UI to loopback. Do not include real SMTP credentials.

Use Compose profiles for optional administration or debugging tools:

```yaml
adminer:
  image: ${ADMINER_IMAGE:?set ADMINER_IMAGE}
  profiles: ["tools"]
```

Do not profile a dependency required by an always-enabled application service unless both sides share compatible profiles.

## Source and Dependency Strategies

### Bind mount

Use a narrow bind mount for straightforward hot reload:

```yaml
volumes:
  - ./apps/api:/app
  - api_vendor:/app/vendor
```

Do not publish fixed performance percentages. File-system behavior varies across native Linux, Docker Desktop, WSL2, repository size, and dependency tree shape.

### Compose Watch

When Docker Compose 2.22 or later is available, use Watch for granular sync, cross-platform native dependencies, or large repositories:

```yaml
develop:
  watch:
    - action: sync
      path: ./src
      target: /app/src
    - action: rebuild
      path: ./package-lock.json
```

Exclude `node_modules`, `vendor`, virtual environments, build output, and other generated trees from sync. Use `sync+restart` for configuration changes that do not require a rebuild.

### Dependencies in the image

Install dependencies in the development image when rebuilding on lockfile changes is acceptable. Copy manifests and lockfiles before source code to preserve build cache. Use the repository's package manager and frozen/locked install command.

### One-shot installer

Use a one-shot installer only when it solves bind-mount or workspace dependency ownership:

```yaml
app-deps:
  image: composer:2
  working_dir: /app
  command: ["composer", "install", "--no-interaction", "--prefer-dist"]
  volumes:
    - ./apps/api:/app
    - api_vendor:/app/vendor

app:
  depends_on:
    app-deps:
      condition: service_completed_successfully
  volumes:
    - ./apps/api:/app
    - api_vendor:/app/vendor
```

Document that the installer is expected to exit with code 0. Ensure lockfile changes have a clear reinstall command. Do not carry installer services into production Compose.

For monorepos, use the repository root as build context only when root lockfiles or shared packages require it. Keep Dockerfile paths, working directories, sync rules, and dependency volumes app-specific.

## Dockerfile Guidance

- Start with `# syntax=docker/dockerfile:1` when BuildKit features are used.
- Pin base image versions and use trusted sources.
- Install only packages required by the selected stack; use `--no-install-recommends` on Debian-family images.
- Copy lockfiles before application source and use locked installs.
- Use BuildKit cache mounts for package-manager caches when they materially improve rebuilds.
- Run the app as a non-root user when practical; parameterize UID/GID when Linux bind-mount ownership requires it.
- Use JSON-array `CMD` or `ENTRYPOINT`. Do not place a multi-token command into one JSON string.
- Ensure every healthcheck binary is installed in the final development image.
- Put production-only compilation and runtime reduction in separate stages or Dockerfiles.

Generate a `.dockerignore` covering at least:

```dockerignore
.git
.env
.env.*
!.env.example
!**/.env.example
node_modules
**/node_modules
vendor
**/vendor
.venv
**/.venv
.next
**/.next
dist
**/dist
```

## Environment and Secrets

Distinguish Compose interpolation from container environment. Prefer an explicit command such as:

```bash
docker compose --env-file .env.docker up -d
```

Generate:

- `.env.docker.example` with safe placeholders and documented required keys
- an ignored `.env.docker` only when the user wants it created
- service-scoped `environment`, `env_file`, or `secrets` declarations

Do not copy application `.env` files into images. Do not pass database, mail, cloud, or application secrets to frontend, proxy, or tooling containers that do not need them. Never print resolved secrets with `docker compose config` output in the final report.

## Platform Considerations

- Native Linux: match UID/GID when containers must write to bind mounts.
- SELinux hosts: apply `:z` or `:Z` only after determining whether the mount is shared or private.
- macOS and Windows: prefer narrow mounts or Compose Watch for large generated trees; do not assume legacy consistency flags improve current Docker Desktop behavior.
- WSL2: keep active source inside the Linux filesystem when practical.
- Mixed architectures: verify image platform support and native module compatibility before adding `platform:` overrides.
