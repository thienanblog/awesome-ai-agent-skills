# UI/UX Concept Routing

Use this reference when the task centers on generating or selecting UI concepts,
implementing a screenshot or mockup, following a visual reference, or emulating
a website's look and interaction patterns. Apply the routing gate before loading
an implementation specialist.

Stay in the general workflow for small local UI fixes that do not depend on concept selection or visual matching. Use an available specialized UI/UX skill when it directly owns the requested workflow; continue with the guidance below when none is available.

## Establish The Visual Contract

- Inspect supplied images and the project's current rendered UI before deciding what to change.
- Identify the relevant design-system source, reusable components, tokens, assets, responsive conventions, and accessibility patterns.
- Distinguish visual requirements from examples that merely communicate intent.
- Ask a narrow question only when unresolved visual ambiguity would lead to materially different implementations.
- Annotate a copy of a supplied image only when labels or callouts would make that clarification substantially easier. Preserve the original artifact.

## Concepts And Selection

When the user asks for multiple concepts, exit the coordinator and use
`brainstorm-first` as an independent pre-implementation phase when available:

- Give each concept a stable name and explain its meaningful tradeoffs.
- Recommend one concept using technical, usability, accessibility, consistency, and implementation evidence.
- Predict user preference only when prior user choices or explicit criteria provide evidence; do not invent a preference.
- Ask the user to choose before implementation only when the concepts differ in a consequential way.

After selection, begin a fresh implementation phase with the coordinator. Route
to `office-web-ui-system` for an operational admin, internal, CRM/ERP, CRUD,
reporting, or back-office surface when available. Route to
`ui-ux-concept-implementation` for other selected concepts, screenshots,
mockups, visual references, or reference sites. Do not load both by default.

Preserve the selected concept outside committed source when it is needed for
later comparison. Use an existing ignored artifact location or another
environment-supported mechanism. Do not modify ignore configuration or create
project files solely to store a transient concept unless that persistence is
necessary and authorized.

## Implementation And Verification

- Match the project's visual language and interaction model before introducing new tokens, components, motion, or layout conventions.
- Keep page-level code focused on composition and data flow when the project has suitable component boundaries.
- Compare target, current, and updated states at equivalent viewports when practical.
- Capture the smallest useful region for component-level changes; use full-page captures when page composition, scrolling, or surrounding context matters.
- Verify the states relevant to the request, such as default, loading, empty, error, validation, disabled, focus, responsive layout, and navigation. Do not manufacture every possible state when the affected component cannot enter it.
- Use a real rendering environment for material visual work. Select among built-in browser control, project-owned end-to-end tests, browser automation, screenshots, or manual checks according to current capabilities and project policy.
- Distinguish exploratory browser verification from repeatable source-controlled regression tests in the final report.

If the task's primary deliverable becomes a new or substantially revised durable
design-system artifact, return routing control to the coordinator and switch to
an available design-system skill. Otherwise update the project's existing source
as supporting work; do not load another full workflow or create a new
design-system document for a one-off visual change.
