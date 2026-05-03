# Django Dockerfile
# Template markers: {{PYTHON_VERSION}}

FROM python:{{PYTHON_VERSION}}-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for layer caching)
COPY requirements.txt ./
# OR for Poetry:
# COPY pyproject.toml poetry.lock ./

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt
# OR for Poetry:
# RUN pip install poetry \
#     && poetry config virtualenvs.create false \
#     && poetry install --no-interaction --no-ansi

# Install Gunicorn
RUN pip install gunicorn

# Copy application code
COPY . .

# Collect static files (for production)
# RUN python manage.py collectstatic --noinput

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Development command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Production command (uncomment for production):
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "myproject.wsgi:application"]
