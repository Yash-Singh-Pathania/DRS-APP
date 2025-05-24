# DRS Coupon App

A mobile-friendly Progressive Web App (PWA) for managing DRS (Deposit Return Scheme) coupons in Europe.

## Features

- **Scan DRS Coupons**: Quickly scan barcodes from recycling coupons
- **Payout Mode**: Display barcodes in high contrast for easy scanning by cashiers
- **Google Authentication**: Secure login with Google account
- **Mobile-Friendly**: Responsive design works well on all devices
- **PWA Support**: Install on your home screen for quick access
- **Persistent Login**: Stay logged in across sessions

## Tech Stack

### Backend
- FastAPI
- Tortoise ORM
- PostgreSQL
- JWT Authentication
- Google OAuth

### Frontend
- React
- Vite
- Material UI
- Zustand (State Management)
- PWA Support

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd drs-app/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example` and configure your environment variables:
   ```
   cp .env.example .env
   ```

5. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd drs-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables:
   ```
   cp .env.example .env
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Add authorized JavaScript origins and redirect URIs for your app
6. Copy the Client ID and Client Secret to your `.env` files

## Database Setup

1. Create a PostgreSQL database:
   ```
   createdb drs_app
   ```

2. The application will automatically create the necessary tables on startup using Tortoise ORM

## Usage

1. Open the app in your browser
2. Log in with your Google account
3. Scan DRS coupons using your device's camera
4. Use Payout Mode when at the store to display barcodes for scanning
5. View and manage your coupons in the Coupons list

## Deployment

The app can be deployed as a standard web application with the backend and frontend components separated:

1. Deploy the FastAPI backend to a server with Python support
2. Build and deploy the React frontend to a static hosting service
3. Configure the frontend to point to your backend API
4. Set up a PostgreSQL database for production

## License

This project is licensed under the MIT License.
