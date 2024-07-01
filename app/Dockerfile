# Base image with Node.js and Yarn pre-installed
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Remove unnecessary debug steps in final Dockerfile
# RUN yarn --version  # Überprüft die Yarn-Version
# RUN ls -la /app    # Zeigt den Inhalt des /app-Verzeichnisses an

RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy all necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


EXPOSE 3000

CMD ["sh", "-c", "PORT=${PORT:-3000} yarn start"]
