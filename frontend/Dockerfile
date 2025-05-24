# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create .env file for runtime
RUN echo "BACKEND_HOST=${BACKEND_HOST:-backend}" > /app/.env && \
    echo "BACKEND_PORT=${BACKEND_PORT:-8000}" >> /app/.env

# Production stage
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache bash

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /etc/nginx/templates && \
    chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 755 /var/cache/nginx /var/run /var/log/nginx

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy any additional static files if they exist
COPY --from=build /app/public/ /usr/share/nginx/html/

# Set proper permissions and create necessary files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    chmod g+rwx /var/cache/nginx /var/run /var/log/nginx && \
    chgrp -R root /var/cache/nginx && \
    # Create missing PWA files if they don't exist
    touch /usr/share/nginx/html/pwa-192x192.png

# Environment variables for backend configuration
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=8000

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.d/50-configure-nginx.sh
RUN chmod +x /docker-entrypoint.d/50-configure-nginx.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx with the entrypoint script
CMD ["/bin/sh", "/docker-entrypoint.d/50-configure-nginx.sh"]
