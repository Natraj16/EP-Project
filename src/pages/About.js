import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { user } = useAuth();
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide businesses with access to qualified, reliable manpower solutions that drive success and growth.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in recruitment, training, and service delivery.',
    },
    {
      icon: Users,
      title: 'People First',
      description: 'We believe in building strong relationships with both clients and professionals.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Leveraging technology to streamline the manpower hiring process.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Satisfied Clients' },
    { number: '10,000+', label: 'Professionals Placed' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src="/logo.png" 
              alt="P&J INFRA Logo" 
              className="h-16 w-auto"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">
              About P&J INFRA
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your trusted partner in professional manpower solutions since 2009
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Founded in 2009, P&J INFRA has grown from a small local staffing agency to a 
              comprehensive manpower solutions provider serving businesses across multiple industries. 
              Our journey began with a simple mission: to connect businesses with qualified 
              professionals efficiently and transparently.
            </p>
            <p>
              Over the years, we've built strong relationships with thousands of clients and 
              professionals, earning a reputation for reliability, quality, and exceptional service. 
              Our success is built on understanding the unique needs of each client and matching 
              them with the right talent.
            </p>
            <p>
              Today, we specialize in four key areas: Security Services, Labor Solutions, 
              Technical Staffing, and Medical Professionals. Our digital platform has revolutionized 
              how businesses request and track manpower services, bringing transparency and 
              efficiency to an industry that traditionally relied on fragmented communication channels.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Network</h2>
          <p className="text-xl mb-6 text-primary-100 max-w-2xl mx-auto">
            Whether you're looking for manpower solutions or seeking opportunities as a 
            professional, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={user ? "/client/new-request" : "/register"} 
              className="bg-white dark:bg-gray-800 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {user ? 'Submit Request' : 'Get Started'}
            </Link>
            <Link to="/contact" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


