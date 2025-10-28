# MongoDB Atlas Setup Guide

## ✅ Connection String Configured

Your MongoDB Atlas connection string has been added to `server/.env`:

```
mongodb+srv://natarajkashyap1_db_user:<db_password>@pjinfracluster.jcapbws.mongodb.net/ep_project?retryWrites=true&w=majority
```

## 🔑 Next Step: Add Your Password

**Replace `<db_password>` with your actual MongoDB Atlas password:**

1. Open `server/.env`
2. Find the line: `MONGODB_URI=mongodb+srv://natarajkashyap1_db_user:<db_password>@...`
3. Replace `<db_password>` with your database user password
4. Save the file

**Example:**
```env
# Before:
MONGODB_URI=mongodb+srv://natarajkashyap1_db_user:<db_password>@pjinfracluster...

# After (if your password is "MySecurePass123"):
MONGODB_URI=mongodb+srv://natarajkashyap1_db_user:MySecurePass123@pjinfracluster...
```

## 🔒 Finding Your MongoDB Atlas Password

If you don't remember your database password:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Click on "Database Access" in the left sidebar
4. Find user `natarajkashyap1_db_user`
5. Click "Edit" → "Edit Password"
6. Set a new password or auto-generate one
7. Copy the password and paste it in your `.env` file

## 🌐 Whitelist Your IP Address

Make sure your IP address is whitelisted:

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Either:
   - Click "Add Current IP Address" (for your current IP)
   - Or "Allow Access from Anywhere" (0.0.0.0/0) for development

## 🚀 Test the Connection

After updating the password:

1. **Restart your server:**
   ```bash
   cd server
   npm start
   ```

2. **Check the console** - You should see:
   ```
   MongoDB Connected: pjinfracluster.jcapbws.mongodb.net
   ```

3. **Test your application:**
   - Register a new user
   - Create a request
   - Check if data appears in MongoDB Atlas dashboard

## 🔄 Switch Between Local and Atlas

Your `.env` now has both options:

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://natarajkashyap1_db_user:YOUR_PASSWORD@pjinfracluster.jcapbws.mongodb.net/ep_project?retryWrites=true&w=majority
```

**For Local MongoDB Compass:**
```env
MONGODB_URI=mongodb://localhost:27017/ep_project
```

Just comment out one and uncomment the other, then restart the server.

## 📊 View Your Data in Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Browse Collections"
3. Select your database: `ep_project`
4. View collections: `users`, `requests`

## ⚠️ Important Notes

- **Never commit** `.env` file to Git (it's already in `.gitignore`)
- **Use strong passwords** for database users
- **Database name**: Using `ep_project` (can be changed in the connection string)
- **Production**: For production deployment, always use MongoDB Atlas
- **Backup**: Atlas automatically backs up your data

## 🆘 Troubleshooting

**Error: "Authentication failed"**
- Double-check your password in `.env`
- Make sure there are no special characters that need URL encoding
- If password has special chars like `@`, `#`, `%`, use URL encoding

**Error: "Connection timeout"**
- Check if your IP is whitelisted in Network Access
- Try allowing access from anywhere (0.0.0.0/0)

**Error: "Server selection timeout"**
- Check your internet connection
- Verify the cluster URL is correct
- Make sure the cluster is running (not paused)

**Special Characters in Password:**
If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `/` → `%2F`
- `:` → `%3A`

Example: Password `Pass@123#` becomes `Pass%40123%23`

## ✅ You're All Set!

Once you add your password and restart the server, your application will be using MongoDB Atlas instead of local MongoDB Compass!
