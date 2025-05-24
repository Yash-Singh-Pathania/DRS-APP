#!/bin/sh
set -e

# These variables (NGINX_BACKEND_HOST, NGINX_BACKEND_PORT)
# MUST be set in the DigitalOcean App Platform environment for the frontend component.
# For example, set NGINX_BACKEND_HOST to ${your_backend_component_name.INTERNAL_HOST}
# and NGINX_BACKEND_PORT to ${your_backend_component_name.INTERNAL_PORT}.
# Defaults are provided for local development (e.g., via docker-compose).
export NGINX_BACKEND_HOST=${NGINX_BACKEND_HOST:-backend}
export NGINX_BACKEND_PORT=${NGINX_BACKEND_PORT:-8000}

echo "Resolved Nginx Backend Configuration to be used by Nginx template:"
echo "NGINX_BACKEND_HOST: ${NGINX_BACKEND_HOST}"
echo "NGINX_BACKEND_PORT: ${NGINX_BACKEND_PORT}"

# For debugging, show original DigitalOcean App Platform variables if they are set
# These are examples; the actual names depend on your component names in App Platform
if [ -n "${DRS_APP_BACKEND_INTERNAL_HOST+x}" ]; then
  echo "DRS_APP_BACKEND_INTERNAL_HOST (from DO): ${DRS_APP_BACKEND_INTERNAL_HOST}"
fi
if [ -n "${DRS_APP_BACKEND_INTERNAL_PORT+x}" ]; then
  echo "DRS_APP_BACKEND_INTERNAL_PORT (from DO): ${DRS_APP_BACKEND_INTERNAL_PORT}"
fi

echo "Generating nginx configuration from template /etc/nginx/nginx.conf.template..."
# Substitute our resolved NGINX_BACKEND_HOST and NGINX_BACKEND_PORT into the template
envsubst '${NGINX_BACKEND_HOST} ${NGINX_BACKEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "Generated Nginx Configuration (/etc/nginx/conf.d/default.conf):"
cat /etc/nginx/conf.d/default.conf

echo "Testing nginx configuration..."
nginx -t

echo "Starting nginx..."
# Start nginx in the foreground
exec nginx -g 'daemon off;'
