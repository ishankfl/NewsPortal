import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiUser, FiMail, FiLock, FiUserCheck } from 'react-icons/fi';
import { Formik, Form } from 'formik';

import FormButton from '../../common/FormButton';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import { userValidationSchema } from '../../../validation/user-validation';
import { Role } from '../../common/Role';
import { createUser } from '../../../api/user-services';

const AddUser = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      setServerError(false);
      // navigate('/admin/users/manage');
    },
    onError: (error) => {
      setServerError(''); 
      if (error.response) {
        // Backend error response
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
        // Network error (no response)
        setServerError('Network error. Please check your internet connection.');
        toast.error('Network error. Please check your internet connection.');
      } else {
        // Other errors
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-800">➕ Add New User</h1>
          <button
            onClick={() => navigate('/admin/users/manage')}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 transition"
          >
            Back to Users
          </button>
        </div>

        {/* Display server/network error */}
        {serverError && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded border border-red-400">
            {serverError}
          </div>
        )}
            {!serverError && (
          <div className="mb-6 p-4 text-green-700 bg-green-100 rounded border border-green-400">
            Successfully new user added
          </div>
        )}

        {/* Formik form */}
        <Formik
          initialValues={initialValues}
          validationSchema={userValidationSchema}
          onSubmit={(values) => createUserMutation.mutate(values)}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
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
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  placeholder="Enter email"
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
                  placeholder="Enter password"
                  icon={FiLock}
                />

                <FormSelect
                  label="Role"
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

              <div className="mt-10 flex justify-end">
                <FormButton
                  type="submit"
                  disabled={createUserMutation.isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center transition"
                >
                  <FiSave className="mr-2" />
                  {createUserMutation.isLoading ? 'Saving...' : 'Save User'}
                </FormButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUser;
