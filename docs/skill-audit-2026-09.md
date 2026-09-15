# September 2026 skill audit and review

## Scope and basis

Reviewed all 15 canonical skill entrypoints and scanned their companion references, templates, adapter prompts, and plugin descriptions for conflicting behavior guidance. Rewrote the entrypoints at different depths: workflow-heavy skills needed substantial reduction; domain guides mostly needed targeted edits. No skills or plugin groups were added, removed, or renamed. Helper implementations and domain configuration assets remain unchanged.

OpenAI's [GPT-6 Astra prompting guidance](https://developers.openai.com/api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices), consulted on September 15, 2026, identifies sensitivity to skill instructions, unnecessary clarification pauses, and over-broad testing as areas to tune. That informs this editorial revision; it does not establish that any shorter prompt is automatically better.

The library remains tool-agnostic and does not select a model, change reasoning settings, or require Astra. Repository/user constraints, meaningful verification, data integrity, production authorization, and delegation consent remain part of the contract.

## Per-skill result

Counts use whitespace-separated words in the complete canonical `SKILL.md`, including frontmatter. They are a reproducible text-size measure, not model token counts, latency measurements, or a quality score. A few already focused guides grew slightly to clarify authorization or retained constraints.

| Skill | Words before → after | Change |
|---|---:|---|
| [agents-md-generator](../skills/agents-md-generator/SKILL.md) | 1,574 → 674 | Make the detector and size targets advisory; preserve instruction ownership and symlinks; retain source verification and context-limit checks. |
| [brainstorm-first](../skills/brainstorm-first/SKILL.md) | 1,338 → 512 | Honor requested option counts and selection boundaries; drop compulsory scoring and repeated three-option cycles; allow an authorized choose-and-implement request. |
| [debugging-workflow](../skills/debugging-workflow/SKILL.md) | 622 → 385 | Condense investigation and proof; allow independent observations; remove forced image annotation and routine full-suite offers. |
| [design-system-generator](../skills/design-system-generator/SKILL.md) | 1,116 → 518 | Replace the nine-question intake and fixed output structure with project discovery and a topic menu; make manifests, exports, and instruction patches conditional. |
| [docker-local-dev](../skills/docker-local-dev/SKILL.md) | 1,264 → 1,327 | Reuse setup/runtime authorization; make detection optional; retain service, data, exposure, readiness, and scan-scope boundaries; clarify helper paths versus project working directory. |
| [documentation-guidelines](../skills/documentation-guidelines/SKILL.md) | 1,018 → 594 | Keep durable ownership and contract checks while removing a universal context gate and post-task full-suite question. |
| [laravel-11-12-app-guidelines](../skills/laravel-11-12-app-guidelines/SKILL.md) | 822 → 803 | Remove coordinator handoffs and repeated testing approval; preserve version-specific framework guidance and destructive-data boundaries; remove assumed docs index and unconditional Pint invocation. |
| [laravel-13-app-guidelines](../skills/laravel-13-app-guidelines/SKILL.md) | 1,403 → 1,369 | Simplify routing and test cadence while retaining installed-version detection, framework constraints, optional feature selection, and production-data safeguards. |
| [office-web-ui-system](../skills/office-web-ui-system/SKILL.md) | 1,716 → 589 | Condense the ten-stage process; make archetypes, visual treatments, locators, and scanner usage conditional; preserve operational density and rendered verification. |
| [performance-optimization](../skills/performance-optimization/SKILL.md) | 717 → 729 | Keep comparable benchmark inputs, repetitions, health, cleanup, and cache correctness; remove routing ceremony and automatic broader-suite offers. |
| [project-development-mindset](../skills/project-development-mindset/SKILL.md) | 2,202 → 707 | Replace the long coordinator protocol with outcome, evidence, implementation, and review; remove skill-count limits and mandatory numerical confidence. |
| [run-reviewable-subtask-loop](../skills/run-reviewable-subtask-loop/SKILL.md) | 3,055 → 945 | Use sequential reviewed commits on one integration branch by default; make extra branches and durable plans conditional; reuse valid evidence and delivery authorization for ordinary CI. |
| [testing-verification](../skills/testing-verification/SKILL.md) | 495 → 394 | Keep behavior-based coverage and browser/E2E distinctions; stop when sufficient evidence exists instead of always offering another suite. |
| [ui-ux-concept-implementation](../skills/ui-ux-concept-implementation/SKILL.md) | 645 → 657 | Retain the visual contract and equivalent-state comparison; remove formal coordinator round trips and reuse authorized direction selection. |
| [vps-docker-traefik-deploy](../skills/vps-docker-traefik-deploy/SKILL.md) | 579 → 572 | Tailor preparation and reporting to new infrastructure versus routine releases; retain live-operation scope, immutable releases, private services, and recovery requirements. |

Total: **18,566 → 10,775 words**, a **42.0% reduction**, relative to `193b04b` (`v1.31.1`). Generated package copies are excluded from this count.

## Review findings and fixes

The second editorial pass compared removed rules with the final contracts and searched supporting files for old instructions that would restore the behavior being removed.

- **Companion-rule conflicts:** aligned test, performance, documentation, design-system, UI routing, and locator references. Templates no longer require full-suite questions, annotation, asset manifests, or a semantic-class rewrite for every task.
- **Authorization regression risk:** retained explicit local-only/CI-budget limits, environment-specific permission for consequential operations, delegation count/scope consent, and required repository gates. Ordinary CI can accompany an authorized publication request; unrelated deployment or extra cost cannot silently inherit that permission.
- **Evidence reuse:** narrowed invalidation to affected inputs and conditions while preserving provider checks on the current PR head. Progress-document edits no longer force every runtime test again.
- **Recovery and squash cleanup:** preserved task ownership and user changes; clarified proof of integration after squash, where ordinary ancestry does not match. No wildcard branch cleanup or automatic shared-history rewriting.
- **Installed helper paths:** separated the Docker helper location from the target project's working directory, and retained the absolute skill-directory pattern for the UI locator scanner.
- **Discovery assumptions:** made detectors optional for known-file edits and removed the assumption that a `docs/` directory contains `docs/README.md`.
- **Metadata consistency:** updated plugin default prompts, selected adapter prompts, README usage, and contributor guidance to match direct specialist use and adaptive workflow rules. Preserved the tracked `AGENTS.md` symlink to `CLAUDE.md`.

## Scenario review

These are manual instruction-consistency checks, not executions of another model or automated behavioral evaluations.

| Scenario | Expected behavior supported by the revised instructions |
|---|---|
| Small known-cause bug | Implement and run focused checks; no mandatory coordinator detour, confidence score, or full-suite question |
| User requests three options and a pause | Present three useful options and wait; no implementation before selection |
| User requests choosing and implementing | Explain the choice and continue within scope; do not create a new selection gate |
| One supplied visual reference | Treat it as the selected direction; compare real rendering at relevant states |
| Existing design system | Infer stack/tokens and update its owner; no forced questionnaire, new library, or manifest |
| Laravel version-specific work | Use installed/target major and supported command runner; preserve API and data constraints |
| Local Docker repair | Preserve resources, use project-compatible services, and run authorized checks from the project directory |
| Routine authorized production release | Follow the existing release gate and recovery plan; no repeated infrastructure intake or implied destructive migration |
| Explicit reviewable delivery | Use coherent reviewed commits and aggregate evidence; do not spawn subagents |
| Authorized PR with ordinary validation | Allow the normal CI trigger; preserve explicit remote-CI prohibitions and separate deployment boundaries |
| Changed PR candidate | Revalidate affected contracts and satisfy provider-required current-head checks |
| Squash merge and cleanup | Prove delivery and ownership before deleting only the task's exact branches |
| Specialist or rendering tool unavailable | Use a supported fallback within scope and report evidence limits; do not claim a missing visual check passed |

## Validation

- `npm run sync`: regenerate manifests, marketplaces, bundled skills, and README tables from canonical inputs.
- `npm run validate`: pass for metadata, consent gates, one-to-one membership, release versions, and generated-file parity across all 15 skills.
- `npm run test:agent-context`: pass; detector regression coverage retained.
- `npm run test:docker-local-dev`: pass; existing helper/template coverage retained.
- `claude plugin validate .`: pass with the installed Claude CLI.
- `git diff --check`: pass.

A local path check also verifies explicit relative Markdown file links in the skill documents and repository docs, excluding illustrative links inside fenced templates. It does not validate external URLs or heading anchors. Generated-file idempotence and final PR check results are recorded in the PR/release workflow.

## Compatibility and upgrade notes

The release is **1.32.0**. Plugin/skill identifiers and manifest schemas are unchanged; no application or data migration is needed. Refresh the marketplace and installed plugins through the agent's normal update flow.

Workflow defaults intentionally change. Users who need exactly three scored options, a mandatory selection pause, one specialist at a time, per-subtask branches, persisted/deleted plan files, or separate approval for every CI trigger should state those requirements in their request or repository policy. Existing explicit requirements continue to apply.

No model A/B benchmark or representative end-to-end execution of all 15 workflows was run. Static validation and helper tests cannot prove Astra quality, speed, cost, compliance, or behavior in every host. The practical outcome established here is a smaller, internally reviewed instruction set with unchanged packaging and helper compatibility.
