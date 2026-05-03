# CMS Configuration Guide

Detailed setup instructions for WordPress, Drupal, and Joomla.

## WordPress Setup

### Docker Compose Service

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
  volumes:
    - ./:/var/www/html
  depends_on:
    - db
    - redis
  environment:
    WORDPRESS_DB_HOST: db
    WORDPRESS_DB_NAME: ${DB_DATABASE:-wordpress}
    WORDPRESS_DB_USER: ${DB_USERNAME:-wordpress}
    WORDPRESS_DB_PASSWORD: ${DB_PASSWORD:-wordpress}
```

### Dockerfile

```dockerfile
FROM php:8.2-fpm

# Install WordPress required extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev libicu-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd mysqli pdo_mysql zip intl xml exif

# Install ImageMagick (optional but recommended)
RUN apt-get install -y libmagickwand-dev \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Opcache for development
RUN docker-php-ext-install opcache
COPY docker/php/opcache-dev.ini /usr/local/etc/php/conf.d/opcache.ini

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

WORKDIR /var/www/html
```

### wp-config.php for Docker

```php
<?php
// Database settings
define('DB_NAME', getenv('WORDPRESS_DB_NAME') ?: 'wordpress');
define('DB_USER', getenv('WORDPRESS_DB_USER') ?: 'wordpress');
define('DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD') ?: 'wordpress');
define('DB_HOST', getenv('WORDPRESS_DB_HOST') ?: 'db');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Authentication Keys and Salts
// Generate at: https://api.wordpress.org/secret-key/1.1/salt/
define('AUTH_KEY',         'put-your-unique-phrase-here');
define('SECURE_AUTH_KEY',  'put-your-unique-phrase-here');
define('LOGGED_IN_KEY',    'put-your-unique-phrase-here');
define('NONCE_KEY',        'put-your-unique-phrase-here');
define('AUTH_SALT',        'put-your-unique-phrase-here');
define('SECURE_AUTH_SALT', 'put-your-unique-phrase-here');
define('LOGGED_IN_SALT',   'put-your-unique-phrase-here');
define('NONCE_SALT',       'put-your-unique-phrase-here');

$table_prefix = 'wp_';

// ============================================
// Development Settings
// ============================================
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', true);
define('SCRIPT_DEBUG', true);
define('SAVEQUERIES', true);

// Memory
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Disable auto-updates in Docker
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_AUTO_UPDATE_CORE', false);

// File editing in admin (optional, disable for security)
// define('DISALLOW_FILE_EDIT', true);

// ============================================
// Redis Object Cache (if using Redis)
// ============================================
define('WP_REDIS_HOST', 'redis');
define('WP_REDIS_PORT', 6379);
// define('WP_REDIS_PASSWORD', 'secret');
define('WP_REDIS_DATABASE', 0);

// For production, add:
// define('WP_DEBUG', false);
// define('WP_DEBUG_LOG', false);
// define('WP_DEBUG_DISPLAY', false);

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
```

### Debug Plugins

Install these plugins for development:

1. **Query Monitor** - Database queries, hooks, conditionals
   ```bash
   wp plugin install query-monitor --activate
   ```

2. **Debug Bar** - Debug information in admin bar
   ```bash
   wp plugin install debug-bar --activate
   ```

3. **Log Deprecated Notices** - Track deprecated functions
   ```bash
   wp plugin install log-deprecated-notices --activate
   ```

### Nginx Configuration for WordPress

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.php;

    client_max_body_size 100M;

    # WordPress permalinks
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP handling
    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    # Deny access to sensitive files
    location ~ /\.ht {
        deny all;
    }

    location = /wp-config.php {
        deny all;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

## Drupal Setup

### Docker Compose Service

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
  volumes:
    - ./:/var/www/html
  depends_on:
    - db
  environment:
    DRUPAL_DB_HOST: db
    DRUPAL_DB_NAME: ${DB_DATABASE:-drupal}
    DRUPAL_DB_USER: ${DB_USERNAME:-drupal}
    DRUPAL_DB_PASSWORD: ${DB_PASSWORD:-drupal}
```

### Dockerfile

```dockerfile
FROM php:8.2-fpm

# Install Drupal required extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev libicu-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd pdo_mysql zip intl xml opcache

# Install Drush globally
RUN curl -OL https://github.com/drush-ops/drush-launcher/releases/latest/download/drush.phar \
    && chmod +x drush.phar \
    && mv drush.phar /usr/local/bin/drush

WORKDIR /var/www/html
```

### settings.local.php for Docker

Create `sites/default/settings.local.php`:

```php
<?php

// Database configuration
$databases['default']['default'] = [
    'database' => getenv('DRUPAL_DB_NAME') ?: 'drupal',
    'username' => getenv('DRUPAL_DB_USER') ?: 'drupal',
    'password' => getenv('DRUPAL_DB_PASSWORD') ?: 'drupal',
    'host' => getenv('DRUPAL_DB_HOST') ?: 'db',
    'port' => '3306',
    'driver' => 'mysql',
    'prefix' => '',
    'collation' => 'utf8mb4_general_ci',
];

// Development settings
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';
$config['system.logging']['error_level'] = 'verbose';
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

// Disable caching for development
$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['page'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';

// Trusted host patterns (adjust for your domain)
$settings['trusted_host_patterns'] = [
    '^localhost$',
    '^127\.0\.0\.1$',
    '^.+\.local$',
];
```

### development.services.yml

Create `sites/development.services.yml`:

```yaml
parameters:
  http.response.debug_cacheability_headers: true
  twig.config:
    debug: true
    auto_reload: true
    cache: false

services:
  cache.backend.null:
    class: Drupal\Core\Cache\NullBackendFactory
```

### Drush Commands

```bash
# Clear cache
drush cr

# Run database updates
drush updb

# Install a module
drush en module_name

# Generate one-time login link
drush uli
```

## Joomla Setup

### Docker Compose Service

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
  volumes:
    - ./:/var/www/html
  depends_on:
    - db
  environment:
    JOOMLA_DB_HOST: db
    JOOMLA_DB_NAME: ${DB_DATABASE:-joomla}
    JOOMLA_DB_USER: ${DB_USERNAME:-joomla}
    JOOMLA_DB_PASSWORD: ${DB_PASSWORD:-joomla}
```

### Dockerfile

```dockerfile
FROM php:8.2-fpm

# Install Joomla required extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev libicu-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd mysqli pdo_mysql zip intl xml opcache

WORKDIR /var/www/html
```

### configuration.php for Docker

```php
<?php
class JConfig {
    // Database
    public $dbtype = 'mysqli';
    public $host = 'db';
    public $user = 'joomla';
    public $password = 'joomla';
    public $db = 'joomla';
    public $dbprefix = 'jos_';
    public $dbencryption = 0;
    public $dbsslverifyservercert = false;
    public $dbsslkey = '';
    public $dbsslcert = '';
    public $dbsslca = '';
    public $dbsslcipher = '';

    // Site
    public $sitename = 'Joomla Development';
    public $secret = 'change-this-secret-key';

    // Debug
    public $debug = true;
    public $debug_lang = true;

    // Error reporting
    public $error_reporting = 'maximum';

    // Logging
    public $log_path = '/var/www/html/administrator/logs';
    public $tmp_path = '/var/www/html/tmp';

    // Cache
    public $caching = 0;
    public $cache_handler = 'file';
    public $cachetime = 15;
    public $cache_platformprefix = false;

    // Session
    public $session_handler = 'database';
    public $lifetime = 15;

    // Mail (use Mailpit)
    public $mailer = 'smtp';
    public $mailfrom = 'admin@localhost';
    public $fromname = 'Joomla';
    public $sendmail = '/usr/sbin/sendmail';
    public $smtpauth = false;
    public $smtpuser = '';
    public $smtppass = '';
    public $smtphost = 'mailpit';
    public $smtpsecure = 'none';
    public $smtpport = 1025;
}
```

### Nginx Configuration for Joomla

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.php index.html;

    client_max_body_size 100M;

    # Joomla SEF URLs
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP handling
    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to sensitive files
    location ~ /\.ht {
        deny all;
    }

    location = /configuration.php {
        deny all;
    }

    location ~ ^/administrator/logs/ {
        deny all;
    }
}
```

## Common CMS Tips

### File Permissions

```bash
# Inside container, set proper permissions
chown -R www-data:www-data /var/www/html
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Writable directories
chmod -R 775 /var/www/html/wp-content/uploads      # WordPress
chmod -R 775 /var/www/html/sites/default/files     # Drupal
chmod -R 775 /var/www/html/images                  # Joomla
chmod -R 775 /var/www/html/tmp                     # Joomla
```

### Database Import

```bash
# MySQL/MariaDB
docker compose exec db mysql -u root -p database_name < dump.sql

# Or using the app container
docker compose exec app mysql -h db -u root -p database_name < dump.sql
```

### WP-CLI in Docker

```bash
# Run WP-CLI commands
docker compose exec app wp plugin list
docker compose exec app wp core update
docker compose exec app wp cache flush

# Import database
docker compose exec app wp db import dump.sql
```
