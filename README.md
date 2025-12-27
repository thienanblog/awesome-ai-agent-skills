# Awesome AI Agent Skills

A community-shared collection of reusable skills for AI coding agents. Works with Claude Code, OpenAI Codex, and any AI tools that support the SKILL format.

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
# Install a specific skill
/plugin install documentation-guidelines@awesome-ai-agent-skills

# Install another skill
/plugin install laravel-11-12-app-guidelines@awesome-ai-agent-skills
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

| Skill | Description |
|-------|-------------|
| [documentation-guidelines](./skills/documentation-guidelines) | Write or update backend feature documentation following DOCUMENTATION_GUIDELINES.md. Use for module docs, API contracts, and backend documentation with architecture, endpoints, payloads, Mermaid diagrams, and seeding instructions. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Guidelines for Laravel 11/12 applications across common stacks (API-only or full-stack), including Docker Compose/Sail, Inertia + React, Livewire, Vue, Blade, Tailwind v4, Fortify, Wayfinder, PHPUnit, Pint, and Laravel Boost MCP tools. |

## Contributing

### Adding a New Skill

1. Fork this repository
2. Create a new folder in `skills/` with your skill name (use kebab-case)
3. Add a `SKILL.md` file with the required metadata header:
   ```yaml
   ---
   name: your-skill-name
   description: Brief description of what the skill does and when to use it.
   ---
   ```
4. Add reference documentation in a `references/` subfolder if needed
5. Submit a pull request
6. Maintainer will scan and update the marketplace

### Skill Structure

```
skills/
  your-skill-name/
    SKILL.md              # Required: Skill definition with metadata
    references/           # Optional: Reference documentation
      your-reference.md
    assets/               # Optional: Images, templates, etc.
    scripts/              # Optional: Helper scripts
```

### Skill Metadata Requirements

The `SKILL.md` must include a YAML frontmatter with:
- `name`: Skill identifier (should match folder name)
- `description`: Clear description of what the skill does and when to use it

### Quality Guidelines

- **Clear Purpose**: Solve a specific, well-defined problem
- **Actionable Instructions**: Include step-by-step workflows
- **Reference Documentation**: Provide detailed references for complex topics
- **Universal Compatibility**: Write instructions that work across different AI tools

## For AI Agents

See [CLAUDE.md](./CLAUDE.md) (or [AGENTS.md](./AGENTS.md)) for instructions on how to work with this repository, including how to scan and update the marketplace when new skills are added.

## Compatibility

This skill format is designed to be universal and works with:
- Claude Code (Anthropic)
- OpenAI Codex
- GitHub Copilot (with custom instructions)
- Any AI coding assistant that supports custom instructions or skills

## License

MIT
