# Mockup Design System

Use this file to keep the visual output stable across sessions.

## Goal

Show the shape, hierarchy, and placement of the idea as fast as possible. Do not spend effort on production-ready content, microcopy, or responsiveness unless the user explicitly asks for those details.

Always treat the mockup and its screenshot checkpoint as the source of truth for later implementation review.

## Fixed Canvases

Use one fixed canvas per option.

- `web-desktop`: `1440x960`
- `mobile-app`: `390x844`
- `desktop-app`: `1366x900`

Keep the canvas fixed. Let the browser scroll if the viewport is smaller.

In review mode, the surrounding app shell should expand to the full browser viewport. Do not place the entire mockup stage inside a narrow centered container.

## Template Variants

Use the platform-matched template:
- `assets/mockup-template/` for `web-desktop`
- `assets/mockup-template-mobile-app/` for `mobile-app`
- `assets/mockup-template-desktop-app/` for `desktop-app`

The template variant should change the review shell and framing, not the approval workflow. All variants still use the same Option A/B/C contract.

All variants use the same runtime contract:
- `Svelte CDN` for rendering
- `TailwindCSS CDN` for styling
- `runtime/styles.css` only for fixed-canvas and capture-specific behavior
- live reload from the local preview server
- zoom controls for large canvases

## Page Structure

The template already provides:
- a stable review shell
- an option rail for `Option A`, `Option B`, `Option C`
- a recommendation badge
- a stage that renders one option at a time
- benchmark notes and rationale
- a capture-only mode that renders just the approved mockup region
- zoom controls and fit-to-viewport behavior for large canvases

Prefer editing only `mockup-data.js`.

Localize `uiText`, labels, notes, and summaries to match the user's language before sharing the mockup.

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

The top-level data object also supports a localized viewer dictionary:

```js
{
  question: "UI mockup question",
  platform: "web-desktop",
  uiText: {
    visualReview: "Visual Review",
    workingNotes: "Working Notes",
    recommended: "Recommended",
    selected: "Selected",
    rationale: "Rationale",
    benchmarks: "Benchmarks",
    canvas: "Canvas",
    replyShortcuts: "Reply shortcuts",
    replyOne: "Option A",
    replyMany: "Option A + C",
    replyNone: "None, I want ..."
  }
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

The viewer adds default visual spacing inside each block. Keep adjacent blocks readable instead of letting them touch edge-to-edge unless the layout meaningfully requires that contact.

## Copy Rules

Keep copy short:
- one-line summaries
- short labels inside blocks
- 2-3 rationale bullets maximum

This is a review artifact, not final UX writing.

When you first mention an important UI region in the user-facing explanation, pair a plain-language label with the English developer term, such as `Thanh bên (Sidebar)` or `Thanh điều hướng (Navbar)`.

## Capture Mode

Use the review URL for discussion and the capture URL for screenshots:
- review: `/#A`, `/#B`, `/#C`
- capture: `/?capture=1&option=A`

Capture mode rules:
- only render the selected mockup frame
- do not include the option rail, notes, rationale, benchmark panel, or reply shortcuts
- size the screenshot to the mockup frame so the image stays noise-free
- save the approved checkpoint under `docs/awesome-ai-agent-skills/visuals/`
- do not connect the live-reload client during capture mode

## Approval Flow

After the user approves a direction:
- preserve the approved screenshot
- keep the final option label stable in the handoff
- translate the option into implementation rules
- stop the preview server when it is no longer needed
