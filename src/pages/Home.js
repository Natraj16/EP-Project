import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, Wrench, Stethoscope, ArrowRight, CheckCircle, Plus, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import API_URL from '../config/api';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientStats, setClientStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect admins to admin dashboard
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    
    // Redirect staff to staff dashboard
    if (user && user.role === 'staff') {
      navigate('/staff/dashboard');
      return;
    }
    
    // Fetch data for clients
    if (user && user.role === 'client') {
      fetchClientData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      console.log('Fetching client requests from:', `${API_URL}/requests/my-requests`);
      const response = await axios.get(`${API_URL}/requests/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        const requests = response.data.data;
        console.log('Fetched requests:', requests);
        
        // Sort by creation date (newest first)
        const sortedRequests = requests.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentRequests(sortedRequests.slice(0, 3)); // Latest 3 requests
        
        // Calculate stats
        const stats = {
          total: requests.length,
          pending: requests.filter(r => r.status === 'pending').length,
          inProgress: requests.filter(r => r.status === 'in-progress').length,
          completed: requests.filter(r => r.status === 'completed').length
        };
        setClientStats(stats);
      }
    } catch (error) {
      console.error('Fetch client data error:', error);
      console.error('Error details:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
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

  // Personalized Home for Logged-in Clients
  if (user && user.role === 'client') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-xl text-primary-100">
                  Manage your service requests and find the right professionals for your needs
                </p>
              </div>
              <Link
                to="/client/new-request"
                className="hidden md:flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                New Request
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          {!loading && clientStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{clientStats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{clientStats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">{clientStats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{clientStats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile New Request Button */}
          <div className="md:hidden mb-6">
            <Link
              to="/client/new-request"
              className="btn-primary w-full text-center flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Create New Request
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Requests */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Requests</h2>
                  <Link to="/client/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
                    View All →
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </div>
                ) : recentRequests.length > 0 ? (
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div key={request._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-500 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                              {request.serviceType} - {request.category}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {request.numberOfPersonnel} personnel • {request.location}
                            </p>
                          </div>
                          <span className={getStatusBadge(request.status)}>{request.status}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            to={`/client/requests/${request._id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="text-gray-400 dark:text-gray-500" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No requests yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first service request to get started</p>
                    <Link to="/client/new-request" className="btn-primary inline-block">
                      Create Request
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Services */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/client/new-request"
                    className="flex items-center p-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    <Plus size={20} className="mr-3" />
                    <span className="font-medium">New Request</span>
                  </Link>
                  <Link
                    to="/client/dashboard"
                    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <BarChart3 size={20} className="mr-3" />
                    <span className="font-medium">View Dashboard</span>
                  </Link>
                  <Link
                    to="/services"
                    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Users size={20} className="mr-3" />
                    <span className="font-medium">Browse Services</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <ArrowRight size={20} className="mr-3" />
                    <span className="font-medium">Contact Support</span>
                  </Link>
                </div>
              </div>

              {/* Services Overview */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Our Services</h3>
                <div className="space-y-3">
                  <Link to="/services/security" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Shield size={18} className="mr-2" />
                    <span className="text-sm font-medium">Security Services</span>
                  </Link>
                  <Link to="/services/labor" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Users size={18} className="mr-2" />
                    <span className="text-sm font-medium">Labor Services</span>
                  </Link>
                  <Link to="/services/technical" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Wrench size={18} className="mr-2" />
                    <span className="text-sm font-medium">Technical Staff</span>
                  </Link>
                  <Link to="/services/medical" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Stethoscope size={18} className="mr-2" />
                    <span className="text-sm font-medium">Medical Professionals</span>
                  </Link>
                </div>
                <Link to="/services" className="mt-4 block text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm">
                  View All Services →
                </Link>
              </div>

              {/* Help Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-2 border-primary-200">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our team is here to assist you with any questions or concerns.
                </p>
                <Link to="/contact" className="btn-outline w-full text-center block">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Home Page for Visitors/Non-Clients
  const services = [
    {
      icon: Shield,
      title: 'Security Services',
      description: 'Armed and unarmed security personnel, special security for events and VIP protection.',
      category: 'security',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Users,
      title: 'Labor Services',
      description: 'Skilled and unskilled labor for construction, manufacturing, and heavy-duty tasks.',
      category: 'labor',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: Wrench,
      title: 'Technical Staff',
      description: 'IT professionals, engineers, technicians, and specialized technical personnel.',
      category: 'technical',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: Stethoscope,
      title: 'Medical Professionals',
      description: 'Nurses, doctors, paramedics, and healthcare support staff for various facilities.',
      category: 'medical',
      color: 'text-red-600 bg-red-50'
    },
  ];

  const features = [
    'Quick response time within 24 hours',
    'Thoroughly vetted and trained professionals',
    'Flexible staffing solutions',
    'Transparent pricing and contracts',
    'Real-time request tracking',
    '24/7 customer support',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professional Manpower Solutions
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Connecting businesses with skilled professionals across security, labor, technical, and medical services
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/services" className="bg-white dark:bg-gray-800 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore Services
                </Link>
                <Link 
                  to={user ? "/client/new-request" : "/register"} 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  {user ? 'Submit Request' : 'Get Started'}
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/hero-image.avif" 
                  alt="Professional Business Analytics and Planning" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-300 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 dark:text-gray-100">Our Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive manpower solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card group hover:scale-105 transition-transform">
                <div className={`w-16 h-16 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <Link
                  to={`/services/${service.category}`}
                  className="flex items-center text-primary-600 font-medium group-hover:text-primary-700"
                >
                  Learn More <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 dark:text-gray-100">
                Why Choose P&J INFRA?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We streamline the process of finding and hiring qualified professionals for your business needs. 
                Our platform ensures transparency, efficiency, and quality in every engagement.
              </p>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100 dark:text-gray-100">Get Started Today</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100 dark:text-gray-100">Register Your Account</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quick and secure registration process</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100 dark:text-gray-100">Submit Your Request</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Specify your manpower requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100 dark:text-gray-100">Track & Hire</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitor progress and connect with professionals</p>
                    </div>
                  </div>
                </div>
                <Link 
                  to={user ? "/client/new-request" : "/register"} 
                  className="btn-primary w-full mt-6 text-center block"
                >
                  {user ? 'Submit Request' : 'Register Now'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find the Right Professionals?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of satisfied clients who trust us for their manpower needs
          </p>
          <Link to="/contact" className="bg-white dark:bg-gray-800 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;





