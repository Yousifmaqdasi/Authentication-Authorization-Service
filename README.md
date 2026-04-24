# Auth System (JWT + Cookies)

A simple authentication and authorization system built with Node.js and Express.
This project focuses on secure user authentication using JWT stored in HTTP-only cookies, along with basic account management features.

> ⚠️ This project is still under development. Features and structure may change.

---

## Overview

This application allows users to:

* Register an account
* Log in and log out
* Stay authenticated using JWT (stored in cookies)
* Refresh access tokens
* Reset their password via secure token flow
* Access protected routes
* View and manage their own account

Basic role-based authorization is started (admin route exists) and will be expanded further.

---

## Tech Stack

* Node.js + Express
* TypeScript
* JWT (authentication)
* HTTP-only cookies (token storage)
* Drizzle ORM
* Database:

  * `users` table
  * `reset_tokens` table (temporary tokens with expiration)

---

## Authentication Flow

* Access token (expiresIn: 15min) → short-lived, used for protected routes
* Refresh token (expiresIn: 7d) → used to generate new access tokens
* Tokens are stored in **HTTP-only cookies** (not accessible via JavaScript)
* Password reset uses **temporary tokens stored in DB**

---

## API Routes

### Auth Routes (`/api/auth`)

* `POST /register`
  Create a new user

* `POST /login`
  Log in and receive tokens (stored in cookies)

* `POST /logout` *(protected)*
  Clear authentication cookies

* `POST /refresh` *(requires refresh token)*
  Generate a new access token

* `POST /forgot-password`
  Generate password reset token

* `POST /reset-password/:userId/:token`
  Reset password using token

---

### User Routes (`/api/users`)

* `GET /` *(admin only)*
  Get all users

* `GET /me` *(protected)*
  Get current user info

* `DELETE /me` *(protected)*
  Delete current user account

---

## Middleware

* `verifyAccessToken` → protects routes
* `verifyRefreshToken` → used for token refresh
* `checkRoleMiddleware("admin")` → restricts access to admins

---

## How to Run the Project

1. Clone the repository

2. Install dependencies

```
npm install
```

3. Set up environment variables (example)

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

4. Run the server

```
npm run dev
```

---

## How to Use

You can test the API using Postman or similar tools:

* Register a user → `/api/auth/register`
* Log in → `/api/auth/login`
* Access protected routes → cookies will be used automatically
* Get your info → `/api/users/me`
* Log out → `/api/auth/logout`
* Test password reset flow if needed

---

## Notes

* Tokens are stored securely in cookies (not localStorage)
* Reset tokens are temporary and expire after a short time
* Basic role-based authorization is implemented (admin route)
* More authorization features will be added

---

## Development Status

This project is still being actively developed. Planned improvements include:

* More advanced role-based authorization
* Better validation and error handling
* Improved security and structure

---

## Optional (For Testing)

You *can* add a test admin user in your database to make it easier for others to try admin routes.
Example:

* email: [admin@test.com](mailto:admin@test.com)
* password: password123

(Not required, but useful for demos)

---

## Purpose

This project is built for learning and portfolio purposes, focusing on:

* Authentication systems
* Secure token handling
* Backend structure and middleware design
