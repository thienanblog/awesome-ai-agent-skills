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
/plugin install documentation-skills@awesome-ai-agent-skills

# Install another plugin
/plugin install laravel-app-skills@awesome-ai-agent-skills
```

**Updating the marketplace**

```
/plugin marketplace update
```

### OpenAI Codex / Other AI Tools

Clone or reference this repository and point your AI tool to the `skills/` directory. Each skill follows a standard format with `SKILL.md` containing the instructions.

```bash
git clone https://github.com/thienanblog/awesome-ai-agent-skills.git
```

### Manual Usage

You can also copy individual skill instructions directly into your AI agent's context or system prompt.

## Available Skills

<!-- SKILLS_TABLE_START -->
| Skill | Description |
|-------|-------------|
| [agents-md-generator](./skills/agents-md-generator) | Generate or update CLAUDE.md/AGENTS.md files for AI coding agents through auto-scanning project files combined with interactive Q&A. Supports multiple tech stacks, development environments, and preserves customizations when updating. |
| [docker-local-dev](./skills/docker-local-dev) | Generate Docker Compose and Dockerfile configurations for local development through interactive Q&A. Supports PHP/Laravel, WordPress, Drupal, Joomla, Node.js, and Python stacks with Nginx, Supervisor/PM2, databases, Redis, and email testing. Always asks clarifying questions before generating configurations. |
| [documentation-guidelines](./skills/documentation-guidelines) | Write or update backend feature documentation that follows a repo's DOCUMENTATION_GUIDELINES.md (or equivalent) across any project. Use when asked to create/update module docs, API contracts, or backend documentation that must include architecture, endpoints, payloads, Mermaid diagrams, and seeding instructions. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Guidelines and workflow for working on Laravel 11 or Laravel 12 applications across common stacks (API-only or full-stack), including optional Docker Compose/Sail, Inertia + React, Livewire, Vue, Blade, Tailwind v4, Fortify, Wayfinder, PHPUnit, Pint, and Laravel Boost MCP tools. Use when implementing features, fixing bugs, or making UI/backend changes while following project-specific instructions (AGENTS.md, docs/). |
<!-- SKILLS_TABLE_END -->

## Plugin Groups

Plugins bundle related skills so you can install by domain. The source of truth is `plugin-groups.json`.

| Plugin | Description | Skills |
|--------|-------------|--------|
| [documentation-skills](./plugins/documentation-skills) | Skills for authoring AI agent instructions and backend documentation. | [agents-md-generator](./skills/agents-md-generator)<br>[documentation-guidelines](./skills/documentation-guidelines) |
| [laravel-app-skills](./plugins/laravel-app-skills) | Guidelines for building Laravel 11/12 apps across common stacks and tooling. | [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) |

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
4. **Validate locally before pushing:**
   ```bash
   npm install
   npm run validate
   ```
5. Submit a pull request

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed guidelines, validation instructions, and troubleshooting.

## For AI Agents

See [CLAUDE.md](./CLAUDE.md) (or [AGENTS.md](./AGENTS.md)) for instructions on how to work with this repository, including how to group skills into plugins and update the marketplace when new skills are added.

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
