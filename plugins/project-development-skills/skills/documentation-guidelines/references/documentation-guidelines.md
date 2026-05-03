# Documentation Guidelines (Backend API Focused)

**Purpose:** Produce a single, skimmable **source of truth** per module. It must allow Backend Developers to maintain logic and Consumers (Frontend Devs / AI Agents) to understand the **API Contract** and **Business Constraints** without needing access to the backend codebase.

## 1. Core Philosophy
1.  **Cohesion over Granularity:** Keep the entire bounded context (Logic, Data, API, Side Effects) in **one canonical file**.
2.  **Bus Factor = 1:** Include instructions on seeding and troubleshooting so any backend developer can fix the API immediately.
3.  **Strict Separation of Concerns:** Documentation defines **Data Contracts** and **Business Logic**, not UI implementation. We describe *what* the data means, not *how* to visualize it.
4.  **Living Document:** When updating logic, **delete** outdated information. Do not append new logic to old logic. Keep the file clean and duplicate-free.

## 2. Location & Naming
- **Backend/Feature Logic:**
    - **Zone-based repos:** If the project uses zones, follow the repo convention (e.g., `docs/features/office/<module-name>.md`, `docs/features/production/<module-name>.md`).
    - **Zone-agnostic repos:** Default to `docs/features/<module-name>.md` unless the repo specifies a different location.
- **Naming:** Descriptive kebab-case (e.g., `production-order-operations.md`).
- **Frontmatter metadata:** Each feature doc must start with a YAML frontmatter block. Use it instead of a free-form header so metadata is machine-readable and consistent. Required keys: `name`, `description`, `version`, `last_updated`, `maintained_by`. Bump the version and update the date whenever you change the doc content.

## 3. Audience & Tone
- **Backend Devs:** Focus on internal architecture, services, database integrity, and background jobs.
- **Consumers (Frontend/AI):** Focus on **Payloads**, **Response Shapes**, **Error Codes**, and **Data Constraints** (e.g., "Field X is immutable when status is Y").
- **Tone:** Declarative, Technical, Concise.

## 4. Standard Structure (Strict Order)

### 0) Frontmatter (Required)
Start the file with YAML frontmatter metadata.

### 1) Title + Purpose
One-liner: What is this module and what problem does it solve?

### 2) Scope & Interfaces
Who consumes this? (Mobile App, Admin Panel, External Webhook, etc.).

### 3) Architecture & Key Decisions (Backend Only)
- Why use specific patterns/technologies? (ADR).
- Cross-module dependencies (e.g., "Depends on Inventory Service").
- **Zone Separation**: Explicitly state if the module bridges zones (e.g., Office creating Production Tasks). Ensure `Production`-prefixed Controllers/Resources are reserved for Production Zone consumers, while Models/Services can be shared.
- **Constants & Enums:** List key constant files that drive logic (e.g., `OrderStatusConstant`).

### 4) Code Components (Backend Only)
*List the specific classes/files that power this module.*
- **Controllers & Routes**: Entry points.
- **Form Requests**: Validation classes.
- **Resources**: Response transformers.
- **Models & Observers**: Data entities and event hooks.
- **Jobs & Console Commands**: Async tasks and custom Artisan commands. Document their signature and usage.
- **Traits & Support**: Shared helpers.
- **Middleware**: Request filtering.
- **Providers**: Service binding.

### 5) Local Development & Seeding (Backend Only)
- Commands to run and seed this specific module locally (for backend verification).
- **Console Commands:** How to run any maintenance/utility commands provided by this module.
- **State Recreation:** How to create specific data scenarios (e.g., "To generate a 'Past Due' order for testing...").

### 6) Guards & Configuration
- **Permissions:** Which permissions (scopes) are required to access these endpoints.
- **Feature Flags:** Server-side flags that might alter API behavior.

### 7) Data Model (Internal)
- **Mermaid ER Diagram** (Internal DB structure).
- **Models:** List relevant Eloquent models.
- *Note:* Useful for Backend understanding, but Consumers should rely on Response shapes.

### 8) Endpoints & Contracts (Consumer Facing)
- **Table:** `Method | Path | Scope/Guard | Purpose`.
- **Headers:** Required headers (e.g., `Accept-Language`, `Timezone`).

### 9) Services & Business Flow (Backend Only)
- **Mermaid Flowchart** of internal processing (States -> Actions -> Side Effects).

### 10) Payloads & Responses (Consumer Facing - Critical)
- **Request Payloads:** Exact JSON structure required. Mark fields as Required/Optional.
- **Response Examples:** Canonical Success and Error JSON shapes.
- **Data Constraints:**
    - Format requirements (e.g., "Dates must be ISO8601 UTC").
    - Field limitations (e.g., "Max 50 characters", "Must be unique").

### 11) Client Consumption Rules (Logic Only)
*Define business rules the client must respect. Do NOT describe UI.*
- **State Logic:** E.g., "When `status` is `archived`, the API rejects all PATCH requests." (Client infers read-only mode).
- **Derivations:** E.g., "The `total_price` field is computed server-side; do not send it in requests."
- **Error Dictionary:** Map Backend Error Codes to Business Meanings.
    - `ERR_STOCK_LOW`: The requested quantity exceeds available inventory.
    - `ERR_KYC_REQUIRED`: User must complete identity verification before proceeding.

### 12) Cache, Events & Side Effects
- **Async Actions:** What happens in the background? (e.g., "Webhooks are fired 5 minutes after creation").
- **Cache Invalidation:** When does the data become stale?

### 13) External Dependencies
- Integrations (Payment Gateways, Storage, etc.).

### 14) Troubleshooting & Logs (Backend Only)
- How to debug backend failures.
- Log keywords for tracing.

### 15) Tests
- Relevant backend test suites.

### 16) FAQ / Change Log
- Version history of the API contract.

## 5. Writing Style & Formatting
- **Visuals:** Use Mermaid for Logic flows.
- **Contracts:** Use Tables for Parameters and Error Codes.
- **Zero UI References:** Avoid words like "Button", "Modal", "Screen", "Color", "Hide/Show". Use words like "Endpoint", "Payload", "Status", "Rejected", "Available".
- **Mermaid Safety:** Keep node labels short and simple (letters/numbers/basic punctuation). Avoid `->`, `::`, `(`, `)`, commas, or quotes inside labels; use separate nodes and arrows for relationships instead. Prefer labels like `CustomerService` or `Customer stats` over sentences. If you must include special characters, wrap the label with `"` and keep it concise to prevent parse errors.

## 6. Fast-Start Templates

**Frontmatter:**
```yaml
---
name: production-order-operations
description: Backend API contract and business rules for production orders.
version: 1.3.0
last_updated: 2026-01-29
maintained_by: Backend Team
---
```

**Endpoint Table:**
| Method | Path | Scope | Purpose |
| :--- | :--- | :--- | :--- |
| POST | `/api/orders` | `orders:write` | Create a new production order |

**Client Consumption Rules (Business Logic):**
| Data State | API Behavior / Constraint |
| :--- | :--- |
| `status: "locked"` | API returns `403 Forbidden` on update attempts. Resource is immutable. |
| `is_verified: false` | API restricts access to sensitive fields (`phone`, `email`). |

## 7. Workflow for Features
1.  **Define Contract:** Define the JSON Payloads and Business Rules first.
2.  **Verify Contract:** Ensure the documented inputs/outputs match the actual code.
3.  **Review Rule:** Code changes that alter the API Contract (breaking changes) must have updated docs.
