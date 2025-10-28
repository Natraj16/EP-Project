# 🚀 Deployment Guide - Vercel + Backend

Your app is now configured to work BOTH locally and on Vercel! Here's what I did and what you need to do:

## ✅ What I Fixed

1. **Created API Configuration** (`src/config/api.js`)
   - Automatically detects if running locally or on Vercel
   - Local: Uses `http://localhost:5000/api`
   - Production: Uses your deployed backend URL

2. **Updated All Files** to use the centralized API config:
   - AuthContext.js
   - All Admin pages
   - All Client pages
   - Staff Dashboard
   - Home.js
   - Contact.js

## 📋 Deployment Steps

### Step 1: Deploy Backend (Choose One)

#### Option A: Render.com (Recommended - Free)

1. Go to https://render.com
2. Sign up and click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   ```
   Name: pjinfra-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://natarajkashyap1_db_user:apple1234pie@pjinfracluster.jcapbws.mongodb.net/ep_project?retryWrites=true&w=majority
   JWT_SECRET=ep-project-secret-key-2025-change-in-production
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=office@pjinfra.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=office@pjinfra.com
   ```
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://pjinfra-backend.onrender.com`)

#### Option B: Railway.app (Alternative - Free)

1. Go to https://railway.app
2. "Start a New Project" → Deploy from GitHub
3. Select your repo and the `server` folder
4. Add the same environment variables as above
5. Copy your backend URL

### Step 2: Update Frontend API URL

After deploying your backend, update `src/config/api.js`:

```javascript
if (process.env.NODE_ENV === 'production') {
  return 'https://pjinfra-backend.onrender.com/api'; // ← Replace with YOUR backend URL
}
```

### Step 3: Configure MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Network Access → Add IP Address
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### Step 4: Deploy Frontend on Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   ```
   Framework Preset: Create React App
   Root Directory: ./
   Build Command: npm run build
   Output Directory: build
   ```
4. Add Environment Variable (optional):
   ```
   REACT_APP_API_URL=https://pjinfra-backend.onrender.com/api
   ```
5. Deploy!

### Step 5: Update Backend CORS

Once you have your Vercel URL, update `server/.env`:

```env
FRONTEND_URL=https://your-app.vercel.app
```

And in `server/index.js`, make sure CORS allows your Vercel domain.

## 🧪 Testing

### Local Testing (Both should work):
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
npm start
```

Visit: http://localhost:3000

### Production Testing:
1. Visit your Vercel URL
2. Try to login/register
3. Check browser console for errors
4. Verify data is saved to MongoDB

## 🔧 Troubleshooting

### Login not working on Vercel?
- Check browser console for API errors
- Verify backend is deployed and running
- Check MongoDB Atlas network access
- Verify environment variables in Vercel

### CORS errors?
- Update `FRONTEND_URL` in backend environment variables
- Restart backend service
- Clear browser cache

### Database not connecting?
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify MONGODB_URI environment variable
- Check backend logs on Render/Railway

## 📝 Quick Reference

**Local Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: Atlas Cloud

**Production:**
- Frontend: https://your-app.vercel.app
- Backend: https://pjinfra-backend.onrender.com (or your URL)
- MongoDB: Same Atlas Cloud

## 🎯 Next Steps

1. ✅ Deploy backend to Render/Railway
2. ✅ Update `src/config/api.js` with backend URL
3. ✅ Configure MongoDB Atlas network access
4. ✅ Deploy frontend to Vercel
5. ✅ Test login/registration
6. ✅ Verify data persistence

---

**Note:** The first request to Render.com free tier may take 30-60 seconds to wake up the server. This is normal!
