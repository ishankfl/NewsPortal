import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield } from 'react-icons/fi';
import { Formik, Form } from 'formik';
import { loginValidationSchema } from '../../../validation/login-validation';
import { loginUser } from '../../../api/auth';
import FormInput from '../../common/FormInput'; // Adjust path as needed
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    // toast.success('Hello')
    setIsLoading(true);
    try {
      const response = await loginUser(values);
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data;

        // Save token and user info in cookies (secure: true for HTTPS)
        Cookies.set('token', token, { expires: 1 }); // expires in 1 day
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
        toast.success('Login successful!');
        navigate('/admin/users/manage'); // Redirect on successful login
      } else if (response.status === 401) {
        toast.error('Unauthorized: Incorrect email or password.');
      } else if (response.status === 403) {
        toast.error('Forbidden: You don’t have permission.');
      } else if (response.status === 429) {
        toast.error('Too Many Requests: Please slow down.');
      } else if (response.status === 404) {
        toast.error('Not Found: User not found.');
      } else {
        toast.error('Unexpected error occurred.');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error('Unauthorized: Invalid credentials.');
            break;
          case 403:
            toast.error('Forbidden: Access denied.');
            break;
          case 404:
            toast.error('Not Found: User does not exist.');
            break;
          case 429:
            toast.error('Too many requests: Please try later.');
            break;
          case 500:
            toast.error('Server Error: Try again later.');
            break;
          default:
            toast.error(`Error: ${error.response.statusText}`);
        }
      } else {
        toast.error('Network Error or Server is unreachable.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-0 lg:p-4 md:p-4 bg-gray-50">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Login Form */}
        <div className="order-2 lg:order-1 p-6 sm:p-10 md:p-12 flex items-center">
          <div className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your admin account</p>
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  <FormInput
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    icon={FiMail}
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && errors.email ? errors.email : ''}
                    placeholder="Enter your email"
                  />

                  <div className="relative">
                    <FormInput
                      label="Password"
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      icon={FiLock}
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && errors.password ? errors.password : ''}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-600">
                      <input type="checkbox" className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      Remember me
                    </label>
                    <button type="button" className="text-sm text-indigo-600 hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center text-sm text-gray-600">
              Need help?{' '}
              <button className="text-indigo-600 hover:underline">Contact Support</button>
            </div>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between items-center">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">NewsPaila</h1>
              <p className="text-indigo-100">Admin Portal</p>
            </div>

            <div className="space-y-3 text-indigo-100">
              <div className="flex items-center space-x-2">
                <FiUser />
                <span>User Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield />
                <span>Content Control</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Analytics & Reports</span>
              </div>
            </div>
          </div>

          <div className="mt-8 hidden lg:block">
            <svg viewBox="0 0 300 200" className="w-full h-auto max-w-xs">
              <rect x="50" y="40" width="200" height="120" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <rect x="60" y="50" width="180" height="20" rx="4" fill="rgba(255,255,255,0.2)" />
              <rect x="60" y="80" width="80" height="15" rx="2" fill="rgba(255,255,255,0.15)" />
              <rect x="150" y="80" width="80" height="15" rx="2" fill="rgba(255,255,255,0.15)" />
              <rect x="60" y="105" width="170" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
              <rect x="60" y="125" width="120" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
              <circle cx="280" cy="30" r="3" fill="rgba(255,255,255,0.4)" />
              <circle cx="20" cy="180" r="2" fill="rgba(255,255,255,0.3)" />
              <rect x="15" y="50" width="4" height="4" rx="1" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
