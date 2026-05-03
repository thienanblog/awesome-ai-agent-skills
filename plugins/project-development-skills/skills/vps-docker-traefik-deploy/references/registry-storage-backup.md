# Registry, Storage, And Backup

## Registry Strategy

Prefer:

1. managed private registry such as GHCR, ECR, GCR, or GitLab Container Registry
2. self-hosted registry bound to localhost or private network only

Avoid public anonymous registries for private production images.

Use immutable tags:

```text
2026-04-21-001
```

Do not deploy `latest`.

## Self-Hosted Registry Rule

If you run `registry:2`, bind it only to localhost unless there is a strong reason not to:

```text
127.0.0.1:5000:5000
```

Then access it through SSH tunnel:

```bash
ssh -L 5000:127.0.0.1:5000 deploy@your-server
docker login 127.0.0.1:5000
```

## Persistent Data

Keep important state outside container writable layers:

- database data
- Redis persistence if enabled
- uploaded files
- application storage directories
- registry data
- reverse proxy ACME state

Named volumes are acceptable. Bind mounts are often easier for operators when they need direct filesystem visibility, backups, or disk migration.

## Storage Growth Plan

Plan for growth before disks fill up.

Typical path:

1. add a new disk or block volume
2. mount it under a stable path such as `/srv/app-data`
3. move DB, storage, or registry data there
4. update bind mounts or Docker volume targets

For file-heavy systems, move user-generated files to object storage:

- AWS S3
- Cloudflare R2
- MinIO
- Backblaze B2 via S3-compatible API
- any other S3-compatible system

Prefer:

- block storage for databases
- object storage for large uploads, exports, and archives

## Backup Minimum

Always back up:

- database dumps
- file storage
- env files and secrets stored on the host
- ACME or TLS state if the proxy manages certificates

## Restore Rule

A backup is incomplete until restore is tested.

Require:

- DB restore test
- storage restore test
- application boot check after restore

## Image And Host Cleanup

App host cleanup:

```bash
docker image prune -a --filter "until=240h"
docker builder prune --filter "until=240h"
```

Registry cleanup:

- keep currently deployed tags
- keep rollback tags
- delete unused manifests or use registry retention rules
- run garbage collection during maintenance windows if the registry requires it
