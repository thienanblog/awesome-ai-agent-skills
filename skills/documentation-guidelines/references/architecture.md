# Documentation Architecture

Use this reference when documentation spans multiple owners or when the existing
layout no longer routes agents reliably. Choose the smallest architecture that
solves the observed discovery problem.

## Semantic Layers

| Layer | Owns | Must not own |
| :--- | :--- | :--- |
| Router | Where an agent should go for a scope | Copied business rules or entity catalogs |
| Registry | Stable identity, responsibility, status, and owner link when a catalog is justified | Detailed behavior or task history |
| Owner document | Durable business semantics and contracts enforced by that owner | Full copies of another owner's rules |
| Relationship map | Material dependencies across ownership boundaries | Every internal call or package import |
| Runbook or reference | Operational procedures or stable lookup data | Product narrative and delivery transcripts |
| Work evidence | Tasks, pull requests, tests, CI, and Git history | Default durable product context |

The default route should reach an owner document and its required context without
passing through historical records or exhaustive catalogs.

## Select A Proportionate Shape

### Small Project

A root README or `docs/README.md` plus a few owner documents may be enough. Do not
create module and feature registries until navigation has become ambiguous or
manual lists already need synchronization.

```text
docs/
  README.md
  order-workflow.md
  deployment-runbook.md
```

### Modular Project

Give each stable module an owner page. Add one project router if agents otherwise
need to search to identify ownership.

```text
docs/
  README.md
  modules/
    orders.md
    payments.md
  runbooks/
```

### Large Monorepo

Prefer repository-local ownership with a thin root router. Add a relationship map
only for material cross-repository contracts. A module or feature registry may be
useful when the number of owners makes direct routing unwieldy.

```text
docs/
  README.md
  relationships.md
apps/
  api/docs/
  web/docs/
packages/
  billing/docs/
```

These are examples, not required names or layouts. Preserve existing conventions
when they still provide a short and unambiguous context path.

## Router Contract

A useful router answers only:

- Which owner covers this business area?
- What is that owner's responsibility?
- Which document is the canonical entrypoint?
- Which shared relationship, decision, or runbook is required for this scope?

Do not copy module details into the router. Mark required context separately from
additional context when agents would otherwise over-read or miss a dependency.

## Registry Decision

Create or retain a registry only when at least one of these is true:

- Agents repeatedly cannot locate the canonical owner.
- Stable IDs, status, responsibility, or ownership must be compared across many
  entities.
- Automation consumes the registry.
- Multiple repositories need one authoritative catalog.

Keep each field in one manually maintained registry. Generate alternate views when
the same entities must be presented elsewhere.

## Relationship Map Decision

Record a relationship when changing one owner may require another owner to change
behavior, compatibility, deployment order, data handling, or operations. Include:

- The two owners and direction of dependency.
- The canonical contract.
- Why the relationship matters.
- Compatibility or sequencing constraints.

Do not model ordinary internal calls that source exploration can recover cheaply.

## Current And Historical Context

- Keep current priorities in an existing progress hub only when the repository uses
  one for active coordination; update it by milestone, not every task.
- Keep durable multi-milestone plans only while they have an owner and an explicit
  completion or removal condition.
- Keep delivery records only for significant releases, migrations, production
  changes, regulated evidence, or explicit handoffs.
- Move durable decisions into owner docs or ADRs. Remove completed plans, temporary
  handoffs, redirects, and transcripts when Git or the issue system already owns the
  history.
- Place required archives outside the default agent context path and state their
  audit, legal, migration, or operational purpose.
