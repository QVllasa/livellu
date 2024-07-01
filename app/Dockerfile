# Base image with Node.js and Yarn pre-installed
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps ./node_modules ./node_modules

# Add debug steps
RUN yarn --version  # Überprüft die Yarn-Version
RUN ls -la /app    # Zeigt den Inhalt des /app-Verzeichnisses an

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy the .env file if it exists
COPY .env .env

# Copy all necessary files from builder
COPY --from=builder ./public ./public
COPY --from=builder ./.next ./.next
COPY --from=builder ./node_modules ./node_modules
COPY --from=builder ./package.json ./package.json
COPY --from=builder ./ .

EXPOSE 3000

CMD ["sh", "-c", "PORT=${PORT:-3000} yarn start"]
