# Choose useful specialist guidance

Use a specialist directly when its purpose clearly matches the task. For mixed or uncertain work, inspect the affected sources first and choose guidance for the current risk. Routine testing, documentation alignment, framework commands, and browser checks can remain part of implementation.

| Need | Relevant skill |
|---|---|
| Unexplained failure or flake | `debugging-workflow` |
| Test strategy, acceptance checks, CI, or QA | `testing-verification` |
| Measured latency or resource bottleneck | `performance-optimization` |
| Documentation ownership, contracts, or consolidation | `documentation-guidelines` |
| Repository instruction creation or compaction | `agents-md-generator` |
| Durable design-system document | `design-system-generator` |
| Selected visual reference implementation | `ui-ux-concept-implementation` |
| Operational admin, CRM/ERP, CRUD, or reporting UI | `office-web-ui-system` |
| Local Compose/Docker configuration | `docker-local-dev` |
| Production VPS/Traefik deployment | `vps-docker-traefik-deploy` |
| Installed Laravel 11/12 | `laravel-11-12-app-guidelines` |
| Laravel 13 or a requested 12-to-13 upgrade | `laravel-13-app-guidelines` |
| Requested option comparison before implementation | `brainstorm-first` |
| Explicitly accepted delivery through reviewable subtasks | `run-reviewable-subtask-loop` |

Use the current skill catalog; names here do not establish availability. An equivalent installed capability is suitable. Do not install an optional skill silently or block ordinary work because one is absent.

## Avoid conflicting guidance

- Select the Laravel guideline for the installed or target major; a 12-to-13 upgrade uses the Laravel 13 guide. Do not apply conflicting version defaults together.
- Distinguish local and production infrastructure. A task can span both; apply each guide only to its environment.
- Dashboard guidance usually owns operational UI, including reference matching. General visual guidance can fill a specific gap without repeating both workflows.
- Design-system generation is for the durable document. Using an existing token does not require that skill.
- Brainstorming pauses for selection when the user requested that boundary. An already selected approach or authorized choice can proceed to implementation.
- Reviewable delivery requires opt-in. Neither that choice nor the word subtask grants delegation permission.

Load references as questions arise, with no fixed numerical cap. Keep relevant constraints as phases change, drop obsolete procedures, and avoid routing back through a coordinator solely for formality. Select a security workflow when threat analysis or vulnerability work is the task, not merely because normal implementation should be secure.
