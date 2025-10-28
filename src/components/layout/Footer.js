import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="P&J INFRA Logo" 
                className="h-8 w-auto"
              />
              <h3 className="text-white text-xl font-bold">P&J INFRA</h3>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for comprehensive manpower solutions across security, labor, technical, and medical services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/security" className="hover:text-primary-400 transition-colors">
                  Security Services
                </Link>
              </li>
              <li>
                <Link to="/services/labor" className="hover:text-primary-400 transition-colors">
                  Labor Services
                </Link>
              </li>
              <li>
                <Link to="/services/technical" className="hover:text-primary-400 transition-colors">
                  Technical Staff
                </Link>
              </li>
              <li>
                <Link to="/services/medical" className="hover:text-primary-400 transition-colors">
                  Medical Professionals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <a href="tel:+919838004008" className="text-sm hover:text-primary-400 transition-colors">+91 98380 04008</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <a href="https://maps.google.com/?q=J374+Awas+Vikas+Colony,+Keshavpuram,+Kalyanpur,+Kanpur+208017" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary-400 transition-colors">
                  Corp. Office: J374 Awas Vikas Colony,<br/>
                  Keshavpuram, Kalyanpur, Kanpur (U.P.) 208017
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <a href="mailto:office@pjinfra.com" className="text-sm hover:text-primary-400 transition-colors">office@pjinfra.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} P&J INFRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

