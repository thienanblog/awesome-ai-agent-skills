---
name: documentation-guidelines
description: Create, reorganize, audit, clean up, or update proportionate documentation for monorepos and single-project repositories. Use for documentation architecture, source-of-truth ownership, minimal routing indexes, module or feature docs, API contracts, workflows, runbooks, optional roadmaps and delivery records, documentation-churn reduction, and removing obsolete plans, notes, archives, or stale references that pollute agent context.
---

# Documentation Guidelines

## Goal

Keep documentation discoverable, owned, and proportionate. Update a document
only when the durable source of truth it owns materially changes. Git, pull
requests, tests, and CI already own task-level history and evidence.

Repository instructions override this skill when they are newer or more
specific.

Run this skill in the main conversation. Do not spawn subagents or delegated
workers unless the user is told that delegation can increase usage and
explicitly approves the proposed count and scope. Ask again before expanding
an approved scope.

Read `references/documentation-guidelines.md` when creating a documentation
architecture, using templates, or performing a broad reorganization.

## Documentation Impact Gate

Decide whether docs need to change before editing them.

| Change | Default documentation action |
| :--- | :--- |
| Internal refactor, test-only change, typo, formatting, dependency refresh with no workflow change | No docs update |
| Bug fix that restores already-documented behavior | No docs update |
| Material user-visible behavior or module workflow change | Update one canonical owner doc |
| Public API, schema, event, permission, validation, or cross-repo contract change | Update the contract owner and any affected relationship-map entry; update a consumer doc only for consumer-specific behavior |
| Setup, command, environment, migration, seed, deployment, recovery, or operational change | Update the owning runbook/reference |
| Stable cross-project convention or architecture decision | Update the owning guide or ADR |
| Active planned scope, decision, status, or next slice changes | Update the active task or issue; update a durable roadmap only when the repository intentionally uses one |
| Add, rename, move, archive, or remove a repo/module/feature | Update its one canonical registry and affected router links |
| Significant release, migration, production change, cross-app feature, or explicit handoff | Add a delivery record only if the repository uses them |
| Obsolete plan, handoff note, delivery transcript, redirect, or archive | Move any still-valid fact to its owner, remove stale references, then delete the obsolete file when Git history is sufficient |

Do not create a docs edit merely to prove that docs were reviewed. When no
durable source of truth changed, report that no documentation update was
needed.

## Reading Rule

Use the smallest default context path: repository instructions, one current
progress hub when present, and one owner document. Open a router only when the
owner is unclear. Open maps, ADRs, references, runbooks, delivery records, and
roadmaps only when the task specifically requires their contracts.

Before editing, moving, merging, or deleting documentation:

1. Read every target file completely.
2. Read the nearest routing index needed to identify the owner.
3. Read the canonical owner doc and relationships that can materially affect
   the task.
4. Read consumer docs only when their local behavior may change.
5. If two docs appear duplicated, read both and identify the owner before
   consolidating them.
6. Do not recursively follow every link or require every root, repo, module,
   and feature index for a small,
   already-routed task.
7. Do not infer business rules from filenames, folder names, translated labels,
   or stale summaries.
8. If routing remains ambiguous after reading the available indexes, ask one
   targeted question before editing instead of guessing.

## Documentation Shape

### Monorepo

```text
docs/
  README.md
  project-progress.md
  relationship-map.md
  decisions/
  runbooks/

apps/<repo>/
  docs/
    README.md
    modules.md
    features.md
    architecture/
    modules/
      <module-id>/
        <module-id>-module.md
        features/
          <feature-id>-feature.md
        workflows/
        runbooks/
    reference/
```

Root `docs/README.md` is a router. It links to repository indexes,
cross-repository relationships, root-owned decisions, and shared runbooks. It
must not copy every module or feature row.

Each repo `docs/README.md` is also a router. It links to its canonical
`modules.md`, optional `features.md`, architecture, references, and
runbooks. It must not duplicate the module table.

`modules.md` is the canonical module registry for the owning repo.
`features.md` is optional; use it only when feature-level discovery provides
real value. Do not maintain a second registry in a README or naming guide.

Detailed docs live with the enforcement owner. A root-owned business doc is
appropriate only when the root project genuinely owns that cross-repo
contract, not merely to centralize information.

### Single Project

Use the same ownership model under root `docs/`. Keep one `modules.md` and,
when useful, one `features.md`; do not repeat their rows in `docs/README.md`.

## Ownership

| Information | Canonical owner |
| :--- | :--- |
| API payloads, errors, permissions, validation, database rules | Backend/API contract owner |
| UI routes, rendering, client state, form flow | Owning client module |
| Jobs, queues, schedules, retries | Owning worker/service |
| Shared package public APIs | Owning package |
| Cross-repo dependency | Contract owner plus an affected relationship-map entry |
| Setup, scripts, deployment, recovery | Owning runbook/tooling area |
| Current priorities | One progress hub |
| Pending work | Active plan or issue tracker |
| Exact task implementation, review, commands, screenshots, CI output | Pull request, tests, CI, and Git |
| Significant historical delivery summary | Optional delivery record |

Consumer docs link to the owner and document only local consumption behavior.
Do not copy complete backend rules into clients.

## Index Rules

- Keep exactly one registry for each entity type.
- Update an index when an indexed entity or indexed field changes: add, rename,
  move, archive, remove, owner link, responsibility, relationship, or status.
- Root and repo READMEs route to canonical indexes instead of copying rows.
- Prefer links over synchronized summaries.
- If a feature index becomes an exhaustive copy of module docs, remove it or
  generate it.
- Delete obsolete redirects, task notes, completed plans, and historical
  transcripts after preserving any durable owner facts. Keep an archive only
  for a stated operational, audit, legal, or migration need; Git history is
  normally sufficient.
- Generate derived catalogs when practical; do not hand-maintain the same rows
  in multiple files.

## Naming

Use searchable suffixes for detailed docs:

| Suffix | Purpose |
| :--- | :--- |
| `-module.md` | Module ownership and stable boundaries |
| `-feature.md` | Material feature or contract |
| `-workflow.md` | Multi-step business or UI flow |
| `-runbook.md` | Operations, maintenance, incident, or debugging procedure |
| `-reference.md` | Stable catalog, mapping, or compatibility reference |
| `-testing.md` | Durable test strategy or environment rules |
| `-roadmap.md` | Planned phases and milestones |
| `-adr.md` | Architecture decision |

Reserve `README.md` for intentional entrypoints and routers.

## Frontmatter

Frontmatter is optional unless the repository uses it for routing, automation,
or a genuinely versioned contract.

Use stable identity fields when machine routing needs them:

```yaml
---
name: Order Module
description: Backend order ownership and contracts.
repo_id: api
module_id: order
maintained_by: Backend Team
---
```

Do not require `version` or `last_updated` for ordinary Markdown. Git owns
history. Use semantic versions only for real external or machine-consumed
contracts, and dates only when temporal validity matters.

## Plans, Progress, And Delivery

- A progress hub contains current state, a small current priority list, and
  owner routes. Update it by milestone, not by task.
- Keep ordinary task planning in the active task, issue, or pull request.
  Create a tracked roadmap only for durable multi-milestone coordination with
  a named owner, active status, and removal/archive condition.
- Delete completed or abandoned plans after moving still-valid decisions into
  owner docs or ADRs. Do not retain them merely because they once existed.
- Treat handoff notes and context snapshots as temporary. Delete them when the
  receiving owner docs and current-state hub contain the durable facts.
- Delivery records are optional. Use them for significant releases,
  migrations, production/operations changes, cross-app contracts, large
  features, or explicitly requested handoffs.
- Do not require a delivery record for every bug fix, refactor, test, or small
  task.
- Do not keep a monolithic chronological delivery transcript in the default
  documentation tree. Use Git and pull requests for detailed history.
- Keep exact commands, raw output, screenshots, review discussion, and CI
  evidence in the pull request or test system.
- Do not add SQLite solely to track documentation deliveries. If structured
  reporting becomes necessary, generate an untracked cache from Git-tracked
  sources.

## Workflow

1. Run the documentation impact gate.
2. Identify the one enforcement owner for each changed fact.
3. Read the target and only the routing/relationship context needed to edit it
   safely.
4. Update the smallest set of canonical docs that would otherwise be wrong.
5. Update indexes when an indexed entity or indexed field changes; do not churn
   them for behavior that the table does not represent.
6. Update relationship-map entries when a cross-repo dependency or required
   integration context changes.
7. Remove contradictory or duplicated text instead of appending another
   summary.
8. For cleanup, move only still-valid durable facts to their canonical owner,
   then delete obsolete files instead of replacing them with archives by
   default.
9. Search for stale paths, names, IDs, Markdown links, and frontmatter
   references affected by the change.
10. Verify links and any repository-specific documentation checks.
11. Report why docs changed, or why no docs update was needed.

## Content Guidance

For an API contract, include only applicable durable information: purpose,
ownership, endpoint or event shape, authentication, authorization, validation,
errors, scoping, state transitions, side effects, compatibility, migration, and
consumer links.

For a client workflow, include only applicable durable information: entry
points, route/screen ownership, consumed contracts, local state, client-only
rules, accessibility, rollout, and troubleshooting.

For a runbook, optimize for safe execution: prerequisites, exact commands,
target environment, non-destructive defaults, verification, rollback, and
known failure modes.

Do not copy source inventories, test counts, or implementation details that are
easier and more accurate to discover from code unless they are essential to a
stable operational contract.

## Verification

Before finishing, verify only what the change affects:

- Every new or moved doc is reachable from its canonical router or index.
- The default reading path reaches one owner without loading unrelated history.
- No entity was added to multiple manually maintained registries.
- Owner and consumer docs do not duplicate the same contract.
- Links, renamed paths, identifiers, and relationship-map entries remain valid.
- Retained archives have a concrete non-Git purpose and are outside the default
  reading path.
- Frontmatter exists only when required by repository policy or automation.
- The final documentation fan-out is proportionate to the changed source of
  truth.

## Resources

- `references/documentation-guidelines.md`: architecture examples, concise
  templates, and an audit checklist for reducing documentation churn.
