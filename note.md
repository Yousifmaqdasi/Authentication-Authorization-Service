# Auth Backend Project – Improvement Ideas

## Core Upgrades

- Add email verification flow (register → verify before login)
- Block login if email is not verified

## User System Improvements

- Add update profile route (`PATCH /users/me`)

## Testing

- Add unit tests for services

## This is to create hashed password (in case to create new admin)

node -e "import('bcrypt').then(b => b.hash('Enter password here', 10).then(console.log))"
