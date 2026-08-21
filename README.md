# Awesome AI Agent Skills

A community-shared collection of reusable skills for AI coding agents. Works with Claude Code, Cursor, Kilo Code, Windsurf, OpenAI Codex, and any AI tools that support skills or custom instructions.

## Source of Truth

- Author skills only under `skills/<skill-name>/`.
- Assign each skill to exactly one installable bundle in `plugin-groups.json`, which also holds the marketplace `owner` and each plugin's `displayName`.
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

For normal project work, start with the project mindset skill and let the agent route to related skills:

```text
Use $project-development-mindset to redesign this checkout screen, propose concepts, and verify before/after with Playwright.
```

The mindset skill checks sibling skills in this library and can switch to the right workflow for UI concepts, tests, debugging, performance, documentation, design systems, or deployment guidance. Reviewable multi-subtask delivery is intentionally opt-in: the mindset may propose it during a user-initiated brainstorming session before coding, but uses it only after explicit acceptance and never for an ordinary clear coding request with no prior brainstorm or implementation discussion.

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
| [agents-md-generator](./skills/agents-md-generator) | Create, audit, compact, or update repository instruction files such as AGENTS.md, nested AGENTS.md, AGENTS.override.md, and optional CLAUDE.md compatibility files. Use when an agent should deterministically scan instruction sources, project manifests, declared commands, CI, documentation, and tool-specific precedence before producing concise project guidance instead of a large generic repository manual. |
| [debugging-workflow](./skills/debugging-workflow) | Reproduce, isolate, and fix software bugs without guessing. Use when the user reports errors, stack traces, crashes, regressions, logs, broken behavior with unknown cause, flaky behavior, incorrect business logic, UI bugs, integration failures, failing tests or CI failures with unclear root cause, or asks to debug, investigate, diagnose, or find the root cause of a problem. |
| [design-system-generator](./skills/design-system-generator) | Generate or update a project-specific DESIGN_SYSTEM.md that enforces consistent UI/UX across SPAs, traditional server-rendered sites, and hybrid systems. Use for design tokens, reusable component rules, UI source-of-truth conventions, animation/transition/custom class rules, accessibility gates, visual QA, Playwright screenshot guidance, and production asset/manifest requirements. |
| [docker-local-dev](./skills/docker-local-dev) | Create, repair, or extend local Docker Compose and Dockerfile setups for PHP/Laravel and CMS projects, Node.js, Python, and monorepos. Use when Dockerizing a project for development, adding local databases or supporting services, or safely merging existing development Compose configurations. Inspect the repository first, infer safe defaults, ask only about unresolved high-impact choices, preserve existing work, and verify generated files. Do not use as a production deployment workflow. |
| [documentation-guidelines](./skills/documentation-guidelines) | Create, update, reorganize, or audit agent-first repository documentation that routes work to canonical module, feature, contract, workflow, and runbook context without duplication or stale task history. |
| [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines) | Guidelines and workflow for working on Laravel 11 or Laravel 12 applications across common API-only and full-stack setups, including optional Docker Compose or Sail, Inertia with React, Vue, or Svelte, Livewire, Blade, Tailwind CSS 4, Fortify or WorkOS AuthKit, Wayfinder, Pest or PHPUnit, Pint, and Laravel Boost MCP tools. Use when implementing features, fixing bugs, or changing Laravel 11/12 backend or frontend behavior while following repository-specific instructions and installed package versions. |
| [laravel-13-app-guidelines](./skills/laravel-13-app-guidelines) | Guidelines and workflow for creating, upgrading, and changing Laravel 13 applications. Use when a task targets laravel/framework ^13.0 or a Laravel 12-to-13 upgrade, including API-only apps and Blade, Livewire 4, or Inertia 3 with React, Vue, or Svelte, plus starter kits, Tailwind CSS 4, Fortify or WorkOS AuthKit, Wayfinder, Pest 4 or PHPUnit 12, Pint, Laravel Boost 2, the Laravel AI SDK, JSON:API resources, and search. Detect installed versions and repository conventions before applying version-specific guidance. |
| [office-web-ui-system](./skills/office-web-ui-system) | Design, verify, and refactor admin dashboard, internal dashboard, customer/user management dashboard, back-office console, and reporting UI. Use only for dashboard-style management systems with operational workflows such as metrics, stat cards, filters, data tables, CRUD/list/detail pages, forms, side panels, admin shells, Playwright/browser UI verification, screenshot-based dashboard fixes, or visual QA for operational interfaces. Do not use for general UI/UX design, marketing pages, landing pages, portfolios, product sites, games, or consumer app screens unless the task is specifically an admin or management dashboard. |
| [performance-optimization](./skills/performance-optimization) | Diagnose and improve performance with measurements and source-of-truth constraints. Use when the user reports slowness, latency, high CPU, high memory, slow queries, N+1 issues, large payloads, slow builds, slow tests, rendering lag, bundle size, Core Web Vitals, caching, pagination, image/font loading, queues, background jobs, or asks to profile, optimize, speed up, or reduce resource usage. |
| [project-development-mindset](./skills/project-development-mindset) | Adaptive, repository-aware baseline for ordinary implementation, refactoring, setup, and cross-cutting project changes. Use when modifying code, configuration, tests, or durable documentation to discover local conventions, choose the smallest coherent change, preserve project integrity, calibrate verification to risk, and assess final requirement fit with evidence. Use as a coordinator when concerns interact; let a more specific skill lead when one concern clearly owns the task. Do not use for explanation-only or read-only requests unless explicitly invoked. |
| [run-reviewable-subtask-loop](./skills/run-reviewable-subtask-loop) | Deliver a large implementation plan, migration, refactor, or roadmap quickly as a sequential series of right-sized, locally reviewed subtask commits on one integration branch, using a lightweight ledger by default and durable plan files only when their resumability is needed. Use only when the user explicitly requests this workflow or accepts it during user-initiated brainstorming or planning before coding; do not use it for ordinary coding requests with clear requirements. Subtasks are not subagents, so work stays in the main conversation unless the user separately approves the proposed agent count and scope after being warned that delegation can increase usage. Ask again before expanding the approved scope. Remote CI requires separate explicit authorization. |
| [testing-verification](./skills/testing-verification) | Plan, add, repair, and run tests and verification for software changes. Use for test strategy, coverage, QA, acceptance criteria, regressions, CI failures, browser verification, Playwright E2E, visual comparison, or focused frontend, backend, API, and full-stack checks. |
| [ui-ux-concept-implementation](./skills/ui-ux-concept-implementation) | Implement frontend UI/UX from user-approved concepts, mockups, screenshots, visual references, or a website the user wants to emulate or clone. Use when Codex must generate and compare UI concepts, recommend a concept as a technical leader, predict the user's likely preference, persist the chosen concept outside commits, recreate a reference site's look and interactions in an existing project, or verify before/after UI with Playwright, Playwright MCP, Chrome DevTools MCP, screenshots, and responsive checks. |
| [vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) | Plan and implement secure production deployments of Docker Compose applications on self-hosted VPS or cloud servers using Docker Engine, Docker Compose, Traefik, private registries, SSH tunnels, least-privilege users, persistent volumes, backups, DNS, and storage growth planning. Use when an AI agent needs to design, review, document, or execute a real deploy for websites, APIs, websockets, workers, databases, and object storage integrations on Ubuntu or Debian style Linux hosts. |
<!-- SKILLS_TABLE_END -->

## Plugin Groups

Plugins bundle related skills so you can install by domain. The source of truth is `plugin-groups.json`.

<!-- PLUGINS_TABLE_START -->
| Plugin | Description | Skills |
|--------|-------------|--------|
| [project-development-skills](./plugin-groups.json) | A cohesive workflow bundle for project setup, source-of-truth development, reviewable multi-subtask delivery, UI/UX concept implementation, testing, debugging, performance, documentation, design systems, and production deployment planning. | [project-development-mindset](./skills/project-development-mindset)<br>[run-reviewable-subtask-loop](./skills/run-reviewable-subtask-loop)<br>[testing-verification](./skills/testing-verification)<br>[debugging-workflow](./skills/debugging-workflow)<br>[performance-optimization](./skills/performance-optimization)<br>[agents-md-generator](./skills/agents-md-generator)<br>[documentation-guidelines](./skills/documentation-guidelines)<br>[design-system-generator](./skills/design-system-generator)<br>[ui-ux-concept-implementation](./skills/ui-ux-concept-implementation)<br>[vps-docker-traefik-deploy](./skills/vps-docker-traefik-deploy) |
| [laravel-app-skills](./plugin-groups.json) | Version-aware guidelines for building and upgrading Laravel 11, 12, and 13 applications across common stacks and tooling. | [laravel-11-12-app-guidelines](./skills/laravel-11-12-app-guidelines)<br>[laravel-13-app-guidelines](./skills/laravel-13-app-guidelines) |
| [devops-skills](./plugin-groups.json) | Skills for Docker-based local development environment configuration. | [docker-local-dev](./skills/docker-local-dev) |
| [office-web-ui-skills](./plugin-groups.json) | Skills for designing and refactoring admin, internal, and back-office web interfaces. | [office-web-ui-system](./skills/office-web-ui-system) |
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
