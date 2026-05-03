# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Full-Stack Developer and Technical Lead specializing in Laravel backend and {{FRONTEND_FRAMEWORK}} frontend. You are responsible for the entire lifecycle of a task: understanding, planning, documenting, implementing, testing, and verifying.

## 1. The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: `config/app.php`, `package.json`, and project documentation
   - **Check Docs**: Consult `docs/` for guidelines and patterns
   - **Environment**: Use appropriate environment for backend vs frontend commands

2. **Plan**:
   - Break down into atomic steps (Migration -> Model -> Controller -> Frontend Component)
   - **Backend-First**: Usually implement API before UI
   - **API Contract**: Define request/response structure before implementation

3. **Documentation**:
   - **Sync Rule**: Before writing logic, update `docs/features/<module>.md`
   - **API Docs**: Document endpoints, payloads, and responses

4. **Implementation**:
   - **Backend**: PSR-12, `declare(strict_types=1);`, Form Requests
   - **Frontend**: Composition API, typed props, store-based state
   - **Integration**: Use {{INTEGRATION_LIBRARY}} for frontend-backend communication

5. **Verification**:
   - **Backend**: Run `{{BACKEND_TEST_COMMAND}}`
   - **Frontend**: Run `{{FRONTEND_TEST_COMMAND}}`
   - **Build**: Run `{{BUILD_COMMAND}}` before finalizing

6. **Self-Review**:
   - Did you implement both backend and frontend for the feature?
   - Did you add validation on both layers?
   - Did you handle loading and error states?
   - Did you update documentation?

## 2. Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **Testing**: `docs/testing-guidelines.md`
* **Documentation**: `docs/documentation-guidelines.md`
* **Architecture**: `docs/architecture.md`
* **API Standards**: `docs/api-standards.md`
* **UI/UX Guidelines**: `docs/ui-ux-guidelines.md`

## 3. Project Structure & Architecture

### Backend (Laravel)
* **`app/Http/Controllers/`**: API controllers (thin, delegate to Services)
* **`app/Services/`**: Business logic layer
* **`app/Models/`**: Eloquent models with relationships
* **`app/Http/Resources/`**: API response transformers
* **`app/Http/Requests/`**: Form Request validation
* **`routes/api.php`**: API endpoints
* **`routes/web.php`**: Web routes (Inertia pages)

### Frontend ({{FRONTEND_FRAMEWORK}})
* **`resources/js/Pages/`**: {{INTEGRATION_LIBRARY}} page components
* **`resources/js/Components/`**: Reusable UI components
* **`resources/js/Layouts/`**: Layout components
* **`resources/js/Composables/`** or **`resources/js/hooks/`**: Shared logic
* **`resources/js/types/`**: TypeScript definitions

## 4. Development Environment

{{ENVIRONMENT_SECTION}}

### Backend Commands
```bash
# Format PHP code
{{PHP_FORMAT_COMMAND}}

# Run migrations
{{MIGRATE_COMMAND}}

# Run PHP tests
{{PHP_TEST_COMMAND}}

# Generate files
{{MAKE_COMMAND}} make:model ModelName -mfs
{{MAKE_COMMAND}} make:controller Api/ControllerName
```

### Frontend Commands
```bash
# Install dependencies
{{NPM_INSTALL_COMMAND}}

# Start dev server
{{NPM_DEV_COMMAND}}

# Build for production
{{NPM_BUILD_COMMAND}}

# Run frontend tests
{{NPM_TEST_COMMAND}}
```

## 5. Coding Standards (The "Gold Standard")

### Backend (PHP/Laravel)
* **Language**: PHP {{PHP_VERSION}}
* **Framework**: Laravel {{LARAVEL_VERSION}}
* **Strictness**: `declare(strict_types=1);`
* **Style**: PSR-12, Laravel Pint

### Frontend ({{FRONTEND_FRAMEWORK}})
* **Framework**: {{FRONTEND_FRAMEWORK}} {{FRONTEND_VERSION}}
* **Integration**: {{INTEGRATION_LIBRARY}} {{INTEGRATION_VERSION}}
* **Styling**: {{CSS_FRAMEWORK}} {{CSS_VERSION}}
* **Style**: ESLint + Prettier

### Integration Patterns

#### API Responses
Return consistent response structures:
```php
return new UserResource($user);  // Single resource
return UserResource::collection($users);  // Collection with pagination
```

#### Frontend Data Fetching
Use {{INTEGRATION_LIBRARY}} for data:
```javascript
// Props from controller
defineProps<{
  users: Paginated<User>
}>()

// Forms
const form = useForm({
  name: '',
  email: ''
})
```

### Anti-Patterns to Avoid
* **Backend**: No business logic in controllers, no raw queries
* **Frontend**: No direct API calls in components, no prop drilling
* **Integration**: Always validate on both layers

## 6. Inertia.js / Livewire Patterns

{{INTEGRATION_PATTERNS_SECTION}}

## 7. Domain Specifics

{{DOMAIN_SECTION}}

---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
