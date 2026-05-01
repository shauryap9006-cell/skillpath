# Premium Authentication System

A complete Login and Signup system with a working Node.js backend and a modern, premium frontend.

## Project Structure
```
auth-system/
├── client/
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
└── server/
    ├── controllers/
    │   └── authController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── auth.js
    ├── .env
    ├── index.js
    └── package.json
```

## Features
- **Frontend**: Clean, modern UI with glassmorphism, responsive design, and smooth animations.
- **Validation**: Full client-side and server-side validation for emails, passwords, and required fields.
- **Security**: Password hashing using `bcryptjs` and secure authentication using `JWT`.
- **Protected Routes**: Dashboard is protected and only accessible with a valid token.
- **Persistence**: Auth token is stored in `localStorage` for session persistence.
- **Feedback**: Loading states and success/error messages for all actions.

## Setup Instructions

### 1. Backend Setup
1. Open your terminal and navigate to the server directory:
   ```bash
   cd auth-system/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running on your machine.
   - By default, it connects to `mongodb://localhost:27017/auth_db`.
   - You can change this in the `.env` file.
4. Start the server:
   ```bash
   node index.js
   ```

### 2. Frontend Setup
1. Since this is a simple HTML/CSS/JS frontend, you can serve it using any local server (like Live Server in VS Code) or just open `login.html` in your browser.
2. Note: If you open the files directly (using `file://`), some browser security policies might block `fetch` requests. It's recommended to use a local server.

## Configuration (.env)
The server uses the following environment variables:
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for signing tokens

## Key API Endpoints
- `POST /api/auth/signup`: Create a new user
- `POST /api/auth/login`: Authenticate and get a token
- `GET /api/auth/dashboard`: Get protected user info (requires Bearer token)
