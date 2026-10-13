# Login Backend

## Setup Instructions

1. Clone the repository.

2. Navigate to the project folder:

   ```bash
   cd login-backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create an `environments` folder in the project root if it doesn't already exist. Inside it, create a `local.env` file and add:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET_KEY=your_access_token_secret
   JWT_REFRESH_SECRET_KEY=your_refresh_token_secret
   JWT_ACCESS_EXPIRES_IN=30m
   JWT_REFRESH_EXPIRES_IN=6d
   PORT=3000
   CORS_ORIGINS=http://localhost:4200
   ```

   Replace the placeholder values with your own configuration. Use strong, private JWT secrets.

5. Start the backend in development mode:

   ```bash
   npm run dev
   ```

6. The backend will run at:

   `http://localhost:3000`

7. Open the Swagger API documentation at:

   `http://localhost:3000/api-docs`

## Available Endpoints

- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Log in and receive access and refresh tokens.
- `POST /auth/refresh` - Obtain a new access token.
- `GET /auth/dashboard` - Access the protected dashboard using a valid access token.

