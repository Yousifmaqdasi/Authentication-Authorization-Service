# 🔐 Authentication & User Management API

A clean, modular Node.js backend built with Express that provides secure authentication, authorization, and user management using JWT access and refresh tokens, role-based access control, and structured middleware. This project is designed to reflect real-world backend architecture with a clear separation of concerns between controllers, services, middleware, and database schemas.

---

⚠️ Project Status

This project is currently under active development. Features may change, and some functionality may be incomplete or subject to updates.

## 🚀 Overview

This API handles the full authentication lifecycle and user management flow. It allows users to register, log in, access protected routes, refresh expired sessions, and log out securely. The system uses short-lived access tokens for requests and long-lived refresh tokens to maintain sessions without forcing users to log in repeatedly. Authorization is handled through roles and permissions, ensuring only authorized users can access certain endpoints.

---

## 🧠 How It Works

When a user logs in, the server generates two tokens: an access token and a refresh token. The access token is short-lived and is used to authenticate requests to protected routes. The refresh token is long-lived and stored securely (typically in a cookie and/or database). When the access token expires, the refresh token is used to generate a new one without requiring the user to log in again. Middleware is responsible for verifying tokens, attaching user data to requests, and enforcing role-based permissions before allowing access to specific routes.

---

## 🏗️ Project Structure

```
src/

controllers/        # Handles request and response logic
  auth.controller.ts
  user.controller.ts

services/           # Business logic and core functionality
  auth.service.ts
  user.service.ts

routes/             # API route definitions
  auth.routes.ts
  users.routes.ts

middleware/         # Request processing and security
  auth.middleware.ts
  role.middleware.ts
  refresh.validation.middleware.ts
  error.handler.middleware.ts

schemas/            # Database schemas/models
  users.schema.ts
  tokens.schema.ts
  auth.schema.ts

utils/              # Helper functions
  generate.access.token.ts
  generate.refresh.token.ts

config/
  db.ts             # Database connection setup

types/
  auth.types.ts

permissions.ts      # Role and permission definitions
app.ts              # Express app configuration
index.ts            # Application entry point
```

---

## 🔑 Features

- JWT-based authentication (access + refresh tokens)
- Secure session handling
- Role-based access control (RBAC)
- Middleware-driven request validation and protection
- Centralized error handling
- Scalable and maintainable folder structure

---

## ⚙️ Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

---

## ▶️ Running the Application

To start the development server:

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

The server will run on:

```
http://localhost:<PORT>
```

---

## 🔐 Authentication Flow

To register a new user, send a POST request to `/api/auth/register`. Logging in is done via `/api/auth/login`, which returns both an access token and a refresh token. Protected routes require the access token to be included in the Authorization header using the Bearer format. When the access token expires, a new one can be generated using `/api/auth/refresh` with a valid refresh token. Logging out invalidates the refresh token via `/api/auth/logout`.

---

## 🛡️ Middleware

The application uses several middleware layers to control request flow and security. The authentication middleware verifies access tokens and attaches the authenticated user to the request. The role middleware ensures that the user has the required permissions to access a route. The refresh validation middleware checks the validity of refresh tokens before issuing new access tokens. The error handler middleware catches all errors and ensures consistent response formatting across the application.

---

## 🔐 Roles & Permissions

Roles and permissions are defined in `permissions.ts`. These are used to restrict access to certain routes based on user roles. For example, an admin may have full access to all endpoints, while a regular user has limited permissions. This makes the system flexible and secure for different user types.

---

## 🧩 Database

The database connection is configured in `db.ts`. User data is managed through `users.schema.ts`, refresh tokens are stored in `tokens.schema.ts`, and authentication-related structures are handled in `auth.schema.ts`. This separation keeps data organized and easy to maintain.

---

## 🧪 Example Protected Route

A typical protected route uses both authentication and role middleware before executing the controller logic. First, the token is verified, then the user’s role is checked, and only then is the request allowed to proceed to the controller.

---

## ❗ Error Handling

All errors are handled centrally using a global error handler middleware. This ensures that every error response follows a consistent structure, making debugging and frontend integration easier.

Example response:

```json
{
  "status": 401,
  "message": "Unauthorized"
}
```

---

## 🧠 Key Concepts

Access tokens should always be short-lived for security reasons, while refresh tokens must be stored securely. Middleware plays a critical role in controlling how requests flow through the application. Controllers should remain lightweight, with most business logic handled inside services to keep the codebase clean and maintainable.

---

## 📌 Future Improvements

Possible improvements include adding rate limiting, email verification, password reset functionality, logging systems, and automated testing using tools like Jest.

---

## 👤 Author

This project was built as a structured backend system focusing on real-world authentication, scalability, and clean architecture principles.
