

# Authentication & Authorization Service

Backend Portfolio Project

---

# Goal

Build a backend service that handles **user authentication and authorization** using **JWT**.

Users can:
- register
- login
- access protected routes
- refresh tokens
- logout

---

# Tech Stack

- Node.js
- Express
- PostgreSQL or MongoDB
- JWT
- bcrypt
- dotenv

---

# Project Setup

## Initial Setup

- [ ] Create project folder
- [ ] Initialize Node project

npm init -y

- [ ] Install dependencies

express  
jsonwebtoken  
bcrypt  
dotenv  
cors  

- [ ] Install dev dependencies

nodemon

- [ ] Create basic server

src/server.js

- [ ] Test server runs

---

# Project Structure

Create basic structure.

- [ ] Create folders

src/
  controllers/
  routes/
  middleware/
  services/
  models/
  utils/

---

# Database Setup

- [ ] Setup database connection

- [ ] Create users table

Example fields:

id  
email  
username  
password_hash  
role  
created_at  

- [ ] Test inserting a user manually

---

# Feature 1: User Registration

### Endpoint

POST /auth/register

### Tasks

- [ ] Create auth route
- [ ] Create auth controller
- [ ] Validate input
- [ ] Hash password with bcrypt
- [ ] Save user in database
- [ ] Return success response

Example response

{
  "message": "User created"
}

---

# Feature 2: Login

### Endpoint

POST /auth/login

### Tasks

- [ ] Find user by email
- [ ] Compare password with bcrypt
- [ ] Generate JWT access token
- [ ] Generate refresh token
- [ ] Return tokens

Example response

{
  "accessToken": "...",
  "refreshToken": "..."
}

---

# Feature 3: JWT Middleware

Protect routes.

### Tasks

- [ ] Create auth middleware
- [ ] Extract token from header

Authorization: Bearer TOKEN

- [ ] Verify JWT
- [ ] Attach user to request
- [ ] Call next()

---

# Feature 4: Protected Route

Example route

GET /users/me

### Tasks

- [ ] Create route
- [ ] Use auth middleware
- [ ] Return logged-in user data

---

# Feature 5: Refresh Token

### Endpoint

POST /auth/refresh

### Tasks

- [ ] Verify refresh token
- [ ] Issue new access token
- [ ] Return new token

---

# Feature 6: Logout

### Endpoint

POST /auth/logout

### Tasks

- [ ] Invalidate refresh token
- [ ] Return success response

---

# Feature 7: Role-Based Authorization

Add roles to users.

Example roles

user  
admin  

### Tasks

- [ ] Add role field to users
- [ ] Create role middleware
- [ ] Protect admin route

Example route

GET /admin/users

---

# Security Improvements

- [ ] Hash passwords with bcrypt
- [ ] Use environment variables
- [ ] Validate input
- [ ] Rate limit login requests

---

# Testing

- [ ] Test register
- [ ] Test login
- [ ] Test protected route
- [ ] Test refresh token
- [ ] Test logout

Tools:
Postman or Thunder Client

---

# Final Improvements (Portfolio)

- [ ] Clean folder structure
- [ ] Add error handling
- [ ] Add logging
- [ ] Write README
- [ ] Document API endpoints

---

# Optional Advanced Features

Do later if desired.

- [ ] Email verification
- [ ] Password reset
- [ ] Token rotation
- [ ] Audit logs
- [ ] Docker setup