# Merge Strategy Reference

This document defines how to update existing CLAUDE.md/AGENTS.md files while preserving user customizations.

## Overview

When a user requests an update to an existing instruction file, the merge strategy must:
1. Preserve custom content the user has added
2. Update outdated information with new detections
3. Add new sections that don't exist
4. Provide clear conflict resolution

## File Parsing

### Section Detection

Parse the existing file into sections using `## ` (h2) headers as delimiters:

```javascript
// Pseudo-code for parsing
function parseIntoSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = 'header';
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous section
      sections[currentSection] = currentContent.join('\n');
      // Start new section
      currentSection = normalizeHeaderName(line);
      currentContent = [line];
    } else {
      currentContent.push(line);
    }
  }
  // Save last section
  sections[currentSection] = currentContent.join('\n');

  return sections;
}
```

### Standard Section Names

Map common variations to standard names:

| Standard Name | Variations |
|--------------|------------|
| `header` | Content before first `## ` |
| `workflow` | "Auto-Pilot Workflow", "Workflow", "Development Workflow" |
| `documentation` | "Documentation & Knowledge Base", "Knowledge Base", "Docs" |
| `structure` | "Project Structure & Architecture", "Project Structure", "Architecture" |
| `environment` | "Development Environment", "Environment", "Setup" |
| `standards` | "Coding Standards", "Code Standards", "The Gold Standard" |
| `domain` | "Domain Specifics", "Non-Negotiables", "Project Rules" |
| `footer` | Content after last recognized section |

## Merge Modes

### Mode 1: Section-Level Merge (Default)

Compare sections individually and decide per-section:

```
For each section:
  IF section exists in BOTH existing AND new:
    -> Compare content
    -> If identical: Keep as-is
    -> If different: Ask user preference (see Conflict Resolution)

  IF section exists ONLY in existing:
    -> Preserve (user customization)
    -> Mark with comment: <!-- Preserved from previous version -->

  IF section exists ONLY in new:
    -> Add to output
    -> Mark with comment: <!-- Added by generator -->
```

### Mode 2: Smart Merge (Line-Level)

For sections that exist in both versions, perform line-level analysis:

```
1. Identify "generated" vs "custom" content:
   - Generated: Matches template patterns exactly
   - Custom: User-added bullet points, rules, or text

2. Merge strategy:
   - Keep ALL custom content
   - Update generated content with new values
   - Add new generated content at appropriate positions
```

### Mode 3: Full Replace (User-Requested)

When user explicitly requests full replacement:
1. Create backup: `CLAUDE.md.backup`
2. Generate completely new file
3. Show diff summary to user

## Conflict Resolution

### Presenting Conflicts

When content differs, present to user:

```
Section "Development Environment" has differences:

EXISTING:
```bash
docker compose exec app php artisan migrate
docker compose exec app vendor/bin/pint
```

NEW (detected):
```bash
docker compose exec php php artisan migrate
docker compose exec php ./vendor/bin/pint
```

Options:
1. Keep existing (preserve your customizations)
2. Use new (update to detected values)
3. Merge (keep both, you'll edit manually)
4. Skip (leave this section unchanged, continue)
```

### Auto-Resolution Rules

Some conflicts can be auto-resolved:

| Pattern | Resolution |
|---------|------------|
| Version number update only | Use new (e.g., PHP 8.2 -> 8.3) |
| Path change (same command) | Ask user (may be intentional) |
| Added new items to list | Merge (append new to existing) |
| Removed items from list | Ask user (may be intentional removal) |
| Formatting-only changes | Use new |

## Customization Detection

### Markers for Custom Content

Look for these patterns to identify user customizations:

```markdown
<!-- CUSTOM: reason -->
Content here
<!-- /CUSTOM -->

<!-- User-added section -->

<!-- Do not auto-update this section -->

# My Custom Section
(Any section not in standard template)
```

### Implicit Custom Content

Content is likely custom if:
1. Not present in any template file
2. Added after initial generation date (if tracked)
3. Contains project-specific terminology not in detection
4. Has different formatting than templates

## Merge Algorithm

```python
def merge_files(existing: dict, new: dict) -> dict:
    result = {}
    conflicts = []

    # 1. Process header
    result['header'] = merge_header(existing.get('header'), new.get('header'))

    # 2. Process standard sections in order
    for section in STANDARD_SECTIONS:
        existing_content = existing.get(section)
        new_content = new.get(section)

        if existing_content and new_content:
            if content_is_same(existing_content, new_content):
                result[section] = existing_content
            else:
                conflicts.append({
                    'section': section,
                    'existing': existing_content,
                    'new': new_content
                })
        elif existing_content:
            result[section] = existing_content  # Preserve
        elif new_content:
            result[section] = new_content  # Add new

    # 3. Preserve custom sections
    for section, content in existing.items():
        if section not in STANDARD_SECTIONS and section not in result:
            result[section] = content

    # 4. Process footer
    result['footer'] = merge_footer(existing.get('footer'), new.get('footer'))

    return result, conflicts
```

## Output Format

### Updated File Structure

```markdown
# AI Agent Guidelines & Repository Manual

**Role:** [Updated or preserved role]

<!-- Last updated: YYYY-MM-DD by agents-md-generator -->
<!-- Sections marked with 'Preserved' contain user customizations -->

## 1. The "Auto-Pilot" Workflow
[Content]

## 2. Documentation & Knowledge Base
<!-- Preserved from previous version -->
[User's custom documentation paths]

## 3. Project Structure & Architecture
[Updated structure from new scan]

## 4. Development Environment
[Content]

## 5. Coding Standards
[Content]

## 6. Domain Specifics
<!-- Preserved from previous version -->
[User's custom domain rules]

## 7. My Custom Section
<!-- User-added section (preserved) -->
[User's custom content]

---
*This file is the primary instruction set for AI agents.*
```

### Change Summary

After merge, provide summary:

```
Update Summary:
--------------
Sections updated: 3
  - Workflow: Version numbers updated
  - Structure: New folders detected
  - Environment: Container name changed

Sections preserved: 2
  - Documentation: Custom paths kept
  - Domain Specifics: Custom rules kept

Sections added: 0

Conflicts resolved: 1
  - Environment: User chose 'Keep existing'

Custom sections preserved: 1
  - My Custom Section

Total changes: 4 lines added, 2 lines modified, 0 lines removed
```

## Backup Strategy

### Before Any Merge

1. Create timestamped backup:
   ```
   CLAUDE.md.backup.2024-01-15T10-30-00
   ```

2. Keep last 3 backups, remove older ones

3. If merge fails, offer restore:
   ```
   Merge failed. Would you like to:
   1. Restore from backup
   2. Keep partial merge
   3. Start fresh
   ```

### Backup Location Options

```
Option 1: Same directory (default)
  CLAUDE.md.backup

Option 2: Hidden backup directory
  .claude-backups/
    CLAUDE.md.2024-01-15

Option 3: Git-based (if git repo)
  Commit current state before changes
  User can git checkout to restore
```

## Edge Cases

### Empty Sections

If a section exists but is empty:
- Existing empty + New has content = Use new
- Existing has content + New empty = Preserve existing (warn user)
- Both empty = Remove section

### Malformed Files

If existing file has parsing errors:
1. Attempt best-effort parse
2. Show warning to user
3. Offer options:
   - Continue with partial merge
   - Full replace (with backup)
   - Cancel and let user fix manually

### Very Large Files

If file exceeds reasonable size (>500 lines):
1. Warn user about large file
2. Offer section-by-section review
3. Show progress during merge

### No Standard Sections Found

If existing file doesn't match expected structure:
1. Treat entire file as "custom content"
2. Place at end of new generated file
3. Ask user to reorganize manually
