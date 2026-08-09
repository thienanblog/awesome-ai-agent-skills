# Remote CI authorization and evidence

Read this reference only when Remote CI is requested, required, or could be
started automatically by a push or review request.

## Separate observation from execution

- Inspect local workflow files and branch-protection configuration during normal
  discovery.
- Read live remote check metadata when needed to identify required status or
  report a blocker. Read-only observation does not authorize a new run.
- If the user explicitly chose no remote access, do not inspect, poll, monitor,
  or download remote state.
- Never dispatch, rerun, cancel, or intentionally trigger a remote job without
  explicit authorization covering that action.

## Establish authorization

Before the first action that can trigger Remote CI, disclose:

- the branch or review-request event that will trigger it;
- the expected workflows or required checks;
- why each remote surface is needed;
- when it will run relative to the final local gate; and
- whether duplicate-run cancellation may be needed.

Obtain explicit approval for the current series and trigger. Permission to
implement, commit, push, publish, open a review request, merge, or release does
not by itself authorize Remote CI. If a push or review request starts checks
automatically, obtain authorization before that action.

Authorization never implies per-slice Remote CI. Ask again before expanding the
approved trigger, jobs, branch, or cancellation scope. A materially changed
candidate may require renewed authorization when the prior approval did not
cover reruns.

## Run local first

Unless the user explicitly requests a remote-first exception:

1. Run every applicable locally runnable final check on the exact integration
   tip.
2. Fix local failures and repeat the stable final gate.
3. Trigger only the approved remote checks on the current review head.

Remote checks may provide:

- platform or runtime matrices unavailable locally;
- secret-dependent or hosted-infrastructure coverage;
- repository-required branch-protection status; or
- trusted remote attestation of a check already reproduced locally.

Do not shorten the local gate merely because an equivalent remote check is
authorized. When the user explicitly requests remote-first or remote-only
execution, confirm the trigger and scope, record why local execution is being
replaced, and follow that instruction.

## Minimize duplicate runs

Use the minimum repository-compliant run count. If push and review-request
events unavoidably create duplicates, cancel a redundant run only when
cancellation was authorized and required checks will still report correctly.
Do not weaken branch protection, permanently rewrite workflows, or use skip
annotations that leave required checks pending.

Do not manually dispatch duplicate post-merge CI when tree-equivalent evidence
is reusable. If repository automation starts a base-branch run automatically,
cancel or skip it only when explicitly authorized and compatible with required
checks.

## Record evidence

Record:

- integration commit SHA, Git tree SHA, branch, and trigger;
- CI run URL and approved check conclusions;
- the current review-head SHA tested by each required check; and
- the remote-only coverage or trusted attestation each check adds.

Any change to the candidate tree invalidates this evidence. Re-run Remote CI
only when existing authorization covers the updated candidate; otherwise ask
before triggering it again.
