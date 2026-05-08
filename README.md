# Awesome AI Agent Skills

A community-shared collection of reusable skills for AI coding agents. Works with Claude Code, Cursor, Kilo Code, Windsurf, OpenAI Codex, and any AI tools that support skills or custom instructions.

## What are Skills?

Skills are self-contained instruction sets that teach AI agents specific workflows, guidelines, or capabilities. Each skill includes:
- A `SKILL.md` with metadata and instructions
- Optional reference documentation for detailed guidance
- Reusable across any project

## Installation

### Claude Code

**Step 1: Add the marketplace**

```
/plugin marketplace add thienanblog/awesome-ai-agent-skills
```

**Step 2: Install skills**

```
# Install a plugin (can bundle multiple skills)
/plugin install project-development-skills@awesome-ai-agent-skills

# Install Laravel guidelines
/plugin install laravel-app-skills@awesome-ai-agent-skills

# Install Docker local development skill
/plugin install devops-skills@awesome-ai-agent-skills

# Install office web UI skill
/plugin install office-web-ui-skills@awesome-ai-agent-skills
```

**Updating the marketplace**

```
/plugin marketplace update
```

Claude Code marketplace entries use `source: "./"`, `strict: false`, and explicit `skills` arrays so this repository can curate multiple related skill folders into one installable plugin. See the official Claude Code docs for [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) and [plugin structure](https://code.claude.com/docs/en/plugins).

### OpenAI Codex

Add this repository as a Codex marketplace:

```bash
codex plugin marketplace add thienanblog/awesome-ai-agent-skills
```

Then install the plugin you want:

```text
codex
/plugins
```

In the plugin browser:

1. Choose the **Awesome AI Agent Skills** marketplace.
2. Open one of these plugins:
   - `project-development-skills`
   - `laravel-app-skills`
   - `devops-skills`
   - `office-web-ui-skills`
3. Select **Install plugin**.
4. Start a new thread and ask Codex normally, or type `@` to choose the plugin or one of its bundled skills explicitly.

To refresh after this repository updates:

```bash
codex plugin marketplace upgrade awesome-ai-agent-skills
```

Codex also supports installing from a local checkout while developing this repository:

```bash
git clone https://github.com/thienanblog/awesome-ai-agent-skills.git
cd awesome-ai-agent-skills
codex plugin marketplace add .
```

This repository includes a Codex-compatible marketplace at `.agents/plugins/marketplace.json` and plugin packages under `plugins/`. The layout follows OpenAI's docs: marketplace entries point at `./plugins/<plugin-name>`, plugin manifests live in `.codex-plugin/plugin.json`, and bundled skills live inside the plugin root. See OpenAI's [Plugins](https://developers.openai.com/codex/plugins) and [Build plugins](https://developers.openai.com/codex/plugins/build) docs.

### Skills CLI

The open `skills` CLI works with Codex, Claude Code, Cursor, and many other agents.

On macOS:

```bash
brew install skills
skills add thienanblog/awesome-ai-agent-skills --list
skills add thienanblog/awesome-ai-agent-skills --skill project-development-mindset
```

Without installing globally:

```bash
npx skills add thienanblog/awesome-ai-agent-skills --list
npx skills add thienanblog/awesome-ai-agent-skills --skill project-development-mindset
npx skills init my-skill
```

You can also copy individual skill instructions directly into your AI agent's context or system prompt.

## Available Skills

<!-- SKILLS_TABLE_START -->
| Skill | Description |
|-------|-------------|
| [agents-md-generator](./skills/agents-md-generator) | Generate or update CLAUDE.md/AGENTS.md files for AI coding agents through auto-scanning project files combined with interactive Q&A. Supports multiple tech stacks, development environments, and preserves customizations when updating. |
| [design-system-generator](./skills/design-system-generator) | Generate a project-specific DESIGN_SYSTEM.md that enforces consistent UI/UX across SPAs, traditional server-rendered sites, and hybrid systems. Includes tokens, component rules, accessibility gates, and production asset/manifest guidance. |
| [docker-local-dev](./skills/docker-local-dev) | Generate Docker Compose and Dockerfile configurations for local development through interactive Q&A. Supports PHP/Laravel, WordPress, Drupal, Joomla, Node.js, and Python stacks with Nginx, Supervisor/PM2, databases, Redis, and email testing. Always asks clarifying questions before generating configurations. |
| [documentation-guidelines](./skills/documentation-guidelines) | Write or update backend feature documentation that follows a repo's DOCUMENTATION_GUIDELINES.md (or equivalent) across any project. Use when asked to create/update module docs, API contracts, or backend documentation that must include architecture, endpoints, payloads, Mermaid diagrams, and seeding instructions. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Guidelines and workflow for working on Laravel 11 or Laravel 12 applications across common stacks (API-only or full-stack), including optional Docker Compose/Sail, Inertia + React, Livewire, Vue, Blade, Tailwind v4, Fortify, Wayfinder, PHPUnit, Pint, and Laravel Boost MCP tools. Use when implementing features, fixing bugs, or making UI/backend changes while following project-specific instructions (AGENTS.md, docs/). |
| [office-web-ui-system](./skills/office-web-ui-system) | Design and refactor polished office-style web app interfaces for admin, internal, and back-office products. Use when an AI agent needs to build or improve dashboards, stat cards, page heroes, filter/search bars, data tables, shells, side panels, semantic locator classes, or reusable page composition that stays portable across Vue, React, Laravel, and other web stacks with or without PrimeVue. |
| [project-development-mindset](./skills/project-development-mindset) | Universal developer mindset and project workflow guide for programming projects. Use when creating a new project, choosing or reviewing a tech stack, modifying an existing codebase, implementing features, fixing bugs, writing or updating documentation, designing architecture or folder structure, improving UI/UX consistency, adding tests, debugging errors, improving performance, preparing deployment, or working across multiple repositories. Useful for experienced developers, beginners, non-developers, founders, and anyone who needs AI assistance to build, maintain, document, test, debug, or deploy software safely. |
| [vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) | Plan and implement secure production deployments of Docker Compose applications on self-hosted VPS or cloud servers using Docker Engine, Docker Compose, Traefik, private registries, SSH tunnels, least-privilege users, persistent volumes, backups, DNS, and storage growth planning. Use when an AI agent needs to design, review, document, or execute a real deploy for websites, APIs, websockets, workers, databases, and object storage integrations on Ubuntu or Debian style Linux hosts. |
| [x-twitter-scraper](./skills/x-twitter-scraper) | Use Xquik for X/Twitter automation tasks such as tweet search, profile tweets, follower export, media download, posting tweets, replies, DMs, webhooks, and MCP workflows. |
<!-- SKILLS_TABLE_END -->

## Plugin Groups

Plugins bundle related skills so you can install by domain. The source of truth is `plugin-groups.json`.

<!-- PLUGINS_TABLE_START -->
| Plugin | Description | Skills |
|--------|-------------|--------|
| [project-development-skills](./plugin-groups.json) | A cohesive workflow bundle for project setup, documentation, design systems, and production deployment planning. | [project-development-mindset](./skills/project-development-mindset)<br>[agents-md-generator](./skills/agents-md-generator)<br>[documentation-guidelines](./skills/documentation-guidelines)<br>[design-system-generator](./skills/design-system-generator)<br>[vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) |
| [laravel-app-skills](./plugin-groups.json) | Guidelines for building Laravel 11/12 apps across common stacks and tooling. | [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) |
| [devops-skills](./plugin-groups.json) | Skills for Docker-based local development environment configuration. | [docker-local-dev](./skills/docker-local-dev) |
| [office-web-ui-skills](./plugin-groups.json) | Skills for designing and refactoring admin, internal, and back-office web interfaces. | [office-web-ui-system](./skills/office-web-ui-system) |
| [social-media-automation-skills](./plugin-groups.json) | Skills for X/Twitter data access, tweet search, posting, and social workflow automation. | [x-twitter-scraper](./skills/x-twitter-scraper) |
<!-- PLUGINS_TABLE_END -->

## Repository Cleanup

This repository has been narrowed to a smaller, cohesive set of skills that are intended to work together. Apologies to contributors whose community skills were removed during this cleanup; the goal is to keep this repository focused on quality-controlled project development workflows instead of hosting unrelated skill experiments.

## Contributing

We welcome contributions! Here's a quick start:

1. Fork this repository
2. Create a skill folder: `skills/your-skill-name/`
3. Add a `SKILL.md` with metadata:
   ```yaml
   ---
   name: your-skill-name
   description: What the skill does and when to use it.
   ---
   ```
4. Add the skill to `plugin-groups.json` so it belongs to exactly one plugin.
5. **Sync and validate locally before pushing:**
   ```bash
   npm install
   npm run sync
   npm run validate
   ```
6. Submit a pull request

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed guidelines, validation instructions, and troubleshooting.

## Validation Workflow

- `plugin-groups.json` is the source of truth for plugin membership.
- `npm run sync` regenerates `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/**`, and the generated tables in `README.md`.
- `npm run validate` checks skill metadata, plugin assignments, Claude marketplace consistency, and Codex plugin package consistency.
- Pull request CI reruns `npm run sync` and fails if generated files are out of date.

## For AI Agents

See [CLAUDE.md](./CLAUDE.md) for instructions on how to work with this repository, including how to group skills into plugins and update the marketplace when new skills are added.

## Compatibility

This skill format is designed to be universal and works with:
- Claude Code (Anthropic)
- OpenAI Codex
- Cursor
- Kilo Code
- GitHub Copilot
- Windsurf
- Any AI coding assistant that supports custom instructions or skills

## License

MIT
