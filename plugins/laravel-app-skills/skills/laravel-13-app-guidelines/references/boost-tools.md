# Laravel Boost 2 Tools

Use this reference when `laravel/boost` is installed and its MCP server is
available. Tool inventories can change between Boost releases, so discover the
current server capabilities before selecting a tool.

Official source: <https://laravel.com/docs/13.x/boost>

## Start with Application Context

- Read application information to confirm PHP, Laravel, installed ecosystem
  packages, database engine, and available models.
- Read repository instructions and local Boost-generated guidelines. Local rules
  override generic examples.
- Use database connection and schema inspection before proposing migrations or
  engine-specific queries.

## Search Documentation

- Use `search-docs` before changing Laravel or ecosystem behavior.
- Send several short, topic-based queries instead of one package-heavy question;
  Boost already filters by installed package versions.
- Search for the concept, feature, and failure mode. Example topics include
  `form request authorization`, `after commit queued listener`, and
  `json api sparse fieldsets`.
- Use official versioned Laravel or package documentation when Boost is absent,
  unhealthy, or missing the installed version. State that fallback.

## Inspect and Diagnose

Depending on the installed Boost release, use available tools to:

- inspect browser logs, the last application error, and recent log entries;
- inspect database connections and schema;
- run a read-only database query for facts that do not require model behavior;
- generate an absolute project URL;
- inspect Artisan commands or routes when those tools are exposed;
- use Tinker for local model or container behavior when that tool is exposed.

Do not invent a tool name that the current server does not advertise. If a tool
is absent, use a non-destructive repository command such as `php artisan list`,
`php artisan help <command>`, or `php artisan route:list` through the detected
command runner.

## Protect Data and Environments

- Treat database-query tools as read-only even when their transport can execute
  SQL. Reject DDL, DML, locking statements, stored procedure calls, and
  write-capable CTEs during inspection.
- Scope Tinker and executable-code tools to local or test environments unless
  the user explicitly authorizes a specific non-local operation.
- Never expose secrets, tokens, personal data, or full production rows in tool
  output. Select only the columns and rows needed for diagnosis.
- Ask before destructive Artisan commands, migrations, queue operations, cache
  flushes, or any mutation of shared data.

## Keep Boost Current

- Use the repository's Composer process to update Boost dependencies.
- `php artisan boost:update` refreshes already published resources.
- `php artisan boost:update --discover` also scans for newly installed packages
  and offers their guidelines and skills.
- Review generated instruction changes before accepting them into a repository.
