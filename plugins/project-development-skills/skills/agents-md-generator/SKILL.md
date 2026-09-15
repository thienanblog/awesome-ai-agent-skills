---
name: agents-md-generator
description: Create, audit, or compact repository instructions in AGENTS.md, scoped overrides, and requested tool compatibility files. Use to preserve non-obvious project rules while removing stale, duplicated, or generic guidance.
---

# AGENTS.md Generator

Produce a small instruction layer containing verified project facts that materially change agent behavior. General engineering knowledge belongs outside always-loaded instructions.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Discover the instruction chain

Inspect existing instructions, their ownership, scopes, and symlinks before editing. Preserve a working shared source such as `AGENTS.md` pointing to `CLAUDE.md`; do not replace it solely to impose a preferred filename. Add compatibility files only when the requested tool support needs them. Keep global user configuration outside a repository-instruction task.

For an unfamiliar or multi-tool repository, the bundled detector can locate instruction paths and declared framework/tool signals:

```bash
"<skill-directory>/scripts/detect-agent-context" --root "<repository-root>" --format json
```

On Windows use `scripts/detect-agent-context.cmd` with the same arguments. Python provides JSON; native Bash/PowerShell fallbacks emit a smaller text report. Resolve scripts relative to this skill, not the target project. Direct file inspection is sufficient for a known, narrow edit.

The detector indexes selected public manifests and instruction/config paths without reading credentials, environment files, or instruction contents. Treat it as an index: read the applicable instructions and verify commands in their source before persisting them. Include global paths only when that investigation is authorized and relevant.

Read [discovery.md](references/discovery.md) for detector details or [tool-compatibility.md](references/tool-compatibility.md) when loading order and supported tool behavior affect the output.

## Select durable rules

Keep a rule when it is non-obvious, supported by project evidence, useful across tasks, and concrete enough to follow. Good candidates include exact command runners, generated-file ownership, unusual business boundaries, required checks, and repository-specific deployment or approval constraints.

Remove or rewrite generic advice, personas, duplicated rules, obsolete commands, exhaustive inventories, mandatory questionnaires, unsupported scores, and procedures that conflict with current project intent. Describe actual authorization boundaries; do not invent new approval gates or weaken explicit ones.

Keep detailed design, API, testing, and deployment guidance in their existing owners, linked with a clear read condition. Exclude secrets, home-directory paths, prompt transcripts, task logs, and global tool inventories.

## Write or reconcile

Default to one compact shared instruction source. Use nested files for meaningful scope differences supported by the target tools, without repeating parent rules. For Codex, check same-directory `AGENTS.override.md` precedence before proposing a layout. For requested Claude compatibility, an import or existing symlink can avoid duplicate rules.

Use [output-template.md](references/output-template.md) as a menu. Classify existing content as keep, update, move, remove, or unresolved; resolve facts from source, and ask only about conflicts that require the user's decision. Read [merge-and-verify.md](references/merge-and-verify.md) for an existing file consolidation.

Prefer roughly 80–150 lines for a root file and shorter scoped files, without padding to a target. Review a root above 200 lines or 16 KiB for duplication and misplaced detail; preserve justified requirements while respecting the target tool's actual loading limit. Do not raise a global context limit just to avoid editing.

Use tracked diffs for recovery. Preserve untracked content that would otherwise be lost. Do not create routine backup copies, alter history, or ignore entire tool-configuration directories merely as part of generating instructions.

## Verify

Check cited paths and commands, scope/precedence, symlinks, duplicate rules, and unresolved placeholders. Measure line/byte size and ensure the relevant instruction chain fits the target tool. Run repository validators when applicable. Static inspection of a command does not mean it was executed; do not run a destructive command to verify its spelling.

Report material rules kept, changed, moved, or removed, the evidence used, and unresolved conflicts. Avoid a separate discovery report unless the user requested it.
