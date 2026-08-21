---
name: agents-md-generator
description: Coordinator-routed specialist for creating, auditing, compacting, or restructuring AGENTS.md, AGENTS.override.md, nested instructions, or optional CLAUDE.md compatibility files. Use after project-development-mindset identifies repository instructions as the primary deliverable, or directly when explicitly invoked or installed standalone. Do not use for routine instruction reading or a small required update accompanying code.
---

# AGENTS.md Generator

Create a small, project-specific instruction layer that agents can load on every task. Treat context as a limited budget: include durable rules that materially change agent behavior, and leave general engineering knowledge or detailed documentation out.

Run this skill in the main conversation. Do not use subagents unless the user explicitly approves the proposed agent count and scope after being warned that delegation can increase usage. Ask again before expanding an approved scope.

## Core contract

- Prefer `AGENTS.md` as the shared repository instruction file.
- Generate only files the user requested. Ask before adding a compatibility file for another tool.
- Keep the root file broadly applicable. Put subtree-specific rules in nested instruction files only when the target tool supports them.
- Record verified facts, not assumptions or generic best practices.
- Link to detailed project documentation with a task-specific read condition instead of copying it.
- Never store secrets, credentials, private prompts, conversation transcripts, or the user's verbatim request.
- Do not add tool configuration directories to `.gitignore` wholesale. Some contain intentionally versioned project configuration.
- Do not modify global instruction files or user configuration while generating repository instructions.

## Output budget

Use these defaults unless the repository already has a stricter convention:

- Root `AGENTS.md`: target 80-150 lines and at most 12 KiB.
- Root hard review threshold: 200 lines or 16 KiB.
- Nested instruction file: target at most 80 lines and include only differences from the parent scope.
- `CLAUDE.md` compatibility file: normally one import line plus explicitly requested Claude-specific rules.

If a generated or merged root file crosses either hard threshold, compact it before writing. Never justify an oversized file by raising Codex's `project_doc_max_bytes`; that setting is an escape hatch, not the default design.

## Workflow

### 1. Locate the instruction chain

Resolve bundled resources relative to the directory containing this `SKILL.md`; never assume the skill exists under the target repository's `skills/` directory.

Run the deterministic detector before manual exploration:

```bash
"<skill-directory>/scripts/detect-agent-context" --root "<repository-root>" --format json
```

On Windows, run `"<skill-directory>\\scripts\\detect-agent-context.cmd"` with the same arguments. The launchers prefer the full Python detector and fall back to a native Bash or PowerShell text report when Python is unavailable. Use text output for a human-readable report. Add `--include-global` only when user-level instruction conflicts matter and reading those paths is permitted. Add repeatable `--config-path` values for nonstandard agent or MCP config locations. The detector reads only selected public manifests and reports paths for instruction/config files; it never reads environment files, credentials, arbitrary source files, or instruction contents.

Treat the report as an evidence index, not final authority. Verify commands and project rules in their cited source before writing them into persistent instructions. Framework and tool signals come from declared dependencies or explicit marker files; do not infer architecture from them.

The detector indexes these relevant instruction sources:

- Root and nested `AGENTS.md` and `AGENTS.override.md` files.
- `CLAUDE.md`, `CLAUDE.local.md`, and `.claude/rules/` when Claude Code compatibility matters.
- `.github/copilot-instructions.md` and `.github/instructions/` when GitHub Copilot compatibility matters.
- `.cursor/rules/` and legacy `.cursorrules` when Cursor compatibility matters.
- Project-scoped agent configuration such as `.codex/config.toml` when present.
- Other tool-specific files only when the project uses that tool.

Read [references/tool-compatibility.md](references/tool-compatibility.md) when multiple agent tools are present or compatibility behavior affects the requested output.

Determine which file actually applies at the current working directory. In Codex, `AGENTS.override.md` wins over `AGENTS.md` in the same directory, only one file is loaded per directory, and files closer to the working directory appear later in the instruction chain.

### 2. Discover repository facts

Read local sources before asking questions:

1. Existing instruction files and repository documentation.
2. Package manifests, lockfiles, runtime/version files, container or devcontainer configuration.
3. CI workflows and scripts that define the real lint, test, type-check, build, and validation commands.
4. Top-level source layout and the nearest representative modules.
5. Tests, fixtures, code-generation rules, deployment notes, and security policies when relevant.

Use the smallest scan that can establish reliable facts. Do not offer time-based “quick/medium/deep” menus. Ask a concise question only when an unresolved choice would materially change the output, such as the intended runtime environment or whether a second agent tool must be supported.

Read [references/discovery.md](references/discovery.md) for detector output guidance, the evidence checklist, and confidence rules.

### 3. Decide what belongs in persistent instructions

Include a rule only if all are true:

1. It is durable across many tasks.
2. It is not obvious from a nearby standard config or common model knowledge.
3. It changes what the agent should do, avoid, read, or verify.
4. It can be written concretely enough to check.

Good content:

- Exact environment and commands when choosing the wrong command would fail or alter state.
- The authoritative docs, schemas, generated files, or modules for a business area.
- Non-obvious architecture boundaries and reuse requirements.
- Repository-specific Git, testing, security, deployment, or approval rules.
- Known generated files that must not be edited directly.
- Platform limitations or checks that cannot be inferred from the manifest.

Exclude:

- Role personas such as “You are a senior engineer.”
- Generic workflows, programming advice, framework tutorials, or exhaustive folder inventories.
- Tool-detection reports, MCP server inventories, home-directory paths, or global prompt summaries.
- Full design-system, testing, debugging, performance, deployment, or API documentation.
- Status logs, roadmaps, completed work, original prompts, or task memory.
- Rules already enforced automatically by formatters or CI unless the agent must run a specific command.

### 4. Choose the file layout

Default to one root `AGENTS.md`.

Add a nested `AGENTS.md` when a subproject has meaningfully different commands or conventions and the target tools load nested files. Add a nested `AGENTS.override.md` only when Codex should ignore the sibling `AGENTS.md` for that directory. Keep common rules at the root and write only the delta in nested files.

Create `CLAUDE.md` only when the user asks for Claude Code support. For a shared instruction source, use:

```markdown
@AGENTS.md
```

Add Claude-specific content below the import only when it cannot live in shared instructions. A symlink is also supported by Claude Code, but prefer the import for cross-platform repositories unless the user chooses otherwise.

For path-scoped Claude or Cursor rules, prefer their native scoped-rule mechanisms over expanding the always-loaded root file.

### 5. Generate the minimum useful file

Use the compact skeleton in [references/output-template.md](references/output-template.md). Include only sections that have verified content. Prefer bullets, exact paths, and exact commands.

Write conditions explicitly:

- Good: “When changing API schemas, update `api/openapi.yaml` before generated clients; run `pnpm generate:api`.”
- Weak: “Keep API documentation up to date.”
- Good: “Run `docker compose exec app php artisan test --filter=<affected test>`; PHP is not installed on the host.”
- Weak: “Always test your changes.”

Do not copy large documentation passages. Write a routed reference such as: “For public API changes, read `docs/api-versioning.md` before editing routes.”

### 6. Reconcile existing files

Do not preserve content merely because it already exists. Classify each rule as:

- `keep`: current, specific, and useful.
- `update`: useful but contradicted by current source-of-truth evidence.
- `move`: useful only for a subdirectory or detailed project document.
- `remove`: generic, duplicated, stale, unverifiable, or task-status content.
- `confirm`: a real conflict whose owner cannot be determined from repository evidence.

Preserve author intent, but prefer current source-of-truth facts. Ask only about `confirm` items. Do not append a fresh template below old content, do not add generated/preserved marker comments, and do not keep both sides of a conflict for the user to clean up later.

When Git tracks the file, rely on the working-tree diff for recovery. Do not create backup files, delete older backups, commit, or modify Git history unless the user explicitly requests it.

Read [references/merge-and-verify.md](references/merge-and-verify.md) before compacting or updating an existing file.

### 7. Verify before finishing

Check every generated or updated instruction file:

- All paths and commands cited exist or are clearly labeled as user-provided.
- No unresolved placeholders such as `TBD`, `[command]`, or template braces remain.
- Rules do not contradict nearer instruction files or repository configuration.
- Root and nested scopes do not repeat the same content.
- No secret, personal home path, prompt transcript, task status, or tool inventory was added.
- The root file stays within the line and byte budgets.
- Optional compatibility files use behavior supported by the selected tool.

Measure rather than estimate:

```bash
wc -l -c AGENTS.md
```

For an update, inspect the final diff and summarize what was kept, updated, moved, and removed. If the repository has its own validation command for generated files or documentation, run it.

## Quick mode

When the user requests quick mode:

- Discover facts from repository sources without a questionnaire.
- Use safe defaults and omit uncertain sections.
- Never overwrite an existing instruction file with unresolved conflicts.
- Produce the same compact, verified output as the normal workflow; quick mode changes interaction, not quality or size limits.

## Maintainer note

Do not bundle `ROADMAP.md`, `PROGRESS.md`, task logs, or archive helpers inside this runtime skill. Track future work in repository-level issues or maintainer documentation outside the packaged skill. Runtime skill contents should include only instructions and resources needed to perform the user-facing workflow.
