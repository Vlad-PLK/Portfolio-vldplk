# Multi-stage Dockerfile for building a React (Vite) app with Node and serving via nginx (SPA-friendly)

# --- Builder Stage (Node) ---
FROM node:18-alpine AS builder

# Install security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache dumb-init

WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install dependencies with clean install for reproducible builds
RUN npm install --no-progress --no-audit

# Copy source files
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build && \
    # Verify build output exists
    ls -la dist/

# --- Production Stage (nginx) ---
FROM nginx:1.27-alpine

# Security: run as non-root user
RUN apk upgrade --no-cache && \
    apk add --no-cache \
    ca-certificates \
    tzdata && \
    # Create nginx cache directories with proper permissions
    mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp && \
    # Create directory for PID file with proper permissions
    mkdir -p /var/run/nginx && \
    # Set proper permissions
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/run/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    # Remove default config
    rm -f /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Create SSL certificate directory
RUN mkdir -p /etc/letsencrypt/live/vladplk.mysmarttech.fr && \
    chown -R nginx:nginx /etc/letsencrypt

# Copy SSL certs from build context (optional - can be mounted via volumes instead)
# If using volumes in docker-compose, comment out these lines
# COPY --chown=nginx:nginx certs/fullchain.pem /etc/letsencrypt/live/vladplk.mysmarttech.fr/fullchain.pem
# COPY --chown=nginx:nginx certs/privkey.pem /etc/letsencrypt/live/vladplk.mysmarttech.fr/privkey.pem
# COPY --chown=nginx:nginx certs/chain.pem /etc/letsencrypt/live/vladplk.mysmarttech.fr/chain.pem

# Copy custom nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf


# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Labels for metadata
LABEL maintainer="Vladimir Polojienko <leonpolo365@gmail.com>"
LABEL description="Production-ready React Portfolio with nginx"
LABEL version="1.0"

# Expose ports
EXPOSE 80 443

# Use nginx directly (runs as root to bind to privileged ports, but worker processes run as nginx user)
CMD ["nginx", "-g", "daemon off;"]