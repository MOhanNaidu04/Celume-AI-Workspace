# Authentication System Documentation

## Overview
The Celume AI workspace now includes a complete authentication system with user registration, login, and JWT token-based authorization.

## Features
✅ User Registration with email validation
✅ Secure Password Hashing (bcrypt)
✅ JWT Token Authentication
✅ Protected Routes
✅ User Profile Management
✅ Persistent Authentication (localStorage)

---

## Backend API Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "createdAt": "2026-06-23T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - User already exists

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "createdAt": "2026-06-23T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### 3. Get Current User (Protected)
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "theme": "light",
    "created_at": "2026-06-23T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401` - No token or invalid token
- `404` - User not found

---

### 4. Update User Profile (Protected)
**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "theme": "dark"
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Smith",
    "theme": "dark",
    "updated_at": "2026-06-23T10:35:00.000Z"
  }
}
```

---

## Frontend Pages

### Login Page
**Route:** `/login`
- Email and password input
- Error message display
- Link to registration page
- Redirect to dashboard after successful login
- Stores token and user info in localStorage

### Register Page
**Route:** `/register`
- Username, email, password, full name inputs
- Password confirmation validation
- Error handling
- Link to login page
- Auto-login after successful registration

---

## Protected Routes

All routes except `/login` and `/register` are protected and require a valid JWT token.

Protected Routes:
- `/` - HomePage
- `/chat` - ChatPage
- `/analytics` - AnalyticsPage
- `/settings` - SettingsPage
- `/prompts` - PromptsPage
- `/profile` - ProfilePage
- `/projects` - ProjectsPage
- `/tasks` - TasksPage
- `/agents` - AgentsPage
- `/companies` - CompaniesPage

If a user tries to access a protected route without a token, they'll be redirected to `/login`.

---

## Using the Authentication

### 1. Making Protected API Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:4000/api/chats', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Getting User Info
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.email); // user@example.com
```

### 3. Logging Out
```javascript
// Remove token and user info
localStorage.removeItem('token');
localStorage.removeItem('user');

// Redirect to login
window.location.href = '/login';
```

---

## Security Features

✅ **Password Hashing:** All passwords are hashed using bcrypt (10 salt rounds)
✅ **JWT Tokens:** Tokens expire after 7 days
✅ **CORS Protection:** Backend validates origin
✅ **Protected Routes:** Frontend redirects unauthenticated users
✅ **Environment Variables:** Secret key in .env (change in production)

---

## Environment Variables

Create a `.env` file in the project root:

```
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=celume_ai_workspace

PORT=4000
NODE_ENV=development

JWT_SECRET=your-secret-key-change-in-production
```

⚠️ **Important:** Change `JWT_SECRET` in production!

---

## Testing the Authentication

### Test Registration
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token_from_login>"
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url VARCHAR(512),
  theme VARCHAR(50) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Troubleshooting

### "Invalid token" Error
- Token may have expired (valid for 7 days)
- Try logging in again to get a new token
- Clear localStorage and refresh the page

### "User already exists" Error
- Email is already registered
- Try using a different email
- Use login instead if you have an existing account

### Connection Error
- Verify backend server is running on port 4000
- Check database connection
- Ensure PostgreSQL is running

---

## Next Steps

1. ✅ User registration and login system
2. ✅ Protected routes
3. ⏳ Email verification
4. ⏳ Password reset functionality
5. ⏳ OAuth/Social login (Google, GitHub)
6. ⏳ Two-factor authentication
7. ⏳ User roles and permissions
