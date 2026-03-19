# Mockup Design System

Use this file to keep the visual output stable across sessions.

## Goal

Show the shape, hierarchy, and placement of the idea as fast as possible. Do not spend effort on production-ready content, microcopy, or responsiveness unless the user explicitly asks for those details.

## Fixed Canvases

Use one fixed canvas per option.

- `web-desktop`: `1440x960`
- `mobile-app`: `390x844`
- `desktop-app`: `1366x900`

Keep the canvas fixed. Let the browser scroll if the viewport is smaller.

## Template Variants

Use the platform-matched template:
- `assets/mockup-template/` for `web-desktop`
- `assets/mockup-template-mobile-app/` for `mobile-app`
- `assets/mockup-template-desktop-app/` for `desktop-app`

The template variant should change the review shell and framing, not the approval workflow. All variants still use the same Option A/B/C contract.

## Page Structure

The template already provides:
- a stable review shell
- an option rail for `Option A`, `Option B`, `Option C`
- a recommendation badge
- a stage that renders one option at a time
- benchmark notes and rationale

Prefer editing only `mockup-data.js`.

## Option Rules

Every mockup session must include:
- `Option A`
- `Option B`
- `Option C`
- exactly one `recommended: true`

Design the options so the user can choose one, combine several, or reject all.

Good axes for variation:
- open vs contained layout
- persistent vs contextual panel
- dense vs spacious information grouping
- inline vs overlay interaction
- left/right/bottom placement when that placement changes the workflow

## Focus Rules

Only render enough surrounding layout to make the focus area understandable.

Example:
- If the question is about a right sidebar, render the page shell, the content area, and the sidebar.
- Do not fill the content area with real tables, charts, or cards unless the sidebar behavior depends on them.

## Visual Language

Use a restrained wireframe look:
- neutral background
- muted shell surfaces
- stronger outline and fill for the focus surface
- simple labels inside blocks
- subtle accent for the recommended pattern

Avoid:
- real brand colors from benchmark products
- production copy
- placeholder lorem ipsum paragraphs
- decorative gradients that distract from structure

## Block Schema

The template expects each option to define:

```js
{
  id: "A",
  title: "Option A",
  summary: "One-line explanation.",
  recommended: true,
  rationale: [
    "Short point 1",
    "Short point 2"
  ],
  benchmarks: [
    "Notion peek panel",
    "Slack thread sidebar"
  ],
  canvas: {
    device: "web-desktop",
    width: 1440,
    height: 960
  },
  blocks: [
    { kind: "topbar", label: "Top bar", x: 0, y: 0, w: 1440, h: 72 },
    { kind: "content", label: "Main content", x: 96, y: 72, w: 1024, h: 888, tone: "muted" },
    { kind: "focus", label: "Right sidebar", x: 1120, y: 72, w: 320, h: 888, tone: "accent" }
  ]
}
```

Supported block kinds:
- `topbar`
- `sidebar`
- `content`
- `panel`
- `focus`
- `sheet`
- `modal`
- `card`
- `table`
- `list`
- `form`
- `toolbar`
- `footer`

Supported tones:
- default
- muted
- accent
- strong

Use `focus` or `tone: "accent"` on the area the user is actually reviewing.

## Copy Rules

Keep copy short:
- one-line summaries
- short labels inside blocks
- 2-3 rationale bullets maximum

This is a review artifact, not final UX writing.

## Approval Flow

After the user approves a direction:
- preserve the approved screenshot
- keep the final option label stable in the handoff
- translate the option into implementation rules
- stop the preview server when it is no longer needed
