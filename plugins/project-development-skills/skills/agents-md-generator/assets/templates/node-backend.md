# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Node.js Backend Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.

## 1. The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: `package.json`, `tsconfig.json`, and environment configuration
   - **Check Docs**: Consult `docs/` for API specifications and patterns
   - **Environment**: Verify environment variables and dependencies

2. **Plan**:
   - Break down into atomic steps (Schema -> Model -> Service -> Controller -> Route)
   - **API Design**: Define endpoints and payloads before implementation
   - **Error Handling**: Plan error responses and edge cases

3. **Documentation**:
   - **Sync Rule**: Update `docs/api/<resource>.md` before implementation
   - **OpenAPI**: Keep API specs in sync with implementation

4. **Implementation**:
   - **TypeScript**: Strict typing for all modules
   - **Async/Await**: Proper error handling with try/catch
   - **Validation**: Validate all inputs at the boundary

5. **Verification**:
   - **Test**: Run `{{TEST_COMMAND}}`
   - **Type Check**: Run `{{TYPECHECK_COMMAND}}`
   - **Lint**: Run `{{LINT_COMMAND}}`

6. **Self-Review**:
   - Did you handle all error cases?
   - Did you validate inputs properly?
   - Did you add proper logging?
   - Did you write tests for the new code?

## 2. Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **API Design**: `docs/api-design.md` (Endpoint conventions)
* **Error Handling**: `docs/error-handling.md` (Error response patterns)
* **Database**: `docs/database.md` (Schema and query patterns)
* **Testing**: `docs/testing.md` (Test structure and conventions)

## 3. Project Structure & Architecture

* **`src/controllers/`**: Request handlers (thin, delegate to services)
* **`src/services/`**: Business logic layer
* **`src/models/`**: Database models/schemas
* **`src/routes/`**: Route definitions and middleware
* **`src/middleware/`**: Express/Fastify middleware
* **`src/utils/`**: Utility functions
* **`src/types/`**: TypeScript type definitions
* **`src/config/`**: Configuration management
* **`src/validators/`**: Input validation schemas
* **`tests/`**: Test files (mirrors src structure)

**Architecture Pattern:**
```
Request -> Route -> Middleware -> Controller -> Service -> Model -> Database
```

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

# Type check
{{TYPECHECK_COMMAND}}

# Build for production
{{BUILD_COMMAND}}

# Lint
{{LINT_COMMAND}}

# Database operations
{{DB_MIGRATE_COMMAND}}
{{DB_SEED_COMMAND}}
```

## 5. Coding Standards (The "Gold Standard")

* **Runtime**: Node.js {{NODE_VERSION}}
* **Language**: TypeScript (strict mode)
* **Framework**: {{FRAMEWORK}} {{FRAMEWORK_VERSION}}
* **Style**: ESLint + Prettier

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Controller Pattern
```typescript
// Controllers should be thin
export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }
}
```

### Service Pattern
```typescript
// Services contain business logic
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(data: CreateUserDto): Promise<User> {
    // Validation, business rules, etc.
    return this.userRepository.create(data);
  }
}
```

### Error Handling
```typescript
// Custom error classes
export class NotFoundError extends Error {
  status = 404;
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

// Global error handler middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = error instanceof AppError ? error.status : 500;
  res.status(status).json({
    error: error.message,
    status
  });
});
```

### Validation
```typescript
// Use Zod/Joi for input validation
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8)
});

// Validate in middleware or controller
const validated = CreateUserSchema.parse(req.body);
```

### Anti-Patterns to Avoid
* **No `any` Types**: Use proper TypeScript types
* **No Callback Hell**: Use async/await
* **No Unhandled Promises**: Always catch errors
* **No Business Logic in Controllers**: Delegate to services
* **No Hardcoded Config**: Use environment variables via config

## 6. Database Patterns

### ORM Usage ({{ORM_NAME}})
```typescript
// Repository pattern for database access
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.model.create({ data });
  }
}
```

### Migrations
```bash
# Create migration
{{DB_MIGRATE_CREATE_COMMAND}}

# Run migrations
{{DB_MIGRATE_COMMAND}}

# Rollback
{{DB_ROLLBACK_COMMAND}}
```

## 7. Testing Patterns

```typescript
// Unit test example
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new UserService(mockRepository);
  });

  it('should find user by id', async () => {
    mockRepository.findById.mockResolvedValue(mockUser);
    const result = await service.findById('1');
    expect(result).toEqual(mockUser);
  });
});

// Integration test example
describe('POST /users', () => {
  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Test', email: 'test@example.com' });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Test');
  });
});
```

## 8. Domain Specifics

{{DOMAIN_SECTION}}

---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
