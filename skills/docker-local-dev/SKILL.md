---
name: docker-local-dev
description: Create, repair, or extend local Docker Compose and Dockerfile setups for PHP/Laravel and CMS projects, Node.js, Python, and monorepos. Use when Dockerizing a project for development, adding local databases or supporting services, or safely merging existing development Compose configurations. Inspect the repository first, infer safe defaults, ask only about unresolved high-impact choices, preserve existing work, and verify generated files. Do not use as a production deployment workflow.
---

# Docker Local Development

Run this skill in the main conversation. Do not spawn subagents, agent teams, or
delegated parallel workers unless the user explicitly approves the proposed
count and scope after being told that doing so can increase usage. Ask again
before expanding an approved scope.

## Guardrails

- Design for local development. Keep production images, secrets, deployment, certificates, and runtime topology separate.
- Inspect before asking questions or proposing services. Treat detection as evidence, not authority.
- Ask only about unresolved choices that materially change the result. Group related questions and recommend a default; do not force a fixed questionnaire.
- Preserve existing Docker files and unrelated working-tree changes. Show a semantic diff before replacing or materially restructuring a working stack. Never commit, reset, delete volumes, run migrations or seeds, or overwrite files unless the user authorized that action.
- Generate only services the project uses or the user explicitly requests. A database is not mandatory when the project uses SQLite, a host service, or an external database.
- Prefer direct foreground commands and one concern per service. Add Supervisor or PM2 only when the project already requires it or production-parity testing justifies it.
- Prefer a stable top-level Compose `name:` and role-based service names. Do not set `container_name` by default because it prevents service scaling and creates cross-project collisions.
- Select images by project constraints, team or production compatibility, trusted publisher, supported version, and architecture. Treat an already-downloaded image only as a tie-breaker. Avoid floating `latest` tags in generated files.
- Publish only ports needed by the host. Bind local-only ports to `127.0.0.1` by default; keep databases, caches, SMTP, PHP-FPM, and internal APIs unexposed when possible.
- Keep secrets out of committed files, generated documentation, command output, and frontend or proxy containers. Generate an ignored local env file plus a safe example when configuration is needed.

## Workflow

### 1. Inspect the project

Check Docker and Compose capabilities before selecting syntax:

```bash
docker version
docker compose version
```

Inspect, when present:

- `compose.yaml`, `compose.yml`, `docker-compose*.yml`, and override files
- `Dockerfile*`, `.dockerignore`, `.devcontainer/`, Makefiles, and package scripts
- application manifests, lockfiles, runtime-version files, env examples, and monorepo/workspace files
- existing local proxy conventions, Compose project names, networks, volumes, and host port mappings
- Git status and repository instructions before editing tracked files

Run stack detection from this skill directory, passing the project root:

```bash
./scripts/detect-stack.sh "<project-root>"
```

The script emits JSON on stdout and diagnostics on stderr. Confirm uncertain findings from source files without printing secret values.

When Docker is available, optionally inspect local images and networks:

```bash
./scripts/detect-images.sh
./scripts/detect-network.sh
```

Do not let cached images or a detected network override project compatibility or isolation requirements.

### 2. Resolve the design

Infer and summarize:

- apps in scope, dev commands, internal ports, shared packages, and live-reload needs
- runtime and package-manager versions from constraints and lockfiles
- database, cache, queue, scheduler, mail, and debugging services actually used
- existing reverse proxy, explicit `.localhost` hostnames, same-origin `/api` routing, and required host exposure
- bind mounts versus Compose Watch; use Watch only when supported by the installed Compose version
- merge versus focused repair versus replacement of existing Docker files

Ask for confirmation only where evidence is absent or conflicting. Typical high-impact questions are the apps to run, database parity, reverse-proxy integration, externally reachable ports, and whether an existing stack may be restructured.

### 3. Load only relevant references

| Need | Read |
|---|---|
| Detection rules and monorepo discovery | `references/tech-stack-detection.md` |
| Images, processes, dependencies, mounts, environment, Dockerfiles | `references/service-configuration-guide.md` |
| WordPress, Drupal, or Joomla | `references/cms-configuration-guide.md` |
| Ports, proxies, domains, networks, host access | `references/networking-ports-guide.md` |
| Existing Compose or Dockerfile changes | `references/merge-backup-strategy.md` |
| Readiness checks and smoke tests | `references/health-check-patterns.md` |

Use assets as starting points, not immutable output. Remove unselected services and adapt placeholders, healthchecks, commands, paths, users, and versions to the detected project.

### 4. Preview and generate

Before writing, present:

- files to create or modify
- inferred services and versions
- host ports and domains
- source/dependency mount strategy
- important changes to an existing stack

After approval where required, generate the smallest coherent setup:

1. local env example and ignored local env file when needed
2. dev Dockerfile or dev build target
3. `.dockerignore`
4. `compose.yaml` without the obsolete top-level `version`
5. selected proxy, process, and helper configuration
6. concise usage notes only when useful or requested

Prefer:

- bind-mounted source with named dependency volumes for straightforward active development
- Compose Watch with `sync`, `sync+restart`, or `rebuild` rules for large trees, native dependencies, or projects that benefit from granular sync
- one-shot dependency installers only when they solve a real bind-mount or monorepo problem; mark them as expected to exit successfully
- separate worker and scheduler services using the same image as the app
- Compose profiles for optional debugging and administration tools
- health-gated dependencies only when the dependency defines a valid healthcheck

Do not automatically run migrations, seeds, CMS installers, destructive cleanup, or database write tests.

### 5. Verify

Run static checks first:

```bash
docker compose config --quiet
docker build --check .
```

Use `docker build --check` only when the installed Docker version supports it. Then build and start after the user has approved container execution:

```bash
docker compose build
docker compose up -d --wait
docker compose ps -a
```

If `--wait` is unavailable, start detached and poll declared healthchecks with a bounded timeout. Inspect logs for failed or restarting services.

Run the bundled checks when applicable:

```bash
./scripts/health-check.sh
./scripts/db-test.sh          # connection/read-only query
./scripts/db-test.sh --crud   # explicit temporary-table CRUD check
```

Also run a stack-specific smoke check such as `php artisan about`, `wp core version`, `drush status`, `python manage.py check`, or the application's health endpoint. Verify hot reload by changing a harmless source file only when the user authorized runtime testing.

### 6. Report

Report:

- generated or modified files
- selected services, versions, local URLs, and explicit host exposure
- exact verification commands and results
- expected stopped one-shot services
- assumptions, skipped checks, and platform-specific limitations

Never include secret values in the report.

## Host Port Registry

Persistent host-port tracking is optional. First check:

```bash
PORT_REGISTRY_FILE="${DOCKER_LOCAL_DEV_PORT_REGISTRY:-${XDG_STATE_HOME:-$HOME/.local/state}/docker-local-dev/HOST_PORT_REGISTRY.md}"
test -f "$PORT_REGISTRY_FILE" && sed -n '1,220p' "$PORT_REGISTRY_FILE"
```

Before creating or refreshing the registry, explain the exact output path and scan root and obtain confirmation because the report may contain local project names and paths. Then run:

```bash
node ./scripts/scan-host-ports.mjs --root "<approved-root>" --out "$PORT_REGISTRY_FILE" --yes
```

Treat registered ports as reserved even when no process is currently listening. For a single project without a registry, a live port check is sufficient.

## Acceptance Criteria

- Generated Compose configuration parses without unresolved placeholders.
- Selected images and commands match project constraints and contain no unreviewed floating tags.
- App containers reach dependencies by Compose service name, not `localhost`.
- Optional services are absent or profile-gated.
- Host ports are minimal, conflict-free, and loopback-bound unless broader access was requested.
- Healthchecks invoke commands available in their images and test readiness rather than process presence alone.
- Source changes reload as intended; lockfile changes follow the documented install or rebuild path.
- No secrets, production data, private domains, or unauthorized mutations appear in generated files or reports.
