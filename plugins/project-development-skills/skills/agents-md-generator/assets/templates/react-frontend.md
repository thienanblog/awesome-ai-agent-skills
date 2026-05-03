# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior React Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.

## 1. The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: `package.json`, `tsconfig.json`, and folder structures
   - **Check Docs**: Consult component documentation and coding guidelines
   - **Scan**: Check `src/components/` for reusable components before creating new ones

2. **Plan**:
   - Break down the request into atomic steps
   - Identify which files need creation or modification
   - Consider component hierarchy and state management needs

3. **Implementation**:
   - **Functional Components**: Use hooks, avoid class components
   - **TypeScript**: Strict typing for props, state, and functions
   - **Formatting**: Always format code with Prettier

4. **Verification**:
   - **Test**: Run `{{TEST_COMMAND}}`
   - **Type Check**: Run `{{TYPECHECK_COMMAND}}`
   - **Build Check**: Run `{{BUILD_COMMAND}}` for production build

5. **Documentation**:
   - Add JSDoc comments to exported functions
   - Update component documentation if behavior changes

6. **Self-Review**:
   - Did you use proper TypeScript types (no `any`)?
   - Did you handle loading and error states?
   - Did you memoize expensive computations?
   - Did you avoid prop drilling?

## 2. Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **Design System**: `docs/design-system.md` (Colors, components, layouts)
* **Component Guide**: `docs/components.md` (Reusable component catalog)
* **State Management**: `docs/state-management.md` (State patterns)
* **Testing Guide**: `docs/testing.md` (Testing conventions)

## 3. Project Structure & Architecture

* **`src/components/`**: Reusable UI components
* **`src/pages/`**: Page-level components (for routing)
* **`src/hooks/`**: Custom React hooks
* **`src/context/`**: React Context providers
* **`src/services/`** or **`src/api/`**: API service layer
* **`src/stores/`**: State management (Zustand/Redux)
* **`src/utils/`**: Utility functions
* **`src/types/`**: TypeScript type definitions
* **`src/styles/`**: Global styles

**Naming Conventions:**
- Components: PascalCase (`UserCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase with descriptive names (`UserProfile.ts`)

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

# Lint and format
{{LINT_COMMAND}}
```

## 5. Coding Standards (The "Gold Standard")

* **Framework**: React {{REACT_VERSION}}
* **Language**: TypeScript (strict mode)
* **Build Tool**: {{BUILD_TOOL}}
* **Styling**: {{CSS_FRAMEWORK}}
* **Code Style**: ESLint + Prettier

### Component Guidelines
* Functional components with hooks only
* Props interfaces defined explicitly with TypeScript
* Prefer named exports over default exports
* Co-locate styles with components when possible

### TypeScript Rules
* No `any` types (use `unknown` if type is truly unknown)
* Explicit return types on exported functions
* Interface over type for object shapes
* Use generics for reusable type patterns

### State Management
* **Server State**: React Query / TanStack Query
* **Client State**: Zustand, Jotai, or Context
* **Form State**: React Hook Form
* **Local State**: `useState` for component-specific data

### Hooks Guidelines
```typescript
// Custom hooks should:
// 1. Start with 'use'
// 2. Be pure functions
// 3. Handle their own cleanup

function useUser(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id)
  });
  return { user: data, isLoading, error };
}
```

### Critical Anti-Patterns

- **No `any` Types**: Use proper TypeScript types
- **No Prop Drilling**: Use Context or state management for deep props
- **No Direct DOM Manipulation**: Use refs and React's declarative approach
- **No Inline Functions in JSX**: Extract to useCallback for performance
- **No Business Logic in Components**: Extract to hooks or services

## 6. Performance Patterns

```typescript
// Memoize expensive components
const MemoizedComponent = React.memo(Component);

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);

// Memoize computed values
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## 7. Testing Patterns

```typescript
// Component tests with Testing Library
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('renders user name', async () => {
  render(<UserCard user={mockUser} />);
  expect(screen.getByText(mockUser.name)).toBeInTheDocument();
});

// Hook tests
import { renderHook, waitFor } from '@testing-library/react';

test('fetches user data', async () => {
  const { result } = renderHook(() => useUser('1'));
  await waitFor(() => {
    expect(result.current.user).toBeDefined();
  });
});
```

## 8. Domain Specifics

{{DOMAIN_SECTION}}

---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
