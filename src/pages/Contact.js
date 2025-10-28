import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string(),
      company: Yup.string(),
      subject: Yup.string(),
      message: Yup.string().required('Message is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      
      try {
        const response = await axios.post(`${API_URL}/contact`, values);
        
        toast.success(response.data.message || 'Message sent successfully! We\'ll get back to you soon.');
        resetForm();
      } catch (error) {
        console.error('Contact form error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [
        <a
          href="https://maps.google.com/?q=J374+Awas+Vikas+Colony,+Keshavpuram,+Kalyanpur,+Kanpur+208017"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-400 transition-colors"
        >
          Corp. Office: J374 Awas Vikas Colony,<br/>
          Keshavpuram, Kalyanpur, Kanpur (U.P.) 208017
        </a>
      ],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        <a
          href="tel:+919838004008"
          className="hover:text-primary-400 transition-colors"
        >
          +91 98380 04008
        </a>
      ],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@pjinfra.com', 'support@pjinfra.com', 'sales@pjinfra.com'],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed'],
    },
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Send us a Message</h2>
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`input-field ${
                        formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="John Doe"
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`input-field ${
                        formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="you@example.com"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`input-field ${
                        formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
                      }`}
                      placeholder="+1 (234) 567-8900"
                      {...formik.getFieldProps('phone')}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className={`input-field ${
                        formik.touched.company && formik.errors.company ? 'border-red-500' : ''
                      }`}
                      placeholder="Your Company"
                      {...formik.getFieldProps('company')}
                    />
                    {formik.touched.company && formik.errors.company && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.company}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className={`input-field ${
                      formik.touched.subject && formik.errors.subject ? 'border-red-500' : ''
                    }`}
                    placeholder="How can we help?"
                    {...formik.getFieldProps('subject')}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    className={`input-field ${
                      formik.touched.message && formik.errors.message ? 'border-red-500' : ''
                    }`}
                    placeholder="Tell us more about your needs..."
                    {...formik.getFieldProps('message')}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={loading}
                >
                  <Send size={20} className="mr-2" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-start">
                  <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-3 mr-4">
                    <info.icon className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 h-96">
          <iframe
            title="P&J INFRA Office Location"
            src="https://www.google.com/maps?q=J374+Awas+Vikas+Colony,+Keshavpuram,+Kalyanpur,+Kanpur+208017&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;



