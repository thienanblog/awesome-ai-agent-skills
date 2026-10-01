---
name: project-development-mindset
description: Plan and carry repository changes through implementation, verification, and handoff. Use only when the user invokes this skill by name; ordinary repository changes proceed without it.
disable-model-invocation: true
---

# Project Development Mindset

Deliver the requested outcome using project evidence and the smallest coherent change. Scale investigation and verification to impact, uncertainty, and reversibility.

## Delegation

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Establish the task

- Inspect applicable instructions, Git state, and the source, tests, configuration, and docs relevant to the request. Preserve unrelated user work and follow the repository's branch and freshness policy.
- Identify observable success criteria and affected contracts. Plan in proportion to dependencies and uncertainty.
- Distinguish intended behavior from current behavior. Resolve stale or conflicting docs against source and runtime evidence; ask only when the remaining choice belongs to the user.
- Keep the original objective and accepted changes in view during long work. A status question or correction usually steers the task rather than replacing it.

## Implement

- Reuse project components, dependencies, commands, and architecture when their semantics fit. Change a harmful pattern only where it affects this task.
- Keep abstractions tied to current invariants or meaningful reuse. Avoid speculative options, new frameworks, and adjacent cleanup without a present need.
- Inspect affected callers and consumers when changing public APIs, persisted data, permissions, or cross-project contracts.
- Use installed versions and official documentation for uncertain external APIs. Keep credentials out of source, logs, fixtures, and output.
- Carry authorized work through to completion. Prepare a concrete, reviewable result before requesting any still-missing approval for publication, deployment, or other consequential actions. Do not infer those actions from an ordinary implementation request.

## Verify and review

- Choose checks that can detect failures in the changed behavior, using the project's existing tools. Complete required checks and follow any explicit testing budget.
- Add regression coverage when it protects meaningful behavior. Skip tests that merely duplicate a reversible, low-impact edit.
- Reuse passing evidence for unchanged code and equivalent environments. Expand or repeat checks for new changes, failures, affected contracts, or unresolved risks; stop once the evidence is sufficient. Offer a broader suite only when it would resolve a concrete gap, respecting repository approval requirements.
- For material UI changes, inspect the rendered result at relevant states and viewports under the host's browser policy. Distinguish manual browser evidence from automated E2E tests.
- Review the complete task diff against the intended base for missing requirements, regressions, unsafe changes, and accidental files. Fix actionable findings and rerun affected checks.
- Update durable documentation when behavior, setup, commands, ownership, or contracts change. Use existing owners instead of creating new documentation structures for routine work.

## Use specialist guidance selectively

Routine tests, docs edits, framework commands, and browser checks stay part of implementation. Bring in a specialist skill when its domain is the main difficulty of the current step.

Read [quality-skill-routing.md](references/quality-skill-routing.md) when choosing a specialist would help, or [ui-ux-concept-routing.md](references/ui-ux-concept-routing.md) for visual decisions and reference matching. Load only relevant guidance, avoid running two workflows for the same responsibility, and let go of a phase's instructions once the task moves on. An unavailable optional skill should not block work the current tools can complete.

`run-reviewable-subtask-loop` is the user's to invoke; task size and internal subtasks neither activate it nor authorize subagents.

## Handoff

Lead with what changed and why. Report relevant checks and their results, remaining gaps, and any decision still needed. Compare the delivered behavior with the user's criteria; fix in-scope gaps before stopping. Describe remaining uncertainty through the evidence behind it.
