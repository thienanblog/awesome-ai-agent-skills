# UI Visual Verification

Use this reference for UI/UX tasks, screenshot-driven implementation, and ambiguous user-provided images.

## Ambiguous User Images

If the user provides a screenshot, mockup, or marked-up image and it is unclear what to change:

Inspect the image and project context first. Ask only if an unresolved visual choice would materially change the result. Use a separate annotated copy with short labels when it makes that question easier to answer; otherwise describe the region directly. Preserve the original image. Do not block ordinary visual work on annotation tooling.

## Screenshot Scope

Capture the element, region, or full page that demonstrates the relevant behavior. A component fix often needs a small region; composition, scroll, and neighboring layout need wider context. Choose scope by evidence needed, without a mandatory capture order.

## Before And After

For visual changes:

- Capture a before screenshot before editing when practical.
- Capture an after screenshot at the same viewport and state.
- Use the same data, theme, language, and account state when possible.
- If the viewport or state differs, state the difference in the final report.

## What To Verify

Check relevant UI states:

- Default
- Loading
- Empty
- Error
- Disabled
- Hover/focus when practical
- Validation
- Responsive behavior
- Dark/light theme if supported
- Keyboard navigation and visible focus for interactive elements

## Visual Source Of Truth

Before changing visual code, inspect:

- `docs/DESIGN_SYSTEM.md` or equivalent.
- Existing shared components and wrappers.
- Theme config, CSS variables, Tailwind config, global CSS, utility classes, tokens, animation rules, and transition utilities.
- Existing screenshots or component examples.

Do not create one-off visual styles when a reusable token, wrapper, class, or component exists.
