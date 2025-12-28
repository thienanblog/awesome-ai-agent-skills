# FastAPI Dockerfile
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

# Install Uvicorn
RUN pip install uvicorn[standard]

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Development command with hot reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production command (uncomment for production):
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
