# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Laravel Backend Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, documenting, implementing, and verifying.

## 1. The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: `config/app.php` and `config/settings.php` (if exists)
   - **Check Docs**: Consult `docs/` for specific guidelines
   - **Environment**: Ensure you are using the correct environment for all runtime commands

2. **Plan**:
   - Break down the request into atomic steps (Migration -> Model -> Service -> Controller)
   - **Constraint Check**: Verify database relationships and validation requirements

3. **Documentation (Mandatory Pre-Code)**:
   - **Sync Rule**: Before writing logic, create or update `docs/features/<module>.md`
   - **Requirements**: Include API contracts, database schema, and validation rules

4. **Implementation**:
   - **Standards**: Apply PSR-12 and `declare(strict_types=1);`
   - **Migrations**: Never edit existing migrations; create new ones
   - **Validation**: Use Form Request classes, not inline validation

5. **Verification & Refinement**:
   - **Format**: Run `vendor/bin/pint` immediately after writing code
   - **Test**: Run tests following project testing guidelines
   - **Manual Check**: Verify via Tinker or standalone scripts if needed

6. **Self-Review**:
   - Did you use proper type declarations?
   - Did you add validation in Form Requests?
   - Did you create/update documentation?
   - Did you handle edge cases and errors?

## 2. Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **Testing**: `docs/testing-guidelines.md` (Test structure and coverage requirements)
* **Documentation**: `docs/documentation-guidelines.md` (How to write feature docs)
* **Architecture**: `docs/architecture.md` (System design and patterns)

## 3. Project Structure & Architecture

* **`app/Http/Controllers/`**: Feature-grouped controllers. Keep thin, delegate to Services.
* **`app/Services/`**: Business logic layer. Encapsulate complex operations.
* **`app/Models/`**: Eloquent models with relationships, scopes, and accessors.
* **`app/Http/Resources/`**: API response transformers. Collections return pagination metadata.
* **`app/Http/Requests/`**: Form Request validation classes.
* **`routes/api.php`**: API routes with middleware.
* **`routes/web.php`**: Web routes for views.
* **`database/migrations/`**: Database schema changes (never edit existing).
* **`database/factories/`**: Model factories for testing.
* **`tests/`**: Feature and Unit tests.

## 4. Development Environment

{{ENVIRONMENT_SECTION}}

### Key Commands

```bash
# Code formatting
{{FORMAT_COMMAND}}

# Run migrations
{{MIGRATE_COMMAND}}

# Run tests
{{TEST_COMMAND}}

# Generate files
{{MAKE_COMMAND}} make:model ModelName -mfs
{{MAKE_COMMAND}} make:controller ControllerName
{{MAKE_COMMAND}} make:request RequestName
```

## 5. Coding Standards (The "Gold Standard")

* **Language**: PHP {{PHP_VERSION}}
* **Framework**: Laravel {{LARAVEL_VERSION}}
* **Strictness**: Always use `declare(strict_types=1);`
* **Style**: PSR-12, enforced by Laravel Pint

### Type Declarations
* Always use explicit return type declarations
* Use appropriate PHP type hints for parameters
* Use PHPDoc for complex array shapes

### Database
* Prefer Eloquent over raw queries
* Use Model Scopes for reusable query logic
* Use `$fillable` or `$guarded` on all models
* Add database indexes for frequently queried columns

### Controllers
* Keep controllers thin - delegate to Services
* Use dependency injection
* Return Resources for API responses

### Testing
* Write tests for all new features
* Use factories for test data
* Follow Arrange-Act-Assert pattern

### Anti-Patterns to Avoid
* No business logic in controllers
* No raw queries when Eloquent suffices
* No hardcoded configuration values (use config files)
* No direct `env()` calls outside config files

## 6. Domain Specifics & Non-Negotiables

{{DOMAIN_SECTION}}

---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
