# Database Connection Test Guide

## ✅ Current Status: CONNECTED

Your MongoDB database is **successfully connected**! 

```
✅ MongoDB connected successfully
📊 Database: ep_project
🚀 Server running on port 5000
```

## 🔍 How to Check Database Connection

### Method 1: Health Check API Endpoint
Open your browser or use curl:
```
http://localhost:5000/api/health
```

This will return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2025-10-27T..."
}
```

### Method 2: Check Server Logs
When you start the server, you should see:
- ✅ MongoDB connected successfully
- 🔗 Mongoose connected to MongoDB
- 📊 Database: ep_project

### Method 3: Using PowerShell
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Test the health endpoint
Invoke-RestMethod -Uri http://localhost:5000/api/health
```

### Method 4: Using MongoDB Compass
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. You should see the `ep_project` database

## 🚀 Starting the Backend Server

### Start backend only:
```bash
cd server
npm start          # Production mode
npm run dev        # Development mode (auto-reload)
```

### Start both frontend and backend:
```bash
npm run dev        # Runs both servers
```

## 📡 Testing the API

### Test Health Endpoint (Browser or Postman):
```
GET http://localhost:5000/api/health
```

### Test Root Endpoint:
```
GET http://localhost:5000/
```

### Register a Test User:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "client"
}
```

## 🔧 Troubleshooting

### If MongoDB is not connected:

1. **Check if MongoDB service is running:**
   ```powershell
   Get-Service -Name MongoDB
   ```

2. **Start MongoDB service (if stopped):**
   ```powershell
   Start-Service -Name MongoDB
   ```

3. **Check MongoDB logs:**
   - Located in: `C:\Program Files\MongoDB\Server\<version>\log\`

4. **Verify connection string in `.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/ep_project
   ```

### Common Issues:

- **Port 5000 already in use**: Change PORT in `server/.env`
- **Module not found**: Run `npm install` in server directory
- **Connection refused**: Make sure MongoDB service is running

## 📊 Database Structure

Your database includes:
- **Users Collection**: Stores user accounts (clients and admins)
- **Requests Collection**: Stores service requests

## 🎯 Next Steps

1. ✅ Database is connected
2. 🔄 Update frontend to use backend API
3. 🧪 Test API endpoints
4. 🎨 Build your application features

## 📝 Quick Reference

- **Backend URL**: http://localhost:5000
- **Frontend URL**: http://localhost:3000
- **Database**: ep_project
- **MongoDB URL**: mongodb://localhost:27017

---

**Current Status**: ✅ Everything is working correctly!
