# Deploying to DigitalOcean App Platform

This guide explains how to deploy the DRS App to DigitalOcean App Platform using the combined Docker image.

## Prerequisites

1. A DigitalOcean account
2. Your code pushed to a GitHub repository
3. DigitalOcean CLI (doctl) installed (optional, for command-line deployment)

## Deployment Steps

### Option 1: Using the DigitalOcean Dashboard

1. **Log in to your DigitalOcean account** and navigate to the App Platform section.

2. **Click "Create App"** and select your GitHub repository.

3. **Select the repository** containing your DRS App code.

4. **Configure the app**:
   - Select "Dockerfile" as the build method
   - Ensure the Dockerfile at the root of your repository is selected
   - Set the HTTP port to 80

5. **Configure environment variables**:
   Add the following environment variables in the Environment Variables section:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: Your secret key for JWT
   - `DOMAIN`: Your domain name (e.g., domydrs.com)
   - `SMTP_HOST`: SMTP server host
   - `SMTP_PORT`: SMTP server port
   - `SMTP_USER`: SMTP username
   - `SMTP_PASSWORD`: SMTP password
   - `SMTP_FROM_EMAIL`: Email address to send from
   - `SMTP_USE_TLS`: Whether to use TLS (1 for yes, 0 for no)

6. **Select a plan** that meets your requirements.

7. **Review and launch** your app.

### Option 2: Using the app.yaml Configuration

1. **Update the app.yaml file** in your repository:
   - Replace `your-github-repo-name` with your actual GitHub repository name
   - Ensure all environment variables are correctly set

2. **Install doctl** if you haven't already:
   ```bash
   brew install doctl  # For macOS
   ```

3. **Authenticate doctl**:
   ```bash
   doctl auth init
   ```

4. **Deploy your app**:
   ```bash
   doctl apps create --spec app.yaml
   ```

## Post-Deployment Steps

1. **Set up your custom domain**:
   - In the App Platform dashboard, go to your app's settings
   - Navigate to the Domains tab
   - Add your custom domain (e.g., domydrs.com)
   - Follow the instructions to configure DNS records

2. **Monitor your app**:
   - Check the Logs tab to ensure everything is running correctly
   - Monitor the Resources tab to track usage

3. **Set up database backups** if you're using DigitalOcean Managed Database.

## Troubleshooting

- **App fails to build**: Check the build logs for errors. Common issues include missing dependencies or incorrect Dockerfile configuration.
- **App builds but doesn't run**: Check the runtime logs. Ensure all environment variables are correctly set.
- **Database connection issues**: Verify your DATABASE_URL is correct and that the database is accessible from the App Platform.

## Updating Your App

To update your app after making changes:

1. **Push changes to your GitHub repository**
2. **DigitalOcean will automatically rebuild and deploy** your app if you've enabled automatic deployments.
3. **Alternatively, trigger a manual deployment** from the App Platform dashboard.

## Important Notes

- The combined Docker image contains both frontend and backend in a single container, managed by supervisord.
- Nginx serves the frontend static files and proxies API requests to the backend.
- Environment variables are injected at runtime by DigitalOcean App Platform.
- SSL/TLS is handled automatically by DigitalOcean App Platform when you configure a custom domain.
