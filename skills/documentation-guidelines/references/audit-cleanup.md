# Documentation Audit And Cleanup

Use this reference for repository-wide or multi-module documentation audits,
consolidation, migrations, and stale-document removal.

## Audit Workflow

1. Discover repository instructions, documentation roots, generated outputs, link
   checks, and existing ownership conventions.
2. Inventory documents by semantic role: router, registry, owner, relationship map,
   runbook/reference, active coordination, or historical evidence.
3. Trace realistic module and feature tasks from the nearest router to their owner
   and required context.
4. Apply the context completeness gate to representative owner documents. Verify
   questionable facts against focused source, schemas, configuration, tests, and
   repository history.
5. Identify duplicated facts, competing owners, missing routes, hidden dependencies,
   stale names or links, and default paths polluted by historical material.

For an audit or review-only request, stop here and report findings and recommended
changes. Do not edit, move, or delete documentation without explicit authorization.

When the user requested cleanup or documentation changes:

6. Choose one owner for every duplicated durable fact before changing files.
7. Move still-valid facts into their owners, replace copies with links when useful,
   update incoming routes, and then remove obsolete files.
8. Run focused documentation checks and re-trace the affected context paths.
   After the cleanup is complete, list any broader repository or full-suite
   checks and ask the user whether to run them.

Do not redesign the entire documentation tree merely because a different layout is
possible. Require evidence of ambiguity, missing context, duplication, or excessive
maintenance fan-out.

## Audit Questions

### Discoverability

- Can an agent locate the correct owner from repository instructions or the nearest
  router without broad search?
- Are required context links explicit and distinct from optional material?
- Do renamed, moved, or archived entities still have stale incoming routes?

### Business Completeness

- Are outcome, scope, actors, permissions, preconditions, invariants, states,
  failures, side effects, dependencies, and evidence anchors present when relevant?
- Are exceptional and negative rules as discoverable as the happy path?
- Do technical contracts explain semantics rather than only data shape?

### Ownership And Duplication

- Does one durable fact have more than one manually maintained owner?
- Does a router or registry copy content from an owner document?
- Does a consumer copy provider validation, permissions, lifecycle, or error rules?
- Does a relationship map enumerate implementation details rather than ownership
  boundaries?

### Staleness And Evidence

- Do source symbols, paths, commands, schemas, and test anchors still exist?
- Does documentation claim behavior contradicted by authoritative code or tests?
- Are versions, dates, status fields, counts, or ownership metadata maintained
  mechanically without affecting routing or compatibility?

### Context Cost

- Must an agent read history, plans, delivery records, or unrelated architecture to
  understand an ordinary feature?
- Can repeated explanation be replaced by one owner link or an exact mapping table?
- Is prose explaining concepts a capable agent can infer reliably from code?
- Does an ordinary behavior change require edits to multiple synchronized indexes?

## Cleanup Decisions

| Document | Default action |
| :--- | :--- |
| Correct canonical owner, contract, or runbook | Keep and improve only where context is incomplete |
| Router that uniquely resolves ownership | Keep thin and correct its routes |
| Duplicate summary or copied contract | Move unique facts to the owner, replace with a link if needed, then remove |
| Completed plan or temporary handoff | Preserve durable decisions in owners or ADRs, then remove |
| Historical transcript or routine delivery log | Remove when tasks, pull requests, CI, and Git preserve sufficient history |
| Required audit, legal, migration, or operational archive | Retain outside the default context path and state why |
| Generated catalog | Fix its canonical source or generator; do not hand-edit the output |

Git history is normally sufficient recovery for deleted Markdown. Follow repository
policy and obtain any required approval before deleting material whose ownership or
retention purpose remains unclear.

## Verification

Use repository-provided checks first. Useful focused commands include:

```sh
rg --files -g '*.md'
rg -n 'old-name|old-path|duplicate-id' .
git diff --check
```

When available, run the repository's Markdown link, frontmatter, generated-file,
and documentation validation commands. Confirm after cleanup that:

- Every retained owner is reachable through the intended route.
- Required context reaches a complete business model without unrelated history.
- No removed path remains in links, indexes, frontmatter, or automation.
- No durable fact was lost when duplicate or historical files were removed.
- The new structure reduces ambiguity or maintenance fan-out in a demonstrable way.
