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

For normal project work, start with the project mindset skill and let the agent
route to related skills:

```text
Use $project-development-mindset to implement the approved checkout redesign and verify the changed behavior.
```

The mindset skill inspects the repository before loading a specialist. It keeps
routine testing, documentation alignment, browser checks, framework use, and
container commands in the core workflow; when one concern becomes the primary
work, it loads at most one matching specialist and switches instead of stacking
full workflows.

`brainstorm-first` is independent. Use it before the mindset when the user asks
for three options or when an ambiguous high-impact request needs a decision. It
stops for selection; implementation then starts as a fresh mindset-coordinated
phase. Reviewable multi-subtask delivery is also intentionally opt-in and never
activates from task size or a routine plan alone.

```text
Use $brainstorm-first to create and compare three checkout redesign concepts, recommend one, and stop for my selection.
```

Laravel, Docker local-development, and office-dashboard plugins remain usable on
their own. When the mindset is installed too, their skills defer automatic
routing to it while preserving direct explicit invocation.

All bundled skills run in the main conversation by default. A skill must not spawn subagents, agent teams, or delegated parallel workers unless it first explains that they can increase usage and the user explicitly approves the proposed agent count and scope. Expanding that scope requires fresh approval.

If you want an exact workflow, invoke that skill directly:

```text
Use $ui-ux-concept-implementation to implement Concept B for this pricing page.
```

For a large migration that should remain local until aggregate review:

```text
Use $run-reviewable-subtask-loop to split this migration into right-sized, coherent subtasks that are meaningful to code, review, and test, then deliver them through one agreed aggregate PR or commit-and-push path.
```

## Available Skills

<!-- SKILLS_TABLE_START -->
| Skill | Description |
|-------|-------------|
| [agents-md-generator](./skills/agents-md-generator) | Coordinator-routed specialist for creating, auditing, compacting, or restructuring AGENTS.md, AGENTS.override.md, nested instructions, or optional CLAUDE.md compatibility files. Use after project-development-mindset identifies repository instructions as the primary deliverable, or directly when explicitly invoked or installed standalone. Do not use for routine instruction reading or a small required update accompanying code. |
| [brainstorm-first](./skills/brainstorm-first) | Independent pre-implementation workflow for explicit brainstorming, three-way comparison, reality checks, diagnosis options, UI concept generation, or ambiguous high-impact decisions. Produce exactly three practical options, recommend one, and stop for selection. Do not combine with project-development-mindset or implementation specialists before selection; do not use for ordinary fixes or an approved approach. |
| [debugging-workflow](./skills/debugging-workflow) | Coordinator-routed specialist for reproducing and isolating unexplained failures before fixing the confirmed cause. Use after project-development-mindset routes root-cause work here, or directly when explicitly invoked or installed standalone. Do not use for known-cause fixes, routine implementation test failures, test strategy, or an established performance bottleneck. |
| [design-system-generator](./skills/design-system-generator) | Coordinator-routed specialist for generating or substantially updating DESIGN_SYSTEM.md and its durable token, component, accessibility, motion, visual-QA, and asset rules. Use after project-development-mindset routes that primary deliverable here, or directly when explicitly invoked or installed standalone. Do not use for one-off UI implementation, visual polish, screenshot matching, or consuming an existing design system. |
| [docker-local-dev](./skills/docker-local-dev) | Coordinator-routed specialist for creating, repairing, or materially extending local-development Docker Compose, Dockerfiles, databases, and supporting services. Use after project-development-mindset makes local container topology the primary work, or directly when explicitly invoked or installed standalone. Do not use merely to run existing container commands, or for production deployment and VPS operations. |
| [documentation-guidelines](./skills/documentation-guidelines) | Coordinator-routed specialist for documentation architecture, broad audits, canonical ownership, module/feature docs, contracts, workflows, runbooks, or stale-content consolidation. Use after project-development-mindset makes documentation the primary deliverable, or directly when explicitly invoked or installed standalone. Do not use for routine docs alignment accompanying code or configuration changes. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Coordinator-routed implementation guidance for confirmed Laravel 11 or 12 repositories when framework conventions materially own the work. Use after project-development-mindset inspects laravel/framework, or directly when explicitly invoked or installed standalone. Never load both Laravel version skills; Laravel 12-to-13 upgrades use the Laravel 13 skill. Do not use merely for supporting Sail, Docker, test, or frontend commands. |
| [laravel-13-app-guidelines](./skills/laravel-13-app-guidelines) | Coordinator-routed implementation and upgrade guidance for confirmed Laravel 13 repositories or Laravel 12-to-13 upgrades when framework conventions materially own the work. Use after project-development-mindset inspects the installed or target laravel/framework major, or directly when explicitly invoked or installed standalone. Never load both Laravel version skills; do not use merely for supporting Docker, test, frontend, or Artisan commands. |
| [office-web-ui-system](./skills/office-web-ui-system) | Coordinator-routed implementation specialist for admin dashboards, internal tools, CRM/ERP management, back-office, CRUD, and reporting UI. Use after project-development-mindset makes an operational dashboard primary, or directly when explicitly invoked or installed standalone. Owns dashboard screenshot/reference work; do not combine with general ui-ux-concept-implementation by default. Excludes marketing and consumer UI. |
| [performance-optimization](./skills/performance-optimization) | Coordinator-routed specialist for measured latency, CPU, memory, query, payload, rendering, bundle, caching, or build/test bottlenecks. Use after project-development-mindset establishes performance as the primary work, or directly when explicitly invoked or installed standalone. Use debugging first for unexplained failures; do not use for routine performance-aware implementation. |
| [project-development-mindset](./skills/project-development-mindset) | Primary coordinator for repository implementation, diagnosis, verification, and durable changes to code, configuration, tests, or documentation. Use first for ordinary project work; inspect before routing to at most one specialist for the current primary concern. Do not use for general explanations, passive inspection with no project-work outcome, or the independent brainstorm-first decision phase unless explicitly invoked. |
| [run-reviewable-subtask-loop](./skills/run-reviewable-subtask-loop) | Explicit-opt-in delivery specialist for executing a large plan, migration, refactor, or roadmap as sequential reviewable commits on one integration branch. Use only when directly requested or explicitly accepted after a project-development-mindset proposal; never infer activation from size, an internal plan, or the word subtask. Subtasks are not subagents; delegation and Remote CI require separate approval. |
| [testing-verification](./skills/testing-verification) | Coordinator-routed specialist when test strategy, coverage, QA, acceptance verification, CI-check design, browser verification, Playwright E2E, or visual comparison is the primary work. Use after project-development-mindset routes here, or directly when explicitly invoked or installed standalone. Do not use merely because implementation needs focused tests; unexplained failures route to debugging first. |
| [ui-ux-concept-implementation](./skills/ui-ux-concept-implementation) | Coordinator-routed implementation specialist for a selected UI concept, single mockup/screenshot, visual reference, or reference site. Use after project-development-mindset makes visual matching primary, or directly when explicitly invoked or installed standalone. Multiple unselected concepts use independent brainstorm-first; operational dashboards use office-web-ui-system when available. Do not use for routine UI edits or supporting browser checks. |
| [vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) | Coordinator-routed specialist for production Docker Compose deployment on self-hosted VPS or cloud servers with Traefik, DNS, registries, storage, backups, rollback, and host hardening. Use after project-development-mindset makes production deployment primary, or directly when explicitly invoked or installed standalone. Do not use for local Docker development, deployment-adjacent app changes, or generic cloud hosting. |
<!-- SKILLS_TABLE_END -->

## Plugin Groups

Plugins bundle related skills so you can install by domain. The source of truth is `plugin-groups.json`.

<!-- PLUGINS_TABLE_START -->
| Plugin | Description | Skills |
|--------|-------------|--------|
| [project-development-skills](./plugin-groups.json) | A coordinator-first development bundle: project-development-mindset routes to one specialist at a time, while brainstorm-first remains an independent pre-implementation decision workflow. | [project-development-mindset](./skills/project-development-mindset)<br>[brainstorm-first](./skills/brainstorm-first)<br>[run-reviewable-subtask-loop](./skills/run-reviewable-subtask-loop)<br>[testing-verification](./skills/testing-verification)<br>[debugging-workflow](./skills/debugging-workflow)<br>[performance-optimization](./skills/performance-optimization)<br>[agents-md-generator](./skills/agents-md-generator)<br>[documentation-guidelines](./skills/documentation-guidelines)<br>[design-system-generator](./skills/design-system-generator)<br>[ui-ux-concept-implementation](./skills/ui-ux-concept-implementation)<br>[vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) |
| [laravel-app-skills](./plugin-groups.json) | Version-exclusive Laravel 11/12 and Laravel 13 implementation guidance, coordinator-routed when project-development-mindset is available and directly usable when installed alone. | [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines)<br>[laravel-13-app-guidelines](./skills/laravel-13-app-guidelines) |
| [devops-skills](./plugin-groups.json) | Local-development Docker configuration, coordinator-routed when project-development-mindset is available and directly usable when installed alone. | [docker-local-dev](./skills/docker-local-dev) |
| [office-web-ui-skills](./plugin-groups.json) | Operational dashboard and back-office UI implementation, coordinator-routed when project-development-mindset is available and directly usable when installed alone. | [office-web-ui-system](./skills/office-web-ui-system) |
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
