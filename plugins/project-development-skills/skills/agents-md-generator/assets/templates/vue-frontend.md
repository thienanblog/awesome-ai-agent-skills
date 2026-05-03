# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Vue.js Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.

## 1. The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: `package.json` and folder structures
   - **Check Docs**: Consult component documentation and style guides
   - **Scan**: Check `src/components/` for reusable components before creating new ones

2. **Plan**:
   - Break down the request into atomic steps
   - Identify which files need creation or modification
   - Check shared components before building new UI pieces

3. **Implementation**:
   - **Surgical Editing**: Make focused changes
   - **Composition API**: Use `<script setup>` syntax
   - **Formatting**: Always format touched files with Prettier/ESLint

4. **Verification**:
   - **Test**: Run `{{TEST_COMMAND}}` for component tests
   - **Build Check**: If changing core configs, run `{{BUILD_COMMAND}}`
   - **Linting**: Ensure ESLint passes

5. **Documentation**:
   - Update component documentation if behavior changes
   - Add JSDoc comments to exported functions

6. **Self-Review**:
   - Did you avoid prop drilling (3+ component layers)?
   - Did you use stores for shared state?
   - Did you avoid direct API calls in components?
   - Did you check for existing components before creating new ones?

## 2. Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **Design System**: `docs/design-system.md` (Colors, components, layouts)
* **Component Guide**: `docs/components.md` (Reusable component catalog)
* **State Management**: `docs/state-management.md` (Store patterns)

## 3. Project Structure & Architecture

* **`src/components/`**: Reusable UI components
* **`src/views/`** or **`src/pages/`**: Page-level components
* **`src/stores/`**: Pinia stores for state management
* **`src/composables/`**: Reusable composition functions
* **`src/services/`** or **`src/api/`**: API service layer
* **`src/assets/`**: Static assets (images, fonts)
* **`src/styles/`**: Global styles and variables
* **`src/router/`**: Vue Router configuration
* **`src/types/`**: TypeScript type definitions

**Organization Rules:**
- **Flat**: For small modules (<10 files)
- **Folder-based**: For large modules (`forms/`, `display/`, `items/`)
- **Naming**: `ModuleName` + `Function` (e.g., `OrderBasicForm.vue`)

## 4. Development Environment

{{ENVIRONMENT_SECTION}}

### Key Commands

```bash
# Install dependencies
{{INSTALL_COMMAND}}

# Start dev server
{{DEV_COMMAND}}

# Run tests
{{TEST_COMMAND}}

# Build for production
{{BUILD_COMMAND}}

# Lint and format
{{LINT_COMMAND}}
```

## 5. Coding Standards (The "Gold Standard")

* **Framework**: Vue {{VUE_VERSION}} (Composition API)
* **Build Tool**: {{BUILD_TOOL}}
* **UI Library**: {{UI_LIBRARY}}
* **Style**: ESLint + Prettier

### Component Guidelines
* Use `<script setup>` syntax
* Props should have type definitions with `defineProps<T>()`
* Emit events with `defineEmits<T>()`
* Use `ref()` and `reactive()` appropriately

### State Management (Pinia)
* **Complex Features**: Create a dedicated Pinia Store
* **Isolated Components**: Use local state for reusable UI atoms
* **API Calls**: Handle in stores or composables, not components

### Styling
* Use {{CSS_FRAMEWORK}} for styling
* Follow existing class naming conventions
* Support dark mode if project requires it

### Critical Anti-Patterns

- **Prop Drilling**: Do not pass data through 3+ component layers. Use stores.
- **Direct API Calls in Components**: NEVER call axios/fetch inside `.vue` files. Use stores/services.
- **Hardcoded Text**: Use i18n for user-facing text if applicable
- **Logic in Templates**: Complex logic should be in computed properties or methods

## 6. Debug & Telemetry

When debugging, use Vue Devtools and inject debug panels:

```vue
<template>
  <Accordion v-if="isDev">
    <AccordionTab header="Debug Data">
      <pre>{{ JSON.stringify(debugData, null, 2) }}</pre>
    </AccordionTab>
  </Accordion>
</template>
```

## 7. Domain Specifics

{{DOMAIN_SECTION}}

---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
