# Remote CI scope and evidence

Read workflow triggers and required-check policy before publishing the series. Read-only inspection of status is different from dispatching, rerunning, or cancelling jobs; respect an explicit no-remote-access instruction for both.

## Authorization

A request to push, open a PR, or merge ordinarily covers the repository's normal validation triggered by that action. Reuse that authorization rather than adding a blanket second CI approval. Explicit user or repository limits still govern: if remote CI is prohibited, separately permissioned, unexpectedly costly, or triggers deployment or another consequential side effect outside the request, explain the actual trigger and resolve it before publishing.

Do not broaden the workflow matrix, manually dispatch extra jobs, rerun unrelated checks, cancel another person's run, or change branch protection as a routine part of delivery. Establish authorization for material additional cost or side effects. A routine rerun needed to verify an in-scope fix can use the existing delivery authorization unless a stricter limit applies.

## Execution

Complete focused local checks first when appropriate, except when remote-first work is requested or the needed environment exists only in CI. Remote results can cover unavailable platforms, hosted infrastructure, secrets, and provider-required attestations. Do not repeat every remote job locally just to claim parity.

Publish the aggregate candidate instead of triggering CI per subtask. Avoid manual duplicate runs; do not use skip annotations that leave required checks pending. Cancel a duplicate only within authorization and without losing required evidence.

## Evidence

Record the run URL, conclusion, tested commit, and relevant environment. Ensure required checks apply to the current PR head before merging. Reuse older results only for responsibilities whose inputs and conditions are unchanged, and only when provider policy permits it. Changed code or configuration requires affected checks again; it does not automatically invalidate unrelated local evidence.

If a required remote check cannot run within the agreed scope, report the exact gap and obtain a decision when it makes delivery unsafe. Do not silently bypass it or claim completion.
