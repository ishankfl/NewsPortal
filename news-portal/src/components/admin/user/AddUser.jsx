import React from 'react';
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

// Example createUser function - replace with actual service
const createUser = async (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(userData), 1000);
    });
};

const AddUser = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // const createUserMutation = useMutation(createUser, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['users']);
    //         toast.success('User created successfully!');
    //         navigate('/users/manage');
    //     },
    //     onError: (error) => {
    //         toast.error(error.message || 'Failed to create user');
    //     }
    // });

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
                        onClick={() => navigate('/users/manage')}
                        className="px-5 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 transition"
                    >
                        Back to Users
                    </button>
                </div>

                {/* Form */}
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
                                    // type="email"
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
                                    value={values.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.role && errors.role}
                                    options={Object.values(Role).map((r) => ({ value: r, label: r }))}
                                    icon={FiUserCheck}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-10 flex justify-end">
                                <FormButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center transition">
                                    <FiSave className="mr-2" />
                                    Save User
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
