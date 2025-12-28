# Health Check Patterns

Service verification patterns for all supported stacks.

## Overview

Health checks run automatically after `docker compose up` to verify all services are working correctly.

## Database Checks

### MySQL/MariaDB

**Connection check:**
```bash
docker compose exec db mysqladmin ping -h localhost -u root --silent
```

**Expected output:** `mysqld is alive`

**CRUD test:**
```sql
-- Create test table
CREATE TABLE IF NOT EXISTS _health_check_test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert
INSERT INTO _health_check_test (value) VALUES ('test');

-- Update
UPDATE _health_check_test SET value = 'updated' WHERE value = 'test';

-- Select (verify)
SELECT COUNT(*) FROM _health_check_test WHERE value = 'updated';
-- Expected: 1

-- Delete
DELETE FROM _health_check_test WHERE value = 'updated';

-- Cleanup
DROP TABLE IF EXISTS _health_check_test;
```

### PostgreSQL

**Connection check:**
```bash
docker compose exec db pg_isready -U postgres
```

**Expected output:** `localhost:5432 - accepting connections`

**CRUD test:**
```sql
-- Create test table
CREATE TABLE IF NOT EXISTS _health_check_test (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert
INSERT INTO _health_check_test (value) VALUES ('test');

-- Update
UPDATE _health_check_test SET value = 'updated' WHERE value = 'test';

-- Select (verify)
SELECT COUNT(*) FROM _health_check_test WHERE value = 'updated';
-- Expected: 1

-- Delete
DELETE FROM _health_check_test WHERE value = 'updated';

-- Cleanup
DROP TABLE IF EXISTS _health_check_test;
```

## Web Server Checks

### Nginx

**HTTP request:**
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:8080
```

**Expected:** `200`, `301`, or `302`

**Headers check:**
```bash
curl -I http://localhost:8080
```

**Check configuration:**
```bash
docker compose exec nginx nginx -t
```

## Redis Checks

**Ping test:**
```bash
docker compose exec redis redis-cli ping
```

**Expected:** `PONG`

**Set/Get test:**
```bash
docker compose exec redis redis-cli SET health_check test
docker compose exec redis redis-cli GET health_check
docker compose exec redis redis-cli DEL health_check
```

**Memory info:**
```bash
docker compose exec redis redis-cli INFO memory | grep used_memory_human
```

## Email Service Checks

### Mailpit

**Web UI check:**
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:8025
```

**Expected:** `200`

**SMTP connection:**
```bash
nc -z localhost 1025 && echo "SMTP OK" || echo "SMTP FAILED"
```

**API check:**
```bash
curl -s http://localhost:8025/api/v1/messages | head -c 100
```

### MailHog

**Web UI check:**
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:8025
```

**API check:**
```bash
curl -s http://localhost:8025/api/v2/messages | head -c 100
```

## Application Checks

### Laravel

**Artisan check:**
```bash
docker compose exec app php artisan --version
```

**Expected:** `Laravel Framework X.X.X`

**Environment check:**
```bash
docker compose exec app php artisan about
```

**Database connection:**
```bash
docker compose exec app php artisan db:show
```

**Cache check:**
```bash
docker compose exec app php artisan cache:clear
```

**Queue check (if enabled):**
```bash
docker compose exec app php artisan queue:work --once
```

### WordPress

**WP-CLI version:**
```bash
docker compose exec app wp --version
```

**Core version:**
```bash
docker compose exec app wp core version
```

**Database check:**
```bash
docker compose exec app wp db check
```

**Core checksums:**
```bash
docker compose exec app wp core verify-checksums
```

**Plugin list:**
```bash
docker compose exec app wp plugin list
```

### Drupal

**Drush status:**
```bash
docker compose exec app drush status
```

**Database check:**
```bash
docker compose exec app drush sql:query "SELECT 1"
```

**Cache rebuild:**
```bash
docker compose exec app drush cr
```

### Django

**Check command:**
```bash
docker compose exec app python manage.py check
```

**Expected:** `System check identified no issues`

**Database check:**
```bash
docker compose exec app python manage.py dbshell -c "SELECT 1"
```

**Migration status:**
```bash
docker compose exec app python manage.py showmigrations
```

### FastAPI

**Health endpoint:**
```bash
curl -s http://localhost:8000/health
# or
curl -s http://localhost:8000/docs
```

**OpenAPI docs:**
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/docs
```

**Expected:** `200`

### Node.js/Express

**HTTP check:**
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000
# or health endpoint
curl -s http://localhost:3000/health
```

**Node version:**
```bash
docker compose exec app node -v
```

## Queue Worker Checks

### Supervisor Process

**Check running processes:**
```bash
docker compose exec worker supervisorctl status
```

**Expected output:**
```
laravel-worker:laravel-worker_00   RUNNING   pid 123, uptime 0:05:00
laravel-scheduler                   RUNNING   pid 124, uptime 0:05:00
```

### Laravel Horizon

**Horizon status:**
```bash
docker compose exec app php artisan horizon:status
```

### Celery

**Worker status:**
```bash
docker compose exec worker celery -A myapp status
```

**Inspect active:**
```bash
docker compose exec worker celery -A myapp inspect active
```

## Full Stack Integration Test

### Test Sequence

```bash
#!/bin/bash

echo "=== Full Stack Health Check ==="

# 1. Database
echo -n "Database... "
docker compose exec -T db mysqladmin ping -u root --silent && echo "OK" || echo "FAIL"

# 2. Redis
echo -n "Redis... "
docker compose exec -T redis redis-cli ping | grep -q PONG && echo "OK" || echo "FAIL"

# 3. Web Server
echo -n "Web Server... "
curl -s -o /dev/null -w '%{http_code}' http://localhost:8080 | grep -qE '200|301|302' && echo "OK" || echo "FAIL"

# 4. Application
echo -n "Application... "
docker compose exec -T app php artisan --version > /dev/null 2>&1 && echo "OK" || echo "FAIL"

# 5. Database CRUD
echo -n "Database CRUD... "
./scripts/db-test.sh > /dev/null 2>&1 && echo "OK" || echo "FAIL"

# 6. Mail Service
echo -n "Mail Service... "
curl -s -o /dev/null -w '%{http_code}' http://localhost:8025 | grep -q 200 && echo "OK" || echo "FAIL"

echo "=== Complete ==="
```

## Common Failure Scenarios

### Database Connection Refused

**Symptoms:**
- `Connection refused` error
- `Can't connect to MySQL server`

**Checks:**
```bash
# Is container running?
docker compose ps db

# Check logs
docker compose logs db

# Is port exposed?
docker compose port db 3306
```

**Solutions:**
1. Wait longer for database to start
2. Check environment variables
3. Check healthcheck in compose file

### Redis Not Ready

**Symptoms:**
- `Could not connect to Redis`
- `Connection refused`

**Checks:**
```bash
docker compose exec redis redis-cli ping
docker compose logs redis
```

### Web Server 502 Bad Gateway

**Symptoms:**
- Nginx returns 502
- Can't reach PHP-FPM

**Checks:**
```bash
# Is PHP-FPM running?
docker compose exec app php-fpm -t

# Check Nginx config
docker compose exec nginx nginx -t

# Check Nginx logs
docker compose logs nginx
```

### Queue Worker Not Processing

**Symptoms:**
- Jobs stay in queue
- Worker shows as running but not processing

**Checks:**
```bash
# Check supervisor status
docker compose exec worker supervisorctl status

# Check worker logs
docker compose logs worker

# Manually run job
docker compose exec app php artisan queue:work --once
```

## Health Check in docker-compose.yml

### Adding Health Checks

```yaml
services:
  db:
    image: mysql:8.0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s

  redis:
    image: redis:alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  app:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
```

### Waiting for Health

```bash
# Wait for all services to be healthy
docker compose up -d --wait
```
