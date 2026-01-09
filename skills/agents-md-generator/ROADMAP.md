# ROADMAP — agents-md-generator

This roadmap tracks *future* plans for the `agents-md-generator` skill.

Rules:
- When new ideas/features are discussed, update both `ROADMAP.md` and `PROGRESS.md`.
- When a task is completed, update both files.
- `ROADMAP.md` uses checklists so items can be marked done.
- Keep this file ~200–300 lines max; if it exceeds, archive oldest entries to `docs/archives/ROADMAP-YYYY-MM.md`.

## Near-Term (Next)

- [ ] Add contributor-friendly “how to update/merge” mini-guide (with examples) in `SKILL.md`
- [ ] Add a short “what I detected” output template with confidence levels and override prompts
- [ ] Add guidance for Windows symlink fallback (copy + header) in the Quick Start section
- [ ] Add a “safe defaults” section: do/don’t for agents (no secrets, no destructive commands, ask-first rules)

## Detection Enhancements

- [ ] Improve monorepo/workspace detection (pnpm/yarn/npm workspaces; Nx/Turborepo/Lerna)
- [ ] Add stronger Docker/Sail/Devcontainer detection signals and command-prefix rules
- [ ] Expand test framework detection (Playwright/Cypress; PHPUnit/Pest; pytest)
- [ ] Expand formatter/linter detection (Biome; Ruff; Black; golangci-lint)

## Merge & Update Strategy

- [ ] Add explicit rules for preserving user customizations vs. regenerating boilerplate
- [ ] Add a “section-level diff summary” workflow that does not dump huge diffs by default
- [ ] Add “deprecated guidance” marking strategy (keep but annotate + date)

## Reference Docs

- [ ] Add a “section catalog” index pointing to `references/*` docs
- [ ] Add more stack examples in `references/section-templates.md` (API-only, full-stack, monorepo)

## Completed

- [x] Add `ROADMAP.md` + `PROGRESS.md` workflow and archiving rules (2026-01-09)
- [x] Add helper scripts to archive roadmap/progress (bash + PowerShell) (2026-01-09)
- [x] Add terminal-aware launcher and Windows cmd wrapper for archiving scripts (2026-01-09)
- [x] Add compact reply examples for Q&A prompts and maintainer workflow using the archive scripts (2026-01-09)
- [x] Standardize multi-choice prompts with explicit “reply examples” while keeping full-sentence answers supported (2026-01-09)
