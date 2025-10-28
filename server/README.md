# EP Project Backend API

Backend server for the EP Project built with Express.js and MongoDB.

## 🚀 Features

- **Authentication & Authorization** (JWT-based)
- **User Management** (Client & Admin roles)
- **Request Management** (CRUD operations)
- **MongoDB Database** with Mongoose ODM
- **RESTful API** architecture
- **Secure Password Hashing** with bcrypt
- **CORS** enabled for frontend integration

## 📋 Prerequisites

Before running the backend, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** installed and running locally
  - Download from: https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update values as needed (MongoDB URI, JWT secret, etc.)

3. **Make sure MongoDB is running:**
   ```bash
   # For Windows (if installed locally)
   net start MongoDB
   
   # Or check MongoDB service in Services
   ```

## 🚀 Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

### Requests
- `GET /api/requests` - Get all requests (filtered by role)
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `POST /api/requests/:id/comments` - Add comment to request
- `DELETE /api/requests/:id` - Delete request (Admin only)

### Health Check
- `GET /api/health` - Check server and database status
- `GET /` - API information

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User Model
- name, email, password (hashed)
- role: 'client' | 'admin'
- phone, company
- isActive status

### Request Model
- title, description, category
- status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
- priority: 'low' | 'medium' | 'high' | 'urgent'
- client, assignedTo (user references)
- budget, deadline, location
- comments, timeline, attachments

## 🧪 Testing the API

You can test the API using:
- **Postman** or **Insomnia**
- **cURL** commands
- **VS Code REST Client** extension

Example register request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "client"
  }'
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/ep_project |
| JWT_SECRET | Secret key for JWT | (change in production) |
| JWT_EXPIRES_IN | JWT token expiration | 7d |
| NODE_ENV | Environment | development |

## 🔧 Troubleshooting

### MongoDB Connection Failed
- Make sure MongoDB is installed and running
- Check if MongoDB service is started
- Verify MONGODB_URI in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

### Dependencies Issues
- Delete `node_modules` folder
- Run `npm install` again

## 📄 License

ISC
