# 🔐 Backend Authentication System (Node.js + Express + Drizzle)

A secure and structured backend authentication system built with **Node.js**, **Express**, **TypeScript**, and **Drizzle ORM**.  
It includes full authentication flow, role-based access control, and password reset functionality.

⚠️ **Status: This project is currently under development.**  
Some features may be improved or extended.

---

## 🚀 Features

- User registration & login
- JWT-based authentication
- Access & refresh tokens (stored in **HTTP-only cookies**)
- Refresh tokens stored securely in database
- Token refresh flow
- Secure logout
- Forgot password & reset password flow
- Role-based permission system
- Protected routes with middleware
- Drizzle ORM with PostgreSQL
- Input validation layer
- Clean architecture (controllers, services, middleware)

---

## 🧠 Authentication Flow

### 1. Register / Login

- User registers or logs in
- Server:
  - Validates input
  - Creates / verifies user
  - Generates:
    - Access Token
    - Refresh Token
- Tokens are stored in **HTTP-only cookies**
- Refresh token is also stored securely in the database

### 2. Access Protected Routes

- `verifyAccessToken`:
  - Reads access token from cookies
  - Verifies JWT
  - Attaches user `{ id, permissions }` to `req.user`

### 3. Refresh Token

- When access token expires:
  - Client calls `/auth/refresh`
  - `verifyRefreshToken` verifies refresh token
  - Server validates refresh token against database
  - New access token is issued

### 4. Logout

- Clears both access & refresh cookies
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
- Ensures user has required permission before accessing route

---

## 📂 Project Structure

```
src/
├── config/           # Permissions config
├── controllers/      # Route handlers (auth, users)
├── drizzle/          # Drizzle schema & config
├── middleware/       # Auth, refresh, role checks
├── routes/           # Express route definitions
├── services/         # Business logic
├── types/            # Type definitions
├── utils/            # Token generators, helpers
├── validators/       # Input validation
├── app.ts            # Express app setup
└── index.ts          # Server entry point
```

---

## 📡 API Endpoints

### Auth Routes (`/auth`)

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| POST   | `/register`                      | Register a new user     |
| POST   | `/login`                         | Login user              |
| POST   | `/logout`                        | Logout (protected)      |
| POST   | `/refresh`                       | Refresh access token    |
| POST   | `/forgot-password`               | Send reset instructions |
| POST   | `/reset-password/:userId/:token` | Reset password          |

---

### User Routes (`/users`)

> All routes are protected by `verifyAccessToken`

| Method | Endpoint | Permission  | Description         |
| ------ | -------- | ----------- | ------------------- |
| GET    | `/`      | USER_READ   | Get all users       |
| GET    | `/me`    | —           | Get current user    |
| DELETE | `/me`    | —           | Delete current user |
| GET    | `/:id`   | USER_READ   | Get user by ID      |
| DELETE | `/:id`   | USER_DELETE | Delete user by ID   |

---

## 🗄️ Database Schema (Drizzle)

### Users Table

- `id`
- `name`
- `email` (unique)
- `password` (hashed)
- `role`
- `createdAt`

### Reset Tokens Table

- `id`
- `user_id` (unique, FK → users)
- `hashed_token`
- `created_at`
- `expires_at`


### Refresh Tokens Table
- `id`
- `token` (unique, FK → users)
- `user_id`
- `expires_at`

## 🔒 Security Notes

- JWT stored in **HTTP-only cookies**
- Refresh tokens stored securely in database
- Password reset tokens are **hashed in DB**
- Input validation before processing
- Protected routes require valid JWT
- Permission-based authorization

---

## ⚙️ Environment Variables

Example `.env`:

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

## ▶️ Running the Project

```
# install dependencies
npm install

# run development server
npm run dev

# build
npm run build

# start production
npm start
```

---

## 🧩 Tech Stack

- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT (jsonwebtoken)
- Cookie-based authentication

---

## 📌 Future Improvements

- Email verification
- Rate limiting & security improvements
- Advanced role system

---

## 👤 Author

**Yousif Maqdasi**

This project was built as part of my backend learning, focusing on real-world authentication, scalability, and clean architecture principles.

---
