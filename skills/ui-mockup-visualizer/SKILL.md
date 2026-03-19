---
name: ui-mockup-visualizer
description: Create fixed-canvas HTML wireframes and visual mockups that help an AI agent verify and explain its understanding of UI/UX requests for websites, mobile apps, and desktop apps. Use when a user asks for UI ideas, visual confirmation, layout exploration, wireframes, HTML mockups, design critique, or says things like "show me the layout", "make a mockup", "wireframe this", "give me 3 UI options", "visualize what you mean", "show the screen idea", "show the sidebar idea", or "turn this into HTML so I can review it". This skill always proposes Option A, Option B, and Option C, marks one AI-recommended option, supports multi-select or "none", uses stable web/mobile/desktop templates, starts a local preview server, and can capture review screenshots into docs/awesome-ai-agent-skills/visuals/.
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

Prefer editing `mockup-data.js` only. Change `index.html`, `styles.css`, or `app.js` only when the default system cannot express the idea.

### 5. Serve the mockup locally

Start a local server from the mockup directory:

```bash
python3 scripts/start_mockup_server.py \
  /absolute/path/to/project/docs/awesome-ai-agent-skills/mockups/<slug>
```

This prints a local URL and writes `.mockup-server.json` in the mockup folder. Share the URL with the user.

Stop it when the user has approved the direction:

```bash
python3 scripts/stop_mockup_server.py \
  /absolute/path/to/project/docs/awesome-ai-agent-skills/mockups/<slug>
```

### 6. Capture screenshots for verification memory

Prefer Chrome DevTools MCP or Playwright MCP when available because they can capture exactly what the agent sees.

Also keep the local fallback script available:

```bash
python3 scripts/capture_mockup.py \
  --url http://127.0.0.1:4173 \
  --output /absolute/path/to/project/docs/awesome-ai-agent-skills/visuals/<slug>-q1.jpg
```

Use numbered checkpoint images whenever the direction changes materially:
- `.../visuals/<slug>-q1.jpg`
- `.../visuals/<slug>-q2.jpg`
- `.../visuals/<slug>-q3.jpg`

If Chrome DevTools MCP or Playwright MCP is missing, explicitly recommend installing one of them for faster headless verification.

### 7. Handoff after approval

After the user approves one option or a merged direction:
- stop the preview server unless the user still needs it
- summarize the chosen structure
- translate the mockup into implementation instructions with exact layout behavior, spacing logic, states, and component hierarchy
- call out what remains intentionally undecided

Do not jump into full production implementation guidance before the user confirms the visual direction.

## Rules

- Default to making a visual whenever the user wants UI/UX ideas or wants to verify the agent's understanding.
- Keep the canvas fixed-size. Do not make the mockup responsive.
- Use placeholder blocks, not final content, unless real content is necessary to explain hierarchy.
- Focus the mockup on the requested surface. Surround it with muted context blocks only to explain position.
- Keep output token-efficient by reusing the template and editing structured data instead of rewriting the whole page.
- Use `Option A`, `Option B`, and `Option C` exactly so the user can refer to them quickly.
- Mark one option as `Recommended` every time.
- Let the user combine options or reject all three.
- Cite large-product benchmarks as pattern references, not as license to clone branding.
- Prefer the bundled template and scripts over inventing a new mockup runtime.
- Save screenshots under `docs/awesome-ai-agent-skills/visuals/` whenever the discussion reaches a stable checkpoint.

## Resources

### scripts/

- `scripts/init_mockup_workspace.py`: create a mockup workspace from the bundled template
- `scripts/start_mockup_server.py`: start a local static server and record its state
- `scripts/stop_mockup_server.py`: stop the recorded local server
- `scripts/capture_mockup.py`: capture a mockup URL to an image with local Chrome/Chromium when available

### references/
- `references/mockup-design-system.md`: fixed canvas sizes, block schema, and mockup behavior rules
- `references/pattern-benchmarks.md`: stable benchmark patterns to cite when explaining the options

### assets/
- `assets/mockup-template/`: reusable web mockup viewer driven by `mockup-data.js`
- `assets/mockup-template-mobile-app/`: mobile-first review shell and phone-frame stage
- `assets/mockup-template-desktop-app/`: desktop-app review shell and workstation-frame stage
