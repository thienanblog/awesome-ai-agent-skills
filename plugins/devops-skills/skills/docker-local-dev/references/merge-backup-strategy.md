# Merge & Backup Strategy

How to handle existing Docker files safely.

## Backup Protocol

### Timestamped Backup Naming

Format: `{filename}.backup.{YYYY-MM-DD-HHMMSS}`

Examples:
- `docker-compose.yml.backup.2024-01-15-143022`
- `Dockerfile.backup.2024-01-15-143022`

### Backup Location

Backups are created in the same directory as the original file.

```bash
# Original
./docker-compose.yml

# Backup
./docker-compose.yml.backup.2024-01-15-143022
```

### Creating Backups

```bash
# Bash function to backup file
backup_file() {
    local file=$1
    local timestamp=$(date +%Y-%m-%d-%H%M%S)
    cp "$file" "${file}.backup.${timestamp}"
    echo "Backed up: ${file}.backup.${timestamp}"
}
```

### Backup Retention

Keep the last 3 backups per file. Older backups can be removed:

```bash
# List backups sorted by date
ls -la docker-compose.yml.backup.* | sort -r

# Keep only last 3
ls -t docker-compose.yml.backup.* | tail -n +4 | xargs rm -f
```

## Merge Algorithm

### Service-Level Merging

The skill merges at the service level, not line-by-line:

1. **Parse existing docker-compose.yml**
2. **Identify existing services**
3. **Only add NEW services**
4. **Preserve existing service configurations**

### Merge Rules

| Scenario | Action |
|----------|--------|
| Service exists | Keep existing, don't modify |
| Service missing | Add from template |
| Network exists | Keep existing |
| Network missing | Add from template |
| Volume exists | Keep existing |
| Volume missing | Add from template |
| Top-level config | Preserve existing |

### Example Merge

**Existing docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    volumes:
      - ./:/var/www

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: custom_password  # User's custom config
```

**Skill wants to add:**
```yaml
services:
  redis:
    image: redis:alpine

  mailpit:
    image: axllent/mailpit
```

**Result after merge:**
```yaml
version: '3.8'

services:
  app:
    build: .
    volumes:
      - ./:/var/www
    # Original config preserved

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: custom_password  # Preserved!

  # NEW services added
  redis:
    image: redis:alpine

  mailpit:
    image: axllent/mailpit
```

### Environment Variable Preservation

Always preserve user's environment variables:

```yaml
# Before merge - user has custom vars
db:
  environment:
    MYSQL_ROOT_PASSWORD: my_secret_pass
    CUSTOM_VAR: my_value

# After merge - variables preserved
db:
  environment:
    MYSQL_ROOT_PASSWORD: my_secret_pass
    CUSTOM_VAR: my_value
    # No new vars added to existing service
```

### Volume Preservation

```yaml
# User's custom volumes - preserved
services:
  app:
    volumes:
      - ./custom/path:/var/www
      - ~/.ssh:/root/.ssh:ro  # Custom mount

# Not replaced with template defaults
```

### Network Preservation

```yaml
# User's custom network
networks:
  my_custom_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16

# Preserved, not replaced
```

## Conflict Resolution

### Show Diff Before Applying

Always show the user what will change:

```diff
 services:
   app:
     # existing config unchanged
+
+  redis:
+    image: redis:alpine
+    volumes:
+      - redis_data:/data
+
+  mailpit:
+    image: axllent/mailpit
+    ports:
+      - "1025:1025"
+      - "8025:8025"
+
 volumes:
+  redis_data:
```

### User Options

Present these options when existing files found:

```
I found existing Docker files. How should I proceed?

1. Merge (add new services, preserve your settings)
   - Your customizations will be kept
   - Only NEW services will be added
   - Backup will be created first

2. Replace (backup existing, generate fresh)
   - Existing files will be backed up
   - New files generated from templates
   - You'll need to re-apply customizations

3. Cancel (let me review first)
   - No changes will be made
   - You can review files manually
```

### Resolving Specific Conflicts

**Port Conflict:**
```
Service 'nginx' already uses port 8080.
New service 'proxy' also wants port 8080.

Options:
1. Use different port for 'proxy' (8081)
2. Keep existing 'nginx' port, skip 'proxy'
3. Cancel and resolve manually
```

**Service Name Conflict:**
```
Template has 'app' service but one already exists.

Options:
1. Keep existing 'app' configuration
2. Rename new service to 'app_new'
3. Cancel and resolve manually
```

## Rollback Procedure

### Manual Rollback

```bash
# Find backup
ls -la *.backup.*

# Restore from backup
cp docker-compose.yml.backup.2024-01-15-143022 docker-compose.yml

# Verify
docker compose config
```

### Automated Rollback Check

```bash
# After generating new files, verify they're valid
if ! docker compose config > /dev/null 2>&1; then
    echo "Error: Generated config is invalid"
    echo "Rolling back..."
    cp docker-compose.yml.backup.* docker-compose.yml
    exit 1
fi
```

### Verification After Merge

1. **Syntax check:**
   ```bash
   docker compose config
   ```

2. **Service check:**
   ```bash
   docker compose config --services
   ```

3. **Test containers start:**
   ```bash
   docker compose up -d
   docker compose ps
   ```

## Best Practices

### Always Backup First

```bash
# Before any modification
backup_file docker-compose.yml
backup_file Dockerfile
backup_file .env
```

### Validate Before Applying

```bash
# Check YAML syntax
docker compose config > /dev/null

# Check Dockerfile syntax
docker build --check .
```

### Use Version Control

```bash
# Commit before changes
git add docker-compose.yml Dockerfile
git commit -m "Backup before Docker skill updates"

# Easy rollback
git checkout docker-compose.yml
```

### Document Custom Changes

Add comments to mark customizations:

```yaml
services:
  db:
    environment:
      # CUSTOM: Using legacy password format
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      # CUSTOM: Company-specific variable
      COMPANY_CODE: ACME
```
