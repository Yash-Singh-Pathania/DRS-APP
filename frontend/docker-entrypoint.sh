#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status.

echo "Starting docker-entrypoint.sh script..."
echo "Initial Environment Variables Check (from script's perspective):"
echo "  APP_PLATFORM_RESOLVED_BACKEND_HOST: '${APP_PLATFORM_RESOLVED_BACKEND_HOST}' (raw value)"
echo "  APP_PLATFORM_RESOLVED_BACKEND_PORT: '${APP_PLATFORM_RESOLVED_BACKEND_PORT}' (raw value)"
echo "  NGINX_BACKEND_HOST (from env before logic): '${NGINX_BACKEND_HOST}'"
echo "  NGINX_BACKEND_PORT (from env before logic): '${NGINX_BACKEND_PORT}'"

# Determine the actual host and port for Nginx substitution
# Prioritize App Platform's resolved variables if they exist.
# Also check if the App Platform variable was passed literally (not expanded)
if [ -n "${APP_PLATFORM_RESOLVED_BACKEND_HOST}" ] && [ "${APP_PLATFORM_RESOLVED_BACKEND_HOST}" != "\${drs-app-backend.INTERNAL_HOST}" ] && [ "${APP_PLATFORM_RESOLVED_BACKEND_HOST}" != "\${YOUR_BACKEND_COMPONENT_NAME.INTERNAL_HOST}" ]; then
  FINAL_HOST="${APP_PLATFORM_RESOLVED_BACKEND_HOST}"
  HOST_SOURCE_INFO="(Source: Using APP_PLATFORM_RESOLVED_BACKEND_HOST value: '${FINAL_HOST}')"
else
  # Fallback logic
  if [ -n "${NGINX_BACKEND_HOST}" ]; then
    FINAL_HOST="${NGINX_BACKEND_HOST}"
    HOST_SOURCE_INFO="(Source: APP_PLATFORM var not set/expanded. Using NGINX_BACKEND_HOST from env: '${FINAL_HOST}')"
  else
    FINAL_HOST="drs-app-backend" # Default to 'drs-app-backend' if NGINX_BACKEND_HOST is also empty. Adjust if your DO backend service name is different.
    HOST_SOURCE_INFO="(Source: APP_PLATFORM var and NGINX_BACKEND_HOST not set/expanded. Using default: '${FINAL_HOST}')"
  fi
fi

if [ -n "${APP_PLATFORM_RESOLVED_BACKEND_PORT}" ] && [ "${APP_PLATFORM_RESOLVED_BACKEND_PORT}" != "\${drs-app-backend.INTERNAL_PORT}" ] && [ "${APP_PLATFORM_RESOLVED_BACKEND_PORT}" != "\${YOUR_BACKEND_COMPONENT_NAME.INTERNAL_PORT}" ]; then
  FINAL_PORT="${APP_PLATFORM_RESOLVED_BACKEND_PORT}"
  PORT_SOURCE_INFO="(Source: Using APP_PLATFORM_RESOLVED_BACKEND_PORT value: '${FINAL_PORT}')"
else
  # Fallback logic
  if [ -n "${NGINX_BACKEND_PORT}" ]; then
    FINAL_PORT="${NGINX_BACKEND_PORT}"
    PORT_SOURCE_INFO="(Source: APP_PLATFORM var not set/expanded. Using NGINX_BACKEND_PORT from env: '${FINAL_PORT}')"
  else
    FINAL_PORT="8000" # Default to '8000' if NGINX_BACKEND_PORT is also empty.
    PORT_SOURCE_INFO="(Source: APP_PLATFORM var and NGINX_BACKEND_PORT not set/expanded. Using default: '${FINAL_PORT}')"
  fi
fi

# Export these names as the nginx.conf.template uses them for substitution
export NGINX_BACKEND_HOST="${FINAL_HOST}"
export NGINX_BACKEND_PORT="${FINAL_PORT}"

echo "Nginx Configuration Logic Output:"
echo "  Resolved Backend Host for Nginx: ${NGINX_BACKEND_HOST} ${HOST_SOURCE_INFO}"
echo "  Resolved Backend Port for Nginx: ${NGINX_BACKEND_PORT} ${PORT_SOURCE_INFO}"

CONF_TEMPLATE_PATH="/etc/nginx/conf.d/default.conf.template"
CONF_OUTPUT_PATH="/etc/nginx/conf.d/default.conf"

if [ ! -f "${CONF_TEMPLATE_PATH}" ]; then
    echo "ERROR: Nginx template file not found at ${CONF_TEMPLATE_PATH}" >&2
    exit 1
fi

echo "Generating Nginx configuration from template: ${CONF_TEMPLATE_PATH} to ${CONF_OUTPUT_PATH}"
# envsubst will replace ${NGINX_BACKEND_HOST} and ${NGINX_BACKEND_PORT} in the template
# with the values of the shell variables NGINX_BACKEND_HOST and NGINX_BACKEND_PORT.
envsubst '${NGINX_BACKEND_HOST} ${NGINX_BACKEND_PORT}' < "${CONF_TEMPLATE_PATH}" > "${CONF_OUTPUT_PATH}"

echo "Generated Nginx Configuration (${CONF_OUTPUT_PATH}):"
cat "${CONF_OUTPUT_PATH}"
echo "--- End of Generated Nginx Configuration ---"

echo "Testing nginx configuration (/etc/nginx/nginx.conf and included files like ${CONF_OUTPUT_PATH})..."
nginx -t

echo "Starting nginx..."
# Start nginx in the foreground
exec nginx -g 'daemon off;'
