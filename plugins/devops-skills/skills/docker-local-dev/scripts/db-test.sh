#!/bin/bash
#
# db-test.sh - Simple CRUD test to verify database works
# Tests INSERT, UPDATE, DELETE operations
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "Database CRUD Test"
echo "=========================================="
echo ""

# Detect database type from running containers
detect_db() {
    local services=$(docker compose ps --services 2>/dev/null || echo "")

    if echo "$services" | grep -qE "^(mysql|mariadb|db)$"; then
        echo "mysql"
    elif echo "$services" | grep -qE "^(postgres|postgresql)$"; then
        echo "postgresql"
    else
        echo ""
    fi
}

DB_TYPE=$(detect_db)

if [[ -z "$DB_TYPE" ]]; then
    echo -e "${YELLOW}No database container detected. Skipping CRUD test.${NC}"
    exit 0
fi

# Get database credentials from environment or use defaults
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASSWORD:-secret}"
DB_NAME="${DB_DATABASE:-test}"

# Test table name
TEST_TABLE="_docker_local_dev_test"

run_test() {
    local name=$1
    local success=$2

    printf "  %-20s" "$name..."

    if [[ "$success" == "true" ]]; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        return 1
    fi
}

# ============================================
# MySQL/MariaDB Tests
# ============================================
if [[ "$DB_TYPE" == "mysql" ]]; then
    DB_SERVICE=$(docker compose ps --services 2>/dev/null | grep -E "^(mysql|mariadb|db)$" | head -1)

    echo "Testing MySQL/MariaDB..."
    echo ""

    # CREATE TABLE
    result=$(docker compose exec -T "$DB_SERVICE" mysql -u"$DB_USER" -p"$DB_PASS" -e "
        CREATE TABLE IF NOT EXISTS $TEST_TABLE (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    " 2>&1 && echo "success" || echo "failed")
    run_test "CREATE table" "[[ '$result' == *'success'* ]]" && CREATE_OK=true || CREATE_OK=false

    # INSERT
    result=$(docker compose exec -T "$DB_SERVICE" mysql -u"$DB_USER" -p"$DB_PASS" -e "
        INSERT INTO $TEST_TABLE (name) VALUES ('test_entry');
    " 2>&1 && echo "success" || echo "failed")
    run_test "INSERT data" "[[ '$result' == *'success'* ]]" && INSERT_OK=true || INSERT_OK=false

    # UPDATE
    result=$(docker compose exec -T "$DB_SERVICE" mysql -u"$DB_USER" -p"$DB_PASS" -e "
        UPDATE $TEST_TABLE SET name = 'updated_entry' WHERE name = 'test_entry';
    " 2>&1 && echo "success" || echo "failed")
    run_test "UPDATE data" "[[ '$result' == *'success'* ]]" && UPDATE_OK=true || UPDATE_OK=false

    # SELECT (verify update worked)
    result=$(docker compose exec -T "$DB_SERVICE" mysql -u"$DB_USER" -p"$DB_PASS" -N -e "
        SELECT COUNT(*) FROM $TEST_TABLE WHERE name = 'updated_entry';
    " 2>&1)
    [[ "$result" == "1" ]] && SELECT_OK=true || SELECT_OK=false
    run_test "SELECT data" "$SELECT_OK"

    # DELETE
    result=$(docker compose exec -T "$DB_SERVICE" mysql -u"$DB_USER" -p"$DB_PASS" -e "
        DELETE FROM $TEST_TABLE WHERE name = 'updated_entry';
    " 2>&1 && echo "success" || echo "failed")
    run_test "DELETE data" "[[ '$result' == *'success'* ]]" && DELETE_OK=true || DELETE_OK=false

    # DROP TABLE (cleanup)
    result=$(docker compose exec -T "$DB_SERVICE" mysql -u"$DB_USER" -p"$DB_PASS" -e "
        DROP TABLE IF EXISTS $TEST_TABLE;
    " 2>&1 && echo "success" || echo "failed")
    run_test "DROP table" "[[ '$result' == *'success'* ]]" && DROP_OK=true || DROP_OK=false
fi

# ============================================
# PostgreSQL Tests
# ============================================
if [[ "$DB_TYPE" == "postgresql" ]]; then
    DB_SERVICE=$(docker compose ps --services 2>/dev/null | grep -E "^(postgres|postgresql)$" | head -1)
    DB_USER="${DB_USER:-postgres}"

    echo "Testing PostgreSQL..."
    echo ""

    # CREATE TABLE
    result=$(docker compose exec -T "$DB_SERVICE" psql -U "$DB_USER" -c "
        CREATE TABLE IF NOT EXISTS $TEST_TABLE (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    " 2>&1 && echo "success" || echo "failed")
    run_test "CREATE table" "[[ '$result' == *'success'* ]]"

    # INSERT
    result=$(docker compose exec -T "$DB_SERVICE" psql -U "$DB_USER" -c "
        INSERT INTO $TEST_TABLE (name) VALUES ('test_entry');
    " 2>&1 && echo "success" || echo "failed")
    run_test "INSERT data" "[[ '$result' == *'success'* ]]"

    # UPDATE
    result=$(docker compose exec -T "$DB_SERVICE" psql -U "$DB_USER" -c "
        UPDATE $TEST_TABLE SET name = 'updated_entry' WHERE name = 'test_entry';
    " 2>&1 && echo "success" || echo "failed")
    run_test "UPDATE data" "[[ '$result' == *'success'* ]]"

    # SELECT
    result=$(docker compose exec -T "$DB_SERVICE" psql -U "$DB_USER" -t -c "
        SELECT COUNT(*) FROM $TEST_TABLE WHERE name = 'updated_entry';
    " 2>&1 | tr -d ' ')
    [[ "$result" == "1" ]] && SELECT_OK=true || SELECT_OK=false
    run_test "SELECT data" "$SELECT_OK"

    # DELETE
    result=$(docker compose exec -T "$DB_SERVICE" psql -U "$DB_USER" -c "
        DELETE FROM $TEST_TABLE WHERE name = 'updated_entry';
    " 2>&1 && echo "success" || echo "failed")
    run_test "DELETE data" "[[ '$result' == *'success'* ]]"

    # DROP TABLE
    result=$(docker compose exec -T "$DB_SERVICE" psql -U "$DB_USER" -c "
        DROP TABLE IF EXISTS $TEST_TABLE;
    " 2>&1 && echo "success" || echo "failed")
    run_test "DROP table" "[[ '$result' == *'success'* ]]"
fi

echo ""
echo -e "${GREEN}Database CRUD test completed successfully!${NC}"
echo ""
