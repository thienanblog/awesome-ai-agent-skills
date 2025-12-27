# AI Agent Instructions

This repository contains community-shared skills for Claude Code and other AI agents.

## Repository Purpose

This is a skill library repository. Skills are self-contained modules that teach AI agents specific workflows, guidelines, or capabilities.

## Skill Structure

Each skill follows this structure:
```
skills/
  skill-name/
    SKILL.md              # Required: Skill definition with YAML metadata
    references/           # Optional: Reference documentation
    assets/               # Optional: Images, templates
    scripts/              # Optional: Helper scripts
```

### SKILL.md Format

Every skill must have a `SKILL.md` with YAML frontmatter:
```yaml
---
name: skill-name
description: Brief description of what the skill does and when to use it.
---
```

## Scanning and Updating Marketplace

When the user asks to "scan and update marketplace" or "update marketplace.json", follow this workflow:

### 1. Scan Skills Folder
Scan all directories in `skills/` that contain a `SKILL.md` file.

### 2. Parse Skill Metadata
For each `SKILL.md`, extract the `name` and `description` from the YAML frontmatter.

### 3. Update marketplace.json
Update `.claude-plugin/marketplace.json`:
- Keep the existing `owner` and `metadata` sections
- Update the `skills` array in `plugins[0]` to include all discovered skills
- Use the format `./skills/skill-name` for each skill path

### 4. Report Changes
Report to the user:
- New skills added
- Skills removed (if any were deleted)
- Any skills with missing or invalid metadata

### Example Update

If a new skill `api-testing` is added to `skills/api-testing/SKILL.md`, update:

```json
{
  "plugins": [
    {
      "skills": [
        "./skills/documentation-guidelines",
        "./skills/laravel-11-12-app-guidelines",
        "./skills/api-testing"  // New skill added
      ]
    }
  ]
}
```

## Current Skills

| Skill | Path | Description |
|-------|------|-------------|
| documentation-guidelines | `./skills/documentation-guidelines` | Backend feature documentation following DOCUMENTATION_GUIDELINES.md |
| laravel-11-12-app-guidelines | `./skills/laravel-11-12-app-guidelines` | Laravel 11/12 application development guidelines |

## Quality Guidelines for New Skills

When reviewing or creating skills:

1. **Clear Purpose**: The skill should solve a specific, well-defined problem
2. **Actionable Instructions**: Include step-by-step workflows, not just descriptions
3. **Reference Documentation**: Provide detailed references for complex topics
4. **Consistent Naming**: Use kebab-case for folder and skill names
5. **Complete Metadata**: Always include `name` and `description` in YAML frontmatter
