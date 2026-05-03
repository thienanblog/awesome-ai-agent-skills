# Traefik, DNS, And Private Admin Access

## Network Model

Recommended public surface:

- `80/tcp`
- `443/tcp`

Recommended private-only services:

- Traefik dashboard
- database
- Redis
- private registry
- any admin endpoint

Create one shared external Docker network for proxied app containers:

```bash
docker network create traefik_proxy
```

## Traefik Deployment Pattern

Run Traefik as a dedicated infrastructure stack, separate from the application stack.

Typical host layout:

```text
/srv/traefik/
  compose/
  dynamic/
  letsencrypt/
  logs/
```

Recommended bind policy:

- `80:80`
- `443:443`
- `127.0.0.1:8080:8080` for the dashboard

Use file provider or labels. Prefer file provider when you want to keep app compose files cleaner.

## Dashboard Access

Do not publish the dashboard on a public route by default.

Use an SSH tunnel:

```bash
ssh -L 8080:127.0.0.1:8080 deploy@your-server
```

Then open:

```text
http://127.0.0.1:8080/dashboard/
```

## Domain Layout

Recommended public hostnames:

```text
inventory.example.com
api.example.com
ws.example.com
```

Avoid public DNS for:

```text
registry.example.com
traefik.example.com
```

unless you have a real reason and proper hardening.

## Cloudflare Guidance

For Cloudflare:

- `A` or `AAAA` records point to the server public IP
- Cloudflare proxy mode is acceptable for websites, APIs, and websockets
- use `Full (strict)` TLS
- use DNS challenge if you need wildcard certificates
- scope API tokens to a single zone only

WebSockets work through Cloudflare, so `ws.example.com` can usually remain proxied.

## Other DNS Providers

Use the same record pattern:

- `A` or `AAAA` for each public hostname
- DNS challenge only if the provider supports it cleanly
- otherwise use HTTP challenge and keep ports `80` and `443` reachable

## Routing Pattern

For separate subdomains:

- website -> `http://<web-container>:80`
- API -> `http://<api-container>:80`
- websocket -> `http://<websocket-container>:3001`

Traefik handles websocket upgrades automatically on standard HTTP routers; you do not need to expose websocket ports publicly just because the service is realtime.
