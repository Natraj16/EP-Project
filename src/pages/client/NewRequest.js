import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChevronRight, ChevronLeft, Upload, X } from 'lucide-react';

import API_URL from '../../config/api';

const NewRequest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Service Selection' },
    { number: 2, title: 'Requirements' },
    { number: 3, title: 'Additional Details' },
    { number: 4, title: 'Review & Submit' },
  ];

  const serviceCategories = {
    security: ['Armed Security', 'Unarmed Security', 'Event Security', 'VIP Protection', 'Mobile Patrol'],
    labor: ['Construction Workers', 'Warehouse Staff', 'Manufacturing Personnel', 'Loading Teams', 'Maintenance Crew'],
    technical: ['IT Support', 'Software Developers', 'Network Engineers', 'Electricians', 'Project Managers'],
    medical: ['Registered Nurses', 'Licensed Practical Nurses', 'Medical Assistants', 'Paramedics', 'Healthcare Support'],
  };

  const formik = useFormik({
    initialValues: {
      serviceType: '',
      category: '',
      numberOfPersonnel: '',
      duration: '',
      startDate: '',
      location: '',
      shiftType: '',
      description: '',
      requirements: '',
      budget: '',
    },
    validationSchema: Yup.object({
      serviceType: Yup.string().required('Service type is required'),
      category: Yup.string().required('Category is required'),
      numberOfPersonnel: Yup.number()
        .min(1, 'Must be at least 1')
        .required('Number of personnel is required'),
      duration: Yup.string().required('Duration is required'),
      startDate: Yup.date().required('Start date is required'),
      location: Yup.string().required('Location is required'),
      shiftType: Yup.string().required('Shift type is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to submit a request');
          navigate('/login');
          return;
        }

        const response = await axios.post(
          `${API_URL}/requests`,
          {
            serviceType: values.serviceType,
            category: values.category,
            numberOfPersonnel: parseInt(values.numberOfPersonnel),
            duration: values.duration,
            startDate: values.startDate,
            shiftType: values.shiftType,
            location: values.location,
            description: values.description,
            requirements: values.requirements || '',
            budget: values.budget ? parseFloat(values.budget) : undefined,
            priority: 'medium'
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          toast.success('Request submitted successfully!');
          navigate('/client/dashboard');
        }
      } catch (error) {
        console.error('Submit request error:', error);
        toast.error(error.response?.data?.message || 'Failed to submit request. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Service Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(serviceCategories).map((service) => (
                  <div
                    key={service}
                    onClick={() => {
                      formik.setFieldValue('serviceType', service);
                      formik.setFieldValue('category', '');
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formik.values.serviceType === service
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{service} Services</h3>
                  </div>
                ))}
              </div>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.serviceType}</p>
              )}
            </div>

            {formik.values.serviceType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Category *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceCategories[formik.values.serviceType].map((category) => (
                    <div
                      key={category}
                      onClick={() => formik.setFieldValue('category', category)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formik.values.category === category
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-500'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{category}</p>
                    </div>
                  ))}
                </div>
                {formik.touched.category && formik.errors.category && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.category}</p>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="numberOfPersonnel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Personnel *
                </label>
                <input
                  id="numberOfPersonnel"
                  name="numberOfPersonnel"
                  type="number"
                  min="1"
                  className="input-field"
                  placeholder="e.g., 5"
                  {...formik.getFieldProps('numberOfPersonnel')}
                />
                {formik.touched.numberOfPersonnel && formik.errors.numberOfPersonnel && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.numberOfPersonnel}</p>
                )}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  className="input-field"
                  {...formik.getFieldProps('duration')}
                >
                  <option value="">Select duration</option>
                  <option value="1-day">1 Day</option>
                  <option value="1-week">1 Week</option>
                  <option value="1-month">1 Month</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="1-year">1 Year</option>
                  <option value="permanent">Permanent</option>
                </select>
                {formik.touched.duration && formik.errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.duration}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="input-field"
                  {...formik.getFieldProps('startDate')}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.startDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="shiftType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Shift Type *
                </label>
                <select
                  id="shiftType"
                  name="shiftType"
                  className="input-field"
                  {...formik.getFieldProps('shiftType')}
                >
                  <option value="">Select shift type</option>
                  <option value="day">Day Shift (8AM - 4PM)</option>
                  <option value="night">Night Shift (8PM - 4AM)</option>
                  <option value="rotating">Rotating Shifts</option>
                  <option value="flexible">Flexible</option>
                </select>
                {formik.touched.shiftType && formik.errors.shiftType && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.shiftType}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location/Address *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="input-field"
                placeholder="Full address or location"
                {...formik.getFieldProps('location')}
              />
              {formik.touched.location && formik.errors.location && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="input-field"
                placeholder="Describe the nature of work, environment, and any important context..."
                {...formik.getFieldProps('description')}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specific Requirements (Optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows="4"
                className="input-field"
                placeholder="Any certifications, licenses, experience levels, or special skills needed..."
                {...formik.getFieldProps('requirements')}
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget Range (Optional)
              </label>
              <input
                id="budget"
                name="budget"
                type="text"
                className="input-field"
                placeholder="e.g., $20-25/hour or $5000-6000/month"
                {...formik.getFieldProps('budget')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Upload Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PDF, DOC, DOCX up to 10MB
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                  Choose Files
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Please review your request details before submitting. You can go back to edit any information.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 border-b pb-2">Service Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Service Type:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{formik.values.serviceType}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formik.values.category}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Number of Personnel:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formik.values.numberOfPersonnel}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formik.values.duration}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formik.values.startDate}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Shift Type:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formik.values.shiftType}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formik.values.location}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Description:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{formik.values.description}</p>
              </div>

              {formik.values.requirements && (
                <div className="pt-4 border-t">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Requirements:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{formik.values.requirements}</p>
                </div>
              )}

              {formik.values.budget && (
                <div className="pt-4 border-t">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Budget:</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{formik.values.budget}</p>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="pt-4 border-t">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Uploaded Files:</span>
                  <ul className="mt-1 space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="text-sm text-gray-900 dark:text-gray-100">• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">New Service Request</h1>
          <p className="text-gray-600 dark:text-gray-400">Fill out the form to submit your manpower service request</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.number}
                  </div>
                  <p className="text-xs mt-2 text-center hidden sm:block">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 mb-6">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`btn-secondary flex items-center ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft size={20} className="mr-2" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex items-center"
                disabled={
                  (currentStep === 1 && (!formik.values.serviceType || !formik.values.category))
                }
              >
                Next
                <ChevronRight size={20} className="ml-2" />
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;







