#!/bin/bash
# Detect Docker networks and reverse proxy containers (Nginx Proxy Manager, Traefik, Caddy)
# Usage: ./detect-network.sh
# Output: JSON with detected reverse proxies and available networks

set -e

# Check if Docker is running
if ! docker info &>/dev/null 2>&1; then
    echo '{"docker_running": false, "error": "Docker is not running or not accessible"}'
    exit 0
fi

# Find reverse proxy containers (Nginx Proxy Manager, Traefik, Caddy, etc.)
NPM_CONTAINERS=$(docker ps --format '{{.Names}}' 2>/dev/null | grep -iE 'nginx.*proxy|npm|proxy.*manager|traefik|caddy|reverse.*proxy' | head -5 || true)

# Get all custom networks (exclude default bridge, host, none)
ALL_NETWORKS=$(docker network ls --format '{{.Name}}' 2>/dev/null | grep -vE '^(bridge|host|none)$' || true)

# Start JSON output
echo "{"
echo '  "docker_running": true,'

# Reverse proxy containers section
echo '  "reverse_proxy_containers": ['
first=true
if [ -n "$NPM_CONTAINERS" ]; then
    while IFS= read -r container; do
        if [ -n "$container" ]; then
            # Get networks for this container
            networks=$(docker inspect "$container" --format '{{range $net, $conf := .NetworkSettings.Networks}}{{$net}} {{end}}' 2>/dev/null | xargs)
            # Get container image
            image=$(docker inspect "$container" --format '{{.Config.Image}}' 2>/dev/null)

            if [ "$first" = true ]; then
                first=false
            else
                echo ","
            fi
            echo -n "    {\"name\": \"$container\", \"networks\": \"$networks\", \"image\": \"$image\"}"
        fi
    done <<< "$NPM_CONTAINERS"
fi
echo ""
echo "  ],"

# Available networks section
echo '  "available_networks": ['
first=true
if [ -n "$ALL_NETWORKS" ]; then
    while IFS= read -r net; do
        if [ -n "$net" ]; then
            # Get network driver and scope
            driver=$(docker network inspect "$net" --format '{{.Driver}}' 2>/dev/null || echo "unknown")

            if [ "$first" = true ]; then
                first=false
            else
                echo ","
            fi
            echo -n "    {\"name\": \"$net\", \"driver\": \"$driver\"}"
        fi
    done <<< "$ALL_NETWORKS"
fi
echo ""
echo "  ],"

# Suggested network for reverse proxy (if found)
echo '  "suggested_proxy_network": '
if [ -n "$NPM_CONTAINERS" ]; then
    # Get the first container's primary network
    first_container=$(echo "$NPM_CONTAINERS" | head -1)
    if [ -n "$first_container" ]; then
        primary_network=$(docker inspect "$first_container" --format '{{range $net, $conf := .NetworkSettings.Networks}}{{$net}}{{end}}' 2>/dev/null | awk '{print $1}')
        if [ -n "$primary_network" ]; then
            echo "\"$primary_network\""
        else
            echo "null"
        fi
    else
        echo "null"
    fi
else
    echo "null"
fi

echo "}"
