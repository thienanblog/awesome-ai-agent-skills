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

## Neutral Skill Editing

When reviewing, creating, or updating a skill under `skills/`, keep the editing
process neutral:

- Treat the target skill as an artifact to evaluate, not as a workflow to
  execute merely because it is being edited.
- Do not load, invoke, or follow any other skill from this repository during the
  edit. In particular, do not let a sibling skill determine the target skill's
  content, structure, delegation model, or verification workflow.
- Use only the user request, repository instructions, the target skill's own
  intended behavior, relevant source files, and repository validators as the
  basis for the change.
- Compare against another repository skill only when the user explicitly asks
  for that comparison; inspect it as source material without activating it.

Repository scripts such as `npm run sync` and `npm run validate` remain the
required source-of-truth and verification tools for skill changes.

## Source of Truth and Generated Files

- Author skill content only in `skills/<skill-name>/`.
- Use `plugin-groups.json` as the source of truth for plugin membership and identity: the marketplace `owner`, plus each plugin's `name`, `displayName`, `description`, and `skills`.
- Use `scripts/lib/plugin-shape.js` as the single definition of every generated marketplace and manifest shape. `sync` writes those shapes; `validate` regenerates and diffs them. Change the shape there, never in a generated file.
- Treat `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/**`, and generated README tables as outputs of `npm run sync`.
- Do not edit `plugins/<plugin-name>/**` directly; those folders are generated plugin packages (Claude Code and Codex) built from `skills/`.
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
- Each plugin requires: `name` (ending with `-skills`), `source: "./plugins/<plugin-name>"`, `description`, and `version` (matching `package.json`)

Each entry points at a real plugin package rather than the repository root, so Claude Code copies only that package into its plugin cache and discovers the bundled `skills/` directory. Keeping `version` in sync with `package.json` pins installs to a release instead of falling back to the git commit SHA.

**Schema compatibility is a hard constraint.** Claude Code rejects unrecognized manifest keys outright, so a key added in a newer release breaks the entire marketplace for anyone on an older client. The generated shapes therefore stay on keys accepted across releases in the wild: the marketplace description and version live under `metadata` (not top-level), and no entry carries `displayName`, `$schema`, or `renames`.

This is enforced structurally, not by a list of banned keys. `scripts/lib/plugin-shape.js` is the single definition of every generated shape; `npm run validate` regenerates each file and diffs it against what is committed, so *any* extra or changed key fails the build. Before adding a key, confirm it is accepted by running `claude plugin validate .` and `claude plugin validate ./plugins/<plugin-name>` on the oldest Claude Code you intend to support.

### 4. Update plugin packages and the Codex marketplace
Update `.agents/plugins/marketplace.json` and `plugins/<plugin-name>/` from `plugin-groups.json`:
- Each plugin package lives in `plugins/<plugin-name>/` and serves both agents
- Each package requires `.claude-plugin/plugin.json` (Claude Code) and `.codex-plugin/plugin.json` (Codex)
- The Codex manifest uses `skills: "./skills/"`; Claude Code scans `skills/` by default
- Each plugin bundles copies of its skill folders under `plugins/<plugin-name>/skills/`
- Each Codex marketplace entry points to `./plugins/<plugin-name>` and includes `policy.installation`, `policy.authentication`, and `category`

Use `npm run sync` to regenerate these files instead of editing generated plugin packages manually.

### 5. Update README.md
Update the "Available Skills" table in `README.md` to match the current skills.

### 6. Report Changes
Report to the user:
- New skills added
- Skills removed (if any were deleted)
- Any skills with missing or invalid metadata

### Example Update

If a new skill `api-testing` is added to `skills/api-testing/SKILL.md`, assign it to a plugin in `plugin-groups.json`:

```json
{
  "owner": {
    "name": "Ân Vũ",
    "email": "8651688+thienanblog@users.noreply.github.com"
  },
  "plugins": [
    {
      "name": "project-development-skills",
      "displayName": "Project Development Skills",
      "description": "A cohesive workflow bundle for project setup, ...",
      "skills": ["project-development-mindset", "api-testing"]
    }
  ]
}
```

Then run `npm run sync`. The generated `.claude-plugin/marketplace.json` looks like this:

```json
{
  "name": "awesome-ai-agent-skills",
  "owner": {
    "name": "Ân Vũ",
    "email": "8651688+thienanblog@users.noreply.github.com"
  },
  "metadata": {
    "description": "Community-shared skills for AI coding agents",
    "version": "1.19.1"
  },
  "plugins": [
    {
      "name": "project-development-skills",
      "source": "./plugins/project-development-skills",
      "description": "A cohesive workflow bundle for project setup, source-of-truth development, reviewable multi-slice delivery, UI/UX concept implementation, testing, debugging, performance, documentation, design systems, and production deployment planning.",
      "version": "1.19.1",
      "author": {
        "name": "Ân Vũ",
        "email": "8651688+thienanblog@users.noreply.github.com"
      },
      "homepage": "https://github.com/thienanblog/awesome-ai-agent-skills",
      "repository": "https://github.com/thienanblog/awesome-ai-agent-skills",
      "license": "MIT",
      "keywords": ["claude-code", "agent-skills", "project-development-mindset"],
      "category": "productivity"
    }
  ]
}
```

The matching `plugins/project-development-skills/.claude-plugin/plugin.json`:

```json
{
  "name": "project-development-skills",
  "version": "1.19.1",
  "description": "A cohesive workflow bundle for project setup, source-of-truth development, reviewable multi-slice delivery, UI/UX concept implementation, testing, debugging, performance, documentation, design systems, and production deployment planning.",
  "author": {
    "name": "Ân Vũ",
    "email": "8651688+thienanblog@users.noreply.github.com"
  },
  "homepage": "https://github.com/thienanblog/awesome-ai-agent-skills",
  "repository": "https://github.com/thienanblog/awesome-ai-agent-skills",
  "license": "MIT",
  "keywords": ["claude-code", "agent-skills", "project-development-mindset"]
}
```

**Note:** Contributors can group related skills in one plugin (like Anthropic's `document-skills` with xlsx, docx, pptx, pdf). Update `plugin-groups.json` to add multiple skills to the same plugin.

## Current Skills

| Skill                        | Path                                   | Description                                                        |
|------------------------------|----------------------------------------|--------------------------------------------------------------------|
| agents-md-generator          | `./skills/agents-md-generator`         | Create concise repository instructions using deterministic discovery |
| debugging-workflow           | `./skills/debugging-workflow`          | Reproduce, isolate, and fix bugs without guessing                  |
| design-system-generator      | `./skills/design-system-generator`     | Generate project-specific DESIGN_SYSTEM.md files                   |
| docker-local-dev             | `./skills/docker-local-dev`            | Generate Docker local development environments                     |
| documentation-guidelines     | `./skills/documentation-guidelines`    | Backend feature documentation following DOCUMENTATION_GUIDELINES.md |
| laravel-11-12-app-guidelines | `./skills/laravel-11-12-app-guidelines`| Laravel 11/12 application development guidelines                   |
| office-web-ui-system         | `./skills/office-web-ui-system`        | Design and refactor office-style admin web interfaces              |
| performance-optimization     | `./skills/performance-optimization`    | Diagnose and improve performance with measurements                 |
| project-development-mindset  | `./skills/project-development-mindset` | Universal developer mindset and project workflow guide             |
| run-reviewable-subtask-loop  | `./skills/run-reviewable-subtask-loop` | Deliver large changes as right-sized, reviewable, testable slices  |
| testing-verification         | `./skills/testing-verification`        | Plan, add, repair, and run tests and verification                  |
| ui-ux-concept-implementation | `./skills/ui-ux-concept-implementation`| Implement UI from selected concepts or reference websites          |
| video-router                 | `./skills/video-router`                | Route video briefs before production begins                        |
| vps-docker-traefik-deploy    | `./skills/vps-docker-traefik-deploy`   | Plan and implement secure Docker/Traefik VPS deployments           |

## GitHub CI Validation

This repository uses GitHub Actions for automated validation and syncing:

### On Pull Requests (validate-pr.yml)
- Runs `npm run validate` to check:
  - Each skill folder has a valid `SKILL.md`
  - YAML frontmatter contains required `name` and `description` fields
  - YAML frontmatter does not contain `author`
  - Skill frontmatter does not contain `context: fork` or `agent`, which would
    execute the skill through a subagent without runtime user consent
  - Every skill defaults to the main conversation, warns that delegation can
    increase usage, requires approval for the proposed agent count and scope,
    and asks again before expanding that approved scope
  - Every skill in `skills/` is assigned to exactly one plugin in `plugin-groups.json`, and each plugin has an `owner`, `displayName`, and `description`
  - Every generated file (both marketplaces, every `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`) byte-matches what `npm run sync` would write — this is what catches hand-edits and newer-only schema keys
  - `package.json` and both root version fields in `package-lock.json` match
  - Bundled skills under `plugins/<plugin-name>/skills/` match their canonical `skills/<skill-name>/` source
  - No stale plugin packages remain under `plugins/`
- If validation fails, a comment is added to the PR with common issues

### On Merge to Main (sync-marketplace.yml)
- Automatically runs `npm run sync` to:
  - Scan all skills in `skills/` folder
  - Update Claude and Codex marketplace files based on `plugin-groups.json`
  - Update plugin packages under `plugins/`
  - Update the skills table in `README.md`
  - Commit and push changes if any

### Local Validation Commands
Before pushing changes, always run:
```bash
npm run sync       # Update marketplace files, plugin packages, and README.md
npm run validate   # Check skill structure, marketplace files, and plugin packages
npm run test:agent-context # Test deterministic discovery and native fallback behavior
```

Then confirm against Claude Code's own validator, which catches schema keys `npm run validate` does not know about:
```bash
claude plugin validate .
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

## Releasing

`package.json` `version` is the single source of truth for the release version. Bump it first, then run `npm run sync` so it propagates into `.claude-plugin/marketplace.json` (both `metadata.version` and every plugin entry) and into each generated plugin manifest. `npm run validate` fails when these drift.

Because plugin entries carry an explicit `version`, users only receive an update when the version changes. Skipping the bump means published skill changes never reach installed users.

## Commit and PR Conventions

- When asked to commit, use one of these prefixes: `feat`, `bug`, `chore`, or `refactor`.
- When asked to open a pull request, create it (prefer `gh` if available) and follow the repo's PR template or guidance.
