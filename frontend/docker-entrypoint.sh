#!/bin/sh
set -e

# Set default values for DigitalOcean internal service discovery
export DIGITALOCEAN_APP_BACKEND_INTERNAL_HOST=${DIGITALOCEAN_APP_BACKEND_INTERNAL_HOST:-drs-app-backend}
export DIGITALOCEAN_APP_BACKEND_INTERNAL_PORT=${DIGITALOCEAN_APP_BACKEND_INTERNAL_PORT:-8000}

# Log the environment variables for debugging
echo "Environment variables:"
echo "DIGITALOCEAN_APP_BACKEND_INTERNAL_HOST: $DIGITALOCEAN_APP_BACKEND_INTERNAL_HOST"
echo "DIGITALOCEAN_APP_BACKEND_INTERNAL_PORT: $DIGITALOCEAN_APP_BACKEND_INTERNAL_PORT"

# Replace environment variables in nginx config
echo "Generating nginx configuration..."
envsubst '${DIGITALOCEAN_APP_BACKEND_INTERNAL_HOST} ${DIGITALOCEAN_APP_BACKEND_INTERNAL_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Starting nginx with the following configuration:"
cat /etc/nginx/conf.d/default.conf

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx in the foreground
echo "Starting nginx..."
exec nginx -g 'daemon off;'
