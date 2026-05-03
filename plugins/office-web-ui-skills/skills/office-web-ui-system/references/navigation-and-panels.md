# Navigation And Panels

Use this reference when building shells, side navigation, flyouts, docks, and utility panels.

## Topbar contract

- Treat the topbar as a transparent shell when the app already supports layered surfaces.
- Group actions into stable pill clusters.
- Left pill usually contains brand and primary shell toggle.
- Right pills usually contain status, quick toggles, notifications, and user actions.
- Readability should come from pill surfaces, not from a single solid full-width bar.

## Sidebar contract

- Desktop sidebar may have:
  - expanded mode for full navigation
  - icon rail mode for space-saving navigation
- Mobile and tablet should keep drawer or overlay behavior unless the host product already has a different mobile pattern.

## Icon rail + flyout

- Rail icons represent root groups, not every page-level route.
- The icon button itself must have a large click and hover target.
- Hover, focus, or click may open the flyout on desktop.
- The flyout should align to the hovered rail icon instead of snapping to sidebar top.
- The gap between rail and flyout must be minimal to avoid a dead zone.
- The flyout must float over content, not push the main workspace horizontally.

## Flyout content

- Use a floating card surface with blur, border, radius, and restrained shadow.
- Include a small header with:
  - root group icon
  - group label
  - optional short navigation hint
- Menu items must be full-width rows, not text-sized inline links.
- Use generous hit areas for dense internal navigation.
- Hover and focus should tint the entire row, not only the label.
- Active route state must stay visible without hover.

## Side utility panels

- Use side panels for history, notes, filters, inspectors, and similar supporting tools.
- The main workspace must remain dominant.
- If a panel competes with a table-heavy workspace, support collapse or hover-reveal behavior.
- Collapsed panels may leave behind a narrow visible handle or tab.
- When collapsed, reserve enough padding so the handle does not cover critical content.
- If the panel state is a user preference, persist it per user when reasonable.

## Docks

- Docks work well for summaries, tabs, actions, and compact secondary controls.
- Use docks to keep workflow controls nearby without stealing workspace height.
- Group related controls into clear sections with semantic wrappers.

## Closing behavior

- Flyouts and temporary panels should close on outside click or `Escape` when appropriate.
- Hover-driven overlays should allow a small grace period so users can move into the panel without flicker.

## Anti-patterns

- Flyout fixed at the wrong vertical anchor
- Tiny hover targets in dense menus
- Panels that permanently consume workspace width for optional information
- Hidden handles that overlap content with no reserved spacing
- Overlay behavior on desktop that feels like a mobile drawer
