# Networking & Ports Guide

Configuration guide for port management and Docker networking.

## Port Selection Strategy

### Common Development Port Ranges

| Service | Default | Range | Notes |
|---------|---------|-------|-------|
| HTTP | 8080 | 8080-8099 | Web server |
| HTTPS | 8443 | 8443-8499 | SSL (if needed) |
| MySQL | 3306 | 3306-3399 | Database |
| PostgreSQL | 5432 | 5432-5499 | Database |
| Redis | 6379 | 6379-6399 | Cache |
| Mail SMTP | 1025 | 1025-1099 | Email testing |
| Mail UI | 8025 | 8025-8099 | Email web interface |
| PHP-FPM | 9000 | 9000-9099 | (Usually not exposed) |

### Checking Port Availability

**Using lsof:**
```bash
lsof -i :8080
```

**Using netcat:**
```bash
nc -z localhost 8080 && echo "in use" || echo "available"
```

**Using ss:**
```bash
ss -tuln | grep :8080
```

### Finding Available Ports

Use the `port-check.sh` script:

```bash
# Check common ports
./scripts/port-check.sh check

# Get suggested available ports (JSON)
./scripts/port-check.sh suggest

# Verify specific ports
./scripts/port-check.sh verify 8080 3306 6379

# Find first available in range
./scripts/port-check.sh find 8080 8099
```

## Port Exposure Options

### Reverse Proxy Detection

Before deciding on port exposure, run the network detection script:

```bash
./scripts/detect-network.sh
```

This script detects:
- Running reverse proxy containers (Nginx Proxy Manager, Traefik, Caddy)
- Available Docker networks
- Suggested network to join

**If reverse proxy detected:**
- Recommend internal-only ports (no host exposure)
- Suggest connecting to the proxy's network
- Only expose database port for SQL tools (optional)

### Internal Only (For Reverse Proxy Users)

When using Nginx Proxy Manager, Traefik, or other reverse proxies:

```yaml
services:
  nginx:
    # No ports exposed - proxy handles routing
    networks:
      - default
      - proxy_network  # Shared with reverse proxy

  db:
    # Optionally expose for SQL tools
    ports:
      - "${DB_PORT:-3306}:3306"

  app:
    # No ports exposed

  redis:
    # No ports exposed

  mailpit:
    # No ports exposed - access via proxy or internal network
```

**Benefits:**
- No port conflicts
- Clean architecture
- Proxy handles SSL, domains, routing

### Minimal Exposure (Recommended for Standalone)

Only expose ports needed for:
1. Web browser access (Nginx)
2. Database tools (DBeaver, DataGrip, TablePlus)

```yaml
services:
  nginx:
    ports:
      - "${APP_PORT:-8080}:80"

  db:
    ports:
      - "${DB_PORT:-3306}:3306"

  # These stay internal
  app:
    # No ports exposed

  redis:
    # No ports exposed

  mailpit:
    ports:
      - "${MAIL_UI_PORT:-8025}:8025"  # Only web UI
```

### Full Exposure

For debugging or when tools need direct access:

```yaml
services:
  nginx:
    ports:
      - "${APP_PORT:-8080}:80"

  db:
    ports:
      - "${DB_PORT:-3306}:3306"

  redis:
    ports:
      - "${REDIS_PORT:-6379}:6379"

  mailpit:
    ports:
      - "${MAIL_PORT:-1025}:1025"     # SMTP
      - "${MAIL_UI_PORT:-8025}:8025"  # Web UI

  app:
    ports:
      - "${PHP_FPM_PORT:-9000}:9000"  # Usually not needed
```

## Docker Networking

### Isolated Project Network (Default)

```yaml
networks:
  default:
    driver: bridge
    name: ${COMPOSE_PROJECT_NAME:-myapp}_network

services:
  app:
    networks:
      - default
```

**Pros:**
- Containers isolated from other projects
- No naming conflicts
- Secure by default

### Shared External Network

For microservices or multiple projects that need to communicate:

**Create the network first:**
```bash
docker network create shared_network
```

**docker-compose.yml:**
```yaml
networks:
  shared:
    external: true
    name: shared_network

services:
  app:
    networks:
      - default
      - shared

  api:
    networks:
      - default
      - shared
```

**Cross-project communication:**
```bash
# From one project, access another by container name
curl http://other-project-app:80
```

### Multiple Networks

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

services:
  nginx:
    networks:
      - frontend

  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend
```

## Nginx Proxy Manager Integration

For managing multiple Docker projects with custom domains.

### When to Use NPM

- Running 3+ Docker projects
- Need custom domains (myapp.local, api.local)
- Want automatic SSL certificates
- Prefer visual configuration

### NPM Setup

**docker-compose.yml for NPM:**
```yaml
# Note: No 'version' field needed - deprecated in Docker Compose v2

services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"    # Admin UI
    volumes:
      - npm_data:/data
      - npm_letsencrypt:/etc/letsencrypt
    networks:
      - proxy

networks:
  proxy:
    external: true
    name: proxy_network

volumes:
  npm_data:
  npm_letsencrypt:
```

**Create proxy network:**
```bash
docker network create proxy_network
```

### Project Configuration with NPM

```yaml
# Your project's docker-compose.yml
networks:
  default:
  proxy:
    external: true
    name: proxy_network

services:
  app:
    networks:
      - default
      - proxy
    # No port exposure needed - NPM handles it
```

### Local Domain Setup

**Add to /etc/hosts:**
```
127.0.0.1 myapp.local
127.0.0.1 api.local
127.0.0.1 admin.local
```

**Or use dnsmasq for wildcard:**
```bash
# macOS with Homebrew
brew install dnsmasq
echo 'address=/.local/127.0.0.1' >> /usr/local/etc/dnsmasq.conf
sudo brew services start dnsmasq
```

## Configuration Storage

### .env File Approach (Recommended)

**.env.docker:**
```env
# Ports
APP_PORT=8080
DB_PORT=3306
REDIS_PORT=6379
MAIL_PORT=1025
MAIL_UI_PORT=8025

# Database
DB_DATABASE=app
DB_USERNAME=app
DB_PASSWORD=secret

# Compose project name (for network naming)
COMPOSE_PROJECT_NAME=myapp
```

**docker-compose.yml:**
```yaml
services:
  nginx:
    ports:
      - "${APP_PORT:-8080}:80"
  db:
    environment:
      MYSQL_DATABASE: ${DB_DATABASE:-app}
      MYSQL_PASSWORD: ${DB_PASSWORD:-secret}
```

**Benefits:**
- Easy to change without editing compose file
- Different configs per environment
- Keep secrets out of version control

### Direct docker-compose.yml

```yaml
services:
  nginx:
    ports:
      - "8080:80"
  db:
    environment:
      MYSQL_DATABASE: app
      MYSQL_PASSWORD: secret
```

**Benefits:**
- Simpler for basic setups
- All config in one place

**Drawbacks:**
- Harder to customize per environment
- Secrets in version control (careful!)

## Port Conflict Resolution

### Detection

```bash
# Check what's using a port
lsof -i :8080

# Kill process using port (careful!)
kill $(lsof -t -i :8080)
```

### Resolution Strategies

1. **Use Different Port**
   ```yaml
   ports:
     - "8081:80"  # Instead of 8080
   ```

2. **Stop Conflicting Service**
   ```bash
   # Stop local MySQL
   brew services stop mysql
   # or
   sudo systemctl stop mysql
   ```

3. **Use Docker Network Only**
   ```yaml
   # Don't expose port, access via Docker network only
   db:
     # No ports directive
   ```

### Common Conflicts

| Port | Common Conflicting Service |
|------|---------------------------|
| 80 | Apache, Nginx, MAMP, XAMPP |
| 3306 | MySQL, MariaDB |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8080 | Various dev servers |

## Troubleshooting

### Container Can't Reach Another

```bash
# Check both are on same network
docker network inspect myapp_network

# Test connectivity from container
docker compose exec app ping db
docker compose exec app nc -z db 3306
```

### Port Not Accessible from Host

```bash
# Check port mapping
docker compose port nginx 80

# Check container is running
docker compose ps

# Check logs
docker compose logs nginx
```

### DNS Resolution Issues

```bash
# Inside container, check /etc/hosts
docker compose exec app cat /etc/hosts

# Check Docker DNS
docker compose exec app nslookup db
```
