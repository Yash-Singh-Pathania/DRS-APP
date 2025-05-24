# DRS Wallet Deployment Guide

This guide provides step-by-step instructions for deploying the DRS Wallet application on a Digital Ocean droplet.

## Prerequisites

- A Digital Ocean account
- A domain name pointing to your Digital Ocean droplet
- Basic knowledge of Docker and Linux commands

## Setting Up a Digital Ocean Droplet

1. **Create a new droplet**:
   - Log in to your Digital Ocean account
   - Click "Create" and select "Droplets"
   - Choose an image: Ubuntu 22.04 LTS
   - Select a plan: Basic (Recommended: at least 2GB RAM / 1 CPU)
   - Choose a datacenter region close to your target users
   - Add SSH keys for secure access
   - Click "Create Droplet"

2. **Connect to your droplet**:
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Update the system**:
   ```bash
   apt update && apt upgrade -y
   ```

4. **Install Docker and Docker Compose**:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt install -y docker-compose
   ```

5. **Set up a firewall**:
   ```bash
   # Allow SSH, HTTP, and HTTPS
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

## Setting Up a Digital Ocean Managed Database

1. **Create a new database cluster**:
   - Log in to your Digital Ocean account
   - Click "Create" and select "Databases"
   - Choose PostgreSQL as the database engine
   - Select a plan (Recommended: Basic plan with 1GB RAM / 1 vCPU)
   - Choose the same datacenter region as your droplet
   - Name your database cluster (e.g., drs-wallet-db)
   - Click "Create Database Cluster"

2. **Configure the database**:
   - Once the database is created, click on it to access its details
   - Navigate to the "Users & Databases" tab
   - Create a new database named `drs_wallet`
   - Note the connection details (host, port, username, password)

3. **Configure firewall rules**:
   - Go to the "Settings" tab
   - Under "Trusted Sources", add your droplet's IP address
   - This ensures only your application can connect to the database

## Deploying the DRS Wallet Application

1. **Clone the repository**:
   ```bash
   mkdir -p /opt/drs-wallet
   cd /opt/drs-wallet
   
   # If using Git:
   git clone your_repository_url .
   
   # Or upload your files using SCP:
   # From your local machine:
   # scp -r /path/to/drs-app/* root@your_droplet_ip:/opt/drs-wallet/
   ```

2. **Configure environment variables**:
   ```bash
   cd /opt/drs-wallet
   cp .env.prod.example .env.prod
   nano .env.prod
   ```
   
   Update the following variables:
   - `DOMAIN`: Your domain name (e.g., drswallet.com)
   - `DATABASE_URL`: Your Digital Ocean database connection string (format: postgres://username:password@host:port/database?sslmode=require)
   - `SECRET_KEY`: A secure random string for JWT token encryption
   - SMTP settings for email functionality

3. **Run the deployment script**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   This script will:
   - Create necessary directories
   - Update Nginx configuration with your domain
   - Build and start Docker containers
   - Set up SSL certificates with Let's Encrypt
   - Configure the application for production use

4. **Verify the deployment**:
   - Open your domain in a web browser
   - Check if the application is running correctly
   - Test login and signup functionality

## Managing Your Deployment

### Viewing Logs

```bash
cd /opt/drs-wallet
docker-compose -f docker-compose.prod.yml logs -f
```

To view logs for a specific service:
```bash
docker-compose -f docker-compose.prod.yml logs -f [service_name]
```

Where `[service_name]` can be: `backend`, `frontend`, `postgres`, or `nginx`.

### Restarting Services

To restart all services:
```bash
docker-compose -f docker-compose.prod.yml restart
```

To restart a specific service:
```bash
docker-compose -f docker-compose.prod.yml restart [service_name]
```

### Stopping the Application

```bash
docker-compose -f docker-compose.prod.yml down
```

### Updating the Application

1. Pull the latest changes:
   ```bash
   git pull
   ```
   
   Or upload the updated files using SCP.

2. Rebuild and restart the containers:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

## SSL Certificate Renewal

Let's Encrypt certificates are valid for 90 days. The certbot container is configured to automatically attempt renewal. However, you can manually renew the certificates:

```bash
docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Backup and Restore

### Database Backup

```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres drs_wallet > backup.sql
```

### Database Restore

```bash
cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres drs_wallet
```

## Troubleshooting

### Application Not Accessible

1. Check if containers are running:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. Check Nginx logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs nginx
   ```

3. Check backend logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs backend
   ```

4. Verify DNS settings:
   ```bash
   nslookup your_domain
   ```

### Database Connection Issues

1. Check if the PostgreSQL container is running:
   ```bash
   docker-compose -f docker-compose.prod.yml ps postgres
   ```

2. Check database logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

3. Verify database connection settings in `.env.prod`

## Security Considerations

1. **Regular Updates**: Keep your system and Docker images updated
2. **Firewall**: Ensure only necessary ports are open
3. **Monitoring**: Set up monitoring for your application
4. **Backups**: Regularly backup your database and configuration
5. **Access Control**: Use strong passwords and limit SSH access

## Need Help?

If you encounter any issues with your deployment, please contact the development team for assistance.
