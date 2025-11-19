import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, Download, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import API_URL from '../../config/api';
import { generateRequestPDF } from '../../utils/pdfGenerator';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view request details');
        navigate('/login');
        return;
      }

      console.log('Fetching request with ID:', id);
      const response = await axios.get(`${API_URL}/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Request response:', response.data);

      if (response.data.success) {
        console.log('Request data:', response.data.data);
        setRequest(response.data.data);
      } else {
        toast.error('Failed to load request details');
        navigate('/client/dashboard');
      }
    } catch (error) {
      console.error('Fetch request error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view this request');
      } else if (error.response?.status === 404) {
        toast.error('Request not found');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load request details');
      }
      navigate('/client/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message via API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleDownloadReport = () => {
    try {
      generateRequestPDF(request);
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
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
            onClick={() => navigate('/client/dashboard')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Request #{request._id.slice(-6)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 capitalize">{request.serviceType} - {request.category}</p>
            </div>
            <span className={getStatusBadge(request.status)}>{request.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Request Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="text-gray-400 dark:text-gray-500 mr-3 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {request.startDate ? new Date(request.startDate).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="text-gray-400 dark:text-gray-500 mr-3 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Number of Personnel</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.numberOfPersonnel || 0} persons</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="text-gray-400 dark:text-gray-500 mr-3 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration & Shift</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {request.duration || 'N/A'} - {request.shiftType || 'N/A'} shift
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="text-gray-400 dark:text-gray-500 mr-3 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="text-gray-400 dark:text-gray-500 mr-3 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.description || 'No description provided'}</p>
                  </div>
                </div>

                {request.requirements && (
                  <div className="flex items-start pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Requirements</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{request.requirements}</p>
                    </div>
                  </div>
                )}

                {request.budget && (
                  <div className="flex items-start pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Rs. {request.budget.toLocaleString()}</p>
                    </div>
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

            {/* Messages */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Communication</h2>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {request.comments && request.comments.length > 0 ? (
                  request.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{comment.user?.name || 'User'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-500 text-center py-4">No messages yet</p>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input-field"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="btn-primary flex items-center">
                  <MessageCircle size={20} className="mr-2" />
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Staff */}
            {request.assignedTo && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Assigned Staff</h3>
                <div className="text-sm space-y-2">
                  <p><span className="text-gray-600 dark:text-gray-400">Name:</span><br />
                  <span className="font-medium">{request.assignedTo.name}</span></p>
                  <p><span className="text-gray-600 dark:text-gray-400">Email:</span><br />
                  <span className="font-medium">{request.assignedTo.email}</span></p>
                  {request.assignedTo.phone && (
                    <p><span className="text-gray-600 dark:text-gray-400">Phone:</span><br />
                    <span className="font-medium">{request.assignedTo.phone}</span></p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleDownloadReport}
                  className="btn-outline w-full flex items-center justify-center"
                >
                  <Download size={18} className="mr-2" />
                  Download Report
                </button>
                <Link to="/contact" className="btn-secondary w-full text-center block">
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Request Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Request Information</h3>
              <div className="text-sm space-y-2">
                <p><span className="text-gray-600 dark:text-gray-400">Request ID:</span><br />
                <span className="font-medium">#{request._id?.slice(-6) || 'N/A'}</span></p>
                <p><span className="text-gray-600 dark:text-gray-400">Created:</span><br />
                <span className="font-medium">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</span></p>
                <p><span className="text-gray-600 dark:text-gray-400">Status:</span><br />
                <span className={getStatusBadge(request.status)}>{request.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;








