# UI Visual Verification

Use this reference for UI/UX tasks, screenshot-driven implementation, and ambiguous user-provided images.

## Ambiguous user images

Inspect the image and the project context first. Ask only when an unresolved visual choice would materially change the result. A separate annotated copy with short labels can make that question easier to answer; otherwise describe the region directly. Keep the original image intact.

## Comparable evidence

A before/after or target comparison is only meaningful when the conditions match: viewport, theme, language, data, account, and interaction state. Capture the before state ahead of editing when practical, and state any condition that differs in the report.

Capture the scope the claim needs. A component fix is shown by a small region; composition, scrolling, and neighboring layout need wider context.

## What to check

Verify the states the changed surface can actually enter. Depending on the component these include loading, empty, error, validation, disabled, hover and focus, responsive layout, and each supported theme. Interactive elements also need keyboard navigation and visible focus.

## Visual source of truth

Before changing visual code, find what already defines the product's look: the design-system document if one exists, shared components and wrappers, theme configuration, tokens and CSS variables, and motion utilities. Reuse those before adding a one-off style, so the change stays consistent with the rest of the product.
