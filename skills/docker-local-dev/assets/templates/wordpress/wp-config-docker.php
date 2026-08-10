<?php
/**
 * WordPress Docker Configuration
 * Optimized for local development
 */

function docker_env_required(string $name): string
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        throw new RuntimeException("Missing required environment variable: {$name}");
    }
    return $value;
}

function docker_env_bool(string $name, bool $default = false): bool
{
    $value = getenv($name);
    return $value === false ? $default : filter_var($value, FILTER_VALIDATE_BOOL);
}

// Database settings from ignored local environment or Compose secrets.
define('DB_NAME', docker_env_required('WORDPRESS_DB_NAME'));
define('DB_USER', docker_env_required('WORDPRESS_DB_USER'));
define('DB_PASSWORD', docker_env_required('WORDPRESS_DB_PASSWORD'));
define('DB_HOST', getenv('WORDPRESS_DB_HOST') ?: 'db:3306');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Derive distinct local keys from one ignored, project-specific secret.
$wordpressSecret = docker_env_required('WORDPRESS_SECRET');
define('AUTH_KEY',         hash_hmac('sha256', 'AUTH_KEY', $wordpressSecret));
define('SECURE_AUTH_KEY',  hash_hmac('sha256', 'SECURE_AUTH_KEY', $wordpressSecret));
define('LOGGED_IN_KEY',    hash_hmac('sha256', 'LOGGED_IN_KEY', $wordpressSecret));
define('NONCE_KEY',        hash_hmac('sha256', 'NONCE_KEY', $wordpressSecret));
define('AUTH_SALT',        hash_hmac('sha256', 'AUTH_SALT', $wordpressSecret));
define('SECURE_AUTH_SALT', hash_hmac('sha256', 'SECURE_AUTH_SALT', $wordpressSecret));
define('LOGGED_IN_SALT',   hash_hmac('sha256', 'LOGGED_IN_SALT', $wordpressSecret));
define('NONCE_SALT',       hash_hmac('sha256', 'NONCE_SALT', $wordpressSecret));

$table_prefix = 'wp_';

// ============================================
// Development Settings
// ============================================
define('WP_DEBUG', docker_env_bool('WP_DEBUG', true));
define('WP_DEBUG_LOG', docker_env_bool('WP_DEBUG_LOG', true));
define('WP_DEBUG_DISPLAY', docker_env_bool('WP_DEBUG_DISPLAY', false));
define('SCRIPT_DEBUG', docker_env_bool('SCRIPT_DEBUG', true));
define('SAVEQUERIES', docker_env_bool('SAVEQUERIES', false));

// Memory
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Disable auto-updates in Docker
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_AUTO_UPDATE_CORE', false);

// Redis Object Cache (if using Redis)
// define('WP_REDIS_HOST', 'redis');
// define('WP_REDIS_PORT', 6379);

// For production, change these:
// define('WP_DEBUG', false);
// define('WP_DEBUG_LOG', false);

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
