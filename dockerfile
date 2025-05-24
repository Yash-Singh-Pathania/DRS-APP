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

# Create nginx configuration for DigitalOcean App Platform
RUN echo 'server {
    listen 80;
    server_name _;

    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Error handling
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}' > /etc/nginx/conf.d/default.conf

# Create supervisord configuration
RUN echo '[supervisord]
nodaemon=true

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:backend]
command=python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
directory=/app/backend
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0' > /etc/supervisor/conf.d/supervisord.conf

# Expose port
EXPOSE 80

# Start supervisor to manage processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]