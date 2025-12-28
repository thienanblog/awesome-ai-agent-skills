#!/bin/bash
#
# health-check.sh - Verify all Docker services are healthy
# Runs AUTOMATICALLY after docker-compose up
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

echo ""
echo "=========================================="
echo "Docker Local Dev - Health Check"
echo "=========================================="
echo ""

# Helper function to check service
check_service() {
    local name=$1
    local command=$2
    local container=$3

    printf "Checking %-20s" "$name..."

    if [[ -n "$container" ]]; then
        if docker compose exec -T "$container" sh -c "$command" > /dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            ((PASSED++))
            return 0
        fi
    else
        if eval "$command" > /dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            ((PASSED++))
            return 0
        fi
    fi

    echo -e "${RED}FAILED${NC}"
    ((FAILED++))
    return 1
}

# Helper function to check HTTP endpoint
check_http() {
    local name=$1
    local url=$2
    local expected_codes=${3:-"200 301 302"}

    printf "Checking %-20s" "$name..."

    local http_code=$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo "000")

    if echo "$expected_codes" | grep -q "$http_code"; then
        echo -e "${GREEN}OK${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    fi

    echo -e "${RED}FAILED${NC} (HTTP $http_code)"
    ((FAILED++))
    return 1
}

# Detect what services are running
detect_services() {
    SERVICES=$(docker compose ps --services 2>/dev/null || echo "")
}

detect_services

# ============================================
# Check Database
# ============================================
if echo "$SERVICES" | grep -qE "^(db|mysql|mariadb)$"; then
    DB_SERVICE=$(echo "$SERVICES" | grep -E "^(db|mysql|mariadb)$" | head -1)
    check_service "MySQL/MariaDB" "mysqladmin ping -h localhost -u root --silent" "$DB_SERVICE"
elif echo "$SERVICES" | grep -qE "^(postgres|postgresql)$"; then
    DB_SERVICE=$(echo "$SERVICES" | grep -E "^(postgres|postgresql)$" | head -1)
    check_service "PostgreSQL" "pg_isready -U postgres" "$DB_SERVICE"
fi

# ============================================
# Check Redis
# ============================================
if echo "$SERVICES" | grep -q "^redis$"; then
    check_service "Redis" "redis-cli ping | grep -q PONG" "redis"
fi

# ============================================
# Check Web Server
# ============================================
if echo "$SERVICES" | grep -qE "^(nginx|web)$"; then
    # Try common ports
    for port in 80 8080 8000 3000; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            check_http "Nginx (port $port)" "http://localhost:$port"
            break
        fi
    done
fi

# ============================================
# Check PHP-FPM / Application
# ============================================
if echo "$SERVICES" | grep -qE "^(app|php|php-fpm)$"; then
    APP_SERVICE=$(echo "$SERVICES" | grep -E "^(app|php|php-fpm)$" | head -1)

    # Check if PHP is running
    check_service "PHP-FPM" "php -v" "$APP_SERVICE"

    # Laravel specific check
    if docker compose exec -T "$APP_SERVICE" test -f artisan 2>/dev/null; then
        check_service "Laravel" "php artisan --version" "$APP_SERVICE"
    fi

    # WordPress specific check
    if docker compose exec -T "$APP_SERVICE" test -f wp-includes/version.php 2>/dev/null; then
        if docker compose exec -T "$APP_SERVICE" which wp > /dev/null 2>&1; then
            check_service "WP-CLI" "wp core version" "$APP_SERVICE"
        fi
    fi
fi

# ============================================
# Check Node.js Application
# ============================================
if echo "$SERVICES" | grep -qE "^(node|app)$"; then
    NODE_SERVICE=$(echo "$SERVICES" | grep -E "^(node|app)$" | head -1)
    if docker compose exec -T "$NODE_SERVICE" which node > /dev/null 2>&1; then
        check_service "Node.js" "node -v" "$NODE_SERVICE"
    fi
fi

# ============================================
# Check Python Application
# ============================================
if echo "$SERVICES" | grep -qE "^(python|app|web)$"; then
    PY_SERVICE=$(echo "$SERVICES" | grep -E "^(python|app|web)$" | head -1)
    if docker compose exec -T "$PY_SERVICE" which python > /dev/null 2>&1; then
        check_service "Python" "python --version" "$PY_SERVICE"

        # Django check
        if docker compose exec -T "$PY_SERVICE" test -f manage.py 2>/dev/null; then
            check_service "Django" "python manage.py check" "$PY_SERVICE"
        fi
    fi
fi

# ============================================
# Check Email Service
# ============================================
if echo "$SERVICES" | grep -qE "^(mailpit|mailhog|mail)$"; then
    MAIL_SERVICE=$(echo "$SERVICES" | grep -E "^(mailpit|mailhog|mail)$" | head -1)

    # Check web UI
    for port in 8025 1080; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            check_http "Mail UI (port $port)" "http://localhost:$port"
            break
        fi
    done
fi

# ============================================
# Check Queue Worker (Supervisor)
# ============================================
if echo "$SERVICES" | grep -qE "^(worker|queue|supervisor)$"; then
    WORKER_SERVICE=$(echo "$SERVICES" | grep -E "^(worker|queue|supervisor)$" | head -1)
    check_service "Queue Worker" "ps aux | grep -E 'queue:work|celery|bull' | grep -v grep" "$WORKER_SERVICE"
fi

# ============================================
# Summary
# ============================================
echo ""
echo "=========================================="
echo "Health Check Summary"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [[ $FAILED -eq 0 ]]; then
    echo -e "${GREEN}All services are healthy!${NC}"
    echo ""

    # Print access information
    echo "Your development environment is ready:"
    echo ""

    # Detect and show URLs
    for port in 80 8080 8000 3000; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            echo "  Web: http://localhost:$port"
            break
        fi
    done

    # Database port
    for port in 3306 5432; do
        if nc -z localhost $port 2>/dev/null; then
            echo "  Database: localhost:$port"
            break
        fi
    done

    # Mail UI
    for port in 8025 1080; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            echo "  Mail UI: http://localhost:$port"
            break
        fi
    done

    echo ""
    exit 0
else
    echo -e "${RED}Some services failed health checks.${NC}"
    echo ""
    echo "Troubleshooting tips:"
    echo "  1. Check container logs: docker compose logs"
    echo "  2. Verify containers are running: docker compose ps"
    echo "  3. Restart services: docker compose restart"
    echo ""
    exit 1
fi
