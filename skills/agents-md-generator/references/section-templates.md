# Section Templates Reference

This document provides complete templates for each standard section of CLAUDE.md/AGENTS.md files. Use these as building blocks when generating instruction files.

## Section 1: Header & Role

### Laravel Backend Engineer
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Laravel Backend Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, documenting, implementing, and verifying.
```

### Vue.js Frontend Engineer
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Vue.js Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.
```

### React Frontend Engineer
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior React Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.
```

### Full-Stack Developer (Laravel + Vue/React)
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Full-Stack Developer and Technical Lead specializing in Laravel backend and [Vue.js/React] frontend. You are responsible for the entire lifecycle of a task: understanding, planning, documenting, implementing, testing, and verifying.
```

### Node.js Backend Engineer
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Node.js Backend Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.
```

### Generic Software Engineer
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Software Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.
```

---

## Section 2: Auto-Pilot Workflow

### Standard 6-Step Cycle (Adapt per stack)

```markdown
## The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: [PRIMARY_CONFIG_FILE]
   - **Check Docs**: Consult [DOCS_PATH] for specific guidelines
   - **Environment**: [ENVIRONMENT_INSTRUCTIONS]

2. **Plan**:
   - Break down the request into atomic steps ([EXAMPLE_STEPS])
   - **Constraint Check**: [PROJECT_SPECIFIC_CONSTRAINTS]

3. **Documentation (Mandatory Pre-Code)**:
   - **Sync Rule**: Before writing logic, create or update [DOC_PATH]
   - **Requirements**: [DOC_REQUIREMENTS]

4. **Implementation**:
   - **Standards**: [CODING_STANDARDS]
   - **Patterns**: [ARCHITECTURE_PATTERNS]
   - [ADDITIONAL_IMPLEMENTATION_RULES]

5. **Verification & Refinement**:
   - **Format**: Run [FORMATTER_COMMAND] immediately after writing code
   - **Test**: [TEST_COMMAND_AND_GUIDELINES]
   - **Manual Check**: [MANUAL_VERIFICATION_APPROACH]

6. **Self-Review**:
   - [SELF_REVIEW_CHECKLIST]
```

### Laravel-Specific Steps

```markdown
1. **Discovery & Context**:
   - **Read First**: `config/settings.php` or `config/app.php`
   - **Check Docs**: Consult `docs/` for specific guidelines
   - **Environment**: Ensure you are using the Docker container for all runtime commands

2. **Plan**:
   - Break down the request into atomic steps (Migration -> Model -> Service -> Controller)
   - **Constraint Check**: Verify database relationships and validation rules

3. **Documentation**:
   - **Sync Rule**: Before writing logic, create or update `docs/features/<module>.md`
   - **Requirements**: Include API contracts and database schema changes

4. **Implementation**:
   - **Standards**: Apply PSR-12 and `declare(strict_types=1);`
   - **Migrations**: Never edit existing migrations; create new ones

5. **Verification & Refinement**:
   - **Format**: Run `vendor/bin/pint` immediately after writing code
   - **Test**: Run `php artisan test` or `vendor/bin/pest`

6. **Self-Review**:
   - Did you use proper type declarations?
   - Did you add validation in Form Requests?
   - Did you handle edge cases?
```

### Vue.js-Specific Steps

```markdown
1. **Discovery & Context**:
   - **Read First**: `package.json` and folder structures
   - **Check Docs**: Consult component documentation and style guides
   - **Scan**: Check existing components before creating new ones

2. **Plan**:
   - Break down the request into atomic steps
   - Identify which files need creation or modification
   - Check `src/components/` for reusable components

3. **Implementation**:
   - **Surgical Editing**: Make focused changes
   - **Composition API**: Use `<script setup>` syntax
   - **Formatting**: Always format touched files

4. **Verification**:
   - **Test**: Run `npm test` or `bun test`
   - **Build Check**: If changing core configs, run build
   - **Linting**: Run ESLint/Prettier

5. **Self-Review**:
   - Did you avoid prop drilling (3+ layers)?
   - Did you use stores for shared state?
   - Did you avoid direct API calls in components?
```

---

## Section 3: Documentation & Knowledge Base

### Template
```markdown
## Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **[Category]**: `[path/to/file.md]` ([Description])
```

### Laravel Example
```markdown
## Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **Testing**: `docs/testing-guidelines.md` (Test structure and coverage requirements)
* **Documentation**: `docs/documentation-guidelines.md` (How to write feature docs)
* **API Standards**: `docs/api-standards.md` (API design conventions)
* **Architecture**: `docs/architecture.md` (System design patterns)
```

### Frontend Example
```markdown
## Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **Design System**: `docs/design-system.md` (Colors, components, layouts)
* **Component Guide**: `docs/components.md` (Reusable component catalog)
* **State Management**: `docs/state-management.md` (Store patterns and conventions)
```

---

## Section 4: Project Structure & Architecture

### Laravel Structure
```markdown
## Project Structure & Architecture

* **`app/Http/Controllers/`**: Feature-grouped controllers. Thin controllers delegate to Services.
* **`app/Services/`**: Business logic. Encapsulate queries via Model Scopes.
* **`app/Models/`**: Eloquent models with relationships and scopes.
* **`app/Http/Resources/`**: API response transformers.
* **`app/Http/Requests/`**: Form Request validation classes.
* **`routes/api.php`**: API routes with middleware.
* **`routes/web.php`**: Web routes for views.
* **`database/migrations/`**: Database schema changes.
* **`tests/`**: Feature and Unit tests.
```

### Vue.js Structure
```markdown
## Project Structure & Architecture

* **`src/components/`**: Reusable UI components.
* **`src/views/`** or **`src/pages/`**: Page-level components.
* **`src/stores/`**: Pinia stores for state management.
* **`src/composables/`**: Reusable composition functions.
* **`src/services/`** or **`src/api/`**: API service layer.
* **`src/assets/`**: Static assets (images, fonts).
* **`src/styles/`**: Global styles and variables.
* **`src/router/`**: Vue Router configuration.
```

### React Structure
```markdown
## Project Structure & Architecture

* **`src/components/`**: Reusable UI components.
* **`src/pages/`**: Page components (Next.js) or route components.
* **`src/hooks/`**: Custom React hooks.
* **`src/context/`**: React Context providers.
* **`src/services/`** or **`src/api/`**: API service layer.
* **`src/utils/`**: Utility functions.
* **`src/types/`**: TypeScript type definitions.
```

### Full-Stack (Laravel + Frontend)
```markdown
## Project Structure & Architecture

### Backend (Laravel)
* **`app/Http/Controllers/`**: API controllers.
* **`app/Services/`**: Business logic layer.
* **`app/Models/`**: Eloquent models.
* **`routes/api.php`**: API endpoints.

### Frontend
* **`resources/js/`**: Frontend source (Inertia.js).
* **`resources/js/Pages/`**: Inertia page components.
* **`resources/js/Components/`**: Reusable components.
* **`resources/js/Layouts/`**: Layout components.
```

---

## Section 5: Development Environment

### Docker Compose
```markdown
## Development Environment

### Container vs Host Commands
* Use **container** for: PHP, Artisan, Composer, database access, tests
* Use **host** for: Git, file operations, IDE commands, npm/node (if not containerized)

### Container Commands
```bash
# PHP/Laravel commands
docker compose exec app php artisan migrate
docker compose exec app php artisan test
docker compose exec app composer install
docker compose exec app vendor/bin/pint

# Database access
docker compose exec db mysql -u root -p
```

### Host Commands
```bash
# Git operations
git status
git commit -m "message"

# Node.js (if not containerized)
npm install
npm run dev
```
```

### Laravel Sail
```markdown
## Development Environment

### Sail Commands
All runtime commands should use Sail:

```bash
# Artisan commands
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan test

# Composer
./vendor/bin/sail composer install

# npm
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

### Direct Host Commands
* Git operations run directly
* IDE/editor commands run directly
```

### Native/Host Machine
```markdown
## Development Environment

### Prerequisites
* [Language] [Version] installed
* [Package Manager] installed
* [Database] running locally

### Key Commands
```bash
# Install dependencies
[INSTALL_COMMAND]

# Run development server
[DEV_COMMAND]

# Run tests
[TEST_COMMAND]

# Format code
[FORMAT_COMMAND]

# Build for production
[BUILD_COMMAND]
```
```

---

## Section 6: Coding Standards

### PHP/Laravel
```markdown
## Coding Standards (The "Gold Standard")

* **Language**: PHP 8.2+
* **Framework**: Laravel 11
* **Strictness**: Always use `declare(strict_types=1);`
* **Style**: PSR-12, enforced by Laravel Pint

### Type Declarations
* Always use explicit return type declarations
* Use appropriate PHP type hints for parameters
* Use PHPDoc for complex array shapes

### Database
* Prefer Eloquent over raw queries
* Use Model Scopes for reusable query logic
* Never edit existing migrations; create new ones

### Controllers
* Keep controllers thin
* Delegate business logic to Services
* Use Form Requests for validation

### Anti-Patterns to Avoid
* No business logic in controllers
* No raw queries when Eloquent suffices
* No hardcoded configuration values
```

### Vue.js
```markdown
## Coding Standards (The "Gold Standard")

* **Framework**: Vue 3 (Composition API)
* **Build Tool**: Vite
* **UI Library**: [Detected or specify]
* **Style**: ESLint + Prettier

### Component Guidelines
* Use `<script setup>` syntax
* Props should have type definitions
* Emit events with proper typing

### State Management
* Use Pinia for shared state
* Local state (`ref`/`reactive`) for component-specific data
* Avoid prop drilling (3+ component layers)

### Anti-Patterns to Avoid
* No direct API calls in components (use services/stores)
* No hardcoded text (use i18n if applicable)
* No business logic in templates
```

### React/TypeScript
```markdown
## Coding Standards (The "Gold Standard")

* **Framework**: React 18+
* **Language**: TypeScript (strict mode)
* **Style**: ESLint + Prettier

### Component Guidelines
* Functional components with hooks
* Props interfaces defined explicitly
* Prefer named exports

### State Management
* React Query for server state
* Context/Zustand for client state
* Local state for component-specific data

### TypeScript
* No `any` types
* Explicit return types on functions
* Interface over type for objects
```

---

## Section 7: Domain Specifics (Optional)

### Permission System
```markdown
## Domain Specifics

### Permissions
* Every controller action requires permission middleware
* Permission naming: `resource.action` (e.g., `users.create`)
* Super admin bypasses permission checks via config
```

### Multi-Zone Application
```markdown
## Domain Specifics

### Application Zones
* **Production Zone**: Prefix classes with `Production` (e.g., `ProductionOrder`)
* **Office Zone**: Standard naming
* **Separation**: Production UIs must not use Office resources
```

### Localization
```markdown
## Domain Specifics

### Localization
* All user-facing messages in [Language]
* Use `mb_strtolower()` and `mb_strtoupper()` for unicode
* Date format: [Format] (e.g., DD/MM/YYYY)
```

### Real-time Features
```markdown
## Domain Specifics

### Real-time Broadcasting
* Endpoint: `POST /api/broadcast/[event]`
* Channels: [List of channels]
* Use Laravel Echo / Socket.io for frontend
```

---

## Footer

Always end the file with:

```markdown
---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
```
