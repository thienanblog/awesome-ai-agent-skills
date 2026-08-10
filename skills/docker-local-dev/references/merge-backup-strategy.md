# Merge and Backup Strategy

Use this reference when Docker or Compose files already exist.

## Contents

- [Inspect](#inspect)
- [Choose the change mode](#choose-the-change-mode)
- [Merge rules](#merge-rules)
- [Preview and verify](#preview-and-verify)
- [Recovery](#recovery)

## Inspect

Before editing:

```bash
git status --short
rg --files -g 'compose*.yml' -g 'compose*.yaml' \
  -g 'docker-compose*.yml' -g 'docker-compose*.yaml' \
  -g 'Dockerfile*' -g '.dockerignore' -g '.env*.example'
```

Inspect all Compose files together, including overrides and profiles. Resolve the effective model with the same `-f` and `--env-file` arguments used by the project. Preserve unrelated user changes and never assume a clean file is current merely because it is tracked.

## Choose the Change Mode

- **Focused repair:** fix a specific broken setting while preserving layout and conventions.
- **Merge:** add or adapt services and related app configuration while retaining valid custom behavior.
- **Replace:** generate a new coherent stack only when the user explicitly accepts the larger change.

Prefer focused repair or merge. Ask before replacement or any change that invalidates existing volumes, networks, service names, local domains, or team commands.

## Merge Rules

Merge semantically, not by appending text:

- preserve valid project names, service names, commands, build contexts, env scoping, labels, networks, and volumes
- update an existing service when the requested feature requires related environment, dependency, network, or healthcheck changes
- do not claim to add a service while refusing the necessary app-side integration
- remove obsolete top-level `version` only when touching the Compose model and the resulting diff remains focused
- avoid `container_name` unless an existing external contract requires it
- do not broaden host bindings or secret distribution
- keep optional tools absent or profile-gated

Do not automatically commit, stash, reset, checkout, clean, delete backups, or run destructive Docker commands. Git history changes require user authorization.

## Preview and Verify

Before applying a material change, summarize:

- files and services affected
- renamed or removed resources
- new ports, networks, volumes, env keys, and secrets
- migration or re-creation implications

Show a focused diff after editing. Validate the complete effective model:

```bash
docker compose config --quiet
docker build --check .
```

Then run the project's relevant build and smoke checks. A valid YAML file is not proof that commands, mounts, healthchecks, or service integration work.

## Recovery

When files are tracked and the working tree is understood, Git diff provides the primary recovery record. Do not create timestamped copies for every ordinary edit because they clutter repositories and may contain secrets.

Before replacing an untracked or sensitive local file, offer an explicit backup path outside generated build contexts. Never delete older backups automatically. Report exactly what was backed up and how to restore it.
