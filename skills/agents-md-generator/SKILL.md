---
name: agents-md-generator
description: Generate or update CLAUDE.md/AGENTS.md files for AI coding agents through auto-scanning project files combined with interactive Q&A. Supports multiple tech stacks, development environments, and preserves customizations when updating.
author: Community
---

# AGENTS.md / CLAUDE.md Generator

## Overview

This skill helps you generate comprehensive instruction files (CLAUDE.md or AGENTS.md) that teach AI coding agents how to work effectively in your project. It combines automatic project scanning with interactive questions to create tailored guidelines.

**When to use this skill:**
- Setting up a new project for AI-assisted development
- Updating existing instruction files after project changes
- Standardizing AI agent behavior across team members
- Migrating from one AI tool to another

## Quick Start

To generate a new CLAUDE.md file:
1. Navigate to your project root
2. Tell the AI agent: "Use the agents-md-generator skill to create a CLAUDE.md file"
3. Answer the interactive questions about your project
4. Review and customize the generated file

### Generation Modes

**Interactive Mode (Default):**
- Guides you through each phase with questions
- Best for first-time setup or complex projects
- Maximum customization

**Quick Mode:**
- Tell the AI: "Generate CLAUDE.md in quick mode"
- Skips all questions, uses auto-detection only
- Best for experienced users or simple projects
- Uses Medium scan depth by default
- Generates all standard sections based on detection

## Interactive Workflow

### Phase 1: Initialization & Discovery

**Check for existing files:**
1. Look for `CLAUDE.md` or `AGENTS.md` in the project root
2. If found, ask user: "I found an existing [filename]. Would you like to:"
   - Update it (merge new content while preserving customizations)
   - Replace it (generate fresh, backup existing)
   - Cancel

**Determine primary file:**
- Default: `CLAUDE.md` as primary, `AGENTS.md` as symlink
- For Windows or if user prefers: Both files with sync header

### Phase 2: Scan Depth Selection

**Ask the user:**
```
What scan depth should I use to analyze your project?

1. Quick (approximately 30 seconds)
   Scans: package.json, composer.json, docker-compose.yml, pyproject.toml,
          Gemfile, go.mod, Cargo.toml, and other root config files
   Best for: When you know your stack well and want fast generation

2. Medium (approximately 1-2 minutes) [RECOMMENDED]
   Scans: Root configs + src/, app/, lib/, config/, routes/, components/,
          pages/, views/, controllers/, models/, services/
   Best for: Most projects - good balance of accuracy and speed

3. Deep (approximately 3-5 minutes)
   Scans: Entire project tree including tests/, docs/, scripts/, all
          subdirectories, hidden configs, and build artifacts
   Best for: Complex projects, monorepos, or unfamiliar codebases
```

**Scan actions per depth:**

| Depth | Files Scanned | Directories Explored |
|-------|---------------|---------------------|
| Quick | Root configs only | None (root level) |
| Medium | Configs + source headers | src/, app/, lib/, config/, routes/ |
| Deep | All files | Full tree traversal |

### Phase 3: Environment Detection

**Ask the user:**
```
What development environment does this project use?

1. Docker Compose
   - Commands run via: docker compose exec <service> <command>
   - Example: docker compose exec app php artisan migrate

2. Laravel Sail
   - Commands run via: ./vendor/bin/sail <command>
   - Example: ./vendor/bin/sail artisan migrate

3. Native/Host Machine
   - Commands run directly on your machine
   - Example: php artisan migrate

4. Dev Containers / Codespaces
   - Commands run inside the container environment

5. Other (please describe)
   - Specify your custom environment setup
```

**Follow-up questions based on selection:**
- Docker: "What is the main service name? (e.g., app, web, php)"
- Docker: "Do you have separate services for different runtimes? (e.g., app for PHP, node for JS)"
- Native: "Do you use any version managers? (nvm, rbenv, pyenv, etc.)"

### Phase 4: Auto-Detection + Confirmation

**Scan the project based on selected depth and detect:**

1. **Backend Framework:**
   - Laravel (composer.json + artisan)
   - Express/Node (package.json + server files)
   - Django/Flask (requirements.txt + manage.py/app.py)
   - Rails (Gemfile + config/routes.rb)
   - Spring Boot (pom.xml/build.gradle + @SpringBootApplication)

2. **Frontend Framework:**
   - Vue.js (package.json + .vue files)
   - React (package.json + .jsx/.tsx files)
   - Angular (angular.json)
   - Svelte (svelte.config.js)
   - Next.js/Nuxt.js (next.config.js/nuxt.config.ts)

3. **Package Manager:**
   - npm/yarn/pnpm/bun (package-lock.json/yarn.lock/pnpm-lock.yaml/bun.lockb)
   - Composer (composer.lock)
   - pip/poetry (requirements.txt/poetry.lock)

4. **Testing Framework:**
   - PHPUnit (phpunit.xml)
   - Pest (pestphp/pest in composer.json)
   - Jest (jest.config.js)
   - Vitest (vitest.config.ts)
   - pytest (pytest.ini/conftest.py)

5. **Code Style/Linting:**
   - Laravel Pint (pint.json)
   - ESLint (.eslintrc.*)
   - Prettier (.prettierrc.*)
   - PHP CS Fixer (.php-cs-fixer.php)

6. **Database:**
   - MySQL/MariaDB (config references)
   - PostgreSQL (config references)
   - SQLite (database/*.sqlite)
   - MongoDB (mongoose in package.json)

**Present findings to user:**
```
I detected the following tech stack:

Backend:
  - Laravel 11 (high confidence)
  - PHP 8.3 (from composer.json)

Frontend:
  - Vue.js 3 with Composition API (high confidence)
  - TailwindCSS v3 (from package.json)

Testing:
  - Pest PHP (from composer.json)
  - Vitest (from package.json)

Code Style:
  - Laravel Pint (pint.json found)
  - ESLint + Prettier (configs found)

Environment:
  - Docker Compose detected (docker-compose.yml)
  - Services: app, mysql, redis

Is this correct? Would you like to add or modify anything?
```

### Phase 4b: Optional Sections (Interactive Mode Only)

**Ask the user about optional sections:**
```
Would you like to include any of these optional sections?

1. CI/CD Configuration
   - Detect: GitHub Actions, GitLab CI, CircleCI, Jenkins
   - Include: Pipeline commands, deployment notes

2. Git Workflow Guidelines
   - Include: Branch naming, commit message format, PR guidelines
   - Detect: .github/PULL_REQUEST_TEMPLATE.md, commitlint config

3. Security Guidelines
   - Include: Env file handling, secrets management, input validation
   - Best practices for the detected stack

4. API Documentation
   - Detect: OpenAPI/Swagger specs, Postman collections
   - Include: Documentation conventions and tooling

5. Mobile App Guidelines (if detected)
   - React Native / Flutter specific patterns
   - Platform-specific considerations

6. Monorepo Guidelines (if detected)
   - Nx / Turborepo / Lerna workspace patterns
   - Package management and dependencies

Select the sections you need (comma-separated numbers, or 'none' to skip):
```

**Note:** In Quick Mode, these optional sections are skipped unless auto-detected with high confidence.

### Phase 5: Section Generation

Generate the following sections based on detected stack and user input:

#### Section 1: Header & Role
```markdown
# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior [DETECTED_ROLE] and Technical Lead.
You are responsible for the entire lifecycle of a task: understanding,
planning, [STACK_SPECIFIC_RESPONSIBILITIES].
```

**Role detection rules:**
- Laravel only → "Laravel Backend Engineer"
- Vue/React only → "[Framework] Frontend Engineer"
- Laravel + Vue/React → "Full-Stack Developer"
- Node.js backend → "Node.js Backend Engineer"
- Generic → "Software Engineer"

#### Section 2: Auto-Pilot Workflow

Generate the 6-step workflow cycle:
1. **Discovery & Context** - What to read first, where to find docs
2. **Plan** - How to break down tasks, constraints to check
3. **Documentation** - When to update docs, what format to use
4. **Implementation** - Coding standards, patterns to follow
5. **Verification & Refinement** - Testing, linting, manual checks
6. **Self-Review** - Checklist of common mistakes to avoid

Each step includes stack-specific instructions from templates.

#### Section 3: Documentation & Knowledge Base

List paths to important documentation:
```markdown
## Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **[Doc Type]**: `[path/to/doc.md]` ([Brief description])
```

**Auto-detect common paths:**
- `docs/`, `documentation/`
- `README.md`, `CONTRIBUTING.md`
- `docs/api/`, `docs/architecture/`
- **Important**: Do not list `CLAUDE.md` or `AGENTS.md` in this section. These files are already loaded by AI tools, and self-references waste context.

#### Section 4: Project Structure & Architecture

Map the folder structure with purposes:
```markdown
## Project Structure & Architecture

* **`[folder/]`**: [Purpose description]
```

**Common patterns to detect:**
- MVC structure (controllers, models, views)
- Feature-based modules
- Domain-driven design
- Component-based frontend

#### Section 5: Development Environment

Based on Phase 3 selection:
```markdown
## Development Environment

### Container Commands (if Docker)
* App container: `docker compose exec [service] <command>`

### Host Commands
* Git, file operations, IDE commands

### Key Commands
* Format: `[detected formatter command]`
* Test: `[detected test command]`
* Build: `[detected build command]`
```

#### Section 6: Coding Standards

Based on detected stack:
```markdown
## Coding Standards (The "Gold Standard")

* **Language**: [Language] [Version]
* **Framework**: [Framework] [Version]
* **Code Style**: [Style guide/tool]
* **Strictness**: [Type hints, strict mode, etc.]
```

**Include anti-patterns section if applicable:**
```markdown
### Critical Anti-Patterns
- [Stack-specific anti-patterns to avoid]
```

#### Section 7: Domain Specifics (Optional)

If the project has specific domain rules detected:
```markdown
## Domain Specifics & Non-Negotiables

* **[Rule Category]**: [Rule description]
```

**Common domain patterns:**
- Multi-tenant applications
- Permission/role systems
- Localization requirements
- Real-time features

#### Section 8: CI/CD Configuration (Optional)

If user selected or auto-detected:
```markdown
## CI/CD & Deployment

### Detected Pipelines
* **GitHub Actions**: `.github/workflows/`
* **GitLab CI**: `.gitlab-ci.yml`

### Pipeline Commands
* Run tests: `[detected command]`
* Build: `[detected command]`
* Deploy: `[detected command]`

### Deployment Notes
* [Environment-specific notes]
```

#### Section 9: Git Workflow (Optional)

If user selected:
```markdown
## Git Workflow

### Branch Naming
* Feature: `feature/<ticket>-<description>`
* Bugfix: `fix/<ticket>-<description>`
* Hotfix: `hotfix/<description>`

### Commit Message Format
```
type(scope): description

[optional body]
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Guidelines
* Reference ticket/issue in description
* Ensure tests pass before requesting review
* Keep PRs focused and reasonably sized
```

#### Section 10: Security Guidelines (Optional)

If user selected:
```markdown
## Security Guidelines

### Environment Variables
* Never commit `.env` files (only `.env.example`)
* Use secrets management for production
* Rotate credentials regularly

### Input Validation
* Validate all user input at boundaries
* Sanitize data before database queries
* Use parameterized queries (ORM handles this)

### Authentication & Authorization
* [Stack-specific auth patterns]
* Always verify permissions before actions
```

#### Section 11: API Documentation (Optional)

If detected or user selected:
```markdown
## API Documentation

### Documentation Location
* OpenAPI Spec: `[path/to/openapi.yaml]`
* Postman Collection: `[path/to/collection.json]`

### Documentation Standards
* Keep API docs in sync with implementation
* Document all endpoints, request/response schemas
* Include example requests and responses
```

#### Section 12: Mobile Guidelines (Optional)

If React Native or Flutter detected:
```markdown
## Mobile Development

### Platform Considerations
* Test on both iOS and Android
* Handle platform-specific UI patterns
* Consider offline functionality

### Build Commands
* iOS: `[build command]`
* Android: `[build command]`
```

#### Section 13: Monorepo Guidelines (Optional)

If monorepo detected:
```markdown
## Monorepo Structure

### Workspace Management
* Package manager: [pnpm/yarn/npm workspaces]
* Build tool: [Nx/Turborepo/Lerna]

### Package Dependencies
* Use workspace protocol for internal packages
* Keep shared dependencies at root level

### Commands
* Build all: `[command]`
* Build affected: `[command]`
* Test affected: `[command]`
```

### Phase 6: File Creation/Update

**For new files:**
1. Write `CLAUDE.md` with generated content
2. Create `AGENTS.md` as symlink:
   ```bash
   ln -s CLAUDE.md AGENTS.md
   ```
3. If symlink fails (Windows), create copy with header:
   ```markdown
   <!-- This file mirrors CLAUDE.md. Edit CLAUDE.md as the primary source. -->
   ```

**For updates (merge mode):**
1. Parse existing file into sections (split by `## ` headers)
2. Compare auto-detected findings against existing guidance; if they conflict, ask the user whether to keep existing content, replace it, or merge.
3. For each section:
   - If exists in both: Show diff and ask user preference
   - If only in existing: Preserve (user customization)
   - If only in new: Add with note
4. Generate merged file
5. Show summary of changes
6. Ensure the generated content does not instruct the agent to read `CLAUDE.md` or `AGENTS.md`, since those files are already loaded by AI tools.

## Tech Stack Detection Reference

See `references/tech-stack-detection.md` for complete detection patterns.

## Section Templates Reference

See `references/section-templates.md` for complete section templates per stack.

## Update/Merge Strategy Reference

See `references/merge-strategy.md` for detailed merge logic.

## Output File Naming

**Primary file:** `CLAUDE.md`
- This is the main instruction file that AI agents read
- All edits should be made to this file

**Secondary file:** `AGENTS.md`
- Symlink to CLAUDE.md (Unix/macOS/Linux)
- Or copy with header note (Windows)
- Provides compatibility with tools expecting AGENTS.md

**Why this approach:**
- Single source of truth prevents drift
- Works across all AI coding tools
- Follows Claude Code conventions while supporting others

---

*This skill is part of the awesome-ai-agent-skills community library.*
