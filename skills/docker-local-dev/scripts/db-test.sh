#!/usr/bin/env bash

# Verify a local Compose database. The default query is read-only. Pass --crud
# to exercise writes in a temporary table that disappears with the session.

set -uo pipefail

CRUD=false

usage() {
    cat <<'EOF'
Usage: db-test.sh [--crud]

Environment:
  DB_SERVICE   Compose service name; auto-detected when omitted
  DB_TYPE      mysql or postgresql; auto-detected when possible
  DB_DATABASE  Database name (default: app)
  DB_USERNAME  Database user (defaults by database type)
  DB_PASSWORD  Optional database password
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --crud) CRUD=true ;;
        -h|--help) usage; exit 0 ;;
        *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 2 ;;
    esac
    shift
done

detect_service() {
    local candidate

    if [[ -n "${DB_SERVICE:-}" ]]; then
        printf '%s\n' "$DB_SERVICE"
        return 0
    fi

    while IFS= read -r candidate; do
        case "$candidate" in
            db|database|mysql|mariadb|postgres|postgresql)
                printf '%s\n' "$candidate"
                return 0
                ;;
        esac
    done < <(docker compose config --services 2>/dev/null)
    return 1
}

detect_type() {
    local service=$1

    if [[ -n "${DB_TYPE:-}" ]]; then
        case "$DB_TYPE" in
            mysql|mariadb) printf 'mysql\n'; return 0 ;;
            postgres|postgresql|pgsql) printf 'postgresql\n'; return 0 ;;
            *) return 1 ;;
        esac
    fi
    case "$service" in
        postgres|postgresql) printf 'postgresql\n'; return 0 ;;
        mysql|mariadb) printf 'mysql\n'; return 0 ;;
    esac
    if docker compose exec -T "$service" sh -c 'command -v psql >/dev/null 2>&1' >/dev/null 2>&1; then
        printf 'postgresql\n'
    elif docker compose exec -T "$service" sh -c 'command -v mysql >/dev/null 2>&1' >/dev/null 2>&1; then
        printf 'mysql\n'
    else
        return 1
    fi
}

run_mysql() {
    local service=$1
    local user=$2
    local database=$3
    local password=$4
    local sql=$5
    local args=(compose exec -T)

    [[ -n "$password" ]] && args+=(-e "MYSQL_PWD=$password")
    args+=("$service" mysql --batch --skip-column-names "--user=$user" "--database=$database" --execute "$sql")
    docker "${args[@]}"
}

run_postgresql() {
    local service=$1
    local user=$2
    local database=$3
    local password=$4
    local sql=$5
    local args=(compose exec -T)

    [[ -n "$password" ]] && args+=(-e "PGPASSWORD=$password")
    args+=("$service" psql --no-psqlrc --tuples-only --no-align --set ON_ERROR_STOP=1 --username "$user" --dbname "$database" --command "$sql")
    docker "${args[@]}"
}

service=$(detect_service || true)
if [[ -z "$service" ]]; then
    printf 'No database service detected. Set DB_SERVICE and DB_TYPE when using a custom name.\n' >&2
    exit 2
fi

type=$(detect_type "$service" || true)
if [[ "$type" != mysql && "$type" != postgresql ]]; then
    printf 'Could not determine database type for service %s. Set DB_TYPE=mysql or DB_TYPE=postgresql.\n' "$service" >&2
    exit 2
fi

database=${DB_DATABASE:-app}
password=${DB_PASSWORD:-}
if [[ "$type" == mysql ]]; then
    user=${DB_USERNAME:-root}
    if [[ "$CRUD" == true ]]; then
        sql="CREATE TEMPORARY TABLE docker_local_dev_check (id INT PRIMARY KEY, name VARCHAR(32)); INSERT INTO docker_local_dev_check VALUES (1, 'created'); UPDATE docker_local_dev_check SET name = 'updated' WHERE id = 1; SELECT name FROM docker_local_dev_check WHERE id = 1; DELETE FROM docker_local_dev_check WHERE id = 1; SELECT COUNT(*) FROM docker_local_dev_check;"
    else
        sql='SELECT 1;'
    fi
    output=$(run_mysql "$service" "$user" "$database" "$password" "$sql") || {
        printf 'MySQL/MariaDB check failed for service %s and database %s.\n' "$service" "$database" >&2
        exit 1
    }
else
    user=${DB_USERNAME:-postgres}
    if [[ "$CRUD" == true ]]; then
        sql="BEGIN; CREATE TEMPORARY TABLE docker_local_dev_check (id INTEGER PRIMARY KEY, name VARCHAR(32)) ON COMMIT DROP; INSERT INTO docker_local_dev_check VALUES (1, 'created'); UPDATE docker_local_dev_check SET name = 'updated' WHERE id = 1; SELECT name FROM docker_local_dev_check WHERE id = 1; DELETE FROM docker_local_dev_check WHERE id = 1; SELECT COUNT(*) FROM docker_local_dev_check; COMMIT;"
    else
        sql='SELECT 1;'
    fi
    output=$(run_postgresql "$service" "$user" "$database" "$password" "$sql") || {
        printf 'PostgreSQL check failed for service %s and database %s.\n' "$service" "$database" >&2
        exit 1
    }
fi

if [[ "$CRUD" == true ]]; then
    printf '%s\n' "$output" | grep -q 'updated' || {
        printf 'Temporary CRUD check did not return the updated row.\n' >&2
        exit 1
    }
    printf 'Temporary CRUD check passed for %s (%s).\n' "$service" "$type"
else
    printf '%s\n' "$output" | grep -Eq '(^|[[:space:]])1([[:space:]]|$)' || {
        printf 'Read-only query did not return the expected result.\n' >&2
        exit 1
    }
    printf 'Database connection and read-only query passed for %s (%s).\n' "$service" "$type"
fi
