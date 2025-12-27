# Awesome AI Agent Skills

Community-shared skills for Claude Code and other AI agents.

## Installation

Use the Claude Code Skill Installer to install skills from this repository:

```bash
# Install all skills from this repository
claude skill install github:thienanblog/awesome-ai-agent-skills

# Or install a specific skill
claude skill install github:thienanblog/awesome-ai-agent-skills/skills/documentation-guidelines
```

## Available Skills

| Skill | Description |
|-------|-------------|
| [documentation-guidelines](./skills/documentation-guidelines) | Write or update backend feature documentation that follows a repo's DOCUMENTATION_GUIDELINES.md. Use for module docs, API contracts, and backend documentation with architecture, endpoints, payloads, Mermaid diagrams, and seeding instructions. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Guidelines for Laravel 11/12 applications across common stacks (API-only or full-stack), including Docker Compose/Sail, Inertia + React, Livewire, Vue, Blade, Tailwind v4, Fortify, Wayfinder, PHPUnit, Pint, and Laravel Boost MCP tools. |

## Contributing

### Adding a New Skill

1. Create a new folder in `skills/` with your skill name (use kebab-case)
2. Add a `SKILL.md` file with the required metadata header:
   ```yaml
   ---
   name: your-skill-name
   description: Brief description of what the skill does and when to use it.
   ---
   ```
3. Add reference documentation in a `references/` subfolder if needed
4. Ask the maintainer to scan and update the marketplace

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

## For AI Agents

See [CLAUDE.md](./CLAUDE.md) for instructions on how to work with this repository, including how to scan and update the marketplace when new skills are added.

## License

MIT
