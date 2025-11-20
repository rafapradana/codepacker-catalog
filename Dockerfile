# Gunakan image Node.js versi LTS
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file project
COPY . .

# Build Next.js
RUN npm run build

# Stage kedua: image untuk runtime
FROM node:22-alpine AS runner
WORKDIR /app

# Copy hasil build dan dependencies produksi
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port 7979
ENV PORT=7979
EXPOSE 7979

# Jalankan aplikasi
CMD ["npm", "run", "start"]
