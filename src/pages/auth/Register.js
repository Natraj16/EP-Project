import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone, Building, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Check for admin access via URL parameter (e.g., /register?admin=true)
  useEffect(() => {
    const adminParam = searchParams.get('admin');
    if (adminParam === 'true') {
      setIsAdminMode(true);
      toast.info('Admin registration mode activated', { autoClose: 2000 });
    }
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      confirmPassword: '',
      adminCode: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
      company: Yup.string().required('Company name is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      adminCode: isAdminMode 
        ? Yup.string().required('Admin code is required for admin registration')
        : Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const registrationData = isAdminMode 
          ? { ...values, requestAdminRole: true }
          : values;
        
        await register(registrationData);
        
        if (isAdminMode) {
          toast.success('Admin registration successful!');
          navigate('/admin/dashboard');
        } else {
          toast.success('Registration successful! Welcome aboard!');
          navigate('/client/dashboard');
        }
      } catch (error) {
        toast.error('Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">
            {isAdminMode ? (
              <span className="flex items-center justify-center gap-2">
                <Shield className="text-primary-600" />
                Admin Registration
              </span>
            ) : (
              'Create your account'
            )}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md dark:shadow-2xl border dark:border-gray-700" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`input-field pl-10 ${
                    formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                  }`}
                  placeholder="John Doe"
                  {...formik.getFieldProps('name')}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input-field pl-10 ${
                    formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="you@company.com"
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`input-field pl-10 ${
                    formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
                  }`}
                  placeholder="+1 (234) 567-8900"
                  {...formik.getFieldProps('phone')}
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="company"
                  name="company"
                  type="text"
                  className={`input-field pl-10 ${
                    formik.touched.company && formik.errors.company ? 'border-red-500' : ''
                  }`}
                  placeholder="Your Company Inc."
                  {...formik.getFieldProps('company')}
                />
              </div>
              {formik.touched.company && formik.errors.company && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`input-field pl-10 ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                  {...formik.getFieldProps('password')}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`input-field pl-10 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                  {...formik.getFieldProps('confirmPassword')}
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.confirmPassword}</p>
              )}
            </div>

            {/* Admin Code Field - Only visible in admin mode */}
            {isAdminMode && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="flex items-center gap-2">
                    <Shield size={16} className="text-primary-600" />
                    Admin Verification Code
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    className={`input-field pl-10 ${
                      formik.touched.adminCode && formik.errors.adminCode ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter admin verification code"
                    {...formik.getFieldProps('adminCode')}
                  />
                </div>
                {formik.touched.adminCode && formik.errors.adminCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formik.errors.adminCode}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Contact your administrator for the verification code
                </p>
              </div>
            )}
          </div>

          <div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;



