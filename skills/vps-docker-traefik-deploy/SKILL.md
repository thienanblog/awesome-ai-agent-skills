---
name: vps-docker-traefik-deploy
description: Plan and implement secure production deployments of Docker Compose applications on self-hosted VPS or cloud servers using Docker Engine, Docker Compose, Traefik, private registries, SSH tunnels, least-privilege users, persistent volumes, backups, DNS, and storage growth planning. Use when an AI agent needs to design, review, document, or execute a real deploy for websites, APIs, websockets, workers, databases, and object storage integrations on Ubuntu or Debian style Linux hosts.
author: Official
context: fork
---

# VPS Docker Traefik Deploy

## Overview

Use this skill to turn an application stack into a real production deployment plan with secure host setup, reverse proxying, registry-based releases, private admin access, persistent storage, backups, and rollback.

Prefer Ubuntu LTS or Debian stable. Prefer immutable image tags. Prefer Traefik for public ingress and SSH tunnels for admin-only access.

## Workflow

1. Establish facts before changing anything.
2. Minimize the public network surface.
3. Baseline the host with a non-root operator account.
4. Install Docker from the official stable channel.
5. Deploy Traefik separately from the app stack.
6. Keep state outside container writable layers.
7. Deploy app images by pull, not by rebuilding on the server.
8. Validate health, backup, restore, rollback, and pruning.

## Establish Facts

Confirm these points first:

- operating system and version
- public domains and subdomains
- TLS strategy: HTTP challenge or DNS challenge
- public services: website, API, websocket, admin UI, registry
- private services: database, Redis, dashboards
- registry type: managed or self-hosted
- persistent data locations
- backup destination and retention
- restore expectations
- whether a single VPS is still acceptable

If the project already has deployment docs, read them first and treat them as the application-specific contract.

## Public Exposure Rules

Default public ports:

- `22/tcp` for SSH
- `80/tcp` for HTTP redirect and ACME when needed
- `443/tcp` for HTTPS

Keep these private unless there is a strong reason:

- Traefik dashboard
- MariaDB or PostgreSQL
- Redis
- private registry
- app service ports that can sit behind Traefik
- internal admin tools

If a GUI tool is required, bind the service to `127.0.0.1` only and use an SSH tunnel from the operator workstation.

## Output Requirements

When using this skill, produce a deployment answer that includes:

- target topology
- exact public ports
- folder layout
- user and permission model
- Docker and Traefik install method
- DNS record plan
- Traefik routing plan
- registry flow
- persistent data plan
- storage growth plan
- backup and restore plan
- rollout and rollback commands

## Mandatory Guardrails

- Do not recommend public exposure of database, Redis, registry, or proxy dashboards by default.
- Do not recommend deploying as the host root account.
- Do not recommend mutable `latest` tags for production.
- Do not keep important state only inside container writable layers.
- Do not call a plan complete unless backup and rollback are addressed.

## Reference Files

Read these files only when needed:

- [references/server-baseline.md](references/server-baseline.md)
  Use for Ubuntu 24.04 host prep, non-root users, SSH hardening, swap, firewall, Docker install.

- [references/traefik-dns.md](references/traefik-dns.md)
  Use for Traefik layout, dashboard tunneling, DNS, subdomains, Cloudflare, and routing patterns.

- [references/registry-storage-backup.md](references/registry-storage-backup.md)
  Use for private registries, image retention, bind mounts versus volumes, S3-compatible storage, backup, restore, and cleanup.

- [references/deploy-checklist.md](references/deploy-checklist.md)
  Use for rollout steps, post-deploy verification, rollback, and maintenance cadence.
