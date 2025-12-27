# AI Agent Instructions

This repository is a **community-shared skill library** for AI coding agents. It works with any AI coding tool that supports skills or custom instructions:

- Claude Code (Anthropic)
- OpenAI Codex
- Cursor
- Kilo Code
- GitHub Copilot
- Windsurf
- And any other AI coding assistant

## Repository Purpose

This is a universal, community-driven skill library. Skills are self-contained instruction sets that teach AI agents specific workflows, guidelines, or capabilities. The format is designed to be tool-agnostic and work across different AI platforms.

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
- Keep the existing `name`, `owner`, and `metadata` sections
- Update the `plugins` array - each skill is a separate plugin entry
- Each plugin entry requires: `name`, `source`, `description`, and `strict: false`

### 4. Update README.md
Update the "Available Skills" table in `README.md` to match the current skills.

### 5. Report Changes
Report to the user:
- New skills added
- Skills removed (if any were deleted)
- Any skills with missing or invalid metadata

### Example Update

If a new skill `api-testing` is added to `skills/api-testing/SKILL.md`, add a new plugin entry:

```json
{
  "name": "awesome-ai-agent-skills",
  "owner": {
    "name": "Ân Vũ",
    "email": "8651688+thienanblog@users.noreply.github.com"
  },
  "metadata": {
    "description": "Community-shared skills for AI coding agents",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "documentation-guidelines",
      "source": "./skills/documentation-guidelines",
      "description": "Backend feature documentation following DOCUMENTATION_GUIDELINES.md",
      "strict": false
    },
    {
      "name": "laravel-11-12-app-guidelines",
      "source": "./skills/laravel-11-12-app-guidelines",
      "description": "Laravel 11/12 application development guidelines",
      "strict": false
    },
    {
      "name": "api-testing",
      "source": "./skills/api-testing",
      "description": "Description from SKILL.md frontmatter",
      "strict": false
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
6. **Universal Compatibility**: Write instructions that work across different AI tools, avoid tool-specific syntax when possible
