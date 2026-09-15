# Branch cleanup

Delete only exact task-owned branches covered by the user's cleanup request.

Before deletion, confirm the branch name and recorded tip, inspect worktrees, and verify that no other session has advanced or is using it. A matching name prefix is not ownership evidence. Preserve the protected base and unrelated branches.

For an ordinary merge, verify ancestry into the intended destination and prefer a safe delete that refuses unmerged work. For a squash merge, ancestry alone will not match: verify the PR is merged, its recorded head matches the owned branch, and the resulting commit/diff accounts for the delivered changes. Then delete that exact branch if cleanup is authorized. Use forced local deletion only after proving there is no unique work to lose or obtaining explicit authorization to discard it.

Apply equivalent ownership and merge checks before deleting the task's remote branch. Confirm it has not advanced since review. Delete exact names only; do not sweep by glob, prefix, or a repository-wide “merged branches” list.

Keep recovery branches until their useful work is integrated or their discard is authorized. If ownership or merge evidence is uncertain, preserve the branch and report the unresolved check.
