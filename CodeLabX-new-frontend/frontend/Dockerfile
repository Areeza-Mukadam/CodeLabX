# ==============================================================================
# CodeLabX Frontend - Multi-Stage Dockerfile (React 19 / Vite / Nginx)
# ==============================================================================

# --- Stage 1: Build React Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Clean install dependencies
RUN npm ci

# Copy project source code and configuration files
COPY . .

# Build-time environment arguments (defaults allow flexible override)
ARG VITE_API_URL=http://localhost:8080
ARG VITE_ENABLE_MOCK_DATA=false

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENABLE_MOCK_DATA=$VITE_ENABLE_MOCK_DATA

# Compile TypeScript and build production bundle via Vite
RUN npm run build

# --- Stage 2: Serve using Nginx Alpine ---
FROM nginx:alpine

# Remove default site configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration supporting SPA routing and API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled frontend assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check to ensure Nginx is serving the frontend index
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
