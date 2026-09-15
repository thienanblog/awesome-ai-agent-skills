---
name: vps-docker-traefik-deploy
description: Prepare or operate production Docker Compose deployments on a VPS with Traefik, DNS, registries, persistent storage, backups, and rollback. Use for production infrastructure and releases, rather than local development.
---

# VPS Docker Traefik Deploy

Deliver the requested deployment work using the project's operating contract. Distinguish planning and file preparation from changing a live environment.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Establish the target

Read existing runbooks, Compose and Traefik configuration, release scripts, and available host evidence. Establish the target host, OS, domains, ingress, registry, persistent data, backup/restore expectations, and deployment authorization. Discover facts before asking; a routine release does not need a fresh infrastructure questionnaire.

For an existing deployment, preserve supported topology and required release gates. For a new one, prefer a supported Ubuntu LTS or Debian stable host, an operator account with appropriate privileges, registry-built immutable images, and Traefik ingress. Verify current official installation guidance when provisioning; reference commands are examples, not a reason to reinstall a working host.

## Keep production boundaries explicit

- Use authorization already granted for the named environment and action. Prepare configuration, diffs, checks, and rollback before asking for any missing live-operation approval. Ask about a new destructive migration or exposure outside that scope.
- Keep databases, caches, registry/admin dashboards, and internal app ports private by default. Expose only needed ingress and operator access, commonly SSH, HTTP/ACME, and HTTPS. Use loopback bindings and SSH tunnels for private operator tools when suitable.
- Keep credentials out of images, source, logs, and reports. Preserve persistent state outside container writable layers.
- Use immutable image tags or digests and retain the prior release. Avoid server-side rebuilds and mutable `latest` references for releases unless the established operating contract provides equivalent reproducibility.
- Address backup and rollback for affected persistent state. A container rollback cannot undo an incompatible database migration; establish the recovery path before applying it.

## Prepare, deploy, verify

Choose only the references needed for the work:

| Work | Reference |
|---|---|
| New host, operator access, SSH/firewall, Docker | [server-baseline.md](references/server-baseline.md) |
| Traefik, TLS, DNS, dashboard access | [traefik-dns.md](references/traefik-dns.md) |
| Registries, persistence, capacity, backup and restore | [registry-storage-backup.md](references/registry-storage-backup.md) |
| Rollout, health, rollback, maintenance | [deploy-checklist.md](references/deploy-checklist.md) |

Validate the effective configuration without exposing secrets, confirm image availability and recovery readiness, then execute the authorized rollout. Verify container health, public routes/TLS, logs, and affected application flows. Test restore in an isolated target when required; never restore over live data as a casual verification step.

Reuse valid evidence for unchanged responsibilities, while completing the project's production release gate. Pruning, retention changes, DNS changes, and host hardening belong in a release only when needed and authorized.

## Handoff

Report what was prepared or deployed, the target and immutable release identifier, checks and results, and rollback readiness. For new infrastructure, include topology, public exposure, state ownership, and recovery commands. Do not reproduce the full infrastructure plan for every routine release or claim a restore was tested when only its configuration was inspected.
