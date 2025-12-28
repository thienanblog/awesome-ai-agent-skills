#!/bin/bash
#
# detect-stack.sh - Auto-detect project tech stack
# Runs BEFORE AI analysis to save tokens
#
# Output: JSON format for easy parsing
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root (default to current directory)
PROJECT_ROOT="${1:-.}"

# Initialize detection results
FRAMEWORK=""
FRAMEWORK_VERSION=""
CMS=""
LANGUAGE=""
LANGUAGE_VERSION=""
PACKAGE_MANAGER=""
DATABASE=""
REDIS_DETECTED=false
QUEUE_DETECTED=false
EXISTING_DOCKER=false
SUPPORTED=true

# Helper function to check file exists
file_exists() {
    [[ -f "$PROJECT_ROOT/$1" ]]
}

# Helper function to check directory exists
dir_exists() {
    [[ -d "$PROJECT_ROOT/$1" ]]
}

# Helper function to check if string in file
string_in_file() {
    grep -q "$1" "$PROJECT_ROOT/$2" 2>/dev/null
}

# Detect PHP version from composer.json
detect_php_version() {
    if file_exists "composer.json"; then
        local php_require=$(grep -o '"php"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/composer.json" 2>/dev/null | head -1)
        if [[ -n "$php_require" ]]; then
            # Extract version like ^8.2 or >=8.1
            echo "$php_require" | grep -oE '[0-9]+\.[0-9]+' | head -1
        fi
    fi
}

# Detect Node version
detect_node_version() {
    # Check .nvmrc first
    if file_exists ".nvmrc"; then
        cat "$PROJECT_ROOT/.nvmrc" | tr -d 'v\n'
        return
    fi

    # Check package.json engines
    if file_exists "package.json"; then
        local node_version=$(grep -o '"node"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/package.json" 2>/dev/null | head -1)
        if [[ -n "$node_version" ]]; then
            echo "$node_version" | grep -oE '[0-9]+' | head -1
        fi
    fi
}

# Detect Python version
detect_python_version() {
    # Check pyproject.toml
    if file_exists "pyproject.toml"; then
        local py_version=$(grep -E 'python[[:space:]]*=' "$PROJECT_ROOT/pyproject.toml" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
        if [[ -n "$py_version" ]]; then
            echo "$py_version"
            return
        fi
    fi

    # Check runtime.txt (Heroku style)
    if file_exists "runtime.txt"; then
        grep -oE '[0-9]+\.[0-9]+' "$PROJECT_ROOT/runtime.txt" | head -1
        return
    fi

    # Check .python-version (pyenv)
    if file_exists ".python-version"; then
        cat "$PROJECT_ROOT/.python-version" | grep -oE '[0-9]+\.[0-9]+' | head -1
    fi
}

# Detect database from config files
detect_database() {
    local db=""

    # Check .env file
    if file_exists ".env"; then
        if grep -qE 'DB_CONNECTION=mysql|DATABASE_URL.*mysql' "$PROJECT_ROOT/.env" 2>/dev/null; then
            db="mysql"
        elif grep -qE 'DB_CONNECTION=pgsql|DB_CONNECTION=postgres|DATABASE_URL.*postgres' "$PROJECT_ROOT/.env" 2>/dev/null; then
            db="postgresql"
        elif grep -qE 'DB_CONNECTION=sqlite' "$PROJECT_ROOT/.env" 2>/dev/null; then
            db="sqlite"
        fi
    fi

    # Check Django settings
    if [[ -z "$db" ]] && file_exists "settings.py"; then
        if grep -q "mysql" "$PROJECT_ROOT/settings.py" 2>/dev/null; then
            db="mysql"
        elif grep -q "postgresql\|psycopg" "$PROJECT_ROOT/settings.py" 2>/dev/null; then
            db="postgresql"
        fi
    fi

    # Check for common config patterns
    if [[ -z "$db" ]]; then
        if file_exists "config/database.php" && grep -q "mysql" "$PROJECT_ROOT/config/database.php" 2>/dev/null; then
            db="mysql"
        fi
    fi

    echo "$db"
}

# Detect Redis usage
detect_redis() {
    # Check .env
    if file_exists ".env"; then
        if grep -qE 'REDIS_HOST|CACHE_DRIVER=redis|SESSION_DRIVER=redis|QUEUE_CONNECTION=redis' "$PROJECT_ROOT/.env" 2>/dev/null; then
            echo "true"
            return
        fi
    fi

    # Check package.json for redis packages
    if file_exists "package.json"; then
        if grep -qE '"redis"|"ioredis"|"bull"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            echo "true"
            return
        fi
    fi

    # Check requirements.txt
    if file_exists "requirements.txt"; then
        if grep -qiE '^redis|^celery|^django-redis' "$PROJECT_ROOT/requirements.txt" 2>/dev/null; then
            echo "true"
            return
        fi
    fi

    echo "false"
}

# Detect queue usage
detect_queue() {
    # Laravel queues
    if file_exists ".env" && grep -qE 'QUEUE_CONNECTION=redis|QUEUE_CONNECTION=database' "$PROJECT_ROOT/.env" 2>/dev/null; then
        echo "true"
        return
    fi

    # Laravel jobs directory
    if dir_exists "app/Jobs"; then
        echo "true"
        return
    fi

    # Bull/BullMQ for Node.js
    if file_exists "package.json" && grep -qE '"bull"|"bullmq"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
        echo "true"
        return
    fi

    # Celery for Python
    if file_exists "requirements.txt" && grep -qi "^celery" "$PROJECT_ROOT/requirements.txt" 2>/dev/null; then
        echo "true"
        return
    fi

    echo "false"
}

# Main detection logic

echo -e "${BLUE}Detecting project tech stack...${NC}" >&2

# Check for existing Docker files
if file_exists "docker-compose.yml" || file_exists "docker-compose.yaml" || file_exists "Dockerfile"; then
    EXISTING_DOCKER=true
fi

# ============================================
# PHP/Laravel Detection
# ============================================
if file_exists "composer.json" && file_exists "artisan"; then
    LANGUAGE="php"
    LANGUAGE_VERSION=$(detect_php_version)
    PACKAGE_MANAGER="composer"

    # Check for Laravel
    if string_in_file "laravel/framework" "composer.json"; then
        FRAMEWORK="laravel"
        # Detect Laravel version
        FRAMEWORK_VERSION=$(grep -o '"laravel/framework"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/composer.json" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
    fi
fi

# ============================================
# WordPress Detection
# ============================================
if file_exists "wp-config.php" || (dir_exists "wp-content" && dir_exists "wp-includes"); then
    LANGUAGE="php"
    CMS="wordpress"
    PACKAGE_MANAGER="composer"

    # Try to detect WP version
    if file_exists "wp-includes/version.php"; then
        FRAMEWORK_VERSION=$(grep "\$wp_version" "$PROJECT_ROOT/wp-includes/version.php" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
    fi
fi

# ============================================
# Drupal Detection
# ============================================
if dir_exists "core" && dir_exists "sites/default"; then
    if file_exists "core/lib/Drupal.php" || file_exists "core/includes/bootstrap.inc"; then
        LANGUAGE="php"
        CMS="drupal"
        PACKAGE_MANAGER="composer"

        # Detect Drupal version
        if file_exists "core/lib/Drupal.php"; then
            FRAMEWORK_VERSION=$(grep "const VERSION" "$PROJECT_ROOT/core/lib/Drupal.php" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
        fi
    fi
fi

# ============================================
# Joomla Detection
# ============================================
if file_exists "configuration.php" && dir_exists "administrator"; then
    if dir_exists "libraries/src" || dir_exists "libraries/joomla"; then
        LANGUAGE="php"
        CMS="joomla"

        # Detect Joomla version
        if file_exists "libraries/src/Version.php"; then
            FRAMEWORK_VERSION=$(grep "MAJOR_VERSION\|MINOR_VERSION" "$PROJECT_ROOT/libraries/src/Version.php" 2>/dev/null | grep -oE '[0-9]+' | head -2 | paste -sd'.')
        fi
    fi
fi

# ============================================
# Node.js Detection
# ============================================
if file_exists "package.json" && [[ -z "$LANGUAGE" ]]; then
    LANGUAGE="nodejs"
    LANGUAGE_VERSION=$(detect_node_version)

    # Detect package manager
    if file_exists "pnpm-lock.yaml"; then
        PACKAGE_MANAGER="pnpm"
    elif file_exists "yarn.lock"; then
        PACKAGE_MANAGER="yarn"
    elif file_exists "bun.lockb"; then
        PACKAGE_MANAGER="bun"
    else
        PACKAGE_MANAGER="npm"
    fi

    # Detect framework
    if string_in_file '"next"' "package.json"; then
        FRAMEWORK="nextjs"
        FRAMEWORK_VERSION=$(grep -o '"next"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/package.json" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
    elif string_in_file '"@nestjs/core"' "package.json"; then
        FRAMEWORK="nestjs"
        FRAMEWORK_VERSION=$(grep -o '"@nestjs/core"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/package.json" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
    elif string_in_file '"express"' "package.json"; then
        FRAMEWORK="express"
        FRAMEWORK_VERSION=$(grep -o '"express"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/package.json" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
    elif string_in_file '"fastify"' "package.json"; then
        FRAMEWORK="fastify"
    elif string_in_file '"koa"' "package.json"; then
        FRAMEWORK="koa"
    fi
fi

# ============================================
# Python Detection
# ============================================
if (file_exists "requirements.txt" || file_exists "pyproject.toml" || file_exists "Pipfile") && [[ -z "$LANGUAGE" ]]; then
    LANGUAGE="python"
    LANGUAGE_VERSION=$(detect_python_version)

    # Detect package manager
    if file_exists "poetry.lock"; then
        PACKAGE_MANAGER="poetry"
    elif file_exists "Pipfile.lock"; then
        PACKAGE_MANAGER="pipenv"
    else
        PACKAGE_MANAGER="pip"
    fi

    # Detect framework
    local req_file=""
    if file_exists "requirements.txt"; then
        req_file="requirements.txt"
    elif file_exists "pyproject.toml"; then
        req_file="pyproject.toml"
    fi

    if [[ -n "$req_file" ]]; then
        if grep -qi "django" "$PROJECT_ROOT/$req_file" 2>/dev/null; then
            FRAMEWORK="django"
            FRAMEWORK_VERSION=$(grep -ioE 'django[=<>~!]*[0-9]+\.[0-9]+' "$PROJECT_ROOT/$req_file" 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
        elif grep -qi "fastapi" "$PROJECT_ROOT/$req_file" 2>/dev/null; then
            FRAMEWORK="fastapi"
        elif grep -qi "flask" "$PROJECT_ROOT/$req_file" 2>/dev/null; then
            FRAMEWORK="flask"
        fi
    fi
fi

# ============================================
# Detect Database, Redis, Queue
# ============================================
DATABASE=$(detect_database)
REDIS_DETECTED=$(detect_redis)
QUEUE_DETECTED=$(detect_queue)

# ============================================
# Check if stack is officially supported
# ============================================
SUPPORTED_STACKS="laravel|wordpress|drupal|joomla|nextjs|nestjs|express|fastify|django|fastapi|flask"
if [[ -n "$FRAMEWORK" ]] && ! echo "$FRAMEWORK" | grep -qE "$SUPPORTED_STACKS"; then
    SUPPORTED=false
fi
if [[ -n "$CMS" ]] && ! echo "$CMS" | grep -qE "wordpress|drupal|joomla"; then
    SUPPORTED=false
fi

# ============================================
# Output JSON
# ============================================
cat <<EOF
{
  "detected": true,
  "language": "$LANGUAGE",
  "languageVersion": "$LANGUAGE_VERSION",
  "framework": "$FRAMEWORK",
  "frameworkVersion": "$FRAMEWORK_VERSION",
  "cms": "$CMS",
  "packageManager": "$PACKAGE_MANAGER",
  "database": "$DATABASE",
  "redis": $REDIS_DETECTED,
  "queue": $QUEUE_DETECTED,
  "existingDocker": $EXISTING_DOCKER,
  "supported": $SUPPORTED
}
EOF

# ============================================
# Human-readable summary
# ============================================
echo "" >&2
echo -e "${GREEN}Detection Results:${NC}" >&2
echo "==================" >&2

if [[ -n "$LANGUAGE" ]]; then
    echo -e "Language: ${BLUE}$LANGUAGE${NC}" >&2
    [[ -n "$LANGUAGE_VERSION" ]] && echo "  Version: $LANGUAGE_VERSION" >&2
fi

if [[ -n "$FRAMEWORK" ]]; then
    echo -e "Framework: ${BLUE}$FRAMEWORK${NC}" >&2
    [[ -n "$FRAMEWORK_VERSION" ]] && echo "  Version: $FRAMEWORK_VERSION" >&2
fi

if [[ -n "$CMS" ]]; then
    echo -e "CMS: ${BLUE}$CMS${NC}" >&2
fi

if [[ -n "$PACKAGE_MANAGER" ]]; then
    echo "Package Manager: $PACKAGE_MANAGER" >&2
fi

if [[ -n "$DATABASE" ]]; then
    echo "Database: $DATABASE" >&2
fi

echo "Redis: $REDIS_DETECTED" >&2
echo "Queue: $QUEUE_DETECTED" >&2
echo "Existing Docker: $EXISTING_DOCKER" >&2

if [[ "$SUPPORTED" == "false" ]]; then
    echo "" >&2
    echo -e "${YELLOW}Warning: This stack is not officially supported.${NC}" >&2
    echo "The Docker setup may not be optimal." >&2
    echo "Consider contributing to improve support!" >&2
fi
