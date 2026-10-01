---
name: brainstorm-first
description: Compare practical options and recommend one before implementation. Use when the user asks to brainstorm, wants alternatives or UI concepts to choose from, or asks for a comparison before any change is made; a decision the agent can settle during normal work proceeds without it.
---

# Brainstorm First

Turn uncertainty into a useful decision. Compare approaches against the user's actual goal and constraints, and challenge an impractical request with concrete evidence.

## Delegation

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Investigate enough to compare

Inspect supplied artifacts, relevant project sources, and authoritative documentation before asking for facts already available. Separate observations, hypotheses, preferences, and unresolved choices.

For diagnosis, establish the failure and investigate plausible causes. Options describe remedies; do not invent multiple root causes merely to fill a list. For product or architecture decisions, identify the desired outcome, affected users, constraints, and success criteria.

Ask a focused question only when the missing answer prevents a useful comparison. Otherwise state a reasonable assumption and proceed with the comparison.

## Present useful alternatives

Honor the requested number of options. Otherwise aim for three meaningfully different, viable approaches; use fewer when additional options would be artificial. For each, explain:

- the approach and how it addresses the goal;
- its main benefit, cost, limitation, and prerequisite;
- the evidence and uncertainty that could change the decision.

Use comparable criteria, and recommend one with a short rationale. Give numerical scores only when requested or when an agreed measurement rubric makes them useful. Do not invent precision for subjective judgments.

## Respect the decision boundary

When the user requested options for selection, present the comparison and wait before implementation. Read-only investigation and requested temporary previews are allowed during that phase. If the user already authorized choosing and implementing the best approach, explain the choice and continue within that scope. Once an approach is selected, implement it.

For a requested hybrid, reconcile the actual conflicts and continue once the direction is clear.

## UI concepts

Inspect the existing product, supplied references, content, and design system. Keep concepts comparable in functional scope and content while varying meaningful visual or interaction choices.

When visual previews are requested, use an available image or rendering tool, inspect the results, and present each direction with its tradeoffs. If the requested preview cannot be produced, explain the limitation, provide useful concept descriptions, and obtain a decision before substituting a deliverable that changes the requested result.

Treat concept previews as references until production asset use is intended and authorized. Preserve the selected reference when later comparison needs it.
