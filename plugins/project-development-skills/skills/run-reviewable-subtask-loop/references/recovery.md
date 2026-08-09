# Recover an invalid slice

Read this reference when a task or integrated slice becomes invalid. Treat every
verified integration commit as a recovery checkpoint.

## Identify the invalid suffix

1. Stop downstream dependent work.
2. Identify the earliest invalid commit and the last-known-good integration
   commit immediately before it.
3. Use ledger dependency edges to mark the invalid commit and every transitive
   dependent slice invalid. In `A -> B -> C -> D`, invalidating `C` invalidates
   both `C` and `D`.
4. Preserve a later slice only after its diff, contracts, and tests prove it is
   independent. A clean cherry-pick is not proof of independence.
5. Invalidate all aggregate evidence for the failed tree.

## Recover unpublished work

If the invalid slice is still on its task branch, discard it when it has no
reusable work. When useful, preserve reviewed, non-sensitive work in a temporary
local WIP commit on a uniquely named backup branch, then create a replacement
task branch from the unchanged integration checkpoint.

If an invalid suffix is already integrated but remains local and unpublished:

1. Create a uniquely named backup branch at the failed tip.
2. Create a replacement integration branch from the last-known-good commit.
3. Rebuild each invalidated slice through the normal implementation, review,
   verification, commit, and integration loop.
4. Keep the failed branch until the rebuilt suffix and final local gate pass.

Do not use destructive reset as routine recovery. Preserve the failed tip before
replacing an unpublished integration branch.

## Recover published work

If the invalid suffix was pushed or its final review request is open, do not
rewrite shared history by default.

1. Revert dependent commits in reverse order. Prefer one coherent, reviewed
   recovery change when repository policy permits; do not mark a temporarily
   broken intermediate revert as a checkpoint.
2. Rebuild invalidated slices with new commits and update the existing aggregate
   review request.
3. Replace or force-update a published integration branch only with explicit
   authorization after accounting for reviewer state and authorized Remote CI
   evidence.

## Revalidate and clean up

Run compact affected checks after each rebuilt slice and the full final gate on
the completed replacement tree. Bind all new evidence to the replacement commit
and tree SHAs.

Delete failed, backup, replacement, or superseded integration branches only
after recovery succeeds and cleanup is authorized. Read
[branch-cleanup.md](branch-cleanup.md) and apply its ownership checks to every
exact branch name. Never force-push as routine recovery.
