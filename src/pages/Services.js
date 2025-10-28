import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Wrench, Stethoscope, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const { user } = useAuth();
  const services = [
    {
      icon: Shield,
      title: 'Security Services',
      category: 'security',
      description: 'Comprehensive security solutions for your business and events',
      features: [
        'Armed Security Personnel',
        'Unarmed Security Guards',
        'Event Security Management',
        'VIP Protection Services',
        'Access Control Systems',
        'Mobile Patrol Services',
      ],
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: Users,
      title: 'Labor Services',
      category: 'labor',
      description: 'Skilled and unskilled workforce for various industrial needs',
      features: [
        'Construction Workers',
        'Warehouse Staff',
        'Manufacturing Personnel',
        'Loading & Unloading Teams',
        'Maintenance Crew',
        'General Labor Support',
      ],
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200',
    },
    {
      icon: Wrench,
      title: 'Technical Staff',
      category: 'technical',
      description: 'Qualified technical professionals for specialized projects',
      features: [
        'IT Support Specialists',
        'Software Developers',
        'Network Engineers',
        'Electricians & Technicians',
        'Mechanical Engineers',
        'Project Managers',
      ],
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      icon: Stethoscope,
      title: 'Medical Professionals',
      category: 'medical',
      description: 'Healthcare professionals for hospitals and medical facilities',
      features: [
        'Registered Nurses (RN)',
        'Licensed Practical Nurses (LPN)',
        'Medical Assistants',
        'Paramedics & EMTs',
        'Healthcare Aides',
        'Medical Support Staff',
      ],
      color: 'bg-red-50 text-red-600',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Professional manpower solutions across multiple industries. Find the right talent for your business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 ${service.borderColor} dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow`}
            >
              <div className={`${service.color} dark:!bg-gray-700 dark:!text-gray-100 p-6`}>
                <div className="flex items-center space-x-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <service.icon size={32} className="dark:text-gray-100" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{service.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">What We Offer:</h3>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <ArrowRight size={20} className={`mr-2 flex-shrink-0 mt-0.5 ${service.color.split(' ')[1]}`} />
                      <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/services/${service.category}`}
                  className="btn-primary w-full text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 text-primary-100">
            Submit a request and get matched with qualified professionals
          </p>
          <Link 
            to={user ? "/client/new-request" : "/register"} 
            className="bg-white dark:bg-gray-800 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Submit a Request
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;


