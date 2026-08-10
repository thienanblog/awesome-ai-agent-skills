# CMS Configuration Guide

Apply this reference only to WordPress, Drupal, or Joomla projects. Preserve the repository's installation layout and project-local tooling.

## Contents

- [Shared rules](#shared-rules)
- [WordPress](#wordpress)
- [Drupal](#drupal)
- [Joomla](#joomla)
- [Verification](#verification)

## Shared Rules

- Detect whether the project is a full CMS tree, Composer-managed application, Bedrock-style layout, or custom document root before choosing paths.
- Match the CMS-supported PHP and database versions from project constraints.
- Keep uploads, generated files, and database data in deliberate bind mounts or named volumes; do not hide tracked source with an unintended volume.
- Run PHP-FPM and the web server as separate services only when the project needs that topology.
- Add Redis, Mailpit, database administration, and debug tooling only when requested or evidenced.
- Do not download plugins, modules, CLI launchers, or CMS core at container startup without explicit approval.
- Do not import production databases or uploads automatically. Sanitize data before local use.
- Keep debug output local and prevent secrets or personal data from appearing in generated documentation.

## WordPress

Determine whether WordPress core is tracked, downloaded by Composer, or supplied by an image. Preserve `WP_HOME`, `WP_SITEURL`, document-root, salts, and content-directory conventions.

For database connectivity, use the Compose service name:

```yaml
environment:
  WORDPRESS_DB_HOST: db:3306
  WORDPRESS_DB_NAME: ${DB_DATABASE:?set DB_DATABASE}
  WORDPRESS_DB_USER: ${DB_USERNAME:?set DB_USERNAME}
  WORDPRESS_DB_PASSWORD_FILE: /run/secrets/db_password
```

Prefer a one-off WP-CLI service based on a pinned compatible image or the project's own image. Do not install WP-CLI dynamically into a running app container.

Enable development flags only in ignored local configuration:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
```

Enable `SAVEQUERIES` only during focused query debugging because it increases memory usage. Install Query Monitor or similar plugins only when the user requests them.

Ensure Nginx or Apache routes front-controller requests to `index.php`, blocks hidden/config files, sets upload limits consistently with PHP, and serves the actual detected document root.

## Drupal

Use Composer-installed Drush from `vendor/bin/drush`. Avoid the retired global Drush Launcher pattern.

Keep local overrides in an ignored `settings.local.php` and include it conditionally from the project's tracked settings. Development services may enable:

- Twig debug and auto-reload
- verbose errors
- development cache settings

Do not globally disable every cache unless the user needs it; Drupal development remains usable with targeted cache and Twig settings.

Ensure writable paths such as `sites/default/files` are writable by the runtime user without recursively changing ownership of the whole repository.

## Joomla

Preserve the detected CLI entrypoint and version-specific directory layout. Keep database host, debug mode, logging, and temporary paths in local configuration rather than rewriting tracked production settings.

Ensure writable cache, log, tmp, and media paths are scoped narrowly. Do not make the entire document root world-writable.

Use the project image for Joomla CLI commands when possible:

```bash
docker compose run --rm cli <command>
```

## Verification

Run only non-destructive checks by default:

```bash
# WordPress
docker compose run --rm wpcli core version

# Drupal
docker compose exec app ./vendor/bin/drush status

# Joomla (adapt to detected CLI)
docker compose run --rm cli --version
```

Then verify the HTTP route, static assets, upload path permissions, database connectivity, and local debug logging. Require explicit approval before installation, updates, database imports, cache-wide destructive operations, or content mutations.
