# Deploying to DigitalOcean App Platform

This guide explains how to deploy the DRS App to DigitalOcean App Platform using a microservices approach with separate frontend and backend containers.

## Prerequisites

1. A DigitalOcean account
2. Your code pushed to a GitHub repository
3. DigitalOcean CLI (doctl) installed (optional, for command-line deployment)

## Deployment Steps

### Option 1: Using the DigitalOcean Dashboard

1. **Log in to your DigitalOcean account** and navigate to the App Platform section.

2. **Click "Create App"** and select your GitHub repository.

3. **Select the repository** containing your DRS App code.

4. **Configure the app as a microservice**:
   - When prompted to select components, choose "Add a Component" twice to add both frontend and backend
   - For the first component (frontend):
     - Select the frontend directory
     - Choose "Dockerfile" as the build method
     - Select the Dockerfile in the frontend directory
     - Set the HTTP port to 80
     - Set the route to `/`
   - For the second component (backend):
     - Select the backend directory
     - Choose "Dockerfile" as the build method
     - Select the Dockerfile in the backend directory
     - Set the HTTP port to 8000
     - Set the route to `/api`

5. **Configure environment variables**:
   For the backend component, add the following environment variables:
   - Database credentials:
     - `DB_USERNAME`: `doadmin`
     - `DB_PASSWORD`: Your database password
     - `DB_HOST`: Your database host (e.g., `db-drs-do-user-18093928-0.e.db.ondigitalocean.com`)
     - `DB_PORT`: `25060`
     - `DB_DATABASE`: `drsdb`
     - `DB_SSL`: `true`
   - Other settings:
     - `SECRET_KEY`: Your secret key for JWT
     - `DOMAIN`: Your domain name (e.g., domydrs.com)
     - `SMTP_HOST`: SMTP server host
     - `SMTP_PORT`: SMTP server port
     - `SMTP_USER`: SMTP username
     - `SMTP_PASSWORD`: SMTP password
     - `SMTP_FROM_EMAIL`: Email address to send from
     - `SMTP_USE_TLS`: Whether to use TLS (true or false)
   
   For the frontend component, add:
   - `API_URL`: `${APP_URL}/api` (DigitalOcean will replace this with the actual app URL)

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

### Frontend Issues
- **Frontend fails to build**: Check the build logs for errors. Common issues include missing dependencies or incorrect Dockerfile configuration.
- **Frontend shows but API calls fail**: Verify that the `API_URL` environment variable is correctly set and that the backend service is running.
- **Nginx configuration issues**: Check if your Nginx configuration is correctly handling API requests and static files.

### Backend Issues
- **Backend fails to build**: Check the build logs. Ensure all dependencies are correctly specified in requirements.txt.
- **Backend builds but doesn't run**: Check the runtime logs. Ensure all environment variables are correctly set.
- **Database connection issues**: Verify your database credentials (DB_USERNAME, DB_PASSWORD, etc.) are correct and that the database is accessible from the App Platform.
- **SSL issues**: Make sure DB_SSL is set to "true" for DigitalOcean managed databases.

### Communication Issues
- **Frontend can't reach backend**: Verify the routing configuration in app.yaml. The backend should be accessible at `/api`.
- **CORS errors**: Check that the backend's CORS settings allow requests from the frontend domain.

### General Troubleshooting
- **Check logs**: DigitalOcean App Platform provides detailed logs for each component.
- **Verify environment variables**: Double-check all environment variables are correctly set.
- **Test locally**: Before deploying, test your microservices locally using Docker Compose to ensure they work together correctly.

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
