# Node.js Dockerfile
# Template markers: {{NODE_VERSION}}, {{PACKAGE_MANAGER}}, {{START_COMMAND}}

FROM node:{{NODE_VERSION}}-alpine

# Install build dependencies (for native modules)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
{{#if_yarn}}
COPY yarn.lock ./
{{/if_yarn}}
{{#if_pnpm}}
COPY pnpm-lock.yaml ./
{{/if_pnpm}}

# Install dependencies
{{#if_npm}}
RUN npm ci
{{/if_npm}}
{{#if_yarn}}
RUN yarn install --frozen-lockfile
{{/if_yarn}}
{{#if_pnpm}}
RUN npm install -g pnpm && pnpm install --frozen-lockfile
{{/if_pnpm}}

# Copy application code
COPY . .

# Build application (if needed)
# RUN npm run build

# Expose port
EXPOSE {{PORT}}

# Start command
CMD ["{{START_COMMAND}}"]

# For development with hot reload:
# CMD ["npm", "run", "dev"]
