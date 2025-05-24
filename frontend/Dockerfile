# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source code and nginx configuration template
COPY . .

# Build the application
RUN npm run build

# Create public directory if it doesn't exist
RUN mkdir -p /app/public

# Production stage
FROM nginx:alpine

# Install envsubst and bash for environment variable substitution
RUN apk add --no-cache bash gettext

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html/public /usr/share/nginx/html/assets && \
    chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Copy nginx configuration template from build stage
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy docker-entrypoint script and make it executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set working directory
WORKDIR /usr/share/nginx/html

# Create necessary directories
RUN mkdir -p /usr/share/nginx/html/public

# Copy error page
COPY --from=build /app/public/error.html /usr/share/nginx/html/error.html

# Create a simple index.html if it doesn't exist
RUN if [ ! -f index.html ]; then \
        echo '<!DOCTYPE html><html><head><title>Loading...</title></head><body>Loading...</body></html>' > index.html; \
    fi

# Create a simple 50x.html error page if it doesn't exist
RUN if [ ! -f 50x.html ]; then \
        echo '<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Error</h1></body></html>' > 50x.html; \
    fi

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    chmod g+rwx /var/cache/nginx /var/run /var/log/nginx && \
    chgrp -R root /var/cache/nginx



# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Set the entrypoint and default command
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
