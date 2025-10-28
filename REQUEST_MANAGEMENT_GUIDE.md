# Request Management System - Complete Guide

## Overview
This document explains the complete flow of the request management system, including how client requests are saved to the database, displayed in both client and admin dashboards, and how timeline updates work.

## System Architecture

### Database Schema
The Request model has been updated for manpower services with the following key fields:

- **Service Details**: `serviceType`, `category`, `numberOfPersonnel`, `duration`, `startDate`, `shiftType`
- **Location & Description**: `location`, `description`, `requirements`
- **Budget & Priority**: `budget`, `priority` (low/medium/high/urgent)
- **Status**: `status` (pending/in-progress/completed/cancelled)
- **Timeline**: Array of status updates with comments visible to clients
- **References**: `client` (ref to User), `assignedTo` (ref to User)

### Timeline Feature
The timeline allows admins to update request status and add comments that are visible to clients:
```javascript
timeline: [{
  status: String,           // Current status at this point
  comment: String,          // Admin's comment about the update
  updatedBy: ObjectId,      // Reference to User who made the update
  updatedAt: Date          // Timestamp of the update
}]
```

## User Credentials

### Admin Access
- **Email**: admin@example.co.in
- **Password**: password
- **Role**: admin

### Client Access
Clients must register through the `/register` page to create their account.

## Complete Flow Walkthrough

### Step 1: Client Creates Request

1. **Client logs in** to their account
2. **Navigates to**: Dashboard → New Request
3. **Fills out the form**:
   - Service Type (Security/Labor/Technical/Medical)
   - Category (specific role)
   - Number of Personnel needed
   - Duration and Start Date
   - Shift Type (Day/Night/Rotating/Flexible)
   - Location
   - Description and Requirements
   - Budget and Priority

4. **Submits the form**
   - Frontend sends POST request to `/api/requests`
   - Backend creates new Request document with initial timeline entry
   - Response includes the created request with ID

### Step 2: Request Appears in Dashboards

#### Client Dashboard (`/client/dashboard`)
- Shows all requests created by the logged-in client
- Displays: Request ID, Service Type, Status, Priority, Created Date
- Status badges color-coded:
  - Pending: Yellow
  - In Progress: Blue
  - Completed: Green
  - Cancelled: Red

#### Admin Dashboard (`/admin/requests`)
- Shows ALL requests from all clients
- Displays: Request ID, Client Name, Service Type, Status, Priority, Created Date
- Admin can click "View" to see details and update status

### Step 3: Client Views Request Details

**Route**: `/client/requests/:id`

**What the client sees**:
- Complete request information (service type, personnel, duration, etc.)
- Current status and priority
- Budget details
- **Timeline**: All status updates with admin comments
  - Status changes
  - Admin comments
  - Timestamp of each update

**Timeline Example**:
```
[Pending] Request created - 2024-01-15 10:30 AM
[In Progress] We are reviewing your requirements and will assign personnel shortly - 2024-01-15 2:45 PM
[Completed] Personnel assigned and service completed successfully - 2024-01-20 5:00 PM
```

### Step 4: Admin Updates Request Status

**Route**: `/admin/requests/:id`

**Admin actions**:
1. Views complete request details including client information
2. Updates status using the sidebar form:
   - **Request Status**: pending/in-progress/completed/cancelled
   - **Priority**: low/medium/high/urgent
   - **Status Update Comment**: Message visible to client in timeline

3. Clicks "Save Changes"
   - Frontend sends PUT request to `/api/requests/:id` with:
     ```json
     {
       "status": "in-progress",
       "priority": "high",
       "comment": "We are reviewing your requirements"
     }
     ```
   - Backend:
     - Updates request status and priority
     - Adds new entry to timeline array
     - Saves and returns updated request

### Step 5: Client Sees Timeline Update

1. Client navigates to their request detail page
2. Timeline automatically shows all updates
3. Latest update appears with:
   - New status
   - Admin's comment
   - Timestamp

## API Endpoints

### Create Request
```
POST /api/requests
Authorization: Bearer <token>

Body: {
  "serviceType": "security",
  "category": "Security Guard",
  "numberOfPersonnel": 5,
  "duration": "1 month",
  "startDate": "2024-01-20",
  "shiftType": "day",
  "location": "Mumbai Office",
  "description": "Need security personnel for office premises",
  "requirements": "Previous security experience required",
  "budget": 50000,
  "priority": "medium"
}
```

### Get All Requests (Client)
```
GET /api/requests
Authorization: Bearer <token>
```
Returns only requests created by the logged-in client.

### Get All Requests (Admin)
```
GET /api/requests
Authorization: Bearer <token>
```
Returns all requests with client details populated.

### Get Single Request
```
GET /api/requests/:id
Authorization: Bearer <token>
```
Returns request details with client and timeline information.

### Update Request (Admin)
```
PUT /api/requests/:id
Authorization: Bearer <token>

Body: {
  "status": "in-progress",
  "priority": "high",
  "comment": "Status update comment visible to client"
}
```
Updates status/priority and adds timeline entry.

## Testing the Complete Flow

### Prerequisites
1. **Backend running**: `cd server && npm run dev` (port 5000)
2. **Frontend running**: `cd .. && npm start` (port 3000)
3. **MongoDB running**: Local or Atlas connection
4. **Admin user created**: `cd server && npm run create-admin`

### Test Scenario

**Step 1: Create Client Account**
1. Open `http://localhost:3000/register`
2. Register as a client:
   - Name: Test Client
   - Email: client@test.com
   - Password: test123
   - Phone: +91 9876543210
   - Company: Test Company

**Step 2: Create Request**
1. Login with client credentials
2. Navigate to "New Request"
3. Fill out form:
   - Service Type: Security
   - Category: Security Guard
   - Number of Personnel: 5
   - Duration: 1 month
   - Start Date: Tomorrow's date
   - Shift Type: Day
   - Location: Test Location
   - Description: Test request for security personnel
   - Budget: 50000
   - Priority: Medium
4. Click "Submit Request"
5. Verify success toast appears
6. Navigate to Dashboard and verify request appears

**Step 3: View Request as Client**
1. Click "View" on the request
2. Verify all details are correct
3. Verify timeline shows "Request created"

**Step 4: Update Request as Admin**
1. Logout from client account
2. Login as admin:
   - Email: admin@example.co.in
   - Password: password
3. Navigate to "Requests"
4. Verify the test request appears with client name
5. Click "View" on the request
6. Verify client details are shown (name, email, company, phone)
7. Update status:
   - Status: In Progress
   - Priority: High
   - Comment: "We are reviewing your requirements and will assign personnel shortly"
8. Click "Save Changes"
9. Verify success toast appears
10. Verify timeline shows the new update

**Step 5: Verify Timeline Update as Client**
1. Logout from admin account
2. Login as client (client@test.com)
3. Navigate to Dashboard → View Request
4. Verify timeline shows two entries:
   - Initial "Request created"
   - Admin update with comment
5. Verify status badge shows "In Progress"
6. Verify priority shows "High"

**Step 6: Complete the Request**
1. Login as admin again
2. View the same request
3. Update status:
   - Status: Completed
   - Comment: "Personnel assigned and service completed successfully"
4. Save changes
5. Login as client and verify "Completed" status and final timeline entry

## Key Features

### ✅ Real-time Database Integration
- All requests stored in MongoDB
- Client-specific filtering (clients see only their requests)
- Admin sees all requests across all clients

### ✅ Timeline Tracking
- Every status update creates a timeline entry
- Admin comments visible to clients
- Chronological history of request progress
- Timestamps for all updates

### ✅ Role-Based Access
- Clients can create and view their own requests
- Admins can view all requests and update status
- Timeline updates restricted to admin role

### ✅ Status Management
- Four status levels: pending, in-progress, completed, cancelled
- Four priority levels: low, medium, high, urgent
- Color-coded status badges for quick identification

### ✅ Client Information Display
- Admin can see full client details (name, email, company, phone)
- Populated from User reference in Request model

## Troubleshooting

### Request not appearing in dashboard
- Check browser console for errors
- Verify token is present in localStorage
- Check backend logs for API errors
- Ensure MongoDB is running and connected

### Timeline not updating
- Verify admin is logged in (not client)
- Check that status/comment are being sent in PUT request
- Verify backend is adding timeline entries
- Refresh the page to see latest updates

### Admin login not working
- Verify admin user was created: `npm run create-admin`
- Check credentials: admin@example.co.in / password
- Clear browser cache and localStorage
- Check backend logs for authentication errors

## File Structure

### Backend Files
```
server/
├── models/
│   ├── Request.js         # Request schema with timeline
│   └── User.js           # User schema with role
├── routes/
│   ├── requests.js       # Request CRUD endpoints with timeline updates
│   └── auth.js          # Authentication endpoints
├── scripts/
│   └── createAdmin.js   # Admin user creation script
└── middleware/
    └── auth.js          # JWT authentication middleware
```

### Frontend Files
```
src/
├── pages/
│   ├── client/
│   │   ├── NewRequest.js         # Request creation form
│   │   ├── ClientDashboard.js    # Client's requests list
│   │   └── RequestDetail.js      # Client's request detail with timeline
│   └── admin/
│       ├── AdminRequests.js      # All requests list
│       └── AdminRequestDetail.js # Admin request detail with status update
└── context/
    └── AuthContext.js            # Authentication context
```

## Next Steps

### Recommended Enhancements
1. **Email notifications** when admin updates request status
2. **File upload** for request attachments
3. **Real-time updates** using WebSockets
4. **Advanced filtering** in admin dashboard
5. **Request assignment** to specific staff members
6. **Comments section** for two-way communication
7. **Export requests** to PDF/Excel
8. **Dashboard analytics** with charts

### Production Checklist
- [ ] Update admin credentials (change default password)
- [ ] Set up proper MongoDB Atlas connection
- [ ] Configure environment variables
- [ ] Enable CORS for production domain
- [ ] Add rate limiting
- [ ] Implement request validation
- [ ] Add error logging service
- [ ] Set up automated backups
- [ ] Add SSL certificates
- [ ] Deploy backend and frontend separately

## Support

For any issues or questions:
1. Check browser console for frontend errors
2. Check `server/logs` for backend errors
3. Verify MongoDB connection
4. Review API endpoint responses
5. Check authentication token validity

---

**Last Updated**: January 2024
**Version**: 1.0.0
