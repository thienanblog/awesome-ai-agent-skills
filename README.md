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

# Install Laravel guidelines
/plugin install laravel-app-skills@awesome-ai-agent-skills

# Install Docker local development skill
/plugin install devops-skills@awesome-ai-agent-skills

# Install workflow/clarification skill
/plugin install workflow-skills@awesome-ai-agent-skills
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
| Skill | Author | Description |
|-------|--------|-------------|
| [agents-md-generator](./skills/agents-md-generator) | Official | Generate or update CLAUDE.md/AGENTS.md files for AI coding agents through auto-scanning project files combined with interactive Q&A. Supports multiple tech stacks, development environments, and preserves customizations when updating. |
| [ask-questions-if-underspecified](./skills/ask-questions-if-underspecified) | Tibo (Codex Team) | Clarify requirements before implementing. Do not use automatically, only when invoked explicitly. |
| [design-system-generator](./skills/design-system-generator) | Official | Generate a project-specific DESIGN_SYSTEM.md that enforces consistent UI/UX across SPAs, traditional server-rendered sites, and hybrid systems. Includes tokens, component rules, accessibility gates, and production asset/manifest guidance. |
| [docker-local-dev](./skills/docker-local-dev) | Official | Generate Docker Compose and Dockerfile configurations for local development through interactive Q&A. Supports PHP/Laravel, WordPress, Drupal, Joomla, Node.js, and Python stacks with Nginx, Supervisor/PM2, databases, Redis, and email testing. Always asks clarifying questions before generating configurations. |
| [documentation-guidelines](./skills/documentation-guidelines) | Official | Write or update backend feature documentation that follows a repo's DOCUMENTATION_GUIDELINES.md (or equivalent) across any project. Use when asked to create/update module docs, API contracts, or backend documentation that must include architecture, endpoints, payloads, Mermaid diagrams, and seeding instructions. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Official | Guidelines and workflow for working on Laravel 11 or Laravel 12 applications across common stacks (API-only or full-stack), including optional Docker Compose/Sail, Inertia + React, Livewire, Vue, Blade, Tailwind v4, Fortify, Wayfinder, PHPUnit, Pint, and Laravel Boost MCP tools. Use when implementing features, fixing bugs, or making UI/backend changes while following project-specific instructions (AGENTS.md, docs/). |
<!-- SKILLS_TABLE_END -->

## Plugin Groups

Plugins bundle related skills so you can install by domain. The source of truth is `plugin-groups.json`.

<!-- PLUGINS_TABLE_START -->
| Plugin | Description | Skills |
|--------|-------------|--------|
| [documentation-skills](./plugin-groups.json) | Skills for authoring AI agent instructions, backend documentation, and design systems. | [agents-md-generator](./skills/agents-md-generator)<br>[documentation-guidelines](./skills/documentation-guidelines)<br>[design-system-generator](./skills/design-system-generator) |
| [laravel-app-skills](./plugin-groups.json) | Guidelines for building Laravel 11/12 apps across common stacks and tooling. | [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) |
| [devops-skills](./plugin-groups.json) | Skills for Docker, CI/CD, and local development environment configuration. | [docker-local-dev](./skills/docker-local-dev) |
| [workflow-skills](./plugin-groups.json) | Skills for AI agent workflow and requirements clarification processes. | [ask-questions-if-underspecified](./skills/ask-questions-if-underspecified) |
<!-- PLUGINS_TABLE_END -->

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

## Known Limitations

- Claude Code currently indexes skills from the repository root, so `/skills` can list all marketplace skills even if you installed only one plugin. This is a Claude Code limitation. We follow the official Claude Skills marketplace example and keep `source: "./"` with explicit `skills` lists so plugin boundaries remain clear and other tools can scope installs properly. If `/skills` looks larger than expected, use the plugin `skills` list and the tables above as the source of truth.

## License

MIT
