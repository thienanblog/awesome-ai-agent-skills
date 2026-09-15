# Recover invalidated work

Stop dependent work and identify the earliest invalid change, affected dependents, and last verified integration tip. A clean cherry-pick does not prove a later change is independent; inspect its contracts and tests.

## Preserve first

Inspect user changes and current publication state. Preserve a uniquely named recovery branch or other project-supported checkpoint before an authorized history change. Do not automatically reset, discard, or rewrite history. An ordinary forward fix is often sufficient.

For unpublished work that needs rebuilding, create a replacement branch from the verified checkpoint and reconstruct only the invalidated responsibilities. Keep the failed tip until the replacement passes the relevant checks.

For published work, prefer reviewed forward fixes or coherent revert/rebuild commits. Shared-history rewriting requires explicit authorization and consideration of active reviewers and CI. Preserve dependent behavior while recovering; do not label a knowingly broken intermediate state complete.

## Revalidate

Review the recovery diff and run checks for rebuilt responsibilities and affected cross-subtask contracts. Reuse evidence only where inputs and conditions remain valid. Record new commits and recovery points; a full-suite rerun needs a concrete coverage reason and any approval required by project policy.

Clean up exact task-owned recovery branches only after successful recovery and within authorization, following [branch-cleanup.md](branch-cleanup.md). Report remaining invalid work or unsafe recovery choices directly.
