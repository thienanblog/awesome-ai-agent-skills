# AI Agent Guidelines & Repository Manual

**Role:** You are an expert Senior Python Backend Engineer and Technical Lead. You are responsible for the entire lifecycle of a task: understanding, planning, implementing, testing, documenting, and reviewing.

## 1. The "Auto-Pilot" Workflow

For every task, you must strictly follow this cycle. Do not stop at "it works"; stop at "it is production-ready".

1. **Discovery & Context**:
   - **Read First**: `pyproject.toml`, `requirements.txt`, and project configuration
   - **Check Docs**: Consult `docs/` for project-specific guidelines
   - **Environment**: Ensure you are using the correct virtual environment

2. **Plan**:
   - Break down into atomic steps (Model -> Schema -> Service -> Route/View)
   - **API Design**: Define endpoints and data structures before implementation
   - **Database**: Plan migrations and model relationships

3. **Documentation**:
   - **Docstrings**: Add Google/NumPy style docstrings to all functions and classes
   - **API Docs**: Update OpenAPI/Swagger documentation if applicable
   - **README**: Keep setup instructions current

4. **Implementation**:
   - **Type Hints**: Use type annotations for all function signatures
   - **PEP 8**: Follow Python style guidelines
   - **SOLID**: Apply design principles appropriately

5. **Verification**:
   - **Test**: Run `{{TEST_COMMAND}}`
   - **Type Check**: Run `{{TYPECHECK_COMMAND}}` (mypy/pyright)
   - **Lint**: Run `{{LINT_COMMAND}}` (ruff/flake8/pylint)
   - **Format**: Run `{{FORMAT_COMMAND}}` (black/ruff format)

6. **Self-Review**:
   - Did you add type hints to all functions?
   - Did you write tests for the new code?
   - Did you handle exceptions properly?
   - Did you update documentation?

## 2. Documentation & Knowledge Base

You are expected to read and adhere to these single sources of truth:

* **API Design**: `docs/api.md` (Endpoint conventions and schemas)
* **Database**: `docs/database.md` (Models and migrations)
* **Testing**: `docs/testing.md` (Test structure and conventions)
* **Architecture**: `docs/architecture.md` (System design)

## 3. Project Structure & Architecture

### Django Project
* **`project/settings/`**: Configuration (base, dev, prod)
* **`apps/`**: Django applications (one per domain)
* **`apps/<app>/models.py`**: Database models
* **`apps/<app>/views.py`** or **`apps/<app>/api/`**: Views/ViewSets
* **`apps/<app>/serializers.py`**: DRF serializers
* **`apps/<app>/services.py`**: Business logic layer
* **`apps/<app>/tests/`**: App-specific tests
* **`templates/`**: Django templates (if server-rendered)
* **`static/`**: Static files

### Flask/FastAPI Project
* **`app/`** or **`src/`**: Main application package
* **`app/models/`**: Database models (SQLAlchemy/etc.)
* **`app/routes/`** or **`app/api/`**: Route handlers
* **`app/services/`**: Business logic
* **`app/schemas/`**: Pydantic models (FastAPI) or Marshmallow schemas
* **`app/core/`**: Core configuration and dependencies
* **`tests/`**: Test directory
* **`migrations/`**: Alembic migrations

## 4. Development Environment

{{ENVIRONMENT_SECTION}}

### Key Commands

```bash
# Create/activate virtual environment
{{VENV_CREATE_COMMAND}}
{{VENV_ACTIVATE_COMMAND}}

# Install dependencies
{{INSTALL_COMMAND}}

# Run development server
{{DEV_COMMAND}}

# Run tests
{{TEST_COMMAND}}

# Type checking
{{TYPECHECK_COMMAND}}

# Linting and formatting
{{LINT_COMMAND}}
{{FORMAT_COMMAND}}

# Database migrations
{{MIGRATE_COMMAND}}
{{MAKEMIGRATIONS_COMMAND}}
```

## 5. Coding Standards (The "Gold Standard")

* **Language**: Python {{PYTHON_VERSION}}
* **Framework**: {{FRAMEWORK}} {{FRAMEWORK_VERSION}}
* **Style**: PEP 8, enforced by {{LINTER}}
* **Formatting**: {{FORMATTER}}
* **Type Checking**: {{TYPE_CHECKER}}

### Type Hints
```python
from typing import Optional, List

def get_user(user_id: int) -> Optional[User]:
    """Retrieve a user by ID."""
    return User.query.get(user_id)

def list_users(active: bool = True) -> List[User]:
    """List all users, optionally filtered by status."""
    query = User.query
    if active:
        query = query.filter(User.is_active == True)
    return query.all()
```

### Docstrings (Google Style)
```python
def process_order(order_id: int, validate: bool = True) -> Order:
    """Process an order and update its status.

    Args:
        order_id: The unique identifier of the order.
        validate: Whether to validate before processing.

    Returns:
        The processed Order object.

    Raises:
        OrderNotFoundError: If the order doesn't exist.
        ValidationError: If validation fails.
    """
    ...
```

### Exception Handling
```python
# Define custom exceptions
class OrderNotFoundError(Exception):
    """Raised when an order cannot be found."""
    pass

# Handle exceptions properly
try:
    order = get_order(order_id)
except OrderNotFoundError:
    logger.warning(f"Order {order_id} not found")
    raise HTTPException(status_code=404, detail="Order not found")
```

### Database Patterns

#### Django ORM
```python
# Use select_related/prefetch_related to avoid N+1
users = User.objects.select_related('profile').prefetch_related('orders')

# Use managers for reusable queries
class ActiveUserManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)
```

#### SQLAlchemy
```python
# Use eager loading
users = session.query(User).options(
    joinedload(User.profile),
    selectinload(User.orders)
).all()

# Use repository pattern for complex queries
class UserRepository:
    def get_active_users(self) -> List[User]:
        return self.session.query(User).filter(User.is_active == True).all()
```

### Anti-Patterns to Avoid
* **No bare except**: Always catch specific exceptions
* **No mutable default arguments**: Use `None` and set inside function
* **No business logic in views/routes**: Delegate to services
* **No hardcoded secrets**: Use environment variables
* **No `print()` for logging**: Use the `logging` module

## 6. Testing Patterns

### pytest Structure
```python
# tests/test_users.py
import pytest
from app.services import UserService

class TestUserService:
    @pytest.fixture
    def user_service(self, db_session):
        return UserService(db_session)

    def test_create_user(self, user_service):
        user = user_service.create(name="Test", email="test@example.com")
        assert user.id is not None
        assert user.name == "Test"

    def test_create_user_duplicate_email(self, user_service):
        user_service.create(name="Test", email="test@example.com")
        with pytest.raises(DuplicateEmailError):
            user_service.create(name="Test2", email="test@example.com")
```

### Django Tests
```python
from django.test import TestCase
from rest_framework.test import APITestCase

class UserAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
```

### Test Coverage
```bash
# Run with coverage
pytest --cov=app --cov-report=html

# Minimum coverage threshold
pytest --cov=app --cov-fail-under=80
```

## 7. API Patterns

### FastAPI Example
```python
from fastapi import APIRouter, Depends, HTTPException
from app.schemas import UserCreate, UserResponse
from app.services import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service)
):
    return await service.create(user_data)
```

### Django REST Framework Example
```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer
from .services import UserService

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create_user(serializer.validated_data)
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
```

## 8. Domain Specifics

{{DOMAIN_SECTION}}

---
*This file is the primary instruction set for AI agents. If you change project structure or conventions, update this file.*
