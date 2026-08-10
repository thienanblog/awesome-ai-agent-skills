#!/usr/bin/env bash

# Check live host port availability without modifying any process.

set -u

HTTP_START=8080
HTTP_END=8099
DB_MYSQL_START=3306
DB_MYSQL_END=3399
DB_POSTGRES_START=5432
DB_POSTGRES_END=5499
REDIS_START=6379
REDIS_END=6399
MAIL_START=8025
MAIL_END=8099
RESERVED_PORTS=""

is_port_in_use() {
    local port=$1

    if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
        return 0
    fi
    if command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 "$port" >/dev/null 2>&1; then
        return 0
    fi
    if command -v ss >/dev/null 2>&1 && ss -H -ltn 2>/dev/null | grep -Eq "(^|[[:space:]])(127\\.0\\.0\\.1|0\\.0\\.0\\.0|\\[::\\]|\\*):${port}([[:space:]]|$)"; then
        return 0
    fi
    if [[ "${PORT_CHECK_DISABLE_TCP_FALLBACK:-0}" != 1 ]] \
        && (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1; then
        return 0
    fi
    return 1
}

is_reserved() {
    local port=$1
    case " $RESERVED_PORTS " in
        *" $port "*) return 0 ;;
        *) return 1 ;;
    esac
}

reserve_port() {
    local port=$1
    [[ -n "$port" ]] && RESERVED_PORTS="${RESERVED_PORTS} ${port}"
}

find_available_port() {
    local start=$1
    local end=$2
    local port

    for ((port = start; port <= end; port += 1)); do
        if ! is_reserved "$port" && ! is_port_in_use "$port"; then
            echo "$port"
            return 0
        fi
    done
    return 1
}

print_port_status() {
    local name=$1
    local port=$2
    local range_start=$3
    local range_end=$4
    local alternative=""

    if is_port_in_use "$port"; then
        alternative=$(find_available_port "$range_start" "$range_end" || true)
        if [[ -n "$alternative" ]]; then
            printf 'Port %s (%s): IN USE; suggested %s\n' "$port" "$name" "$alternative"
        else
            printf 'Port %s (%s): IN USE; no free port in %s-%s\n' "$port" "$name" "$range_start" "$range_end"
        fi
        return 1
    fi

    printf 'Port %s (%s): AVAILABLE\n' "$port" "$name"
    return 0
}

json_number_or_null() {
    [[ -n "$1" ]] && printf '%s' "$1" || printf 'null'
}

usage() {
    cat <<'EOF'
Usage: port-check.sh [check|suggest|verify|find]

  check                    Check common development ports.
  suggest                  Emit JSON with distinct available ports.
  verify <port> [...]      Check specific ports; nonzero if any are occupied.
  find <start> <end>       Print the first available port in a range.
EOF
}

main() {
    local mode=${1:-check}
    local all_ok=true
    local port

    case "$mode" in
        check)
            print_port_status "HTTP" 8080 "$HTTP_START" "$HTTP_END" || all_ok=false
            print_port_status "MySQL" 3306 "$DB_MYSQL_START" "$DB_MYSQL_END" || all_ok=false
            print_port_status "PostgreSQL" 5432 "$DB_POSTGRES_START" "$DB_POSTGRES_END" || all_ok=false
            print_port_status "Redis" 6379 "$REDIS_START" "$REDIS_END" || all_ok=false
            print_port_status "Mail UI" 8025 "$MAIL_START" "$MAIL_END" || all_ok=false
            [[ "$all_ok" == true ]]
            ;;
        suggest)
            local http_port mysql_port postgres_port redis_port mail_port
            http_port=$(find_available_port "$HTTP_START" "$HTTP_END" || true)
            reserve_port "$http_port"
            mysql_port=$(find_available_port "$DB_MYSQL_START" "$DB_MYSQL_END" || true)
            reserve_port "$mysql_port"
            postgres_port=$(find_available_port "$DB_POSTGRES_START" "$DB_POSTGRES_END" || true)
            reserve_port "$postgres_port"
            redis_port=$(find_available_port "$REDIS_START" "$REDIS_END" || true)
            reserve_port "$redis_port"
            mail_port=$(find_available_port "$MAIL_START" "$MAIL_END" || true)
            cat <<EOF
{
  "http": $(json_number_or_null "$http_port"),
  "mysql": $(json_number_or_null "$mysql_port"),
  "postgresql": $(json_number_or_null "$postgres_port"),
  "redis": $(json_number_or_null "$redis_port"),
  "mail": $(json_number_or_null "$mail_port")
}
EOF
            ;;
        verify)
            shift
            if [[ $# -eq 0 ]]; then
                usage >&2
                return 2
            fi
            for port in "$@"; do
                if ! [[ "$port" =~ ^[0-9]+$ ]] || ((port < 1 || port > 65535)); then
                    printf 'Invalid port: %s\n' "$port" >&2
                    all_ok=false
                elif is_port_in_use "$port"; then
                    printf 'Port %s: IN USE\n' "$port"
                    all_ok=false
                else
                    printf 'Port %s: AVAILABLE\n' "$port"
                fi
            done
            [[ "$all_ok" == true ]]
            ;;
        find)
            if [[ $# -ne 3 ]] \
                || ! [[ "$2" =~ ^[0-9]+$ && "$3" =~ ^[0-9]+$ ]] \
                || (($2 < 1 || $3 > 65535 || $2 > $3)); then
                usage >&2
                return 2
            fi
            find_available_port "$2" "$3"
            ;;
        -h|--help)
            usage
            ;;
        *)
            usage >&2
            return 2
            ;;
    esac
}

main "$@"
