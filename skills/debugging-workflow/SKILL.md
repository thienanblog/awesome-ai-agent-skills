---
name: debugging-workflow
description: Reproduce, isolate, and fix unexplained failures, regressions, or flaky behavior. Use when the cause is uncertain; a known-cause fix usually needs only the normal implementation workflow.
---

# Debugging Workflow

Use evidence to locate the failing boundary and fix the cause while preserving business intent.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Investigate

1. Capture the failing command or flow, input, expected behavior, actual result, and relevant environment. Read the error and nearby source before expanding the search.
2. Reproduce the smallest useful case when practical. If reproduction is unavailable, distinguish what logs or source prove from what remains a hypothesis.
3. Trace the symptom through the affected boundaries. Choose checks that distinguish plausible causes; independent observations can run together when safe. Avoid stacking speculative fixes.
4. For a UI failure, inspect the supplied image or rendered state. Annotate only if it makes a material ambiguity easier to resolve; a screenshot does not automatically require a question.

Read [debugging-playbook.md](references/debugging-playbook.md) for deeper isolation, flaky failures, or temporary instrumentation. Keep sensitive data out of logs and remove temporary debug code.

## Fix and verify

Make the smallest coherent fix, preserving unusual business rules unless evidence shows they are the defect. Avoid unrelated refactors. Add a regression test when it provides durable protection, ideally demonstrating failure before the fix.

Rerun the original failure and affected checks. Complete repository-required checks; broaden only when a remaining risk warrants it and authorization permits. Reuse valid results instead of asking routinely whether to run a full suite.

If measurement or test design becomes the main work, consult the relevant specialist directly when available. No coordinator handoff is needed merely to use another reference.

## Report

Explain the cause, fix, and evidence that the failure is resolved. Include reproduction limits or remaining uncertainty. Record a difficult bug in existing durable docs only when future work would benefit.
