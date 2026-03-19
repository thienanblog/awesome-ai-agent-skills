---
name: ui-mockup-visualizer
description: Create fixed-canvas HTML mockups for websites, mobile apps, and desktop apps so an AI agent can verify UI direction before implementation. Use when a user asks for layout ideas, wireframes, visual comparison, HTML previews, mockups, or wants to see what a sidebar, navbar, modal, dashboard section, mobile screen, or desktop panel could look like. This skill always proposes Option A, Option B, and Option C with one recommended option, mirrors the user's language in the review, uses Svelte CDN plus TailwindCSS CDN templates, starts a local preview server, captures screenshot checkpoints of the mockup region only, and turns an approved option into an implementation-ready plan.
author: Official
---

# UI Mockup Visualizer

## Overview

Use this skill to turn UI/UX discussion into concrete HTML mockups quickly, so the user can verify whether the agent is visualizing the right thing before implementation starts.

Default to this skill whenever a user wants to see the layout the agent is describing, wants UI/UX ideas, wants visual comparison, or needs a fast wireframe for websites, mobile apps, or desktop apps. Skip it only when the user explicitly asks for text-only output.

Read these references as needed:
- `references/mockup-design-system.md`
- `references/pattern-benchmarks.md`

Strong trigger cues:
- the user wants to "see" what the agent means before implementation
- the user asks for several UI directions to compare
- the user asks for a mockup, wireframe, layout sketch, or HTML preview
- the user is discussing a specific surface such as sidebar, modal, dashboard block, form area, mobile screen, or desktop panel

## Workflow

### 1. Lock the problem scope

Compress the request to the smallest visual surface that matters:
- the exact region the user cares about
- the platform: `web-desktop`, `mobile-app`, or `desktop-app`
- the main job of the surface
- the constraint that matters most: density, clarity, speed, hierarchy, approval flow, or discoverability

Do not mock the entire product unless the whole-page structure is the question. Keep the mockup focused and use empty context blocks to show placement.

Mirror the user's language from the first response onward. Keep `Option A`, `Option B`, and `Option C` unchanged, but translate the surrounding explanation, notes, and review copy into the user's language.

When naming UI regions for the first time, pair the plain-language label with the developer term in English:
- `Thanh điều hướng (Navbar)`
- `Thanh bên (Sidebar)`
- `Menu thả xuống (Dropdown menu)`
- `Thanh dock (Dock bar)`
- `Thanh trạng thái (Status bar)`

If the user seems unsure about the term they want, offer the likely names instead of forcing them to guess.

### 2. Generate three options every time

Always present:
- `Option A`
- `Option B`
- `Option C`

Rules:
- make all three options plausible, not random
- keep them meaningfully different in hierarchy or interaction model
- mark exactly one option as `Recommended`
- include one sentence telling the user why that option is the best fit
- always allow the user to reply with one or more option letters or say that none of them fit

Use this reply contract:

```text
What I think you want
<1-2 concise sentences>

Options
- Option A: ...
- Option B: ...
- Option C: ...
- Recommended: Option B because ...

Reply with:
- one option: "Option B"
- many options: "Option A + C"
- reject all: "None, I want ..."
```

After every review round, explicitly do one of these:
- ask whether the chosen direction is correct
- propose the next improvement step
- if none fit, offer two new directions or reframe the terminology so the user can correct the target surface

### 3. Cite benchmarks without turning the task into research

Use 1-3 benchmark references from major products when they genuinely clarify the pattern. Prefer stable, product-level references such as:
- Notion for peek panels and contextual side surfaces
- Slack for threaded sidebars and utility panels
- GitHub or Shopify for dense admin information layout
- Linear for compact issue/workspace structure
- Apple Settings for clear mobile preference architecture

Do not pretend these are exact copies. State the pattern, not the brand styling.

If the user asks for the latest real-world examples, exact citations, or proof of current practice, browse official/public sources before making the claim.

### 4. Build the mockup with the stable template

Prefer the bundled template so the visual language stays consistent across sessions.

The template runtime is standardized:
- `Svelte CDN` for rendering logic
- `TailwindCSS CDN` for layout and styling
- minimal local CSS only for fixed-canvas and capture-specific behavior
- a full-viewport review layout instead of a centered content container
- built-in zoom controls so large canvases stay readable
- default block spacing so regions do not visually collide

Create the workspace under the current project:

```bash
python3 scripts/init_mockup_workspace.py \
  /absolute/path/to/project/docs/awesome-ai-agent-skills/mockups/<slug> \
  --title "Short mockup question" \
  --platform web-desktop
```

The script creates a ready-to-edit static mockup package and picks the matching template variant:
- `assets/mockup-template/` for `web-desktop`
- `assets/mockup-template-mobile-app/` for `mobile-app`
- `assets/mockup-template-desktop-app/` for `desktop-app`

Prefer editing `mockup-data.js` only. Localize `uiText`, notes, labels, and summaries before sharing the mockup.

Change the runtime files only when the default Svelte + Tailwind viewer cannot express the idea.

### 5. Serve the mockup locally

Start a local server from the mockup directory:

```bash
python3 scripts/start_mockup_server.py \
  /absolute/path/to/project/docs/awesome-ai-agent-skills/mockups/<slug>
```

This prints a local URL and writes `.mockup-server.json` in the mockup folder. Share the URL with the user.

The preview server supports live reload. If the user asks for another revision while the server is still running, update `mockup-data.js` or the runtime files and let the page refresh automatically.

Stop it as soon as the review loop is done or paused. Do not leave the temporary preview server running after the skill finishes:

```bash
python3 scripts/stop_mockup_server.py \
  /absolute/path/to/project/docs/awesome-ai-agent-skills/mockups/<slug>
```

### 6. Capture screenshots for verification memory

Prefer Chrome DevTools MCP or Playwright MCP when available because they can capture exactly what the agent sees.

Always capture the approved mockup region only. Do not screenshot the whole review page, option rail, rationale panel, notes, or surrounding browser area. Extra chrome creates noise and can make later implementation less accurate.

Use the built-in capture mode:
- review URL: `http://127.0.0.1:4173/#B`
- capture URL contract: `http://127.0.0.1:4173/?capture=1&option=B`

Also keep the local fallback script available:

```bash
python3 scripts/capture_mockup.py \
  --url http://127.0.0.1:4173 \
  --option B \
  --output /absolute/path/to/project/docs/awesome-ai-agent-skills/visuals/<slug>-q1.jpg
```

Use numbered checkpoint images whenever the direction changes materially:
- `.../visuals/<slug>-q1.jpg`
- `.../visuals/<slug>-q2.jpg`
- `.../visuals/<slug>-q3.jpg`

Treat these screenshots as verification memory. When implementation starts, compare the built UI against both the approved mockup and its checkpoint image instead of relying on prose alone.

If Chrome DevTools MCP or Playwright MCP is missing, explicitly recommend installing one of them for faster headless verification.

### 7. Handoff after approval

After the user approves one option or a merged direction:
- preserve the approved checkpoint screenshot
- stop the preview server unless the user is immediately iterating again
- summarize the chosen structure
- translate the mockup into implementation instructions with exact layout behavior, spacing logic, states, and component hierarchy
- anchor the implementation plan to the chosen option and checkpoint image
- call out what remains intentionally undecided

Do not jump into full production implementation guidance before the user confirms the visual direction.

## Rules

- Default to making a visual whenever the user wants UI/UX ideas or wants to verify the agent's understanding.
- Keep the canvas fixed-size. Do not make the mockup responsive.
- Use placeholder blocks, not final content, unless real content is necessary to explain hierarchy.
- Focus the mockup on the requested surface. Surround it with muted context blocks only to explain position.
- Keep output token-efficient by reusing the template and editing structured data instead of rewriting the whole page.
- Use the full review viewport. Do not wrap the stage in a narrow centered container when a wider layout makes comparison easier.
- Keep a visible margin between blocks so the mockup is easier to scan.
- Use the built-in zoom controls when the fixed canvas is too large to inspect comfortably.
- Use `Option A`, `Option B`, and `Option C` exactly so the user can refer to them quickly.
- Mark one option as `Recommended` every time.
- Let the user combine options or reject all three.
- Cite large-product benchmarks as pattern references, not as license to clone branding.
- Prefer the bundled template and scripts over inventing a new mockup runtime.
- Always use the bundled Svelte CDN + TailwindCSS CDN viewer unless the user explicitly requests a different mockup stack.
- Save screenshots under `docs/awesome-ai-agent-skills/visuals/` whenever the discussion reaches a stable checkpoint.
- Capture only the mockup region, never the whole review page.
- Mirror the user's language in the review and handoff.
- Keep the first mention of each important region bilingual: plain-language label plus English developer term.
- End every review loop with either a validation question or the next proposed refinement step.
- Clean up the temporary preview server before leaving the task.

## Resources

### scripts/

- `scripts/init_mockup_workspace.py`: create a mockup workspace from the bundled template
- `scripts/start_mockup_server.py`: start a local live-reload preview server and record its state
- `scripts/stop_mockup_server.py`: stop the recorded local server
- `scripts/capture_mockup.py`: capture the mockup-only checkpoint URL to an image with local Chrome/Chromium when available

### references/
- `references/mockup-design-system.md`: fixed canvas sizes, runtime contract, capture behavior, and block schema
- `references/pattern-benchmarks.md`: stable benchmark patterns to cite when explaining the options

### assets/
- `assets/mockup-template/`: reusable web mockup viewer entrypoint
- `assets/mockup-template-mobile-app/`: mobile-first review entrypoint
- `assets/mockup-template-desktop-app/`: desktop-app review entrypoint
- `assets/mockup-runtime/`: shared Svelte CDN + TailwindCSS CDN runtime copied into each mockup workspace
