# P&J INFRA Staff - Admin Access

## ✅ Staff Members Created

All staff members have been created with **admin role** and can access the **Admin Dashboard**.

### 📋 Staff List

| Name | Email | Password | Role | Phone |
|------|-------|----------|------|-------|
| Rajesh Kumar | rajesh.kumar@pjinfra.com | password | admin | +91 9876543211 |
| Priya Sharma | priya.sharma@pjinfra.com | password | admin | +91 9876543212 |
| Amit Patel | amit.patel@pjinfra.com | password | admin | +91 9876543213 |
| Sneha Reddy | sneha.reddy@pjinfra.com | password | admin | +91 9876543214 |
| Vikram Singh | vikram.singh@pjinfra.com | password | admin | +91 9876543215 |

## 🔐 Login Details

**Email Pattern:** `firstname.lastname@pjinfra.com`  
**Password (All):** `password`  
**Company:** P&J INFRA  
**Role:** admin (full admin dashboard access)

## 🎯 What They Can Do

Since all staff members have **admin role**, they can:

✅ Access Admin Dashboard at `/admin/dashboard`  
✅ View all client requests from database  
✅ Update request status (pending → in-progress → completed)  
✅ Assign staff members to requests  
✅ Add timeline comments  
✅ View analytics and statistics  
✅ Manage all requests across all clients  

## 💾 Database Information

- **Collection:** `users` (same collection as clients and admins)
- **Database:** `ep_project` (works on both local MongoDB and Atlas)
- **Filter:** All users with `role: 'admin'` and `email` ending with `@pjinfra.com`

## 🔄 Works on Both Databases

The script automatically uses the database specified in your `.env` file:

- **Local MongoDB:** `mongodb://localhost:27017/ep_project`
- **MongoDB Atlas:** `mongodb+srv://...@pjinfracluster.../ep_project`

Staff members are created in whichever database you're currently connected to.

## 🚀 How to Use

### Login as Staff:
1. Go to http://localhost:3000/login
2. Enter any email from the table above
3. Password: `password`
4. Click Login
5. You'll be redirected to Admin Dashboard

### Re-run Script (if needed):
```bash
cd server
npm run create-pjinfra-staff
```

The script will skip existing users and only create new ones.

## 📊 Fetching Requests

All staff members (with admin role) will see:
- **All requests** from all clients
- Real-time data from `requests` collection
- Request details: service type, status, assigned staff, timeline
- Client information who created the request

## 🔒 Security Note

**For Production:**
- Change the default password `password` to something secure
- Each staff member should have a unique, strong password
- Consider implementing password change on first login
- Use environment variables for default credentials

## ✅ Ready to Test

All staff accounts are active and ready to use! They work exactly like the main admin account but with @pjinfra.com email addresses.
