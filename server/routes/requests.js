const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all requests (with filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, category, priority, clientId } = req.query;
    const filter = {};

    // If user is client, only show their requests
    if (req.user.role === 'client') {
      filter.client = req.user.userId;
    } else if (clientId) {
      filter.client = clientId;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const requests = await Request.find(filter)
      .populate('client', 'name email company')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message
    });
  }
});

// Get single request by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('client', 'name email phone company')
      .populate('assignedTo', 'name email phone')
      .populate('comments.user', 'name')
      .populate('timeline.updatedBy', 'name');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user has access to this request
    if (req.user.role === 'client' && request.client._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching request',
      error: error.message
    });
  }
});

// Create new request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      serviceType, 
      category, 
      numberOfPersonnel, 
      duration, 
      startDate, 
      shiftType,
      location, 
      description, 
      requirements, 
      budget, 
      priority 
    } = req.body;

    const request = new Request({
      serviceType,
      category,
      numberOfPersonnel,
      duration,
      startDate,
      shiftType,
      location,
      description,
      requirements,
      budget,
      priority: priority || 'medium',
      client: req.user.userId,
      timeline: [{
        status: 'pending',
        comment: 'Request created',
        updatedBy: req.user.userId
      }]
    });

    await request.save();
    await request.populate('client', 'name email company phone');

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating request',
      error: error.message
    });
  }
});

// Update request
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check permissions
    if (req.user.role === 'client' && request.client.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, category, priority, budget, deadline, location, status, assignedTo, comment } = req.body;

    // Update fields (client can update these)
    if (title) request.title = title;
    if (description) request.description = description;
    if (category) request.category = category;
    if (budget !== undefined) request.budget = budget;
    if (deadline) request.deadline = deadline;
    if (location) request.location = location;
    
    // Only admin can update status, priority, and assignedTo
    if (req.user.role === 'admin') {
      const statusChanged = status && status !== request.status;
      const staffAssigned = assignedTo && assignedTo !== request.assignedTo?.toString();

      if (statusChanged) {
        request.status = status;
      }

      if (staffAssigned) {
        request.assignedTo = assignedTo;
      }

      // Add timeline entry if status changed, staff assigned, or comment provided
      if (statusChanged || staffAssigned || comment) {
        let timelineComment = comment || '';
        
        if (!comment) {
          const changes = [];
          if (statusChanged) changes.push(`Status changed to ${status}`);
          if (staffAssigned) changes.push('Staff member assigned');
          timelineComment = changes.join(' and ');
        }

        request.timeline.push({
          status: request.status,
          comment: timelineComment,
          updatedBy: req.user.userId
        });
      }
    }

    await request.save();
    await request.populate('client', 'name email company phone');
    await request.populate('assignedTo', 'name email phone');

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating request',
      error: error.message
    });
  }
});

// Add comment to request
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.comments.push({
      user: req.user.userId,
      text: req.body.text
    });

    await request.save();
    await request.populate('comments.user', 'name');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: request
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

// Delete request (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting request',
      error: error.message
    });
  }
});

module.exports = router;
