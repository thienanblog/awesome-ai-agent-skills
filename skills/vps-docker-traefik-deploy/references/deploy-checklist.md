# Deployment Checklist

## Before First Deploy

- confirm OS and package baseline
- create non-root operator account
- harden SSH
- enable firewall
- create swap
- install Docker and Compose from the official stable channel
- create the proxy network
- deploy Traefik
- prepare DNS records
- prepare runtime env files
- prepare backup destination
- decide storage locations

## Release Flow

1. Build immutable images.
2. Push them to the registry.
3. Export exact image tags on the server.
4. Run `docker compose pull`.
5. Run `docker compose up -d`.
6. Verify health endpoints and logs.

## Public Exposure Check

Public:

- SSH
- HTTP
- HTTPS

Private:

- dashboard
- DB
- Redis
- registry
- internal app service ports

## Post-Deploy Verification

- `docker compose ps`
- `docker compose logs --tail=100`
- website responds through Traefik
- API health responds through Traefik
- websocket handshake or health endpoint works
- background workers are healthy
- backup job still runs

## Rollback

Rollback by image tag, not by rebuilding on the host.

1. export previous image tags
2. `docker compose pull`
3. `docker compose up -d`
4. re-run health checks

## Maintenance Cadence

Daily:

- backup checks
- disk usage checks

Weekly:

- log review
- image or builder cleanup review

Monthly:

- restore test
- OS patch review
- Docker and Traefik patch review
- certificate and DNS audit
