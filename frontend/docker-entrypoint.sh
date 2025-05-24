#!/bin/sh
set -e

echo "Starting nginx with the following configuration:"
cat /etc/nginx/conf.d/default.conf

# Start nginx in the foreground
echo "Starting nginx..."
exec nginx -g 'daemon off;'
