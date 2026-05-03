# Service Configuration Guide

Comprehensive configuration options for all Docker services.

## Image Management Strategy

### Scan Existing Images

Before pulling new images, scan what's already available locally to save disk space:

```bash
./scripts/detect-images.sh
```

This script outputs JSON with:
- Database images (MySQL, MariaDB, PostgreSQL)
- PHP images with versions
- Node.js images with versions
- Redis images
- Mail testing images (Mailpit, MailHog)
- Nginx images

### Image Selection Priority

1. **Use existing images when possible** - saves disk space and download time
2. **Match production versions** - if user needs specific version for compatibility
3. **Prefer Alpine variants** - smaller image size (e.g., `redis:7-alpine` vs `redis:7`)

### Example Decision Flow

```
Detected: mysql:8.0.35 (2.3 GB already downloaded)

Options:
1. mysql:8.0.35 (already downloaded - recommended)
2. mysql:8.4 (will download ~500 MB)
3. mariadb:11 (will download ~400 MB)

→ If production uses MySQL 8.0.x, recommend option 1
→ If production uses MySQL 8.4, recommend option 2
→ Always ask user for production compatibility
```

### Docker Compose Version

**Important:** Do not include `version:` field in docker-compose.yml files.
- Docker Compose v2 deprecated this field
- Modern compose files don't need it

## Nginx Configuration

### PHP-FPM (Laravel/WordPress)

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;  # Laravel
    # root /var/www/html;        # WordPress
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Increase upload size (adjust as needed)
    client_max_body_size 100M;
}
```

### Node.js Reverse Proxy

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Python WSGI/ASGI

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://app:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/static/;
    }

    location /media/ {
        alias /var/www/media/;
    }
}
```

## Database Configuration

### MySQL 8.x

```yaml
db:
  image: mysql:8.0
  environment:
    MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-secret}
    MYSQL_DATABASE: ${DB_DATABASE:-app}
    MYSQL_USER: ${DB_USERNAME:-app}
    MYSQL_PASSWORD: ${DB_PASSWORD:-secret}
  volumes:
    - db_data:/var/lib/mysql
    - ./docker/mysql/init:/docker-entrypoint-initdb.d
  ports:
    - "${DB_PORT:-3306}:3306"
  command: --default-authentication-plugin=mysql_native_password
```

**Development settings (my.cnf):**
```ini
[mysqld]
# Performance
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M

# Development friendly
sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"

# Logging (optional for debugging)
# general_log = 1
# general_log_file = /var/log/mysql/query.log
```

### MariaDB 11.x

```yaml
db:
  image: mariadb:11
  environment:
    MARIADB_ROOT_PASSWORD: ${DB_PASSWORD:-secret}
    MARIADB_DATABASE: ${DB_DATABASE:-app}
    MARIADB_USER: ${DB_USERNAME:-app}
    MARIADB_PASSWORD: ${DB_PASSWORD:-secret}
  volumes:
    - db_data:/var/lib/mysql
  ports:
    - "${DB_PORT:-3306}:3306"
```

### PostgreSQL 16.x

```yaml
db:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: ${DB_DATABASE:-app}
    POSTGRES_USER: ${DB_USERNAME:-app}
    POSTGRES_PASSWORD: ${DB_PASSWORD:-secret}
  volumes:
    - db_data:/var/lib/postgresql/data
  ports:
    - "${DB_PORT:-5432}:5432"
```

## Redis Configuration

### Basic Redis

```yaml
redis:
  image: redis:alpine
  volumes:
    - redis_data:/data
  ports:
    - "${REDIS_PORT:-6379}:6379"
  command: redis-server --appendonly yes
```

### Redis with Password

```yaml
redis:
  image: redis:alpine
  volumes:
    - redis_data:/data
  ports:
    - "${REDIS_PORT:-6379}:6379"
  command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-secret}
```

### Redis Configuration Options

| Option | Value | Description |
|--------|-------|-------------|
| `appendonly` | yes | Enable AOF persistence |
| `maxmemory` | 256mb | Memory limit |
| `maxmemory-policy` | allkeys-lru | Eviction policy |

## Email Testing Services

### Mailpit (Recommended)

```yaml
mailpit:
  image: axllent/mailpit:latest
  ports:
    - "${MAIL_PORT:-1025}:1025"      # SMTP
    - "${MAIL_UI_PORT:-8025}:8025"   # Web UI
  environment:
    MP_SMTP_AUTH_ACCEPT_ANY: 1
    MP_SMTP_AUTH_ALLOW_INSECURE: 1
```

**Framework configuration:**

Laravel (.env):
```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

WordPress (wp-config.php):
```php
define('SMTP_HOST', 'mailpit');
define('SMTP_PORT', 1025);
```

Django (settings.py):
```python
EMAIL_HOST = 'mailpit'
EMAIL_PORT = 1025
EMAIL_USE_TLS = False
```

### MailHog (Alternative)

```yaml
mailhog:
  image: mailhog/mailhog:latest
  ports:
    - "${MAIL_PORT:-1025}:1025"
    - "${MAIL_UI_PORT:-8025}:8025"
```

## Opcache Configuration

### Development Settings

```ini
; docker/php/opcache.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000

; CRITICAL for development - validate on every request
opcache.validate_timestamps=1
opcache.revalidate_freq=0

; Optional: Enable file-based cache
; opcache.file_cache=/tmp/opcache
```

### Production Hints (Comments)

```ini
; For production, consider:
; opcache.validate_timestamps=0  ; Don't check for file changes
; opcache.revalidate_freq=60     ; Or check less frequently
```

## Supervisor Configuration

### Laravel Queue Worker

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/worker.log
stopwaitsecs=3600
```

### Laravel Scheduler

```ini
[program:laravel-scheduler]
command=/bin/sh -c "while [ true ]; do php /var/www/artisan schedule:run --verbose --no-interaction; sleep 60; done"
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/scheduler.log
```

### Celery Worker (Python)

```ini
[program:celery]
command=celery -A myapp worker --loglevel=info
directory=/var/www
user=www-data
numprocs=1
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600
stdout_logfile=/var/log/celery/worker.log
stderr_logfile=/var/log/celery/worker-error.log
```

## Volume Mount Strategies

### Bind Mount (Development)

```yaml
volumes:
  - ./:/var/www
```

**Pros:**
- Instant file sync
- No rebuild needed for code changes
- Easy debugging

**Cons:**
- Slower on macOS (~10-20%)
- File permission issues possible

### Bind Mount with Performance Options (macOS)

```yaml
volumes:
  - ./:/var/www:cached           # Relaxed consistency
  # or
  - ./:/var/www:delegated        # Container-authoritative
```

### Named Volume (Performance)

```yaml
volumes:
  - app_code:/var/www

volumes:
  app_code:
```

**Pros:**
- Best performance
- Native Docker speed

**Cons:**
- Requires rebuild for code changes
- Not suitable for active development

### Hybrid Approach

```yaml
volumes:
  - ./:/var/www                  # Source code (bind mount)
  - vendor_cache:/var/www/vendor # Dependencies (named volume)
  - node_modules_cache:/var/www/node_modules

volumes:
  vendor_cache:
  node_modules_cache:
```

## Environment Variables

### .env File Approach (Recommended)

```env
# .env.docker
APP_PORT=8080
DB_PORT=3306
REDIS_PORT=6379
MAIL_PORT=1025
MAIL_UI_PORT=8025

DB_DATABASE=app
DB_USERNAME=app
DB_PASSWORD=secret
```

**docker-compose.yml:**
```yaml
services:
  nginx:
    ports:
      - "${APP_PORT:-8080}:80"
```

### Direct in docker-compose.yml

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
