#!/bin/bash
#
# wp-setup.sh - WordPress initialization script
# Sets up WP-CLI, downloads core, installs debug plugins
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
WP_PATH="${WP_PATH:-/var/www/html}"
WP_DEBUG_PLUGINS="${WP_DEBUG_PLUGINS:-query-monitor debug-bar}"

echo ""
echo "=========================================="
echo "WordPress Setup Script"
echo "=========================================="
echo ""

# Check if running inside container or on host
if [[ -f "/.dockerenv" ]]; then
    INSIDE_CONTAINER=true
else
    INSIDE_CONTAINER=false
fi

# Helper function to run WP-CLI
wp_cli() {
    if [[ "$INSIDE_CONTAINER" == "true" ]]; then
        wp "$@" --path="$WP_PATH" --allow-root
    else
        docker compose exec -T app wp "$@" --path="$WP_PATH" --allow-root
    fi
}

# Check if WP-CLI is installed
check_wpcli() {
    echo -n "Checking WP-CLI... "

    if wp_cli --version > /dev/null 2>&1; then
        echo -e "${GREEN}installed${NC}"
        return 0
    else
        echo -e "${YELLOW}not found${NC}"
        return 1
    fi
}

# Install WP-CLI
install_wpcli() {
    echo "Installing WP-CLI..."

    if [[ "$INSIDE_CONTAINER" == "true" ]]; then
        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
        chmod +x wp-cli.phar
        mv wp-cli.phar /usr/local/bin/wp
    else
        docker compose exec -T app bash -c "
            curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
            chmod +x wp-cli.phar
            mv wp-cli.phar /usr/local/bin/wp
        "
    fi

    echo -e "${GREEN}WP-CLI installed successfully${NC}"
}

# Check if WordPress is downloaded
check_wp_core() {
    echo -n "Checking WordPress core... "

    if wp_cli core is-installed 2>/dev/null; then
        echo -e "${GREEN}installed${NC}"
        return 0
    elif [[ -f "$WP_PATH/wp-config.php" ]]; then
        echo -e "${YELLOW}downloaded but not installed${NC}"
        return 1
    else
        echo -e "${YELLOW}not downloaded${NC}"
        return 2
    fi
}

# Download WordPress core
download_wp_core() {
    local version=${1:-latest}

    echo "Downloading WordPress $version..."
    wp_cli core download --version="$version"
    echo -e "${GREEN}WordPress downloaded${NC}"
}

# Configure wp-config.php for Docker
configure_wp_config() {
    echo "Configuring wp-config.php for Docker..."

    local db_name="${WORDPRESS_DB_NAME:-wordpress}"
    local db_user="${WORDPRESS_DB_USER:-wordpress}"
    local db_pass="${WORDPRESS_DB_PASSWORD:-wordpress}"
    local db_host="${WORDPRESS_DB_HOST:-db}"

    # Check if wp-config.php exists
    if [[ -f "$WP_PATH/wp-config.php" ]]; then
        echo "wp-config.php already exists, skipping..."
        return 0
    fi

    wp_cli config create \
        --dbname="$db_name" \
        --dbuser="$db_user" \
        --dbpass="$db_pass" \
        --dbhost="$db_host" \
        --extra-php <<PHP

// Docker development settings
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', true);
define('SCRIPT_DEBUG', true);
define('SAVEQUERIES', true);

// Disable automatic updates in Docker
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_AUTO_UPDATE_CORE', false);

// Memory limit
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Cookie settings for local development
define('COOKIE_DOMAIN', '');
define('ADMIN_COOKIE_PATH', '/');
define('COOKIEPATH', '/');
define('SITECOOKIEPATH', '/');
PHP

    echo -e "${GREEN}wp-config.php configured for Docker${NC}"
}

# Install debug plugins
install_debug_plugins() {
    echo ""
    echo "Installing debug plugins..."

    for plugin in $WP_DEBUG_PLUGINS; do
        echo -n "  Installing $plugin... "

        if wp_cli plugin is-installed "$plugin" 2>/dev/null; then
            echo -e "${YELLOW}already installed${NC}"
        else
            if wp_cli plugin install "$plugin" --activate 2>/dev/null; then
                echo -e "${GREEN}done${NC}"
            else
                echo -e "${RED}failed${NC}"
            fi
        fi
    done
}

# Verify WordPress checksums
verify_checksums() {
    echo ""
    echo -n "Verifying WordPress core checksums... "

    if wp_cli core verify-checksums 2>/dev/null; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${YELLOW}Warning: checksums don't match${NC}"
        return 1
    fi
}

# Main setup flow
main() {
    local mode=${1:-full}

    case $mode in
        full)
            # Full setup
            check_wpcli || install_wpcli
            check_wp_core
            local core_status=$?
            if [[ $core_status -eq 2 ]]; then
                download_wp_core
            fi
            configure_wp_config
            install_debug_plugins
            verify_checksums
            ;;

        wpcli)
            # Just install WP-CLI
            check_wpcli || install_wpcli
            ;;

        plugins)
            # Just install debug plugins
            install_debug_plugins
            ;;

        verify)
            # Just verify checksums
            verify_checksums
            ;;

        *)
            echo "Usage: $0 [full|wpcli|plugins|verify]"
            echo ""
            echo "Commands:"
            echo "  full      Full WordPress setup (default)"
            echo "  wpcli     Install WP-CLI only"
            echo "  plugins   Install debug plugins only"
            echo "  verify    Verify WordPress checksums"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${GREEN}WordPress setup complete!${NC}"
    echo ""
}

main "$@"
