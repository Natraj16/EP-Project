import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import API_URL from '../../config/api';

const AdminRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  useEffect(() => {
    fetchRequestDetail();
    fetchStaffList();
  }, [id]);

  const fetchStaffList = async () => {
    try {
      setLoadingStaff(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('Fetching staff list...');

      // Fetch users with role 'staff'
      const staffResponse = await axios.get(`${API_URL}/users?role=staff`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Fetch users with role 'admin' (for P&J INFRA staff)
      const adminResponse = await axios.get(`${API_URL}/users?role=admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Staff response:', staffResponse.data);
      console.log('Admin response:', adminResponse.data);

      // Combine both staff and admin users
      const staffMembers = staffResponse.data.success ? staffResponse.data.data : [];
      const adminMembers = adminResponse.data.success ? adminResponse.data.data : [];
      const allStaff = [...staffMembers, ...adminMembers];

      console.log('Total staff members found:', allStaff.length);
      setStaffList(allStaff);
    } catch (error) {
      console.error('Fetch staff list error:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load staff list');
      setStaffList([]);
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchRequestDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view request details');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const req = response.data.data;
        setRequest(req);
        setStatus(req.status);
        setAssignedStaff(req.assignedTo?._id || '');
      }
    } catch (error) {
      console.error('Fetch request error:', error);
      toast.error('Failed to load request details');
      navigate('/admin/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        status
      };

      // Add assigned staff if selected
      if (assignedStaff) {
        updateData.assignedTo = assignedStaff;
      }

      // Add comment to timeline if there's a status change or comment
      if (statusComment.trim()) {
        updateData.comment = statusComment;
      }

      const response = await axios.put(`${API_URL}/requests/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Request updated successfully!');
        setStatusComment('');
        fetchRequestDetail(); // Refresh data
      }
    } catch (error) {
      console.error('Update request error:', error);
      toast.error(error.response?.data?.message || 'Failed to update request');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge badge-pending',
      'in-progress': 'badge badge-in-progress',
      'completed': 'badge badge-completed',
      'cancelled': 'badge badge-rejected',
    };
    return badges[status] || 'badge';
  };

  if (loading || !request) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/requests')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to All Requests
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Request #{request._id.slice(-6)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{request.client?.name || 'N/A'} - <span className="capitalize">{request.serviceType}</span></p>
            </div>
            <span className={getStatusBadge(request.status)}>{request.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Client Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Company Name</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{request.client?.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Contact Person</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{request.client?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{request.client?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{request.client?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Submitted On</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Priority</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{request.priority}</p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Request Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Service Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{request.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Personnel Needed</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.numberOfPersonnel}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(request.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Shift Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{request.shiftType} shift</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Location</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{request.location}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Description</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{request.description}</p>
                </div>

                {request.requirements && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Requirements</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.requirements}</p>
                  </div>
                )}

                {request.budget && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Budget</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Rs. {request.budget.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Request Timeline</h2>
              <div className="space-y-4">
                {request.timeline && request.timeline.length > 0 ? (
                  request.timeline.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                        {index < request.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{item.status}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(item.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-500 text-center py-4">No timeline updates yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Admin Actions */}
          <div className="space-y-6">
            {/* Update Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Update Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Request Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign Staff Member
                  </label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="input-field"
                    disabled={loadingStaff}
                  >
                    <option value="">
                      {loadingStaff ? 'Loading staff...' : 'Not Assigned'}
                    </option>
                    {staffList.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name} - {staff.email} ({staff.role})
                      </option>
                    ))}
                  </select>
                  {!loadingStaff && staffList.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ No staff members found. Please add staff or admin users to the database.
                    </p>
                  )}
                  {!loadingStaff && staffList.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ {staffList.length} staff member(s) available
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status Update Comment
                  </label>
                  <textarea
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    rows="3"
                    placeholder="Add a comment about this status update..."
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be visible to the client in the timeline</p>
                </div>

                <button
                  onClick={handleUpdateRequest}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Request Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Request Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Request ID</p>
                  <p className="text-gray-900 dark:text-gray-100 dark:text-gray-100">#{request._id.slice(-6)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Created</p>
                  <p className="text-gray-900 dark:text-gray-100 dark:text-gray-100">{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-900 dark:text-gray-100 dark:text-gray-100">{new Date(request.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Current Status</p>
                  <p className="text-gray-900 dark:text-gray-100 dark:text-gray-100 capitalize">{request.status.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Assigned Staff</p>
                  <p className="text-gray-900 dark:text-gray-100 dark:text-gray-100">
                    {request.assignedTo?.name || 'Not assigned yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestDetail;







