# Node.js Dockerfile
# Template markers: {{NODE_VERSION}}, {{PACKAGE_MANAGER}}, {{START_COMMAND_JSON}}

# syntax=docker/dockerfile:1
FROM node:{{NODE_VERSION}}-alpine

# Install build dependencies (for native modules)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Set working directory
WORKDIR /app

RUN corepack enable

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
RUN pnpm install --frozen-lockfile
{{/if_pnpm}}

# Copy application code
COPY --chown=node:node . .

RUN chown -R node:node /app

# Build application (if needed)
# RUN npm run build

# Expose port
EXPOSE {{PORT}}

# Run the development process as the image-provided non-root user.
USER node

# Replace with a valid JSON array, for example ["npm", "run", "dev"].
CMD {{START_COMMAND_JSON}}

# For development with hot reload:
# CMD ["npm", "run", "dev"]
