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

# Create public directory if it doesn't exist
RUN mkdir -p /app/public

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

# Create necessary directories
RUN mkdir -p /etc/nginx/conf.d /usr/share/nginx/html/public /usr/share/nginx/html/assets

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure the nginx configuration is valid
RUN nginx -t

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create a simple index.html if it doesn't exist
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
        echo '<!DOCTYPE html><html><head><title>Loading...</title></head><body>Loading...</body></html>' > /usr/share/nginx/html/index.html; \
    fi

# Create a simple 50x.html error page if it doesn't exist
RUN if [ ! -f /usr/share/nginx/html/50x.html ]; then \
        echo '<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Error</h1></body></html>' > /usr/share/nginx/html/50x.html; \
    fi

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    chmod g+rwx /var/cache/nginx /var/run /var/log/nginx && \
    chgrp -R root /var/cache/nginx

# Environment variables for backend configuration
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=8000

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx with the entrypoint script
CMD ["/bin/sh", "/docker-entrypoint.sh"]
