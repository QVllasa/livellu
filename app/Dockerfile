# Base image with Node.js and Yarn pre-installed
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Add debug step to list directory contents
RUN ls -la /app

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy the .env file if it exists
COPY .env .env

# Copy all necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/ .

EXPOSE 3000

CMD ["sh", "-c", "PORT=${PORT:-3000} yarn start"]
