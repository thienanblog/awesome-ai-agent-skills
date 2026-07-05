# UI Visual Verification

Use this reference for UI/UX tasks, screenshot-driven implementation, and ambiguous user-provided images.

## Ambiguous User Images

If the user provides a screenshot, mockup, or marked-up image and it is unclear what to change:

1. Inspect the image first.
2. Create a separate annotated copy when image tooling is available.
3. Use circles, arrows, or callouts for each unclear area.
4. Label each area with a stable short name such as `A`, `B`, `Header spacing`, `Filter row`, or `Primary action`.
5. Ask concise questions using those labels.
6. Do not edit the user's original image.

If annotation tooling is unavailable, describe the labeled areas by position and ask the same questions.

## Screenshot Order

Prefer this order:

1. Screenshot the exact element or region that needs work.
2. Screenshot the surrounding component only if the region needs context.
3. Screenshot the full page only if layout, scroll, viewport composition, or neighboring content is part of the requirement.

Broad full-page screenshots add noise. Use them deliberately.

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
