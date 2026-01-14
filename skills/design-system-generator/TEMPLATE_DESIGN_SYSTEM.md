# DESIGN_SYSTEM.md

## 0. Scope
- Product surfaces covered:
- Out of scope:

## 1. Design principles
- Clarity over cleverness
- Consistency over variety
- Accessibility is default
- Performance is a feature

## 2. Supported platforms & constraints
- App type: (SPA / Traditional / Hybrid)
- Frameworks:
- Browser support:
- i18n/RTL:
- Theming: (Light / Light+Dark / Multi-theme)

## 3. Design tokens
### 3.1 Token sources
- Source of truth: (CSS variables / JSON tokens / both)
- Files:
  - `styles/tokens.css`
  - `styles/design-tokens.json` (optional)

### 3.2 Color system
- Brand colors:
- Neutral palette:
- Semantic colors:
  - `--color-success`
  - `--color-warning`
  - `--color-danger`
  - `--color-info`

Rules:
- Never hardcode hex in components; use tokens.
- Ensure contrast meets WCAG AA.

### 3.3 Typography
- Font families:
- Type scale (sizes + line-height):
- Font weights:
- Rules (headings/body/captions):

### 3.4 Spacing & layout
- Spacing scale:
- Grid/container rules:
- Responsive breakpoints:

### 3.5 Radius, borders, shadows
- Radius scale:
- Border rules:
- Shadow scale:

### 3.6 Motion
- Duration scale:
- Easing:
- Reduced motion policy:

## 4. UI foundations
### 4.1 Base styles / reset
- Reset/base approach:
- Defaults (body, links, headings):

### 4.2 Focus & interaction states
- Focus ring standard:
- Hover/active behavior:
- Disabled behavior:

### 4.3 Iconography
- Icon set:
- Sizing rules:
- Stroke/fill rules:

## 5. Component architecture
### 5.1 Portability
Components must be implementable in:
- SPA components
- server-rendered templates

### 5.2 Naming & structure
- Naming conventions:
- Folder conventions:

### 5.3 Required component states
All interactive components define:
- default, hover, active, focus, disabled
- loading (if async)
- error (if validation)

## 6. Component inventory (minimum)
- Button (primary/secondary/ghost/destructive)
- Input, Textarea, Select
- Checkbox, Radio, Switch
- Badge
- Card
- Modal/Dialog
- Toast/Notification
- Table (empty/loading states)
- Navigation primitives (header/sidebar/tabs)

## 7. CSS strategy & tooling
### 7.1 SPA
- Bundler:
- CSS strategy:
- Theming approach:

### 7.2 Traditional server-rendered
- CSS tooling:
- Architecture layers:
  - tokens
  - base
  - components
  - utilities
- Bundler recommendation:

## 8. Production build & asset strategy
### 8.1 Output folders
- `dist/` structure:
- Public assets:

### 8.2 Manifest & cache busting (required)
Build outputs a manifest mapping logical to hashed filenames.

### 8.3 Optimization
- CSS/JS minify:
- Image optimization:
- SVG optimization:
- Font strategy:

## 9. Accessibility checklist (ship gate)
- Keyboard navigation verified
- Focus visible
- Contrast AA
- Reduced motion supported
- Semantic HTML first

## 10. Examples
### 10.1 Token usage (CSS variables)
```css
:root {
  --color-bg: #ffffff;
  --color-fg: #0b0f17;
  --radius-md: 12px;
  --space-4: 16px;
}
```

### 10.2 Component example
```html
<button class="btn btn-primary">
  Submit
</button>
```
