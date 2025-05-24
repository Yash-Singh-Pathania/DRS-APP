#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}DRS Wallet Deployment Script${NC}"
echo "=============================="

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo -e "${RED}Error: .env.prod file not found!${NC}"
    echo "Please create a .env.prod file with your production environment variables."
    exit 1
fi

# Load environment variables
echo -e "${YELLOW}Loading environment variables...${NC}"
export $(grep -v '^#' .env.prod | xargs)

# Check if domain is set
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: DOMAIN not set in .env.prod!${NC}"
    echo "Please set your domain name in the .env.prod file."
    exit 1
fi

# Create required directories
echo -e "${YELLOW}Creating required directories...${NC}"
mkdir -p nginx/ssl
mkdir -p nginx/www

# Check if Docker and Docker Compose are installed
echo -e "${YELLOW}Checking if Docker and Docker Compose are installed...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Update Nginx configuration with actual domain
echo -e "${YELLOW}Updating Nginx configuration with domain: $DOMAIN${NC}"
sed -i "s/\${DOMAIN}/$DOMAIN/g" nginx/conf.d/default.conf

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL not set in .env.prod!${NC}"
    echo "Please set your Digital Ocean database connection string in the .env.prod file."
    exit 1
fi

# Build the containers
echo -e "${YELLOW}Building containers...${NC}"
docker-compose -f docker-compose.prod.yml build

# Start the rest of the services
echo -e "${YELLOW}Starting remaining services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Initialize SSL certificates with Let's Encrypt
echo -e "${YELLOW}Setting up SSL certificates with Let's Encrypt...${NC}"
docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --email admin@$DOMAIN --agree-tos --no-eff-email

# Reload Nginx to apply SSL certificates
echo -e "${YELLOW}Reloading Nginx to apply SSL certificates...${NC}"
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "Your DRS Wallet application is now running at https://$DOMAIN"
echo -e "Please make sure your domain's DNS records are pointing to this server's IP address."
echo ""
echo -e "${YELLOW}To view logs:${NC}"
echo "docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo -e "${YELLOW}To stop the application:${NC}"
echo "docker-compose -f docker-compose.prod.yml down"
echo ""
echo -e "${YELLOW}To restart the application:${NC}"
echo "docker-compose -f docker-compose.prod.yml restart"
