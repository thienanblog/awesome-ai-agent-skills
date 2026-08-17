# Branch cleanup safety

Read this reference immediately before deleting any subtask, recovery,
finalization, backup, replacement, or integration branch created by the series.

Delete a branch only when cleanup was authorized and all of these checks pass:

1. The exact branch name appears in the series ledger as a branch this series
   created. A matching prefix or naming pattern is not ownership evidence.
2. The branch is not checked out in another worktree or used by another session.
   Inspect the repository worktree list first.
3. The branch tip is the exact commit recorded by this series. If it moved,
   someone else may have written to it; keep it and report the discrepancy.
4. For a completed subtask branch, its exact tip is integrated into the intended
   integration branch and the required checkpoint checks passed.
5. The target is not the protected base, a remote branch, another session's
   branch, or the integration branch before final merge.

Delete by exact name only. Never use a glob, wildcard, prefix sweep, bulk
"delete merged branches" operation, or a branch discovered only by listing the
repository. Prefer the safe delete that refuses unmerged work.

Use a forced delete only for an exact branch this series created whose work is
intentionally being discarded, and only when cleanup authorization covers that
discard. If any ownership or safety check fails, keep the branch and report its
name and the failed check.

Apply the same rules to the integration branch after final merge. By then every
normal subtask branch should already have been handled at its integration step.
