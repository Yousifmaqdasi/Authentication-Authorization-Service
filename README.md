# 🔐 Backend Authentication System (Node.js + Express + Drizzle)

A secure and structured backend authentication system built with **Node.js**, **Express**, **TypeScript**, and **Drizzle ORM**.  
It includes full authentication flow, role-based access control, password reset, and email verification.

⚠️ **Status: This project is currently under development.**  
Some features may be improved or extended.

---

## 🚀 Features

- User registration & login
- Email verification flow
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
- Centralized error handling using a custom `AppError` class

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
├── config/
├── controllers/
├── drizzle/
├── middleware/
├── routes/
├── services/
├── types/
├── utils/
├── validators/
├── app.ts
└── index.ts
```

---

## 📡 API Endpoints

### Auth Routes (`/auth`)

| Method | Endpoint                         | Description     |
| ------ | -------------------------------- | --------------- |
| POST   | `/register`                      | Register user   |
| GET    | `/verify-email`                  | Verify email    |
| POST   | `/login`                         | Login           |
| POST   | `/logout`                        | Logout          |
| POST   | `/refresh`                       | Refresh token   |
| POST   | `/forgot-password`               | Forgot password |
| POST   | `/reset-password/:userId/:token` | Reset password  |

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

## 🔒 Security Notes

- JWT stored in **HTTP-only cookies**
- Refresh tokens stored in DB (hashed)
- Refresh token rotation enabled
- Password reset tokens are hashed
- Email verification tokens are hashed and expire
- Protected routes require valid JWT
- Verified users only can access protected routes
- Permission-based authorization
- Helmet for secure headers
- Rate limiting applied (general + auth routes)

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

## 📌 Future Improvements

- Resend verification email
- Advanced role system
- More security hardening

---

## 👤 Author

**Yousif Maqdasi**

Backend learning project focused on real-world authentication, scalability, and clean architecture.
