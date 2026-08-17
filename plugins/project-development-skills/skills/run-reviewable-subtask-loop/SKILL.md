---
name: run-reviewable-subtask-loop
description: Deliver a large implementation plan, migration, refactor, or roadmap as a sequential series of right-sized, locally reviewed subtask commits on one integration branch, with resumable per-subtask plan files by default and one aggregate delivery. Use only when the user explicitly requests this workflow or accepts it during user-initiated brainstorming or planning before coding; do not use it for ordinary coding requests with clear requirements. Subtasks are not subagents, so work stays in the main conversation unless the user separately approves the proposed agent count and scope after being warned that delegation can increase usage. Ask again before expanding the approved scope. Remote CI requires separate explicit authorization.
---

# Run Reviewable Subtask Loop

Deliver a large change as ordered, recoverable commits on a local integration
branch. Review and verify every subtask before integration, then run one complete
local gate and use one agreed aggregate publication path.

Use **task** for the user's complete requested outcome, **subtask** for one
independently reviewable and recoverable delivery unit, and **phase** only for an
optional group of related subtasks. Do not use these terms interchangeably.

## Enforce consent boundaries

1. Apply this workflow only after the explicit opt-in described in the
   frontmatter. A routine implementation plan, silence, or a general request to
   start coding is not acceptance.
2. Treat a subtask as a delivery and recovery boundary, not a delegated worker.
   Perform implementation, self-review, verification, and finalization
   sequentially in the main conversation by default.
3. Do not infer delegation approval from terms such as subtask, phase, review,
   reviewer, parallelizable, execute the plan, or use this skill. Before any
   delegation, explain why it helps, its usage impact, and the proposed agent
   count and scope, maximum concurrency, and roles. Obtain explicit approval and
   ask again before expanding the approved count, concurrency, roles, or scope.
4. Treat Remote CI as a separate consent boundary. Reading repository workflow
   files is always local discovery; triggering remote jobs requires explicit
   authorization for the current series and trigger. Read
   [references/remote-ci.md](references/remote-ci.md) when Remote CI is required,
   requested, or could start automatically.
5. Treat planning as read-only except for exact temporary plan artifacts the
   user requested or the durable-plan default below authorizes. Create branches,
   commits, merges, pushes, review requests, or branch deletions only when the
   user's execution request or repository workflow authorizes them. Never infer
   final-merge authorization from permission to implement or publish.

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
6. Agree on the subtask ledger, plan-persistence mode, verification budget, final
   local gate, publication path, Remote CI decision, and whether cleanup of this
   series' exact local branches is authorized. Disclose any push or review-
   request action that would automatically trigger Remote CI before taking it.

Use this normal topology:

```text
intended base
└── series integration
    └── one current local subtask branch
```

Keep the integration branch local until aggregate verification passes unless
the user explicitly requests remote backup or collaboration requires it. Do not
push subtask branches or open per-subtask review requests. During normal
execution, keep at most one live subtask branch and start every subtask from the
current verified integration tip.

## Choose and maintain the plan artifacts

Before the first source edit, present these execution modes once as a non-
blocking choice and state that durable subtask plans are the default:

- **Durable subtask plans:** create the master and all subtask plans first so the
  series can pause and resume between subtasks.
- **Continuous execution:** keep the ordered ledger in the conversation or an
  existing repository-owned progress surface and run the approved subtasks
  sequentially through the final gate without creating temporary plan files.

When execution is authorized and the user has not explicitly selected continuous
execution, proceed immediately with durable subtask plans. Do not issue a
blocking question solely to resolve this choice. Treat `docs/plans` as a
repository-relative path, but obey a higher-priority repository rule that
requires another planning location or forbids temporary tracked plans.

For durable subtask plans:

1. Choose one collision-free task slug and create only these series-owned paths:
   `docs/plans/<task-slug>-00-master.md` and
   `docs/plans/<task-slug>-NN-<subtask-slug>.md`, using zero-padded execution
   order for `NN`. Never overwrite an existing plan to reuse a name.
2. Put the agreed requirement baseline, initial base and integration SHAs,
   execution mode, subtask order, dependencies, status, branches, commits,
   verification, findings, and recovery tip in the master. Put one subtask's
   responsibility, acceptance criteria, scope, implementation notes, and
   focused checks only in that subtask's file. Record every exact owned path in
   the master.
3. Once execution and local commits are authorized, preserve the initial plan
   set as a dedicated setup checkpoint when repository policy permits. If the
   plans remain uncommitted, report that state and do not claim a clean branch.
4. Before implementing a subtask, read its exact plan plus the master and work
   only from that subtask's accepted scope. Do not preload later subtask plans
   unless a dependency or conflict requires them.
5. After the subtask is integrated and its integration check passes, update the
   master with the evidence and delete that exact subtask plan. Preserve the
   update and deletion as a progress checkpoint before starting the next subtask.
   Never delete plans by glob, prefix sweep, or directory-wide cleanup.
6. After the final subtask, verify that every subtask is complete and only the
   master remains. Keep the completed master while review is pending so another
   session can reconstruct progress.

When resuming, treat the master as routing metadata, not proof. Reconcile it
with Git, tests, and remaining exact subtask files before trusting its status.

## Plan coherent subtasks

Create an ordered ledger before editing. For each planned subtask, record:

- one responsibility and its acceptance criteria;
- files, modules, generated artifacts, or contracts in scope;
- prerequisite subtasks and affected dependents;
- planned branch name and focused local checks;
- documentation impact and the reason the boundary has distinct review, test,
  rollout, or recovery value.

As work proceeds, add the actual branch, commit SHA, review findings and fixes,
verification evidence, integration result, last-known-good tip, and cleanup
state. Do not require runtime values before they exist.

Choose the fewest subtasks that preserve meaningful boundaries. A good subtask
is a coherent delivery slice that:

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
roughly 12 subtasks requires a concrete justification for every remaining
boundary. Obtain user approval before materially changing a user-approved plan.

## Set the verification budget

Use three proportionate gates:

- **Subtask gate:** focused tests and checks for the changed responsibility, plus
  a cheap integration smoke when shared boundaries changed.
- **Phase gate:** an occasional focused cross-subtask contract check when several
  subtasks change the same boundary.
- **Final gate:** the complete locally runnable matrix required for all affected
  and contract-connected surfaces on the exact integration tip.

Prefer focused subtask gates, but allow a broader or full suite when it is cheap,
repository-required, or justified by the subtask's risk. Do not use lint or
formatting alone as evidence for a behavior change. Avoid repeatedly running an
expensive full matrix when a focused check gives reliable intermediate
evidence.

Run local checks before Remote CI unless the user explicitly requests a remote-
first exception. Remote checks may cover unavailable platforms, secrets,
infrastructure, or required trusted attestations of checks already run locally.
Do not intentionally trigger Remote CI per subtask.

Bind aggregate evidence to the commit SHA and Git tree SHA. Record exact local
commands and conclusions, unavailable checks and reasons, and authorized remote
evidence when used. Any source, generated-file, conflict-resolution, or merge
change that alters the final tree invalidates the aggregate evidence.

For a series with material UI/UX work, defer the planned manual visual and
screenshot pass until the Final gate. At that gate:

1. Use the built-in Browser when available and follow its instructions. Use
   Playwright MCP or another interactive browser surface only as a documented
   fallback. Keep source-controlled Playwright E2E distinct from manual browser
   verification.
2. Capture and inspect representative desktop and mobile viewports. Check the
   accepted layout, typography, spacing, imagery, interaction states,
   responsive behavior, overflow, text fit, and accessibility-relevant states.
3. Compare the rendered result directly with the agreed requirements and any
   approved screenshot, mockup, or concept. Record screenshot paths, mismatches,
   unavailable states, and the verification surface used.

Do not claim visual equivalence when the application could not be rendered.
Use an earlier interactive pass only when the user requests it or when it is
necessary to diagnose a blocker; do not present that pass as the Final gate.

## Execute each subtask

Repeat sequentially:

1. Switch to the clean integration tip and create the planned, series-unique
   subtask branch. Confirm the exact name is unused by another branch, worktree,
   session, or series, then record ownership in the ledger.
2. Implement the complete subtask with its focused tests, documentation, and
   generated artifacts.
3. Run its subtask gate and any justified phase gate.
4. Review the complete integration-to-subtask diff for correctness, regressions,
   contracts, authorization and data safety, validation, tests, documentation,
   accidental artifacts, and unrelated changes.
5. Fix every actionable finding, rerun affected checks, and review the final
   diff again.
6. Commit only when required local checks pass and no actionable finding
   remains. Follow repository commit conventions and prefer one final commit per
   subtask; consolidate local checkpoints when policy permits.
7. Return to integration and merge the reviewed commit locally, preferring
   fast-forward-only when the branch contains the intended single commit. Do not
   start another subtask first. If execution resumed after review, confirm the
   exact commit/tree still matches the reviewed diff before integration.
8. Verify the new integration tip and run a cheap smoke check when shared
   contracts or build boundaries changed. Mark it last-known-good only after
   required checks pass.
9. Record the commit, checks, findings, fixes, integration result, and recovery
   boundary. If cleanup was authorized, read
   [references/branch-cleanup.md](references/branch-cleanup.md) and delete only
   the exact merged local subtask branch after its ownership checks pass.

If review reveals a material scope change, stop and request direction. If an
integrated subtask becomes invalid, stop dependent work and read
[references/recovery.md](references/recovery.md) before changing history or
rebuilding the suffix.

## Complete the series

1. Confirm every ledger entry and owning plan item is complete. In durable-plan
   mode, confirm that only the exact master plan remains. Review the full base-
   to-integration diff, not only the final subtask.
2. Fix aggregate findings on a dedicated finalization branch and pass it
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
   and manual UI/visual surfaces that are locally runnable and applicable. For
   material UI/UX work, perform the desktop/mobile visual pass defined above.
   Keep manual browser review distinct from automated E2E.
6. Fix failures with affected checks, then repeat the exact final gate once the
   candidate is stable. Record the commit and tree SHAs with the final evidence.
7. Fetch again, then review the complete diff against the latest fetched
   intended base. When `origin/main` exists, also review
   `origin/main...integration` explicitly for bugs, regressions, missing
   requirements, accidental artifacts, and unsafe changes. Fix every actionable
   finding through the normal finalization loop, rerun affected checks, and
   repeat the complete Final gate because the candidate tree changed.
8. Re-read the agreed requirement baseline and map every criterion to delivered
   behavior and evidence. Report a **requirement-fit confidence** score from 0
   to 100, with deductions and remaining mismatches. Use 100 only when every
   agreed criterion is satisfied and verified with no known gap. If a gap is
   actionable and in scope, fix it and reassess; otherwise explain why it is
   impossible, inadvisable, ambiguous, or too large, propose a bounded next
   decision, and do not claim full completion.
9. Use the agreed aggregate publication path: either open one integration-to-
   base review request or commit and push without opening one. Take either path
   only after the final local gate and aggregate review pass and the required
   commit, push, or review-request actions are authorized. Summarize subtasks and
   SHAs, review findings and fixes, recovery, verification, unavailable checks,
   the confidence score, warnings, and unresolved decisions.
   For a commit-and-push path without a review request, treat explicit final-push
   authorization as acceptance of the candidate. In durable-plan mode, delete
   the exact master plan before that final commit and push, verify that no
   series-owned plan remains, review the changed candidate, and rerun the
   required final evidence because its tree changed. Obtain separate Remote CI
   authorization first when the push can trigger it.
10. If Remote CI is authorized, follow
   [references/remote-ci.md](references/remote-ci.md) and verify that approved
   checks tested the current review head. Otherwise report required remote-only
   or branch-protection checks as blockers without triggering them.
11. Leave the review request open unless final merge is explicitly authorized.
   Immediately before an authorized merge, fetch and compare the base again. A
   changed candidate tree requires new aggregate evidence.
12. When the user explicitly authorizes merge or squash-merge and durable-plan
    mode was used, delete the exact master plan before merging. Preserve that
    deletion on the review branch, verify that no series-owned plan remains,
    review the changed candidate, and rerun the required final evidence because
    its tree changed. If updating the branch can trigger Remote CI, obtain that
    separate authorization first. Do not delete the master merely because the
    implementation is complete or review is open.
13. Follow repository merge policy, verify the merged tree matches the validated
    candidate, and clean up the integration branch only when authorized and
    after the exact ownership checks pass.

## Resume safely

On continuation, always inspect the working tree, worktrees, branches,
integration/base tips, and review-request state. In durable-plan mode, reconcile
the master and remaining exact subtask plans with Git and verification evidence.
In continuous-execution mode, reconstruct progress from the conversation or
existing repository-owned ledger, Git, and verification evidence without
expecting plan files. Identify the first incomplete loop step and reuse valid
branches and commits. Never recreate work only because conversation context was
lost.

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
subtasks, and the precise blocker. Never claim completion while required work
remains.
