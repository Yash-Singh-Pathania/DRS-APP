#!/bin/sh
set -e

# Replace environment variables in the nginx config
echo "Configuring nginx with BACKEND_HOST=$BACKEND_HOST and BACKEND_PORT=$BACKEND_PORT"

# Ensure the config directory exists
mkdir -p /etc/nginx/conf.d

# Generate the nginx config with environment variables
envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
