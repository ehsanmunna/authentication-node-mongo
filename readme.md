## Project Summary

**authentication-node-mongo** — A Node.js/Express REST API for user authentication with MongoDB.

### Tech Stack
- **Runtime:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (`jsonwebtoken` + `express-jwt`) + bcrypt password hashing
- **Docs:** Swagger/OpenAPI (swagger-jsdoc + swagger-ui-express) + JSDoc

### Structure
| File | Purpose |
|------|---------|
| `app.js` | Express server entrypoint (port 4000) |
| `_helpers/db.js` | Mongoose connection setup |
| `_helpers/jwt.js` | JWT middleware; whitelists `/authenticate` and `/register` as public routes |
| `_helpers/error-handler.js` | Global error handler (validation, JWT, custom errors) |
| `users/user.model.js` | Mongoose schema: `username`, `hash`, `firstName`, `lastName`, `createdDate` |
| `users/user.service.js` | Business logic: authenticate, CRUD operations, bcrypt hashing |
| `users/users.controller.js` | Express router with Swagger annotations |

### API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users/register` | Public | Create new user |
| POST | `/api/users/authenticate` | Public | Login, returns JWT |
| GET | `/api/users` | Protected | List all users |
| GET | `/api/users/current` | Protected | Get current user |
| GET | `/api/users/:id` | Protected | Get user by ID |
| PUT | `/api/users/:id` | Protected | Update user |
| DELETE | `/api/users/:id` | Protected | Delete user |

### Key Details
- Passwords are hashed with **bcrypt** (salt rounds: 10)
- JWT tokens are revoked if the user is deleted
- Swagger docs available at `/api-docs` when running
- Config via `config.json` (MongoDB connection string + JWT secret)

---

### Project Setup:
duplicate **config.json.example** and renamed it to **config.json**. Into the **config.json** file, add your (mongo) db connection string to "connectionString" key.

npm i
npm start

### Database Setup:
This project requires MongoDB. You can use either:

1. **Local MongoDB** — Install and run MongoDB locally, then use a connection string like `mongodb://localhost:27017/your-db-name`

2. **Cloud (MongoDB Atlas)** — Create a free cluster at [mongodb.com](https://www.mongodb.com) and use the provided connection string

Then add your connection string to `config.json`:
```json
{
    "connectionString": "mongodb://localhost:27017/auth-db",
    "collectionName": "users",
    "secret": "your-jwt-secret"
}
```

### Get API Doc:
http://localhost:4000/api-docs *[after running server]*

### Get javascript docs:
npm run doc
then go to docs folder and open 'index.html' file with browser.