---
name: run-reviewable-subtask-loop
description: Deliver a large implementation plan, migration, refactor, or roadmap as a sequential series of right-sized, locally reviewed commits on one integration branch, followed by one aggregate review request. Use only when the user explicitly requests this workflow or accepts it during user-initiated brainstorming or planning before coding; do not use it for ordinary coding requests with clear requirements. Subtasks are not subagents, so work stays in the main conversation unless the user separately approves the proposed agent count and scope after being warned that delegation can increase usage. Ask again before expanding the approved scope. Remote CI requires separate explicit authorization.
---

# Run Reviewable Subtask Loop

Deliver a large change as ordered, recoverable commits on a local integration
branch. Review and verify every slice before integration, then run one complete
local gate and open one aggregate review request.

## Enforce consent boundaries

1. Apply this workflow only after the explicit opt-in described in the
   frontmatter. A routine implementation plan, silence, or a general request to
   start coding is not acceptance.
2. Treat a subtask as a delivery and recovery boundary, not a delegated worker.
   Perform implementation, self-review, verification, and finalization
   sequentially in the main conversation by default.
3. Do not infer delegation approval from terms such as subtask, slice, review,
   reviewer, parallelizable, execute the plan, or use this skill. Before any
   delegation, explain why it helps, its usage impact, and the proposed agent
   count and scope, maximum concurrency, and roles. Obtain explicit approval and
   ask again before expanding the approved count, concurrency, roles, or scope.
4. Treat Remote CI as a separate consent boundary. Reading repository workflow
   files is always local discovery; triggering remote jobs requires explicit
   authorization for the current series and trigger. Read
   [references/remote-ci.md](references/remote-ci.md) when Remote CI is required,
   requested, or could start automatically.
5. Treat planning as read-only. Create branches, commits, merges, pushes, review
   requests, or branch deletions only when the user's execution request or
   repository workflow authorizes them. Never infer final-merge authorization
   from permission to implement or publish.

## Initialize the series

Before the first edit:

1. Read repository instructions, the implementation plan, relevant architecture
   and progress docs, workflow files, branch protection, and current Git state.
2. Determine the intended base branch, integration branch, required branch
   prefix, local verification commands, review-request path, documentation
   rules, and merge behavior.
3. Fetch configured remotes and explicitly compare the intended base with its
   fetched counterpart. If a clean, non-diverged base is behind, update it only
   with the repository-approved fast-forward operation. If freshness cannot be
   verified, or the base is dirty or diverged, report the exact state and obtain
   direction before editing from that base or changing history.
4. Create or reuse the series integration branch only after its base is fresh
   enough under repository policy. Default to an ephemeral local branch from
   the intended protected base; use an established delivery branch only when
   required.
5. Record the initial base and integration commit SHAs. Confirm the integration
   branch is not used by another worktree and starts clean.
6. Agree on the slice ledger, verification budget, final local gate, publication
   path, Remote CI decision, and whether cleanup of this series' exact local
   branches is authorized. Disclose any push or review-request action that would
   automatically trigger Remote CI before taking it.

Use this normal topology:

```text
intended base
└── series integration
    └── one current local task branch
```

Keep the integration branch local until aggregate verification passes unless
the user explicitly requests remote backup or collaboration requires it. Do not
push task branches or open per-slice review requests. During normal execution,
keep at most one live task branch and start every task from the current verified
integration tip.

## Plan coherent slices

Create an ordered ledger before editing. For each planned slice, record:

- one responsibility and its acceptance criteria;
- files, modules, generated artifacts, or contracts in scope;
- prerequisite slices and affected dependents;
- planned branch name and focused local checks;
- documentation impact and the reason the boundary has distinct review, test,
  rollout, or recovery value.

As work proceeds, add the actual branch, commit SHA, review findings and fixes,
verification evidence, integration result, last-known-good tip, and cleanup
state. Do not require runtime values before they exist.

Choose the fewest slices that preserve meaningful boundaries. A good slice:

1. implements one complete responsibility without a broken intermediate state;
2. tells one coherent review story;
3. has checks that can detect failure of that responsibility; and
4. would justify an independent keep, revert, or rebuild decision.

Merge adjacent work when the boundary is only a file, route, rename, checklist
row, mechanical edit, or shared verification command. Split work when it mixes
materially different contracts, failure modes, owners, rollout needs, security
or data scopes, migrations, public APIs, deployment boundaries, or unrelated
test surfaces. Keep generated output with its source change and never leave the
integration branch knowingly uncompilable.

When the ledger reaches high single digits, compress it explicitly. More than
roughly 12 slices requires a concrete justification for every remaining
boundary. Obtain user approval before materially changing a user-approved plan.

## Set the verification budget

Use three proportionate gates:

- **Slice gate:** focused tests and checks for the changed responsibility, plus
  a cheap integration smoke when shared boundaries changed.
- **Phase gate:** an occasional focused cross-slice contract check when several
  slices change the same boundary.
- **Final gate:** the complete locally runnable matrix required for all affected
  and contract-connected surfaces on the exact integration tip.

Prefer focused slice gates, but allow a broader or full suite when it is cheap,
repository-required, or justified by the slice's risk. Do not use lint or
formatting alone as evidence for a behavior change. Avoid repeatedly running an
expensive full matrix when a focused check gives reliable intermediate
evidence.

Run local checks before Remote CI unless the user explicitly requests a remote-
first exception. Remote checks may cover unavailable platforms, secrets,
infrastructure, or required trusted attestations of checks already run locally.
Do not intentionally trigger Remote CI per slice.

Bind aggregate evidence to the commit SHA and Git tree SHA. Record exact local
commands and conclusions, unavailable checks and reasons, and authorized remote
evidence when used. Any source, generated-file, conflict-resolution, or merge
change that alters the final tree invalidates the aggregate evidence.

## Execute each slice

Repeat sequentially:

1. Switch to the clean integration tip and create the planned, series-unique
   task branch. Confirm the exact name is unused by another branch, worktree,
   session, or series, then record ownership in the ledger.
2. Implement the complete slice with its focused tests, documentation, and
   generated artifacts.
3. Run its slice gate and any justified phase gate.
4. Review the complete integration-to-task diff for correctness, regressions,
   contracts, authorization and data safety, validation, tests, documentation,
   accidental artifacts, and unrelated changes.
5. Fix every actionable finding, rerun affected checks, and review the final
   diff again.
6. Commit only when required local checks pass and no actionable finding
   remains. Follow repository commit conventions and prefer one final commit per
   slice; consolidate local checkpoints when policy permits.
7. Return to integration and merge the reviewed commit locally, preferring
   fast-forward-only when the branch contains the intended single commit. Do not
   start another slice first. If execution resumed after review, confirm the
   exact commit/tree still matches the reviewed diff before integration.
8. Verify the new integration tip and run a cheap smoke check when shared
   contracts or build boundaries changed. Mark it last-known-good only after
   required checks pass.
9. Record the commit, checks, findings, fixes, integration result, and recovery
   boundary. If cleanup was authorized, read
   [references/branch-cleanup.md](references/branch-cleanup.md) and delete only
   the exact merged local task branch after its ownership checks pass.

If review reveals a material scope change, stop and request direction. If an
integrated slice becomes invalid, stop dependent work and read
[references/recovery.md](references/recovery.md) before changing history or
rebuilding the suffix.

## Complete the series

1. Confirm every ledger entry and owning plan item is complete. Review the full
   base-to-integration diff, not only the final slice.
2. Fix aggregate findings on a dedicated finalization task branch and pass it
   through the same review, verification, integration, and cleanup loop.
3. Fetch the intended base again and compare it with the recorded base. If it
   advanced, use the repository-approved integration method; obtain direction
   before an unapproved merge, rebase, or history rewrite. Resolve conflicts and
   invalidate prior aggregate evidence before retesting the changed tree.
4. Inventory repository instructions, package scripts, test configuration,
   workflow files, changed components, and every suite or harness introduced by
   the series. Mark each surface locally runnable, remote-only, or inapplicable
   with a reason.
5. Run the final local gate on the exact integration tip. Include all required
   affected lint, type, test, build, packaging, database, API, automated E2E,
   and manual UI/visual surfaces that are locally runnable and applicable. Keep
   manual browser review distinct from automated E2E.
6. Fix failures with affected checks, then repeat the exact final gate once the
   candidate is stable. Record the commit and tree SHAs with the final evidence.
7. Publish the integration branch and open one integration-to-base review
   request only after the final local gate passes and those actions are
   authorized. Summarize slices and SHAs, review findings and fixes, recovery,
   verification, unavailable checks, warnings, and unresolved decisions.
8. If Remote CI is authorized, follow
   [references/remote-ci.md](references/remote-ci.md) and verify that approved
   checks tested the current review head. Otherwise report required remote-only
   or branch-protection checks as blockers without triggering them.
9. Leave the review request open unless final merge is explicitly authorized.
   Immediately before an authorized merge, fetch and compare the base again. A
   changed candidate tree requires new aggregate evidence.
10. Follow repository merge policy, verify the merged tree matches the validated
    candidate, and clean up the integration branch only when authorized and
    after the exact ownership checks pass.

## Resume safely

On continuation, inspect the working tree, worktrees, branches, ledger,
integration/base tips, and review request. Reconstruct completed slices from
commits and durable records, identify the first incomplete loop step, and reuse
valid branches and commits. Never recreate work only because conversation
context was lost.

Before cleanup, rebuild ownership from the ledger. If ownership is missing or
uncertain, treat every existing branch as belonging to someone else and ask the
user which branches belong to this series. Re-fetch the intended base before
reusing final evidence.

## Stop conditions

Stop and request direction when:

- overlapping user changes cannot be preserved safely;
- base freshness, permissions, credentials, or branch protection block the
  loop;
- required checks conflict with the agreed verification or Remote CI budget;
- a finding materially expands scope;
- repository delivery rules require unapproved promotion or history changes;
- branch ownership or cleanup safety is uncertain; or
- production, deployment, destructive data, DNS, or another separately
  authorized action becomes necessary.

Report integrated commits, local verification, review fixes, current branch,
review-request state, authorized Remote CI state when applicable, remaining
slices, and the precise blocker. Never claim completion while required work
remains.
