# Networking and Ports Guide

Use this reference for host exposure, Compose networks, reverse proxies, local domains, host-service access, and conflict handling.

## Contents

- [Exposure defaults](#exposure-defaults)
- [Port checks and registry](#port-checks-and-registry)
- [Compose networking](#compose-networking)
- [Reverse proxies and domains](#reverse-proxies-and-domains)
- [Host and cross-project services](#host-and-cross-project-services)
- [Troubleshooting](#troubleshooting)

## Exposure Defaults

Containers on the same Compose network reach one another by service name and internal port. `expose` is normally unnecessary because image and Compose networking already make internal ports reachable.

Publish only services the host must access:

```yaml
services:
  web:
    ports:
      - "127.0.0.1:${APP_PORT:-8080}:80"
```

Bind to `127.0.0.1` by default. Publishing `HOST_PORT:CONTAINER_PORT` without a host address binds all host interfaces and can expose development databases, caches, mail, and debug endpoints to the local network.

Keep these internal unless explicitly required:

- PHP-FPM
- Redis or other caches
- database ports when no host SQL client is used
- SMTP capture ports
- internal APIs behind a local proxy

When LAN or device testing is requested, identify the exact service and explain the broader exposure before binding `0.0.0.0` or `[::]`.

## Port Checks and Registry

Check live availability with:

```bash
./scripts/port-check.sh verify 8080 5432 8025
./scripts/port-check.sh suggest
```

The first command exits nonzero when any requested port is occupied. `suggest` emits JSON on stdout.

Persistent port tracking is optional. Resolve the registry path as:

```bash
PORT_REGISTRY_FILE="${DOCKER_LOCAL_DEV_PORT_REGISTRY:-${XDG_STATE_HOME:-$HOME/.local/state}/docker-local-dev/HOST_PORT_REGISTRY.md}"
```

Read an existing registry before allocating ports. Treat configured and runtime ports as reserved even when no listener is currently active.

Before creating or refreshing the registry, disclose its path and scan root and ask for confirmation. The scan can record local project names, service names, and paths:

```bash
node ./scripts/scan-host-ports.mjs \
  --root "<approved-root>" \
  --out "$PORT_REGISTRY_FILE" \
  --yes
```

For a standalone project without an existing registry, a live check is sufficient. Do not force a user-wide scan.

## Compose Networking

Use the implicit project network for standalone stacks unless explicit segmentation improves the design:

```yaml
name: inventory-api

services:
  app:
    build: .
  db:
    image: ${DB_IMAGE:?set DB_IMAGE}
```

The app connects to `db:<internal-port>`, never `localhost:<host-port>`.

Use multiple networks to isolate data services from a proxy-facing edge:

```yaml
services:
  proxy:
    networks: [edge]
  app:
    networks: [edge, backend]
  db:
    networks: [backend]

networks:
  edge:
  backend:
    internal: true
```

Use an external network only when an existing reverse proxy or another Compose project must connect:

```yaml
networks:
  proxy:
    external: true
    name: ${PROXY_NETWORK:?set PROXY_NETWORK}
```

Verify the network exists before startup. Do not infer reverse-proxy identity from a container name alone; inspect its image, labels, published ports, and attached networks.

## Reverse Proxies and Domains

When a local proxy already exists:

1. identify the proxy implementation and configuration source
2. attach only the routed service to the proxy network
3. keep database/cache networks private
4. preserve same-origin `/api` routing when the frontend relies on it
5. avoid publishing a duplicate host HTTP port

Prefer explicit `.localhost` hosts such as:

- `app.localhost`
- `api.localhost`
- `admin.localhost`

Ask about wildcard routing only when wildcard behavior is actually under test. Order explicit routes before wildcard routes.

Do not claim public automatic TLS for `.localhost`. When local HTTPS is needed, use a trusted local CA such as mkcert or the proxy's local CA support, document trust installation, and keep certificate files out of version control. Production wildcard HTTPS requires a DNS-01 challenge or a pre-provisioned wildcard certificate and belongs in deployment documentation.

For a same-origin frontend/API arrangement, proxy the API path explicitly:

```nginx
location /api/ {
    proxy_pass http://api:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

Match trailing-slash behavior to the application routes.

## Host and Cross-Project Services

If a container must reach a host service:

- Docker Desktop normally provides `host.docker.internal`
- on Linux Engine, verify support and add `extra_hosts: ["host.docker.internal:host-gateway"]` when needed
- prefer a dedicated Compose service or shared external network when that produces a reproducible team setup

For cross-project communication, prefer a documented shared external network and stable service aliases. Do not use `container_name` as service discovery.

## Troubleshooting

For a host port conflict:

```bash
./scripts/port-check.sh verify "${APP_PORT:-8080}"
docker compose ps
```

Choose a different port or stop the conflicting service only with user authorization. Do not kill a process automatically.

For container-to-container failures:

```bash
docker compose config --services
docker compose exec app getent hosts db
docker compose exec app nc -vz db 5432
docker network inspect "${COMPOSE_PROJECT_NAME}_default"
```

For host-access failures:

```bash
docker compose port web 80
docker compose ps
docker compose logs --tail=100 web
```

Verify that the application listens on `0.0.0.0` inside its container; binding to container-local `127.0.0.1` prevents published-port access.
