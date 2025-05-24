# Multi-stage build for DRS Wallet application

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the frontend application
RUN npm run build

# Verify the build output
RUN ls -la /app/frontend/dist/

# Stage 2: Build backend
FROM python:3.9-slim AS backend-build

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Stage 3: Final image
FROM python:3.9-slim

WORKDIR /app

# Install Nginx and supervisor
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy backend from backend-build stage
COPY --from=backend-build /app/backend /app/backend
COPY --from=backend-build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy frontend build from frontend-build stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Create nginx user and group and set up directories
RUN groupadd -r nginx && \
    useradd -r -g nginx -s /sbin/nologin -d /var/cache/nginx -c "Nginx user" nginx && \
    mkdir -p /var/log/nginx /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run

# Set proper permissions for Nginx
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Create supervisord configuration
RUN echo '[supervisord]\n\
nodaemon=true\n\
\n\
[program:nginx]\n\
command=nginx -g "daemon off;"\n\
user=nginx\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:backend]\n\
command=python -m uvicorn app.main:app --host 0.0.0.0 --port 8000\n\
directory=/app/backend\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0' > /etc/supervisor/conf.d/supervisord.conf

# Expose port
EXPOSE 80

# Start supervisor to manage processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]