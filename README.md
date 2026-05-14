# 🔐 Backend Authentication System (Node.js + Express + Drizzle)

A secure and structured backend authentication system built with **Node.js**, **Express**, **TypeScript**, and **Drizzle ORM**.  
It includes full authentication flow, role-based access control, password reset, and email verification.

## 🌐 Live Deployment

Base API:
https://authentication-authorization-service-production.up.railway.app/

Swagger API Docs:
https://authentication-authorization-service-production.up.railway.app/api-docs

## 🚀 Features

- JWT authentication
- Access & refresh token flow
- HTTP-only cookie authentication
- Refresh token rotation
- Email verification
- Resend email verification flow
- Forgot/reset password flow
- Role-based access control (RBAC)
- Permission middleware
- Protected routes
- Input validation
- Centralized error handling
- Swagger/OpenAPI documentation
- PostgreSQL + Drizzle ORM
- Clean modular architecture
- Security hardening with Helmet & rate limiting

---

## 🧠 Authentication Flow

### 1. Register

- User registers
- Server:
  - Validates input
  - Creates user
  - Generates email verification token
- A verification email is sent
- User must verify email before accessing protected routes

---

### 2. Verify Email

- User clicks verification link:
  ```
  /auth/verify-email?verificationToken=...
  ```
- Server:
  - Validates token
  - Checks expiration
  - Marks user as verified
- Authentication tokens are issued after successful verification

### 2.1 Resend Verification Email

- User requests a new verification email
- Server:
  - Validates email
  - Ensures user is unverified
  - Generates new verification token
  - Invalidates old token
- A new verification email is sent

---

### 3. Login

- User logs in
- Server:
  - Validates input
  - Verifies credentials
  - Ensures user is verified
  - Generates access & refresh tokens
- Tokens are stored in **HTTP-only cookies**

---

### 4. Access Protected Routes

- `verifyAccessToken`
  - Verifies JWT
  - Attaches `{ id, permissions, isVerified }` to `req.user`

- `requireVerified`
  - Blocks unverified users from accessing routes

---

### 5. Refresh Token

- Client calls `/auth/refresh`
- Server:
  - Verifies refresh token
  - Checks database
  - Issues new access token

---

### 6. Logout

- Clears cookies
- Removes refresh token from database

---

## 🔐 Role & Permission System

Permissions:

- `USER_CREATE`
- `USER_READ`
- `USER_UPDATE`
- `USER_DELETE`

Roles:

- `admin` → full permissions
- `user` → no permissions (default)

Middleware:

- `requirePermission(permission)`

---

## 📂 Project Structure

```
src/
├── config/          # env, db, app configuration
├── constants/       # constants/enums
├── controllers/     # request/response handling
├── docs/            # swagger api docs
├── drizzle/         # schema, migrations, db setup
├── middleware/      # express middlewares
├── models/          # database models/types
├── routes/          # api route definitions
├── services/        # business logic
├── types/           # global/custom TypeScript types
├── utils/           # helper functions
├── validators/      # zod/validation schemas
├── app.ts           # express app setup
└── index.ts         # server entry point
```

---

## 📡 API Endpoints

### Auth Routes (`/auth`)

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| POST   | `/register`                      | Register user             |
| GET    | `/verify-email`                  | Verify email              |
| POST   | `/resend-verification-email`     | Resend verification email |
| POST   | `/login`                         | Login                     |
| POST   | `/logout`                        | Logout                    |
| POST   | `/refresh`                       | Refresh token             |
| POST   | `/forgot-password`               | Forgot password           |
| POST   | `/reset-password/:userId/:token` | Reset password            |

---

### User Routes (`/users`)

> Requires `verifyAccessToken` + verified email

| Method | Endpoint | Permission  | Description         |
| ------ | -------- | ----------- | ------------------- |
| GET    | `/`      | USER_READ   | Get all users       |
| GET    | `/me`    | —           | Get current user    |
| DELETE | `/me`    | —           | Delete current user |
| GET    | `/:id`   | USER_READ   | Get user by ID      |
| DELETE | `/:id`   | USER_DELETE | Delete user by ID   |

---

### Health Route

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Check server status |

---

## 🗄️ Database Schema

### Users

- `id`
- `name`
- `email`
- `password`
- `role`
- `isVerified`
- `verificationToken`
- `verificationTokenExpires`
- `createdAt`

### Reset Tokens

- `user_id`
- `hashed_token`
- `expires_at`

### Refresh Tokens

- `user_id`
- `hashed_token`
- `expires_at`

---

## 🔒 Security

- Access tokens stored in HTTP-only cookies
- Refresh tokens hashed before database storage
- Password reset tokens hashed and expiring
- Email verification tokens hashed and expiring
- Refresh token rotation
- Protected route middleware
- Permission-based authorization
- Helmet secure headers
- Rate limiting for auth routes

---

## ⚙️ Environment Variables

```
PORT=3000

DATABASE_URL=your_database_url

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

PERMIT_TOKEN=secret_key

SMTP_USER=secret_key
SMTP_PASS=secret_key
```

---

## 📘 API Documentation

This project includes Swagger/OpenAPI documentation for all major endpoints.

After starting the server, the API documentation is available at:

```bash
http://localhost:3000/api-docs
```

## ▶️ Running the Project

```bash
npm install
npm run dev
npm run build
npm start
```

---

## 🧩 Tech Stack

- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT
- Cookie-based auth

---

## 👤 Author

**Yousif Maqdasi**

Backend learning project focused on real-world authentication, scalability, and clean architecture.
