import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiUser, FiMail, FiLock, FiUserCheck, FiArrowLeft } from 'react-icons/fi';
import { Formik, Form } from 'formik';

import FormButton from '../../common/FormButton';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import { userValidationSchema } from '../../../validation/user-validation';
import { Role } from '../../common/Role';
import { createUser } from '../../../api/user-services';

const AddUser = () => {
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      setServerError(false);
    },
    onError: (error) => {
      setServerError(''); 
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          setServerError(data.message || 'Validation error occurred');
        } else if (status === 401) {
          setServerError('Unauthorized. Please login.');
        } else if (status === 500) {
          setServerError('Server error occurred. Please try again later.');
        } else {
          setServerError(data.message || 'An error occurred');
        }
        toast.error(data.message || 'Failed to create user');
      } else if (error.request) {
        setServerError('Network error. Please check your internet connection.');
        toast.error('Network error. Please check your internet connection.');
      } else {
        setServerError(error.message || 'An unexpected error occurred');
        toast.error(error.message || 'Failed to create user');
      }
    }
  });

  const initialValues = {
    username: '',
    email: '',
    plainPassword: '',
    role: Role.Writer
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/users/manage')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm"
            >
              <FiArrowLeft className="mr-2" size={16} />
              Back to Users
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
              <p className="text-gray-600 mt-1">Create a new user account with role-based access</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - SVG Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-md">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Background circles */}
                <circle cx="200" cy="150" r="120" fill="#f0f4ff" opacity="0.6"/>
                <circle cx="180" cy="130" r="80" fill="#e0e7ff" opacity="0.4"/>
                
                {/* Main user figure */}
                <circle cx="200" cy="120" r="25" fill="#6366f1"/>
                <rect x="175" y="145" width="50" height="60" rx="25" fill="#6366f1"/>
                
                {/* Additional user figures */}
                <circle cx="140" cy="140" r="15" fill="#a5b4fc" opacity="0.8"/>
                <rect x="125" y="155" width="30" height="35" rx="15" fill="#a5b4fc" opacity="0.8"/>
                
                <circle cx="260" cy="140" r="15" fill="#a5b4fc" opacity="0.8"/>
                <rect x="245" y="155" width="30" height="35" rx="15" fill="#a5b4fc" opacity="0.8"/>
                
                {/* Decorative elements */}
                <rect x="120" y="80" width="8" height="8" rx="2" fill="#6366f1" opacity="0.6"/>
                <rect x="280" y="90" width="6" height="6" rx="1" fill="#8b5cf6" opacity="0.6"/>
                <rect x="100" y="200" width="10" height="10" rx="2" fill="#06b6d4" opacity="0.6"/>
                <rect x="290" y="210" width="8" height="8" rx="2" fill="#10b981" opacity="0.6"/>
                
                {/* Connection lines */}
                <line x1="165" y1="150" x2="185" y2="160" stroke="#6366f1" strokeWidth="2" opacity="0.4"/>
                <line x1="235" y1="160" x2="255" y2="150" stroke="#6366f1" strokeWidth="2" opacity="0.4"/>
                
                {/* Text */}
                <text x="200" y="260" textAnchor="middle" fill="#6366f1" fontSize="16" fontWeight="600">
                  User Management
                </text>
                <text x="200" y="280" textAnchor="middle" fill="#64748b" fontSize="12">
                  Create and manage user accounts
                </text>
              </svg>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Status Messages */}
            {serverError && (
              <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-start">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium">Error occurred</h3>
                  <p className="text-sm mt-1">{serverError}</p>
                </div>
              </div>
            )}

            {!serverError && createUserMutation.isSuccess && (
              <div className="mb-6 p-4 text-green-700 bg-green-50 rounded-lg border border-green-200 flex items-start">
                <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium">Success!</h3>
                  <p className="text-sm mt-1">New user has been created successfully</p>
                </div>
              </div>
            )}

            {/* Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={userValidationSchema}
              onSubmit={(values) => createUserMutation.mutate(values)}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Username"
                      id="username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && errors.username}
                      placeholder="Enter username"
                      icon={FiUser}
                    />

                    <FormInput
                      label="Email Address"
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      placeholder="Enter email address"
                      icon={FiMail}
                    />

                    <FormInput
                      label="Password"
                      id="plainPassword"
                      name="plainPassword"
                      type="password"
                      value={values.plainPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.plainPassword && errors.plainPassword}
                      placeholder="Enter secure password"
                      icon={FiLock}
                    />

                    <FormSelect
                      label="User Role"
                      id="role"
                      name="role"
                      value={parseInt(values.role)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.role && errors.role}
                      options={Object.entries(Role).map(([key, val]) => ({ value: val, label: key }))}
                      icon={FiUserCheck}
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/users/manage')}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <FormButton
                        type="submit"
                        disabled={createUserMutation.isLoading}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSave className="mr-2" size={18} />
                        {createUserMutation.isLoading ? 'Creating User...' : 'Create User'}
                      </FormButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
