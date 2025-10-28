# Request Timeline Feature - Technical Documentation

## Overview
The timeline feature allows clients to track the progress of their service requests in real-time. When an admin updates a request's status or priority, they can add a comment that becomes visible to the client in the request timeline.

## How It Works

### Timeline Data Structure
```javascript
timeline: [
  {
    status: 'pending',
    comment: 'Request created',
    updatedBy: ObjectId('...'),  // Reference to User who made the update
    updatedAt: Date('2024-01-15T10:30:00Z')
  },
  {
    status: 'in-progress',
    comment: 'We are reviewing your requirements and will assign personnel shortly',
    updatedBy: ObjectId('...'),
    updatedAt: Date('2024-01-15T14:45:00Z')
  },
  {
    status: 'completed',
    comment: 'Personnel assigned and service completed successfully',
    updatedBy: ObjectId('...'),
    updatedAt: Date('2024-01-20T17:00:00Z')
  }
]
```

## Backend Implementation

### Request Model Schema
```javascript
// server/models/Request.js
timeline: [{
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}]
```

### Timeline Entry Creation

#### On Request Creation (POST /api/requests)
```javascript
const newRequest = new Request({
  serviceType,
  category,
  numberOfPersonnel,
  // ... other fields
  timeline: [{
    status: 'pending',
    comment: 'Request created',
    updatedBy: req.user.userId
  }]
});
```

#### On Status Update (PUT /api/requests/:id)
```javascript
// Check if status or priority changed, or if comment provided
const statusChanged = status && status !== request.status;
const priorityChanged = priority && priority !== request.priority;

if (statusChanged || priorityChanged || comment) {
  let timelineComment = comment || '';
  
  // Generate default comment if none provided
  if (!comment) {
    if (statusChanged && priorityChanged) {
      timelineComment = `Status changed to ${status} and priority changed to ${priority}`;
    } else if (statusChanged) {
      timelineComment = `Status changed to ${status}`;
    } else if (priorityChanged) {
      timelineComment = `Priority changed to ${priority}`;
    }
  }

  // Add timeline entry
  request.timeline.push({
    status: request.status,
    comment: timelineComment,
    updatedBy: req.user.userId
  });
}
```

## Frontend Implementation

### Client View (RequestDetail.js)

#### Fetching Timeline Data
```javascript
const fetchRequestDetail = async () => {
  const response = await axios.get(`${API_URL}/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setRequest(response.data.data);
};
```

#### Displaying Timeline
```javascript
{/* Timeline Section */}
<div className="bg-white rounded-xl shadow-md p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Request Timeline</h2>
  
  {request.timeline && request.timeline.length > 0 ? (
    <div className="space-y-4">
      {request.timeline.map((entry, index) => (
        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-900 capitalize">
              {entry.status.replace('-', ' ')}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(entry.updatedAt).toLocaleString()}
            </span>
          </div>
          {entry.comment && (
            <p className="text-gray-600 text-sm">{entry.comment}</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No timeline updates yet</p>
  )}
</div>
```

### Admin View (AdminRequestDetail.js)

#### Status Update Form
```javascript
const [status, setStatus] = useState('');
const [priority, setPriority] = useState('');
const [statusComment, setStatusComment] = useState('');

const handleUpdateRequest = async () => {
  const token = localStorage.getItem('token');
  const updateData = {};
  
  // Only include changed fields
  if (status !== request.status) updateData.status = status;
  if (priority !== request.priority) updateData.priority = priority;
  if (statusComment.trim()) updateData.comment = statusComment;
  
  const response = await axios.put(
    `${API_URL}/requests/${id}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  if (response.data.success) {
    toast.success('Request updated successfully');
    setStatusComment(''); // Clear comment field
    fetchRequestDetail(); // Refresh data to show new timeline entry
  }
};
```

#### Admin Update Form UI
```javascript
{/* Status Update Form */}
<div className="bg-white rounded-xl shadow-md p-6">
  <h3 className="font-bold text-gray-900 mb-4">Update Status</h3>
  
  {/* Status Select */}
  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="pending">Pending</option>
    <option value="in-progress">In Progress</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>
  
  {/* Priority Select */}
  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="urgent">Urgent</option>
  </select>
  
  {/* Status Comment */}
  <textarea
    value={statusComment}
    onChange={(e) => setStatusComment(e.target.value)}
    placeholder="Add a comment about this status update..."
  />
  <p className="text-xs text-gray-500">
    This will be visible to the client in the timeline
  </p>
  
  <button onClick={handleUpdateRequest}>Save Changes</button>
</div>
```

## Timeline Display Features

### Status Badge Colors
```javascript
const getStatusBadge = (status) => {
  const badges = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};
```

### Date Formatting
```javascript
// Convert ISO date to readable format
new Date(entry.updatedAt).toLocaleString()
// Output: "1/15/2024, 2:45:00 PM"
```

### Status Text Formatting
```javascript
// Convert 'in-progress' to 'In Progress'
entry.status.replace('-', ' ').split(' ').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ')
```

## Common Use Cases

### 1. Initial Request Submission
```
Timeline Entry:
- Status: pending
- Comment: "Request created"
- Timestamp: When client submits form
```

### 2. Admin Reviews Request
```
Admin Action:
- Changes status to "in-progress"
- Adds comment: "We are reviewing your requirements"

Timeline Entry:
- Status: in-progress
- Comment: "We are reviewing your requirements"
- Timestamp: When admin saves changes
```

### 3. Request Completion
```
Admin Action:
- Changes status to "completed"
- Adds comment: "Personnel assigned and service completed successfully"

Timeline Entry:
- Status: completed
- Comment: "Personnel assigned and service completed successfully"
- Timestamp: When admin marks as complete
```

### 4. Request Cancellation
```
Admin Action:
- Changes status to "cancelled"
- Adds comment: "Unable to fulfill requirements at this time"

Timeline Entry:
- Status: cancelled
- Comment: "Unable to fulfill requirements at this time"
- Timestamp: When admin cancels request
```

## Best Practices

### For Admins
1. **Always add meaningful comments** when updating status
2. **Be specific** about what actions are being taken
3. **Include timeframes** when possible (e.g., "Will assign within 24 hours")
4. **Update status regularly** to keep clients informed
5. **Use appropriate priority levels** based on urgency

### For Developers
1. **Always validate comment length** before saving
2. **Use transactions** for critical timeline updates
3. **Index updatedAt field** for performance
4. **Populate updatedBy** to show who made changes
5. **Consider timezone handling** for international users

## Testing Timeline Feature

### Test Case 1: Initial Timeline Entry
```javascript
// Create request and verify initial timeline
const request = await Request.create({
  // ... request fields
  timeline: [{
    status: 'pending',
    comment: 'Request created',
    updatedBy: userId
  }]
});

expect(request.timeline.length).toBe(1);
expect(request.timeline[0].status).toBe('pending');
expect(request.timeline[0].comment).toBe('Request created');
```

### Test Case 2: Status Update Adds Timeline Entry
```javascript
// Update request status
const updateData = {
  status: 'in-progress',
  comment: 'Reviewing requirements'
};

const response = await axios.put(`/api/requests/${id}`, updateData);
const updatedRequest = response.data.data;

expect(updatedRequest.timeline.length).toBe(2);
expect(updatedRequest.timeline[1].status).toBe('in-progress');
expect(updatedRequest.timeline[1].comment).toBe('Reviewing requirements');
```

### Test Case 3: Timeline Visible to Client
```javascript
// Client fetches their request
const response = await axios.get(`/api/requests/${id}`, {
  headers: { Authorization: clientToken }
});

const timeline = response.data.data.timeline;
expect(timeline.length).toBeGreaterThan(0);
expect(timeline[0].comment).toBeDefined();
```

## Troubleshooting

### Timeline Not Showing
**Problem**: Client doesn't see timeline updates
**Solutions**:
1. Check if request is being populated with timeline field
2. Verify timeline entries are being saved to database
3. Ensure frontend is mapping over timeline array correctly
4. Check browser console for rendering errors

### Comments Not Appearing
**Problem**: Admin comments not visible in timeline
**Solutions**:
1. Verify comment field is included in PUT request body
2. Check backend is receiving comment in req.body
3. Ensure timeline push is happening before save
4. Verify comment is not empty string

### Duplicate Timeline Entries
**Problem**: Multiple entries created for single update
**Solutions**:
1. Check if PUT endpoint is being called multiple times
2. Verify no duplicate timeline.push() calls
3. Add debouncing to save button
4. Use loading state to prevent multiple submissions

### Timeline Order Issues
**Problem**: Timeline entries not in chronological order
**Solutions**:
1. Sort timeline by updatedAt before rendering
2. Ensure updatedAt is set correctly
3. Use `sort()` in frontend:
   ```javascript
   request.timeline.sort((a, b) => 
     new Date(a.updatedAt) - new Date(b.updatedAt)
   )
   ```

## Future Enhancements

### 1. User Information in Timeline
Show who made each update:
```javascript
await request.populate('timeline.updatedBy', 'name role');
// Display: "Updated by Admin User (admin)"
```

### 2. Timeline Notifications
Email client when timeline is updated:
```javascript
if (statusChanged || comment) {
  await sendTimelineUpdateEmail(request.client.email, {
    requestId: request._id,
    status: request.status,
    comment: timelineComment
  });
}
```

### 3. Rich Text Comments
Allow formatting in timeline comments using Markdown or WYSIWYG editor.

### 4. Attachments in Timeline
Allow admins to attach files to timeline updates:
```javascript
timeline: [{
  status: String,
  comment: String,
  attachments: [String],
  updatedBy: ObjectId,
  updatedAt: Date
}]
```

### 5. Timeline Filters
Allow clients to filter timeline by status or date range.

---

**Last Updated**: January 2024
