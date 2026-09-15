---
name: testing-verification
description: Design or assess tests, acceptance checks, CI coverage, and browser verification. Use when verification is the main deliverable or requires specialist judgment; ordinary implementation can keep its focused checks inline.
---

# Testing Verification

Verify observable behavior at the narrowest reliable level, using project conventions and the failure cost to choose coverage.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Select evidence

Inspect relevant contracts, nearby tests, fixtures, commands, and CI definitions. Choose checks that can fail for the behavior in question, including important negative paths. Use [test-strategy.md](references/test-strategy.md) when the test level or coverage tradeoff is unclear.

Prefer existing test infrastructure and stable fixtures. Test public behavior rather than incidental implementation details; avoid hidden network dependencies, production data, and timing-based assertions. Add automation when it protects meaningful behavior, without writing tests that simply mirror trivial edits.

## Browser work

Follow the host's browser policy. Use its built-in Browser for interactive, exploratory, screenshot, and visual comparison work when available. Use Playwright MCP only when that surface is unavailable and record why; troubleshoot a failed Browser setup before treating it as unavailable. If the user explicitly chose Browser, obtain direction before substituting another surface.

Source-controlled Playwright E2E provides repeatable regression coverage. Keep it distinct from a manual Browser pass. Read [ui-visual-verification.md](references/ui-visual-verification.md) when comparison conditions or visual ambiguity matter.

## Run and finish

Run focused checks and required repository gates. Investigate failures before broadening, and rerun only affected checks after a fix. Reuse passing results for unchanged responsibilities and equivalent conditions. A commit, PR, merge, or handoff alone does not justify repeating a suite.

Follow explicit testing budgets. Propose a broader suite only when it could resolve a material gap; ask when project policy or unapproved cost requires it. Once sufficient evidence exists, finish without a routine full-suite question.

Report commands, results, relevant coverage, any browser surface used, and remaining gaps. Do not claim behavioral or visual verification from static checks alone.
