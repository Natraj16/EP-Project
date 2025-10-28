# API Endpoints Documentation

## 🌐 Base URL
```
http://localhost:5000/api
```

## 📚 API Endpoints Reference

---

## 1. Authentication Endpoints

### Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client",
  "phone": "+1234567890",
  "company": "ABC Company"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "phone": "+1234567890",
      "company": "ABC Company",
      "isActive": true,
      "createdAt": "2025-10-27T...",
      "updatedAt": "2025-10-27T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Verify Token
**GET** `/api/auth/verify`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client"
    }
  }
}
```

---

## 2. Request Endpoints

### Get All Requests
**GET** `/api/requests`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**
- `status` - Filter by status (pending, in-progress, completed, cancelled)
- `category` - Filter by category (civil, electrical, mechanical, plumbing, hvac, structural, other)
- `priority` - Filter by priority (low, medium, high, urgent)
- `clientId` - Filter by client ID (admin only)

**Example:**
```
GET /api/requests?status=pending&category=electrical
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "650xyz789...",
      "title": "Electrical Wiring Installation",
      "description": "Need electrical wiring for new office",
      "category": "electrical",
      "status": "pending",
      "priority": "high",
      "budget": 5000,
      "deadline": "2025-11-15T00:00:00.000Z",
      "location": "123 Main St",
      "client": {
        "_id": "650abc123...",
        "name": "John Doe",
        "email": "john@example.com",
        "company": "ABC Company"
      },
      "createdAt": "2025-10-27T...",
      "updatedAt": "2025-10-27T..."
    }
  ],
  "count": 1
}
```

---

### Get Single Request
**GET** `/api/requests/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "650xyz789...",
    "title": "Electrical Wiring Installation",
    "description": "Need electrical wiring for new office",
    "category": "electrical",
    "status": "pending",
    "priority": "high",
    "budget": 5000,
    "deadline": "2025-11-15T00:00:00.000Z",
    "location": "123 Main St",
    "client": {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "ABC Company"
    },
    "comments": [],
    "timeline": [
      {
        "status": "pending",
        "comment": "Request created",
        "updatedBy": {
          "_id": "650abc123...",
          "name": "John Doe"
        },
        "updatedAt": "2025-10-27T..."
      }
    ],
    "createdAt": "2025-10-27T...",
    "updatedAt": "2025-10-27T..."
  }
}
```

---

### Create New Request
**POST** `/api/requests`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "title": "HVAC System Repair",
  "description": "Air conditioning system not working properly",
  "category": "hvac",
  "priority": "urgent",
  "budget": 3000,
  "deadline": "2025-11-05",
  "location": "456 Oak Avenue"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "_id": "650new456...",
    "title": "HVAC System Repair",
    "description": "Air conditioning system not working properly",
    "category": "hvac",
    "status": "pending",
    "priority": "urgent",
    "budget": 3000,
    "deadline": "2025-11-05T00:00:00.000Z",
    "location": "456 Oak Avenue",
    "client": {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "timeline": [
      {
        "status": "pending",
        "comment": "Request created",
        "updatedBy": "650abc123..."
      }
    ],
    "createdAt": "2025-10-27T..."
  }
}
```

---

### Update Request
**PUT** `/api/requests/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body (Client can update):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "high",
  "budget": 4000
}
```

**Request Body (Admin can also update):**
```json
{
  "status": "in-progress",
  "assignedTo": "650admin789..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request updated successfully",
  "data": {
    "_id": "650xyz789...",
    "title": "Updated Title",
    "status": "in-progress",
    // ... full request object
  }
}
```

---

### Add Comment to Request
**POST** `/api/requests/:id/comments`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "text": "This is my comment about the request"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "650xyz789...",
    "comments": [
      {
        "user": {
          "_id": "650abc123...",
          "name": "John Doe"
        },
        "text": "This is my comment about the request",
        "createdAt": "2025-10-27T..."
      }
    ]
    // ... full request object
  }
}
```

---

### Delete Request (Admin Only)
**DELETE** `/api/requests/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

---

## 3. User Endpoints

### Get All Users (Admin Only)
**GET** `/api/users`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**
- `role` - Filter by role (client, admin)
- `isActive` - Filter by active status (true, false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "650abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "phone": "+1234567890",
      "company": "ABC Company",
      "isActive": true,
      "createdAt": "2025-10-27T..."
    }
  ],
  "count": 1
}
```

---

### Get Current User Profile
**GET** `/api/users/profile`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "650abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "phone": "+1234567890",
    "company": "ABC Company",
    "isActive": true
  }
}
```

---

### Get User by ID
**GET** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "650abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "phone": "+1234567890",
    "company": "ABC Company",
    "isActive": true
  }
}
```

---

### Update User Profile
**PUT** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210",
  "company": "XYZ Corp"
}
```

**Admin can also update:**
```json
{
  "role": "admin",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "650abc123...",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+9876543210",
    "company": "XYZ Corp"
  }
}
```

---

### Delete User (Admin Only)
**DELETE** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 4. Utility Endpoints

### Health Check
**GET** `/api/health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2025-10-27T12:00:00.000Z"
}
```

---

### Root Endpoint
**GET** `/`

**Response (200 OK):**
```json
{
  "message": "EP Project API Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "requests": "/api/requests",
    "users": "/api/users"
  }
}
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### How to get a token:
1. Register or login via `/api/auth/register` or `/api/auth/login`
2. Copy the token from the response
3. Include it in the Authorization header for subsequent requests

---

## 📊 Data Models

### User Roles:
- `client` - Regular user who can create and manage their requests
- `admin` - Administrator with full access

### Request Categories:
- `civil`
- `electrical`
- `mechanical`
- `plumbing`
- `hvac`
- `structural`
- `other`

### Request Status:
- `pending` - Newly created
- `in-progress` - Being worked on
- `completed` - Finished
- `cancelled` - Cancelled

### Priority Levels:
- `low`
- `medium`
- `high`
- `urgent`

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Request not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error creating request",
  "error": "Error details..."
}
```

---

## 🧪 Testing Tips

1. **Use Postman or Insomnia** for easy API testing
2. **Save your token** in environment variables
3. **Test the flow**: Register → Login → Create Request → View Requests
4. **Check error cases**: Invalid tokens, missing fields, etc.

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Passwords are automatically hashed before storage
- Password fields are never returned in API responses
- MongoDB IDs are automatically generated
- Clients can only access their own requests
- Admins can access all requests and users
