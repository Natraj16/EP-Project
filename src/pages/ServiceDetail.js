import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Shield, Users, Wrench, Stethoscope, CheckCircle, Clock, Award, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ServiceDetail = () => {
  const { category } = useParams();
  const { user } = useAuth();

  const serviceData = {
    security: {
      icon: Shield,
      title: 'Security Services',
      subtitle: 'Professional security solutions for complete peace of mind',
      description: 'Our security services provide comprehensive protection for your business, events, and properties. We employ highly trained security professionals with extensive backgrounds in law enforcement and military service.',
      color: 'text-blue-600 bg-blue-50',
      services: [
        {
          name: 'Armed Security',
          description: 'Licensed armed guards for high-risk environments and valuable asset protection.',
        },
        {
          name: 'Unarmed Security',
          description: 'Professional security presence for access control and general safety monitoring.',
        },
        {
          name: 'Event Security',
          description: 'Specialized security for concerts, conferences, and private events.',
        },
        {
          name: 'VIP Protection',
          description: 'Close protection services for executives and high-profile individuals.',
        },
        {
          name: 'Mobile Patrol',
          description: 'Regular security patrols for multiple locations and facilities.',
        },
      ],
      benefits: [
        'Comprehensive background checks',
        'Ongoing training and certification',
        'Advanced threat assessment',
        '24/7 emergency response',
        'Detailed incident reporting',
      ],
    },
    labor: {
      icon: Users,
      title: 'Labor Services',
      subtitle: 'Reliable workforce solutions for any project size',
      description: 'From skilled tradespeople to general laborers, we provide qualified personnel for construction, manufacturing, warehousing, and more. Our workers are thoroughly vetted and ready to contribute from day one.',
      color: 'text-green-600 bg-green-50',
      services: [
        {
          name: 'Construction Labor',
          description: 'Skilled and unskilled workers for building and construction projects.',
        },
        {
          name: 'Warehouse Operations',
          description: 'Personnel for inventory management, packing, and logistics support.',
        },
        {
          name: 'Manufacturing Staff',
          description: 'Production line workers and quality control specialists.',
        },
        {
          name: 'Loading/Unloading Teams',
          description: 'Efficient teams for material handling and transportation support.',
        },
        {
          name: 'Maintenance Crew',
          description: 'General maintenance and facility upkeep personnel.',
        },
      ],
      benefits: [
        'Flexible staffing options',
        'Safety training included',
        'Quick deployment',
        'Experience in multiple industries',
        'Performance monitoring',
      ],
    },
    technical: {
      icon: Wrench,
      title: 'Technical Staff',
      subtitle: 'Expert technical professionals for specialized needs',
      description: 'Our technical staffing services connect you with qualified IT professionals, engineers, and technicians. Whether you need short-term project support or long-term placements, we have the expertise.',
      color: 'text-purple-600 bg-purple-50',
      services: [
        {
          name: 'IT Support',
          description: 'Help desk support, system administration, and network management.',
        },
        {
          name: 'Software Development',
          description: 'Full-stack developers, mobile app developers, and QA engineers.',
        },
        {
          name: 'Engineering Services',
          description: 'Mechanical, electrical, and civil engineering professionals.',
        },
        {
          name: 'Technical Specialists',
          description: 'HVAC technicians, electricians, and maintenance engineers.',
        },
        {
          name: 'Project Management',
          description: 'Certified project managers for technical initiatives.',
        },
      ],
      benefits: [
        'Industry-certified professionals',
        'Latest technical skills',
        'Project-based or full-time',
        'Quick talent matching',
        'Competitive rates',
      ],
    },
    medical: {
      icon: Stethoscope,
      title: 'Medical Professionals',
      subtitle: 'Qualified healthcare staff for every medical setting',
      description: 'We provide licensed and certified medical professionals for hospitals, clinics, nursing homes, and home healthcare. All our medical staff undergo rigorous credential verification and compliance checks.',
      color: 'text-red-600 bg-red-50',
      services: [
        {
          name: 'Registered Nurses',
          description: 'RNs with specialized certifications for various medical departments.',
        },
        {
          name: 'Licensed Practical Nurses',
          description: 'LPNs for patient care and medical support services.',
        },
        {
          name: 'Medical Assistants',
          description: 'Certified assistants for clinical and administrative support.',
        },
        {
          name: 'Paramedics',
          description: 'Emergency medical technicians and paramedics for urgent care.',
        },
        {
          name: 'Healthcare Support',
          description: 'Medical receptionists, billing specialists, and administrative staff.',
        },
      ],
      benefits: [
        'Licensed and certified',
        'HIPAA compliance training',
        'Flexible scheduling',
        'Emergency placements available',
        'Ongoing compliance verification',
      ],
    },
  };

  const service = serviceData[category];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = service.icon;

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className={`w-20 h-20 rounded-2xl ${service.color} flex items-center justify-center`}>
              <Icon size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{service.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">{service.subtitle}</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{service.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Available Services</h2>
            <div className="space-y-4">
              {service.services.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Quick Deployment</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Fast turnaround on all requests</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Quality Assured</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Thoroughly vetted professionals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Competitive Rates</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Best value for your investment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Submit a request and we'll match you with qualified professionals.
              </p>
              <Link 
                to={user ? "/client/new-request" : "/register"} 
                className="btn-primary w-full text-center block mb-3"
              >
                {user ? 'Submit Request' : 'Register to Submit Request'}
              </Link>
              <Link to="/contact" className="btn-outline w-full text-center block">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/services" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to All Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;





