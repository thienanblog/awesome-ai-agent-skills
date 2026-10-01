---
name: testing-verification
description: Design or assess tests, acceptance checks, CI coverage, and browser verification. Use when verification is the main deliverable or requires specialist judgment; ordinary implementation can keep its focused checks inline.
---

# Testing Verification

Verify observable behavior at the narrowest reliable level, using project conventions and the failure cost to choose coverage.

## Delegation

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Select evidence

Inspect relevant contracts, nearby tests, fixtures, commands, and CI definitions. Choose checks that can fail for the behavior in question, including important negative paths. Use [test-strategy.md](references/test-strategy.md) when the test level or coverage tradeoff is unclear.

Prefer existing test infrastructure and stable fixtures. Test public behavior rather than incidental implementation details; avoid hidden network dependencies, production data, and timing-based assertions. Add automation when it protects meaningful behavior, without writing tests that simply mirror trivial edits.

## Browser work

Use the browser surface the host and project policy designate for interactive, exploratory, screenshot, and visual comparison work. If that surface fails, troubleshoot it before falling back to another, and say which surface produced the evidence. When the user named a specific surface, get their direction before substituting a different one.

Source-controlled Playwright E2E provides repeatable regression coverage. Keep it distinct from a manual Browser pass. Read [ui-visual-verification.md](references/ui-visual-verification.md) when comparison conditions or visual ambiguity matter.

## Run and finish

Run focused checks and required repository gates. Investigate failures before broadening, and rerun only affected checks after a fix. Reuse passing results for unchanged responsibilities and equivalent conditions. A commit, PR, merge, or handoff alone does not justify repeating a suite.

Follow explicit testing budgets. Propose a broader suite only when it could resolve a material gap; ask when project policy or unapproved cost requires it. Finish once the evidence is sufficient.

Report commands, results, relevant coverage, any browser surface used, and remaining gaps. Do not claim behavioral or visual verification from static checks alone.
