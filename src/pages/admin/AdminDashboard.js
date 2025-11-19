import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import API_URL from '../../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    activeClients: 0,
    monthlyGrowth: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view dashboard');
        navigate('/login');
        return;
      }

      // Fetch all requests
      const response = await axios.get(`${API_URL}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Fetch all users for client count
      const usersResponse = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const requests = response.data.data;
        const users = usersResponse.data.success ? usersResponse.data.data : [];

        // Current month calculations
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentMonthRequests = requests.filter(r => 
          new Date(r.createdAt) >= currentMonthStart
        );
        const lastMonthRequests = requests.filter(r => {
          const date = new Date(r.createdAt);
          return date >= lastMonthStart && date <= lastMonthEnd;
        });

        // Calculate stats
        const totalRequests = requests.length;
        const pendingRequests = requests.filter(r => r.status === 'pending').length;
        const inProgressRequests = requests.filter(r => r.status === 'in-progress').length;
        const completedRequests = requests.filter(r => r.status === 'completed').length;

        // Current month stats for comparison
        const currentMonthPending = currentMonthRequests.filter(r => r.status === 'pending').length;
        const lastMonthPending = lastMonthRequests.filter(r => r.status === 'pending').length;
        
        const currentMonthInProgress = currentMonthRequests.filter(r => r.status === 'in-progress').length;
        const lastMonthInProgress = lastMonthRequests.filter(r => r.status === 'in-progress').length;
        
        const currentMonthCompleted = currentMonthRequests.filter(r => r.status === 'completed').length;
        const lastMonthCompleted = lastMonthRequests.filter(r => r.status === 'completed').length;

        // Get active clients (users with role='client')
        const activeClients = users.filter(u => u.role === 'client').length;
        const lastMonthClients = users.filter(u => {
          const date = new Date(u.createdAt);
          return u.role === 'client' && date >= lastMonthStart && date <= lastMonthEnd;
        }).length;

        // Calculate growth percentages
        const totalGrowth = lastMonthRequests.length > 0 
          ? Math.round(((currentMonthRequests.length - lastMonthRequests.length) / lastMonthRequests.length) * 100)
          : currentMonthRequests.length > 0 ? 100 : 0;

        const pendingChange = lastMonthPending > 0
          ? Math.round(((currentMonthPending - lastMonthPending) / lastMonthPending) * 100)
          : currentMonthPending > 0 ? 100 : 0;

        const inProgressChange = lastMonthInProgress > 0
          ? Math.round(((currentMonthInProgress - lastMonthInProgress) / lastMonthInProgress) * 100)
          : currentMonthInProgress > 0 ? 100 : 0;

        const completedChange = lastMonthCompleted > 0
          ? Math.round(((currentMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100)
          : currentMonthCompleted > 0 ? 100 : 0;

        const clientsChange = lastMonthClients > 0
          ? Math.round(((activeClients - lastMonthClients) / lastMonthClients) * 100)
          : activeClients > 0 ? 100 : 0;

        const monthlyGrowth = lastMonthRequests.length > 0
          ? ((currentMonthRequests.length - lastMonthRequests.length) / lastMonthRequests.length * 100).toFixed(1)
          : 0;

        setStats({
          totalRequests,
          pendingRequests,
          inProgressRequests,
          completedRequests,
          activeClients,
          monthlyGrowth,
          changes: {
            total: totalGrowth,
            pending: pendingChange,
            inProgress: inProgressChange,
            completed: completedChange,
            clients: clientsChange,
          }
        });

        // Get recent 5 requests
        const sortedRequests = requests.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentRequests(sortedRequests.slice(0, 5));
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [location.key]); // Re-fetch when location changes

  const statCards = [
    {
      label: 'Total Requests',
      value: stats.totalRequests,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      change: stats.changes?.total ? `${stats.changes.total > 0 ? '+' : ''}${stats.changes.total}%` : '0%',
    },
    {
      label: 'Pending Review',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      change: stats.changes?.pending ? `${stats.changes.pending > 0 ? '+' : ''}${stats.changes.pending}%` : '0%',
    },
    {
      label: 'In Progress',
      value: stats.inProgressRequests,
      icon: AlertCircle,
      color: 'bg-purple-50 text-purple-600',
      change: stats.changes?.inProgress ? `${stats.changes.inProgress > 0 ? '+' : ''}${stats.changes.inProgress}%` : '0%',
    },
    {
      label: 'Completed',
      value: stats.completedRequests,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      change: stats.changes?.completed ? `${stats.changes.completed > 0 ? '+' : ''}${stats.changes.completed}%` : '0%',
    },
    {
      label: 'Active Clients',
      value: stats.activeClients,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600',
      change: stats.changes?.clients ? `${stats.changes.clients > 0 ? '+' : ''}${stats.changes.clients}%` : '0%',
    },
    {
      label: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      change: stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth}%` : `${stats.monthlyGrowth}%`,
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge badge-pending',
      'in-progress': 'badge badge-in-progress',
      'completed': 'badge badge-completed',
      'cancelled': 'badge badge-rejected',
    };
    return badges[status] || 'badge';
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage all manpower service requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/admin/requests?status=pending"
            className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <Clock className="text-yellow-600 dark:text-yellow-500 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Review Pending</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.pendingRequests} requests need attention</p>
          </Link>

          <Link
            to="/admin/requests"
            className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <FileText className="text-blue-600 dark:text-blue-500 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">All Requests</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all requests</p>
          </Link>

          <Link
            to="/admin/analytics"
            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <TrendingUp className="text-green-600 dark:text-green-500 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View detailed reports and insights</p>
          </Link>
        </div>

        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Requests</h2>
            <Link to="/admin/requests" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 dark:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        #{request._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {request.client?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {request.serviceType ? request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(request.status)}>
                          {formatStatus(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/requests/${request._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No requests found. Requests from clients will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;









