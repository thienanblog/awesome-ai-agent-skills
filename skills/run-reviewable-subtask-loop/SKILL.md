---
name: run-reviewable-subtask-loop
description: Deliver an explicitly requested multi-subtask plan as sequential reviewed and verified commits with one aggregate publication path. Use only when the user requests or accepts this workflow; subtasks do not authorize subagents.
---

# Run Reviewable Subtask Loop

Deliver coherent, recoverable increments and review the aggregate result before publication. Use this workflow only after explicit opt-in; a large task or an internal plan alone is insufficient.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Establish the series

Inspect repository instructions, working-tree and worktree state, the intended base and its fetched remote counterpart, and relevant delivery checks. Follow repository freshness policy; preserve the intended base and user changes. Do not silently merge, rebase, reset, or overwrite work to make the starting state convenient.

Resolve the branch, commit, push, PR, merge, and cleanup permissions from the user's request. A request to implement does not automatically authorize publication or final merge. Ask only about missing permissions when needed, after completing independent preparatory work.

Use one integration branch and sequential commits by default. Use temporary subtask branches when repository policy or an actual isolation/recovery need justifies them. Never check out the same branch in two worktrees. Record initial base and integration SHAs and the exact branches created by this series.

Inspect remote triggers before publication. Read [remote-ci.md](references/remote-ci.md) when push, PR, or merge can start CI. Honor explicit local-only, cost, and separate-approval requirements.

## Keep a compact ledger

Use the conversation or an existing project progress surface. Persist a plan only when requested or needed for recovery across sessions; use the repository's established location. Record exact task-owned artifact paths and preserve them according to the user's retention preference.

For each subtask, track its responsibility, acceptance criteria, dependencies, focused checks, status, and resulting commit. Add findings, evidence, and recovery points as they exist. Do not prescribe a fixed number of subtasks or plan files.

Split at boundaries that have distinct review, test, rollout, or recovery value. Keep source and generated output together. Combine mechanical fragments; separate unrelated contracts or risky migrations. Adjust implementation details within the agreed outcome, and ask before materially changing an approved scope.

## Execute each subtask

1. Start from the verified integration tip, using an isolated branch only when warranted.
2. Implement the complete responsibility with needed tests, documentation, and generated artifacts.
3. Run checks for that responsibility and affected shared contracts. Do not run the aggregate suite for every commit.
4. Review the complete subtask diff. Fix actionable issues and rerun affected checks; revisit the wider review only when the fix changes its assumptions.
5. Commit when the required checks pass. If using a subtask branch, integrate by the repository-approved method, preferring fast-forward when possible.
6. Record the commit, review outcome, checks, and last-known-good tip. Recheck integration only when it changes the tested behavior or conditions.

Keep dependent work behind unresolved failures. For invalidated work, read [recovery.md](references/recovery.md) and preserve a recovery point before any authorized history change. Temporary branch cleanup follows [branch-cleanup.md](references/branch-cleanup.md).

## Verify the complete result

Review the complete diff against the intended base and map it to the user's criteria. Fetch the base again before delivery. If it advanced, assess the integration risk and follow repository policy; obtain direction before an unapproved merge or history rewrite.

Run the smallest aggregate checks that cover the changed responsibilities and their contracts, plus required release or repository gates. Reuse valid subtask evidence. Respect explicit suite budgets; propose broader tests only for a concrete gap instead of always asking for a full run.

For material visual work, inspect relevant rendered states and viewports and compare any selected reference. Use earlier browser checks when they help expose design or integration errors; there is no requirement to defer all visual work to the end. Follow the host browser policy and distinguish manual Browser evidence from source-controlled E2E tests.

Record the final commit/tree and the inputs or environment on which checks depended. Changes invalidate affected evidence, not every unrelated check. Revalidate changed contracts after conflict resolution; a documentation-only progress update does not by itself invalidate runtime tests. Provider-required checks may still need the current PR SHA.

## Publish and clean up

Use the authorized aggregate path: one PR, or commit and push if that is what the user requested. Keep intermediate branches local unless remote backup or collaboration is requested. Report the result, meaningful review fixes, checks, and gaps in plain language without a mandatory confidence score.

Merge only when requested, repository-required checks pass on the candidate, and no unresolved finding makes the merge unsafe. Verify the resulting commit/tree, including any base changes. An existing passing check does not need a local rerun merely because the next step is squash merge.

Clean up only the exact task-owned branches and temporary files covered by authorization. Keep evidence needed for pending review or recovery; do not delete plan documents the user wants retained. Follow [branch-cleanup.md](references/branch-cleanup.md), including its squash-merge checks. Preserve unrelated branches and worktrees.

## Resume or report a blocker

Reconcile the ledger with actual Git state, review status, and verification evidence. Resume from the first incomplete step, keeping completed work. If ownership, authorization, base freshness, protected-branch checks, or an unresolved scope decision prevents safe progress, explain the precise blocker and continue any independent work that remains possible.
