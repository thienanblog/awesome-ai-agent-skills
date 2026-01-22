# PROGRESS — agents-md-generator

This progress log tracks *current and recently completed* work for the `agents-md-generator` skill.

Rules:
- When new ideas/features are discussed, update both `PROGRESS.md` and `ROADMAP.md`.
- When a task is completed, update both files.
- Keep this file ~200–300 lines max; if it exceeds, archive oldest entries to `docs/archives/PROGRESS-YYYY-MM.md`.

## Current Focus

- Maintenance: Keep roadmap/progress in sync with feature discussions and shipped updates.

## Done (Most Recent First)

- 2026-01-22 — Added scripted detection of AI tool prompts, MCP servers, and optional prompt-alignment/memory sections; added skill duplicate scan and reference updates.
- 2026-01-09 — Standardized multi-choice prompts to include explicit reply examples (while still allowing full-sentence answers).
- 2026-01-09 — Improved question prompts with optional compact reply examples (e.g., `1a 2b 3c`) and documented a maintainer workflow that runs the archive helper scripts.
- 2026-01-09 — Added terminal-aware launcher + Windows `.cmd` wrapper to pick the best archiving tool (PowerShell vs bash).
- 2026-01-09 — Added helper scripts to archive `ROADMAP.md`/`PROGRESS.md` (bash + PowerShell).
- 2026-01-09 — Added `ROADMAP.md` and `PROGRESS.md` for the skill, including archiving rules.
