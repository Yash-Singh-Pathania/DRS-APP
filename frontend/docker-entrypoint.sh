#!/bin/sh
set -e

# For DigitalOcean App Platform, set these environment variables in the frontend component's settings:
#   APP_PLATFORM_RESOLVED_BACKEND_HOST = ${drs-app-backend.INTERNAL_HOST}
#   APP_PLATFORM_RESOLVED_BACKEND_PORT = ${drs-app-backend.INTERNAL_PORT}

# For local development (docker-compose.yml), NGINX_BACKEND_HOST & NGINX_BACKEND_PORT are used.

# Determine the actual host and port for Nginx substitution
# Prioritize App Platform's resolved variables if they exist.
if [ -n "${APP_PLATFORM_RESOLVED_BACKEND_HOST}" ]; then
  FINAL_HOST="${APP_PLATFORM_RESOLVED_BACKEND_HOST}"
else
  FINAL_HOST=${NGINX_BACKEND_HOST:-backend} # Fallback to NGINX_BACKEND_HOST (from docker-compose) or 'backend'
fi

if [ -n "${APP_PLATFORM_RESOLVED_BACKEND_PORT}" ]; then
  FINAL_PORT="${APP_PLATFORM_RESOLVED_BACKEND_PORT}"
else
  FINAL_PORT=${NGINX_BACKEND_PORT:-8000} # Fallback to NGINX_BACKEND_PORT (from docker-compose) or '8000'
fi

# Export the final chosen host and port so envsubst can use them with the Nginx template's placeholders
export NGINX_BACKEND_HOST="${FINAL_HOST}"
export NGINX_BACKEND_PORT="${FINAL_PORT}"

echo "Nginx Configuration Details:"
echo "  Using Backend Host: ${NGINX_BACKEND_HOST}"
echo "  Using Backend Port: ${NGINX_BACKEND_PORT}"

# For debugging, show the source variables if they were set:
if [ -n "${APP_PLATFORM_RESOLVED_BACKEND_HOST+x}" ]; then echo "  (Source: APP_PLATFORM_RESOLVED_BACKEND_HOST=${APP_PLATFORM_RESOLVED_BACKEND_HOST})"; fi
if [ -n "${NGINX_BACKEND_HOST+x}" ] && [ -z "${APP_PLATFORM_RESOLVED_BACKEND_HOST+x}" ]; then echo "  (Source: NGINX_BACKEND_HOST=${NGINX_BACKEND_HOST} from docker-compose/local env)"; fi

echo "Generating Nginx configuration from template: /etc/nginx/conf.d/default.conf.template"
envsubst '${NGINX_BACKEND_HOST} ${NGINX_BACKEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Generated Nginx Configuration (/etc/nginx/conf.d/default.conf):"
cat /etc/nginx/conf.d/default.conf

echo "Testing nginx configuration..."
nginx -t

echo "Starting nginx..."
# Start nginx in the foreground
exec nginx -g 'daemon off;'
