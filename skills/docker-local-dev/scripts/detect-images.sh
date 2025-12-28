#!/bin/bash
# Detect existing Docker images to suggest reuse and save disk space
# Usage: ./detect-images.sh
# Output: JSON with categorized existing images (databases, PHP, Node, Redis, mail)

set -e

# Check if Docker is running
if ! docker info &>/dev/null 2>&1; then
    echo '{"docker_running": false, "error": "Docker is not running or not accessible"}'
    exit 0
fi

# Function to get images matching a pattern
get_images_json() {
    local pattern=$1
    local first=true

    docker images --format '{{.Repository}}:{{.Tag}}|{{.Size}}' 2>/dev/null | grep -E "^($pattern):" | while IFS='|' read -r repo_tag size; do
        repo=$(echo "$repo_tag" | cut -d':' -f1)
        tag=$(echo "$repo_tag" | cut -d':' -f2)

        if [ "$first" = true ]; then
            first=false
        else
            echo ","
        fi
        echo -n "    {\"repository\": \"$repo\", \"tag\": \"$tag\", \"size\": \"$size\"}"
    done
}

# Start JSON output
echo "{"
echo '  "docker_running": true,'

# Database images (MySQL, MariaDB, PostgreSQL)
echo '  "databases": ['
DB_OUTPUT=$(get_images_json "mysql|mariadb|postgres")
if [ -n "$DB_OUTPUT" ]; then
    echo "$DB_OUTPUT"
fi
echo ""
echo "  ],"

# PHP images
echo '  "php": ['
PHP_OUTPUT=$(docker images --format '{{.Repository}}:{{.Tag}}|{{.Size}}' 2>/dev/null | grep -E "^php:" | while IFS='|' read -r repo_tag size; do
    repo=$(echo "$repo_tag" | cut -d':' -f1)
    tag=$(echo "$repo_tag" | cut -d':' -f2)
    echo -n "    {\"repository\": \"$repo\", \"tag\": \"$tag\", \"size\": \"$size\"},"
done | sed 's/,$//')
if [ -n "$PHP_OUTPUT" ]; then
    echo "$PHP_OUTPUT"
fi
echo ""
echo "  ],"

# Node.js images
echo '  "node": ['
NODE_OUTPUT=$(docker images --format '{{.Repository}}:{{.Tag}}|{{.Size}}' 2>/dev/null | grep -E "^node:" | while IFS='|' read -r repo_tag size; do
    repo=$(echo "$repo_tag" | cut -d':' -f1)
    tag=$(echo "$repo_tag" | cut -d':' -f2)
    echo -n "    {\"repository\": \"$repo\", \"tag\": \"$tag\", \"size\": \"$size\"},"
done | sed 's/,$//')
if [ -n "$NODE_OUTPUT" ]; then
    echo "$NODE_OUTPUT"
fi
echo ""
echo "  ],"

# Python images
echo '  "python": ['
PYTHON_OUTPUT=$(docker images --format '{{.Repository}}:{{.Tag}}|{{.Size}}' 2>/dev/null | grep -E "^python:" | while IFS='|' read -r repo_tag size; do
    repo=$(echo "$repo_tag" | cut -d':' -f1)
    tag=$(echo "$repo_tag" | cut -d':' -f2)
    echo -n "    {\"repository\": \"$repo\", \"tag\": \"$tag\", \"size\": \"$size\"},"
done | sed 's/,$//')
if [ -n "$PYTHON_OUTPUT" ]; then
    echo "$PYTHON_OUTPUT"
fi
echo ""
echo "  ],"

# Redis images
echo '  "redis": ['
REDIS_OUTPUT=$(get_images_json "redis")
if [ -n "$REDIS_OUTPUT" ]; then
    echo "$REDIS_OUTPUT"
fi
echo ""
echo "  ],"

# Mail testing images (Mailpit, MailHog)
echo '  "mail": ['
MAIL_OUTPUT=$(get_images_json "mailpit|mailhog|axllent/mailpit")
if [ -n "$MAIL_OUTPUT" ]; then
    echo "$MAIL_OUTPUT"
fi
echo ""
echo "  ],"

# Nginx images
echo '  "nginx": ['
NGINX_OUTPUT=$(docker images --format '{{.Repository}}:{{.Tag}}|{{.Size}}' 2>/dev/null | grep -E "^nginx:" | while IFS='|' read -r repo_tag size; do
    repo=$(echo "$repo_tag" | cut -d':' -f1)
    tag=$(echo "$repo_tag" | cut -d':' -f2)
    echo -n "    {\"repository\": \"$repo\", \"tag\": \"$tag\", \"size\": \"$size\"},"
done | sed 's/,$//')
if [ -n "$NGINX_OUTPUT" ]; then
    echo "$NGINX_OUTPUT"
fi
echo ""
echo "  ]"

echo "}"
