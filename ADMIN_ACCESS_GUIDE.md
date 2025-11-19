# Admin Access Guide

## How to Create New Admin Accounts

There are **3 ways** to access admin registration:

---

### Method 1: Secret URL (Direct Access)
Simply visit this URL in your browser:
```
http://localhost:3000/register?admin=true
```

Or for production:
```
https://yourwebsite.com/register?admin=true
```

**Required Information:**
- Admin Verification Code: `PJINFRA2025`

---

### Method 2: Secret Click on Login Page
1. Go to the **Login page**: `http://localhost:3000/login`
2. Click on the title **"Sign in to your account"** 5 times quickly
3. A toast message will appear: "Admin registration unlocked!"
4. You'll be redirected to the admin registration page

---

### Method 3: Using Backend Script
If you have server access, run:
```bash
cd server
node scripts/createPJInfraStaff.js
```

This creates 5 pre-configured admin accounts.

---

## Admin Registration Process

Once you access the admin registration page (`/register?admin=true`):

1. Fill in all required fields:
   - Full Name
   - Email Address
   - Phone Number
   - Company Name
   - Password
   - Confirm Password

2. Enter the **Admin Verification Code**: `PJINFRA2025`

3. Click "Create account"

4. You'll be registered as an admin and redirected to the admin dashboard

---

## Security Notes

⚠️ **Important Security Information:**

1. **Keep the admin code secret** - Only share with authorized personnel
2. **Change the default code** in production:
   - Frontend: `src/pages/auth/Register.js`
   - Backend: `server/routes/auth.js` or add to `.env` file as `ADMIN_SECRET_CODE`

3. **URL method is safest** - Share the direct URL with admin code separately

4. **No hints visible** - Regular users won't see any indication of admin registration

---

## Changing the Admin Code

### In .env file (Recommended):
```env
ADMIN_SECRET_CODE=YourNewSecretCode2025
```

### Or in code:
1. **Backend**: Edit `server/routes/auth.js` - Line 8
2. **Frontend**: Edit `src/pages/auth/Register.js` - Line verification logic

---

## Current Admin Accounts

After running `resetDatabase.js`, these accounts exist:

| Name | Email | Password |
|------|-------|----------|
| Rajesh Kumar | rajesh.kumar@pjinfra.com | Admin@123 |
| Priya Sharma | priya.sharma@pjinfra.com | Admin@123 |
| Amit Patel | amit.patel@pjinfra.com | Admin@123 |
| Sneha Reddy | sneha.reddy@pjinfra.com | Admin@123 |
| Vikram Singh | vikram.singh@pjinfra.com | Admin@123 |

---

## Troubleshooting

**Q: I can't access the admin registration page**
- Make sure you're using the exact URL with `?admin=true`
- Try clearing browser cache
- Check browser console for errors

**Q: Invalid admin code error**
- Verify you're using the correct code: `PJINFRA2025`
- Check if it was changed in the backend
- Code is case-sensitive

**Q: Need to reset an admin password**
```bash
cd server
node scripts/resetAdminPassword.js
```

---

## Contact

For admin access issues, contact the system administrator.
