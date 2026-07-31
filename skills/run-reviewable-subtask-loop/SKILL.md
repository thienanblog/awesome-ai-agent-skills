---
name: run-reviewable-subtask-loop
description: Split a large implementation plan, architecture migration, refactor, or feature roadmap into right-sized, coherent subtasks that are substantial enough to code, review, and test meaningfully yet narrow enough to roll back independently. Use when the user wants proportionate delivery boundaries, atomic last-known-good checkpoints, recovery by rebuilding an invalid dependent suffix, a resumable multi-slice loop, affected-surface aggregate testing with applicable automated E2E and manual browser review, minimal remote CI, one integration-to-base review request, or reuse of valid CI evidence when promoting an unchanged tree to the protected base.
---

# Run Reviewable Subtask Loop

Deliver a large change as a sequence of isolated, locally reviewed commits on an
integration branch. Do not use pull requests, merge requests, or equivalent
review requests as the transport between subtasks. Open one aggregate review
request only after the integrated tree is ready for the user's final review and
any required remote CI.

## Establish the contract

1. Read repository instructions, plans, progress documents, relevant
   architecture, workflow files, branch protection, and current Git state.
2. Determine:
   - protected base branch;
   - series integration branch and required branch prefix;
   - all local verification surfaces and their commands;
   - remote CI workflow triggers and required checks;
   - final review-request and merge behavior;
   - documentation and progress-record rules.
3. Default to an ephemeral integration branch created from the protected base.
   Use an established delivery branch only when repository policy or the user
   explicitly requires it.
4. Treat planning as read-only. Create branches, commit, merge, push, open the
   final review request, or delete branches only when the user's execution
   request or repository workflow authorizes those actions.
5. Present the slices and workflow first when the user requests approval or
   brainstorming.

## Use a local-first branch topology

Use this default topology:

```text
protected base
└── series integration
    ├── task 01 (local)
    ├── task 02 (local)
    └── task 03 (local)
```

Apply these rules:

1. Create each task branch from the current integration tip.
2. Keep task branches local. Do not push them or open subtask review requests.
3. Complete, review, fix, verify, and commit one task before merging it into
   integration.
4. Prefer one final commit per subtask and fast-forward it into integration so
   the integration history is an ordered ledger of reviewed slices. Follow
   repository merge policy when it requires another local merge method.
   Temporary checkpoint commits may exist on the local task branch; consolidate
   them before integration when repository policy permits.
5. Do not start a dependent task until its prerequisite commit is integrated.
6. Keep the integration branch local until the aggregate tree is ready unless
   the user explicitly requests a remote backup or collaboration requires one.
7. Open only the final integration-to-base review request. Leave it open for
   the user to decide whether to squash-merge.

If an established delivery branch is mandatory, define the release path before
editing. Do not silently add an extra review request or CI checkpoint; explain
any repository-required delivery-to-base promotion.

## Build the subtask ledger

Create an ordered ledger before editing. Give every slice:

- one primary responsibility;
- files, modules, or contracts in scope;
- dependencies;
- acceptance criteria;
- scoped local verification;
- documentation impact;
- planned integration commit;
- prerequisite commits and dependent slices;
- last-known-good integration commit and recovery boundary;
- reason the boundary provides distinct coding, review, test, or recovery value;
- status, findings, and fixes.

Choose slices from dependency and review boundaries, not an arbitrary count.
Keep generated artifacts with their generator or contract change. Do not leave
the integration branch knowingly uncompilable.

## Calibrate subtask granularity

Choose the smallest **coherent** slice whose failure would justify an
independent rollback, not the smallest possible diff or the smallest unit that
can be named. Prefer the fewest slices that preserve meaningful implementation,
review, verification, and recovery boundaries.

Apply this right-sizing test to every proposed subtask:

1. **Code:** Can it be implemented as one complete responsibility without
   placeholder work, a knowingly broken intermediate state, or unnecessary
   context switching?
2. **Review:** Can a reviewer understand the intent and evaluate the complete
   diff as one story without needing a later slice to explain it?
3. **Test:** Does it have focused verification that can meaningfully detect a
   failure of its responsibility, rather than only repeating generic checks?
4. **Recovery:** Would keeping, reverting, or rebuilding it independently change
   a realistic recovery decision?

A good slice normally passes all four checks. If a boundary has no distinct
review, test, or recovery value, merge it with the adjacent slice that shares
its acceptance criteria and verification.

Treat a proposed subtask as too small when it:

- contains only a tiny mechanical edit, checklist item, rename, or preparation
  step that is not independently useful;
- cannot compile, run, be reviewed coherently, or be tested meaningfully without
  the immediately following slice;
- shares the same responsibility, contract, acceptance criteria, and
  verification commands as an adjacent slice;
- adds branch, commit, review, and test ceremony without creating a useful
  last-known-good checkpoint.

Group those changes into one coherent slice. Examples include moving several
low-risk routes out of one catch-all module, applying the same contract
migration across its direct consumers, or updating generated artifacts together
with the source that produces them.

Treat a proposed subtask as too broad when it:

- mixes responsibilities that a reviewer cannot assess as one coherent change;
- combines materially different failure modes, owners, rollout needs, recovery
  decisions, or verification surfaces;
- requires unrelated test suites to prove unrelated outcomes;
- would force already valid, unrelated work to be reverted when one part fails.

Split those changes at the meaningful boundary. Always consider separate slices
for database migrations, authorization or data-scope changes, public contract
changes, dependency or bundle changes, risky interactive UI, generated
artifacts with independent consumers, and production or deployment boundaries.

Before presenting the ledger:

1. Estimate the repeated cost of branch setup, review, tests, builds, manual
   browser checks, documentation, and integration smoke for the proposed slice
   count.
2. Compare that cost with the coding, review, test, and recovery value of each
   boundary.
3. Merge adjacent low-risk slices when their separate diffs or checkpoints
   would not change a realistic implementation or recovery decision.
4. Split a broad slice when its diff cannot be reviewed coherently or one
   failure would force unrelated validated work to be reverted.
5. When the ledger reaches high single digits, perform an explicit compression
   pass. More than roughly 12 slices requires a concrete justification for every
   remaining boundary. These are review triggers, not hard caps; retain a larger
   ledger only when its risk and dependency boundaries justify the repeated
   cost.

Do not turn "one route", "one file", "one component", or "one checklist row"
into an automatic slice rule. Those are useful boundaries only when they also
provide independent review, verification, or recovery value. A small diff may
still deserve its own slice when it carries a material migration, security,
public-contract, or deployment risk with distinct verification and recovery
needs; otherwise fold it into a coherent neighbor. Record any intentional
deviation from a repository plan that mandated finer slices and obtain user
approval before execution.

## Set the CI budget

Inspect workflow triggers and branch protection before the first edit.

Use three verification tiers:

- **Slice gate:** run the smallest checks that cover the changed responsibility,
  such as focused tests, typecheck or lint for the affected package, diff
  checks, and a cheap integration smoke. When behavior changes, do not treat a
  formatting or lint-only check as sufficient evidence.
- **Phase gate:** after a group of related slices, run the affected package or
  application suite, build, and representative manual browser or E2E coverage
  once.
- **Final gate:** on the exact integration tip, run repository-required checks
  and broad verification for every affected or contract-connected surface.

Apply these rules:

1. Run a slice gate locally for every subtask. Do not repeat a full package,
   workspace, API, application, E2E, or manual browser matrix per slice unless
   the slice's risk or repository policy specifically requires it.
2. Do not push task branches, open subtask review requests, or intentionally
   start remote CI for individual slices.
3. Treat local verification as the primary gate. Reserve remote CI for checks
   that cannot run locally because of platform, infrastructure, secrets, or
   repository-required checks.
4. Push the integration branch and open the integration-to-base review request
   only after local aggregate verification passes.
5. Run remote CI on the final review request only when a required check or a
   genuinely remote-only test remains. Record why each remote job is necessary.
6. If push and review-request triggers unavoidably create duplicate runs, use
   the minimum repository-compliant run count. Cancel a redundant run only when
   authorized and when required checks will still report successfully.
7. Do not weaken branch protection or permanently rewrite CI merely to reduce
   remote usage. Do not use skip annotations that leave required checks
   pending.

Record local and remote aggregate evidence:

- commit SHA and Git tree SHA;
- exact commands and local conclusions;
- branch and trigger when applicable;
- CI run URL when remote CI was necessary;
- required-check conclusions.

Any source, generated-file, conflict-resolution, or merge change that alters
the final tree invalidates that evidence and requires aggregate validation of
the new tree.

## Execute each subtask

Repeat this loop:

1. Switch to integration, confirm a clean tree, and create a unique task branch
   from its current tip.
2. Implement the current responsibility as a complete, coherent slice. Keep its
   production code, focused tests, documentation, plans, and generated artifacts
   together when they share the same acceptance criteria.
3. Run the smallest relevant checks, followed by scoped local verification that
   can actually detect a failure of the slice's responsibility.
4. Review the complete diff for:
   - correctness, edge cases, and regressions;
   - contract drift and integration compatibility;
   - authorization, scoping, validation, and data safety;
   - missing or misleading tests;
   - stale documentation;
   - accidental artifacts and unrelated changes.
5. Fix every actionable finding, rerun affected checks, and review the final
   diff again.
6. Commit the reviewed slice using repository message conventions, defaulting
   to English when no convention exists. Do not commit a slice with unresolved
   actionable findings or failing required local checks.
7. Return to integration and merge the exact task commit locally. Prefer
   `--ff-only` when the task branch contains the intended single commit.
8. Verify the integration tip and run a cheap integration smoke check when the
   slice affects shared contracts or build boundaries.
9. Mark the new integration tip as last-known-good only after its required
   scoped and smoke checks pass.
10. Delete the exact local task branch when cleanup is authorized.
11. Record the commit SHA, verification, review findings, fixes, integration
    result, recovery boundary, and next ledger item.

If review discovers a material scope change, stop and request direction. Do not
open a review request merely to obtain review or CI for a subtask.

## Recover from an invalid subtask

Treat every validated integration commit as a recovery checkpoint.

1. Stop work on downstream dependent slices as soon as a subtask becomes
   invalid.
2. Identify the earliest invalid commit and the last-known-good integration
   commit immediately before it.
3. Use the ledger's dependency edges to mark the invalid commit and every
   transitive dependent slice as invalid. In a strictly linear sequence such as
   `A -> B -> C -> D`, invalidating `C` invalidates both `C` and `D`.
4. Preserve a later slice only after proving from its diff, contracts, and tests
   that it is independent of the invalid slice. Do not assume independence only
   because Git can cherry-pick it cleanly.
5. If the invalid slice is still on its task branch, discard it directly when
   it has no reusable work. When useful, first preserve reviewed, non-sensitive
   work in a temporary local WIP commit on a backup branch, then create a
   uniquely named replacement task branch from the unchanged integration
   checkpoint.
6. If the invalid suffix is already integrated but remains local and
   unpublished, create a uniquely named backup branch at the failed tip, then
   create a replacement integration branch from the last-known-good commit.
   Keep the failed branch until the rebuilt suffix passes.
7. If the invalid suffix was published or its final review request is open, do
   not rewrite shared history by default. Revert dependent commits in reverse
   order, preferably as one reviewed recovery change when repository policy
   permits; do not treat a temporarily broken intermediate revert as a
   checkpoint. Rebuild the suffix with new commits and update the existing
   final review request. Replace or force-update the published integration
   branch only with explicit authorization and after accounting for reviewer
   and CI state.
8. Reimplement each invalidated slice through the normal review, verification,
   commit, and integration loop. Invalidate all aggregate evidence for the old
   tree.
9. Run affected scoped checks after each rebuilt slice and the full final gate
   on the completed replacement tree.
10. Delete failed or backup branches only after recovery succeeds and cleanup
    is authorized.

Do not use destructive reset or force-push as routine recovery. Prefer a
preserved failed tip plus a replacement branch for unpublished work, and revert
commits for shared history.

## Complete the series

1. Confirm every ledger entry and owning plan is complete.
2. Review the full base-to-integration diff, not only the final slice.
3. Fix aggregate findings on a dedicated finalization task branch, review and
   verify them, then integrate the resulting commit through the same local loop.
4. Inventory all verification surfaces from repository instructions, package
   scripts, test configuration, workflow files, and changed components.
5. Fetch the configured primary remote and integrate its latest protected base
   reference into the integration branch before final aggregate testing. Record
   the fetched base ref and commit.
6. Run the final gate on the exact integration tip:
   - run all repository-required checks;
   - run full suites, lint, type, build, packaging, and database checks for
     affected packages and contract-connected consumers;
   - run the API full test suite when API behavior, shared contracts, database
     behavior, cross-application integration, repository policy, or the user
     requires it; do not run it automatically for an isolated frontend-only or
     documentation-only series;
   - run the repository's source-controlled automated E2E suite when affected
     user flows, shared frontend infrastructure, or repository policy requires
     it; otherwise run the focused affected projects or record why it is
     inapplicable;
   - run a manual browser and visual review when runnable affected UI exists and
     a compatible capability is available; follow that capability's
     instructions and cover representative interaction, state, viewport,
     screenshot, and visual checks rather than repeating every unchanged state.
7. Keep manual browser review and automated E2E distinct. Use an available
   browser-testing surface for manual and visual review; do not describe a
   one-off browser pass as automated E2E coverage. If no compatible surface is
   available, record that fact instead of silently substituting a different
   verification category.
8. Fix failures, rerun affected checks, and repeat the aggregate gate until the
   exact integration tree passes. Explicitly record unavailable or
   inapplicable suites and the reason.
9. Publish the integration branch only after the final local gate passes, then
   open one integration-to-base review request with:
   - a summary of all slices and commit SHAs;
   - notable review findings and fixes;
   - any invalidated suffixes, recovery commits, or preserved exceptions;
   - scoped and exhaustive local verification;
   - unavailable tests and any required remote-only checks;
   - known warnings or unresolved decisions.
10. Run remote CI only for tests that could not run locally or checks enforced
    by repository policy. Verify that any CI evidence tested the current review
    head and record its commit and tree.
11. Leave the review request open unless the user explicitly authorizes the
    final merge.
12. Immediately before an authorized merge, fetch the recorded protected base
    ref again:
    - if it still equals the recorded base and the proposed merge result has the
      same Git tree as the fully validated integration tip, reuse the evidence
      and do not run duplicate post-merge CI;
    - if it changed, invalidate the checkpoint, integrate the new base, resolve
      conflicts, and rerun the final local gate. Rerun remote CI only for the
      remaining remote-only or required checks against the updated candidate;
    - if repository automation starts a duplicate base-branch run despite
      tree-equivalent evidence, skip or cancel it only when explicitly
      authorized, supported by the workflow, and compatible with required
      checks.
13. Follow repository policy or the user's requested squash merge. Compare the
    merged base tree with the validated candidate; a different tree requires
    new aggregate evidence.
14. Clean up the integration branch only after the final merge and only when
    authorized.

## Resume safely

On continuation:

1. Inspect the working tree, current branch, local and remote branches,
   integration/base tips, ledger, and final review request if one exists.
2. Reconstruct completed slices from commits and repository records.
3. Identify the first incomplete loop step.
4. Reuse valid branches and commits. Never recreate work solely because
   conversational context was lost.
5. If a final review request exists, confirm its head matches the local
   integration tree and re-fetch the protected base before reusing any
   evidence.

## Stop conditions

Stop and request direction when:

- overlapping user changes cannot be preserved safely;
- required checks conflict with the agreed CI budget;
- a review finding materially expands scope;
- credentials, permissions, or branch protection block the loop;
- a required delivery model would add promotion steps the user did not approve;
- cleanup would affect a branch not created for the series;
- production, deployment, destructive data, DNS, or other separately
  authorized actions become necessary.

Report integrated commits, local verification, review fixes, current branch
state, final review-request and CI status if present, remaining slices, and the
precise blocker. Never claim completion while required work remains.
