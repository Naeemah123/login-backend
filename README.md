# Login Backend

## Setup Instructions

1. Clone the repository.

2. Navigate to the project folder:

cd login-backend

3. Install the dependencies:

npm install

4. Create a `.env` file in the project root and add:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=6d
PORT=3000

5. Start the backend in development:

npm run dev

6. The backend will run at:

http://localhost:3000