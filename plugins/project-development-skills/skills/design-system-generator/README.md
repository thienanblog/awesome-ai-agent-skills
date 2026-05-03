# design-system-generator

Generates a project-specific `DESIGN_SYSTEM.md` so UI/UX stays consistent across pages, components, and teams.

## What this skill produces

- `DESIGN_SYSTEM.md` (primary output)
- Optional:
  - `tokens.css` (CSS variables)
  - `design-tokens.json` (token export)
  - Example manifest snippet / guidance (cache-busting)

## What this skill optimizes for

- Component-based design that works in:
  - SPAs (React/Vue/Svelte/Angular)
  - Traditional server-rendered sites (Laravel/Rails/Django/WordPress)
  - Hybrid setups
- Accessibility defaults (focus, keyboard, contrast, reduced motion)
- Production readiness (hashed assets + manifest, minification, image optimization)

## Where to place outputs

- `DESIGN_SYSTEM.md` → repo root
- Optional token files:
  - `styles/tokens.css`
  - `styles/design-tokens.json`

## Integration requirement

`AGENTS.md` and/or `CLAUDE.md` must reference `DESIGN_SYSTEM.md` with the required snippet:

```markdown
## Design System
All UI components and pages must follow `DESIGN_SYSTEM.md`:
- Use design tokens (no hardcoded colors/sizes).
- Implement component states (hover/focus/disabled/loading/error).
- Meet accessibility and performance requirements.
```

## Related skills

- `agents-md-generator` - Generates `AGENTS.md`/`CLAUDE.md` and can delegate to this skill for Design System generation
