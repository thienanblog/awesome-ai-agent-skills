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

Do not add `author` to skill frontmatter. This repository only tracks the required `name` and `description` fields for skills.

## Source of Truth and Generated Files

- Author skill content only in `skills/<skill-name>/`.
- Use `plugin-groups.json` as the source of truth for which installable plugin bundle owns each skill.
- Treat `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/**`, and generated README tables as outputs of `npm run sync`.
- Do not edit `plugins/<plugin-name>/skills/**` directly; those folders are Codex plugin package copies generated from `skills/`.
- Do not duplicate a skill under multiple plugin groups. If two skills overlap, merge the unique guidance into one canonical skill folder and keep exactly one plugin assignment.

## Scanning and Updating Marketplace

When the user asks to "scan and update marketplace" or "update marketplace.json", follow this workflow:

### 1. Scan Skills Folder
Scan all directories in `skills/` that contain a `SKILL.md` file.

### 2. Parse Skill Metadata
For each `SKILL.md`, extract the `name` and `description` from the YAML frontmatter.

### 3. Update Claude marketplace.json
Update `.claude-plugin/marketplace.json`:
- Keep the existing `name`, `owner`, and `metadata` sections
- Update the `plugins` array based on `plugin-groups.json` so each plugin can contain multiple related skills
- Each plugin requires: `name` (ending with `-skills`), `description`, `source: "./"`, `strict: false`, and a `skills` array
- The `skills` array lists the skill paths for that plugin

This repository uses `strict: false` with explicit `skills` lists so the marketplace entry defines each installable skill bundle.

### 4. Update Codex marketplace and plugins
Update `.agents/plugins/marketplace.json` and `plugins/<plugin-name>/` from `plugin-groups.json`:
- Each Codex plugin lives in `plugins/<plugin-name>/`
- Each Codex plugin requires `.codex-plugin/plugin.json`
- Each plugin manifest uses `skills: "./skills/"`
- Each plugin bundles copies of its skill folders under `plugins/<plugin-name>/skills/`
- Each marketplace entry points to `./plugins/<plugin-name>` and includes `policy.installation`, `policy.authentication`, and `category`

Use `npm run sync` to regenerate these files instead of editing generated plugin packages manually.

### 5. Update README.md
Update the "Available Skills" table in `README.md` to match the current skills.

### 6. Report Changes
Report to the user:
- New skills added
- Skills removed (if any were deleted)
- Any skills with missing or invalid metadata

### Example Update

If a new skill `api-testing` is added to `skills/api-testing/SKILL.md`, update `plugin-groups.json` and add or extend the matching plugin entry:

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
      "name": "project-development-skills",
      "description": "A cohesive workflow bundle for project setup, documentation, design systems, and production deployment planning.",
      "source": "./",
      "strict": false,
      "skills": [
        "./skills/project-development-mindset",
        "./skills/agents-md-generator",
        "./skills/documentation-guidelines",
        "./skills/design-system-generator",
        "./skills/vps-docker-traefik-deploy"
      ]
    },
    {
      "name": "laravel-app-skills",
      "description": "Guidelines for building Laravel 11/12 apps across common stacks and tooling.",
      "source": "./",
      "strict": false,
      "skills": [
        "./skills/laravel-11-12-app-guidelines"
      ]
    }
  ]
}
```

**Note:** Contributors can group related skills in one plugin (like Anthropic's `document-skills` with xlsx, docx, pptx, pdf). Update `plugin-groups.json` to add multiple skills to the same plugin.

## Current Skills

| Skill                        | Path                                   | Description                                                        |
|------------------------------|----------------------------------------|--------------------------------------------------------------------|
| agents-md-generator          | `./skills/agents-md-generator`         | Generate or update CLAUDE.md/AGENTS.md files for AI coding agents |
| design-system-generator      | `./skills/design-system-generator`     | Generate project-specific DESIGN_SYSTEM.md files                   |
| docker-local-dev             | `./skills/docker-local-dev`            | Generate Docker local development environments                     |
| documentation-guidelines     | `./skills/documentation-guidelines`    | Backend feature documentation following DOCUMENTATION_GUIDELINES.md |
| laravel-11-12-app-guidelines | `./skills/laravel-11-12-app-guidelines`| Laravel 11/12 application development guidelines                   |
| office-web-ui-system         | `./skills/office-web-ui-system`        | Design and refactor office-style admin web interfaces              |
| project-development-mindset  | `./skills/project-development-mindset` | Universal developer mindset and project workflow guide             |
| vps-docker-traefik-deploy    | `./skills/vps-docker-traefik-deploy`   | Plan and implement secure Docker/Traefik VPS deployments           |

## GitHub CI Validation

This repository uses GitHub Actions for automated validation and syncing:

### On Pull Requests (validate-pr.yml)
- Runs `npm run validate` to check:
  - Each skill folder has a valid `SKILL.md`
  - YAML frontmatter contains required `name` and `description` fields
  - YAML frontmatter does not contain `author`
  - All skills in `skills/` are listed in a plugin's `skills` array
  - Each plugin has `source: "./"` and a valid `skills` array
  - Codex plugin packages exist under `plugins/` and match `plugin-groups.json`
- If validation fails, a comment is added to the PR with common issues

### On Merge to Main (sync-marketplace.yml)
- Automatically runs `npm run sync` to:
  - Scan all skills in `skills/` folder
  - Update Claude and Codex marketplace files based on `plugin-groups.json`
  - Update Codex plugin packages under `plugins/`
  - Update the skills table in `README.md`
  - Commit and push changes if any

### Local Validation Commands
Before pushing changes, always run:
```bash
npm run sync       # Update marketplace files, Codex plugins, and README.md
npm run validate   # Check skill structure, marketplace files, and Codex plugins
```

## Quality Guidelines for New Skills

When reviewing or creating skills:

1. **Clear Purpose**: The skill should solve a specific, well-defined problem
2. **Actionable Instructions**: Include step-by-step workflows, not just descriptions
3. **Reference Documentation**: Provide detailed references for complex topics
4. **Consistent Naming**: Use kebab-case for folder and skill names
5. **Complete Metadata**: Always include `name` and `description` in YAML frontmatter, and do not include `author`
6. **Universal Compatibility**: Write instructions that work across different AI tools, avoid tool-specific syntax when possible

## Post-Task Workflow

After completing any task that modifies skills, plugins, or documentation:

1. **Re-read context files** to ensure documentation is synchronized:
   - `CLAUDE.md` - Check if instructions need updating
   - `README.md` - Verify skills table and plugin groups are current
   - Any skill-specific documentation that was modified

2. **Sync marketplace** if skills were added, removed, modified, or regrouped:
   ```bash
   npm run sync
   ```

3. **Run validation** to catch any issues:
   ```bash
   npm run validate
   ```

## Commit and PR Conventions

- When asked to commit, use one of these prefixes: `feat`, `bug`, `chore`, or `refactor`.
- When asked to open a pull request, create it (prefer `gh` if available) and follow the repo's PR template or guidance.
