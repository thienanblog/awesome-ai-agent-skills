#!/bin/bash
#
# port-check.sh - Check and find available ports
# Verifies ports are not in use before Docker setup
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default port ranges
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

# Check if a port is in use
is_port_in_use() {
    local port=$1

    # Try multiple methods for compatibility
    if command -v lsof > /dev/null 2>&1; then
        lsof -i ":$port" > /dev/null 2>&1 && return 0
    fi

    if command -v nc > /dev/null 2>&1; then
        nc -z localhost "$port" 2>/dev/null && return 0
    fi

    if command -v ss > /dev/null 2>&1; then
        ss -tuln | grep -q ":$port " && return 0
    fi

    # Try connecting with bash
    (echo > /dev/tcp/localhost/$port) 2>/dev/null && return 0

    return 1
}

# Find next available port in range
find_available_port() {
    local start=$1
    local end=$2

    for port in $(seq $start $end); do
        if ! is_port_in_use $port; then
            echo $port
            return 0
        fi
    done

    echo ""
    return 1
}

# Check specific port and suggest alternative
check_port() {
    local name=$1
    local port=$2
    local range_start=$3
    local range_end=$4

    printf "Port %-5s (%-15s) " "$port" "$name"

    if is_port_in_use $port; then
        echo -e "${YELLOW}IN USE${NC}"

        # Find alternative
        local alt_port=$(find_available_port $range_start $range_end)
        if [[ -n "$alt_port" ]]; then
            echo -e "  ${BLUE}Suggesting: $alt_port${NC}"
            echo "$alt_port"
        else
            echo -e "  ${RED}No available ports in range $range_start-$range_end${NC}"
            echo ""
        fi
        return 1
    else
        echo -e "${GREEN}Available${NC}"
        echo "$port"
        return 0
    fi
}

# Main function
main() {
    echo ""
    echo "=========================================="
    echo "Port Availability Check"
    echo "=========================================="
    echo ""

    local mode=${1:-check}

    case $mode in
        check)
            # Check common development ports
            echo "Checking common development ports..."
            echo ""

            check_port "HTTP" 8080 $HTTP_START $HTTP_END > /dev/null
            check_port "MySQL" 3306 $DB_MYSQL_START $DB_MYSQL_END > /dev/null
            check_port "PostgreSQL" 5432 $DB_POSTGRES_START $DB_POSTGRES_END > /dev/null
            check_port "Redis" 6379 $REDIS_START $REDIS_END > /dev/null
            check_port "Mail UI" 8025 $MAIL_START $MAIL_END > /dev/null
            ;;

        suggest)
            # Output JSON with suggested ports
            local http_port=$(find_available_port $HTTP_START $HTTP_END)
            local mysql_port=$(find_available_port $DB_MYSQL_START $DB_MYSQL_END)
            local postgres_port=$(find_available_port $DB_POSTGRES_START $DB_POSTGRES_END)
            local redis_port=$(find_available_port $REDIS_START $REDIS_END)
            local mail_port=$(find_available_port $MAIL_START $MAIL_END)

            cat <<EOF
{
  "http": ${http_port:-null},
  "mysql": ${mysql_port:-null},
  "postgresql": ${postgres_port:-null},
  "redis": ${redis_port:-null},
  "mail": ${mail_port:-null}
}
EOF
            ;;

        verify)
            # Verify specific ports from arguments
            shift
            local all_ok=true

            for port in "$@"; do
                if is_port_in_use $port; then
                    echo -e "Port $port: ${RED}IN USE${NC}"
                    all_ok=false
                else
                    echo -e "Port $port: ${GREEN}Available${NC}"
                fi
            done

            if [[ "$all_ok" == "true" ]]; then
                exit 0
            else
                exit 1
            fi
            ;;

        find)
            # Find a single available port
            local start=${2:-8080}
            local end=${3:-8099}
            find_available_port $start $end
            ;;

        *)
            echo "Usage: $0 [check|suggest|verify|find]"
            echo ""
            echo "Commands:"
            echo "  check           Check common development ports (default)"
            echo "  suggest         Output JSON with suggested available ports"
            echo "  verify <ports>  Verify specific ports are available"
            echo "  find <start> <end>  Find first available port in range"
            ;;
    esac
}

main "$@"
