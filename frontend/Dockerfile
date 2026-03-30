# --------------------------------------------------
# STAGE 1 — Install dependencies only when needed
# --------------------------------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# Install required packages for Next.js (sharp, etc.)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# --------------------------------------------------
# STAGE 2 — Build the application
# --------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --------------------------------------------------
# STAGE 3 — Production Image
# --------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run Next.js as root (security best practice)
RUN addgroup -g 1001 nextjs && \
    adduser -D -G nextjs -u 1001 nextjs

# Copy only the production artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
CMD ["npm", "run", "start"]
