# Awesome AI Agent Skills

A community-shared collection of reusable skills for AI coding agents. Works with Claude Code, Cursor, Kilo Code, Windsurf, OpenAI Codex, and any AI tools that support skills or custom instructions.

## Source of Truth

- Author skills only under `skills/<skill-name>/`.
- Assign each skill to exactly one installable bundle in `plugin-groups.json`,
  which also holds marketplace ownership, plugin metadata, and routing-safe
  Codex prompts for multi-skill bundles.
- Change generated marketplace/manifest shapes only in `scripts/lib/plugin-shape.js`.
- Treat `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/**`, and generated README tables as sync outputs.
- Do not edit `plugins/<plugin-name>/**` directly; those are generated plugin packages (Claude Code + Codex) regenerated from `skills/`.
- Run `npm run sync` after changing skills or plugin grouping, then run `npm run validate`.

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

**Claude Desktop app**

The desktop app's plugin browser (**+** → **Plugins** → **Add plugin**) only lists marketplaces you have already configured — it cannot add one. Register this marketplace first from a terminal:

```bash
claude plugin marketplace add thienanblog/awesome-ai-agent-skills
```

Then reopen the plugin browser. If any marketplace command fails with `JSON Parse error: Unexpected EOF`, your local `~/.claude/plugins/known_marketplaces.json` is corrupt; delete that file and retry.

**Layout**

Each marketplace entry points at a self-contained plugin package under `plugins/<plugin-name>/`, which carries its own `.claude-plugin/plugin.json` and bundles only that plugin's skills. Claude Code copies just that package into its plugin cache and pins it to the released `version`. See the official Claude Code docs for [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) and [plugin structure](https://code.claude.com/docs/en/plugins).

The manifests deliberately stay on the schema keys that every current Claude Code release accepts. Newer-only keys (top-level `description`/`version`, per-plugin `displayName`, `$schema`, `renames`) are rejected as unrecognized by older clients, which makes the whole marketplace fail to load rather than degrade. `scripts/lib/plugin-shape.js` is the single definition of every generated shape, and `npm run validate` regenerates and diffs each file, so any stray key fails the build.

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

The repeated skill folders under `plugins/<plugin-name>/skills/` are generated package copies shared by both agents. If they differ from `skills/<skill-name>/`, edit the canonical skill folder and rerun `npm run sync`.

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

## Usage Examples

Choose the skill that fits the task. Use the general project workflow when the
work spans several responsibilities or the right starting point is unclear:

```text
Use $project-development-mindset to implement the approved checkout redesign and verify the changed behavior.
```

Specialists can be used directly. Routine tests, documentation updates, framework
commands, and browser checks stay within the implementation task; they do not
require a routing ceremony or a fixed number of loaded skills.

```text
Use $debugging-workflow to isolate and fix this intermittent checkout failure.
Use $ui-ux-concept-implementation to implement Concept B for this pricing page.
```

For a decision before implementation:

```text
Use $brainstorm-first to compare three checkout redesign concepts, recommend one, and wait for my selection.
```

Brainstorming honors the requested option count and decision boundary. If you ask
the agent to choose and implement, it can continue within that authorization.
Reviewable delivery remains opt-in:

```text
Use $run-reviewable-subtask-loop to deliver this migration as coherent reviewed commits and one aggregate PR.
```

All bundled skills run in the main conversation by default. Delegation can increase
usage and requires explicit approval for the proposed agent count and scope. That
approval is reused within its bounds; expanding the count or scope requires fresh
approval. A request for subtasks does not authorize subagents.

## Instruction design

The skills focus on task-specific decisions, evidence, and real operating
constraints. They reuse existing authorization, ask only about material unresolved
choices, and scale verification to changed behavior and repository requirements.
They avoid fixed questionnaires, invented confidence scores, mandatory full-suite
offers, and repeated workflow handoffs.

The September 2026 revision was informed by OpenAI's
[GPT-6 Astra prompting guidance](https://developers.openai.com/api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices).
The content remains tool-agnostic: it neither selects a model nor assumes that
stronger models make verification or data/production boundaries unnecessary.
See the [audit and review notes](docs/skill-audit-2026-09.md) for per-skill changes,
compatibility notes, and the limits of validation.

## Available Skills

<!-- SKILLS_TABLE_START -->
| Skill | Description |
|-------|-------------|
| [agents-md-generator](./skills/agents-md-generator) | Create, audit, or compact repository instructions in AGENTS.md, scoped overrides, and requested tool compatibility files. Use to preserve non-obvious project rules while removing stale, duplicated, or generic guidance. |
| [brainstorm-first](./skills/brainstorm-first) | Explore and compare practical options before implementation. Use for requested brainstorming, requirements tradeoffs, diagnosis options, or UI concepts; skip when the approach is already selected. |
| [debugging-workflow](./skills/debugging-workflow) | Reproduce, isolate, and fix unexplained failures, regressions, or flaky behavior. Use when the cause is uncertain; a known-cause fix usually needs only the normal implementation workflow. |
| [design-system-generator](./skills/design-system-generator) | Create or revise a project design system covering tokens, components, accessibility, motion, and visual verification. Use when the durable design-system document is the deliverable, rather than a one-off UI edit. |
| [docker-local-dev](./skills/docker-local-dev) | Create or repair local Docker Compose services, Dockerfiles, mounts, networking, and readiness checks. Use when container configuration is the deliverable; ordinary container commands and production deployment are separate concerns. |
| [documentation-guidelines](./skills/documentation-guidelines) | Create, audit, or consolidate durable project documentation, including feature rules, contracts, workflows, and runbooks. Use when documentation is the main deliverable; routine code changes can update their owning docs directly. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Implement changes in Laravel 11 or 12 using the installed framework, frontend, and command runner. Select by composer evidence; Laravel 12-to-13 upgrades use laravel-13-app-guidelines. |
| [laravel-13-app-guidelines](./skills/laravel-13-app-guidelines) | Implement Laravel 13 changes or upgrade Laravel 12 to 13 using verified package versions and project conventions. Use only for the installed or requested major; optional framework features are not required dependencies. |
| [office-web-ui-system](./skills/office-web-ui-system) | Build or improve operational dashboards, admin tools, CRM/ERP, CRUD, reporting, and record-management interfaces. Use for dense workflows and dashboard reference matching; excludes marketing and unrelated consumer UI. |
| [performance-optimization](./skills/performance-optimization) | Measure and improve latency, resource use, queries, rendering, or build/test throughput. Use when performance is the primary problem; preserve correctness and compare equivalent workloads. |
| [project-development-mindset](./skills/project-development-mindset) | Plan and carry repository changes through implementation, verification, and handoff. Use for project work that needs a general development workflow; select specialist guidance when it adds task-specific value. |
| [run-reviewable-subtask-loop](./skills/run-reviewable-subtask-loop) | Deliver an explicitly requested multi-subtask plan as sequential reviewed and verified commits with one aggregate publication path. Use only when the user requests or accepts this workflow; subtasks do not authorize subagents. |
| [testing-verification](./skills/testing-verification) | Design or assess tests, acceptance checks, CI coverage, and browser verification. Use when verification is the main deliverable or requires specialist judgment; ordinary implementation can keep its focused checks inline. |
| [ui-ux-concept-implementation](./skills/ui-ux-concept-implementation) | Implement a selected mockup, screenshot, or visual reference in an existing project and compare the rendered result. Use when visual fidelity drives the work; use dashboard guidance for operational surfaces when it fits better. |
| [vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) | Prepare or operate production Docker Compose deployments on a VPS with Traefik, DNS, registries, persistent storage, backups, and rollback. Use for production infrastructure and releases, rather than local development. |
<!-- SKILLS_TABLE_END -->

## Plugin Groups

Plugins bundle related skills so you can install by domain. The source of truth is `plugin-groups.json`.

<!-- PLUGINS_TABLE_START -->
| Plugin | Description | Skills |
|--------|-------------|--------|
| [project-development-skills](./plugin-groups.json) | Focused development workflows for implementation, decisions, debugging, verification, documentation, UI, and deployment. Use the guidance that fits the task. | [project-development-mindset](./skills/project-development-mindset)<br>[brainstorm-first](./skills/brainstorm-first)<br>[run-reviewable-subtask-loop](./skills/run-reviewable-subtask-loop)<br>[testing-verification](./skills/testing-verification)<br>[debugging-workflow](./skills/debugging-workflow)<br>[performance-optimization](./skills/performance-optimization)<br>[agents-md-generator](./skills/agents-md-generator)<br>[documentation-guidelines](./skills/documentation-guidelines)<br>[design-system-generator](./skills/design-system-generator)<br>[ui-ux-concept-implementation](./skills/ui-ux-concept-implementation)<br>[vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) |
| [laravel-app-skills](./plugin-groups.json) | Laravel 11/12 and Laravel 13 guidance selected by installed or target framework version, with project-specific frontend and command conventions. | [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines)<br>[laravel-13-app-guidelines](./skills/laravel-13-app-guidelines) |
| [devops-skills](./plugin-groups.json) | Local Docker development configuration with project-compatible services, networking, persistence, and readiness checks. | [docker-local-dev](./skills/docker-local-dev) |
| [office-web-ui-skills](./plugin-groups.json) | Operational dashboards and back-office interfaces with clear data hierarchy, reusable components, and practical visual verification. | [office-web-ui-system](./skills/office-web-ui-system) |
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
   npm run test:agent-context
   ```
6. Submit a pull request

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed guidelines, validation instructions, and troubleshooting.

## Validation Workflow

- `plugin-groups.json` is the source of truth for plugin membership.
- `npm run sync` regenerates `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/**`, and the generated tables in `README.md`.
- `npm run validate` checks skill metadata, plugin assignments, release-version parity, generated manifests, and complete bundled-skill parity with canonical sources.
- `npm run test:agent-context` runs regression coverage for deterministic framework/tool discovery, precedence, symlink safety, and native fallback depth.
- Bump `version` in `package.json` before syncing a release; it is stamped into every plugin entry, and users only receive an update when it changes.
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
