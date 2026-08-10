# Boost Tools Reference

Use this reference when Laravel Boost MCP tools are available. Discover the
installed server's tool inventory first because capabilities and names can vary
between Boost releases.

## Establish Application Context

- Read application information to confirm PHP, Laravel, installed package,
  database, and model context.
- Inspect database connections and schema before proposing migrations or
  engine-specific queries.
- Follow repository instructions and Boost-generated local guidelines over
  generic examples.

## Search Documentation

- Use `search-docs` before making version-sensitive Laravel ecosystem decisions.
- Start with several short, topic-based queries. Boost already knows installed
  package versions, so omit package names unless needed to disambiguate.
- Fall back to official versioned Laravel or package documentation when Boost is
  unavailable or does not cover the installed version.

## Inspect and Diagnose

Use the tools advertised by the current server to inspect routes, Artisan
commands, database schema, recent logs, browser errors, and absolute URLs. Some
Boost releases also expose Tinker or route and Artisan helpers. Do not invent a
tool name that the server does not provide; use non-destructive Artisan commands
through the repository's command runner as a fallback.

## Protect Data and Environments

- Keep database inspection read-only. Reject DDL, DML, stored procedure calls,
  locks, and write-capable CTEs.
- Scope Tinker and executable-code tools to local or test environments unless a
  specific non-local operation is explicitly authorized.
- Select only required columns and rows; do not expose secrets, personal data,
  or full production records.
- Ask before destructive Artisan commands, migrations, cache flushes, queue
  operations, or mutations of shared data.
