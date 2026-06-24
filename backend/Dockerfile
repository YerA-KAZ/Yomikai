FROM node:18-alpine AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ==========================================
FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma in production
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built code
COPY --from=builder /app/dist ./dist

# Start script that runs migrations and then starts the server
# Using sh -c to ensure the command is evaluated properly
CMD sh -c "npx prisma migrate deploy && node dist/server.js"
