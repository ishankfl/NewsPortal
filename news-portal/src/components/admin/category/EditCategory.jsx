import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiTag, FiGlobe, FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormButton from '../../common/FormButton';
import FormInput from '../../common/FormInput';
import { getCategoryById, updateCategory } from '../../../api/category-services';

const EditCategory = () => {
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const validationSchema = Yup.object({
    name_En: Yup.string().required('English name is required'),
    name_Np: Yup.string().required('Nepali name is required'),
    slug: Yup.string().required('Slug is required')
  });

  // Fetch category data
  const { data: category, isLoading: isLoadingCategory, isError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    onError: (error) => {
      console.error('Failed to load category:', error);
      toast.error('Failed to load category data');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      toast.success('Category updated successfully!');
      setServerError(false);
      navigate('/admin/categories/manage');
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        const data = error.response.data;
        setServerError(data.message || 'Failed to update category');
        toast.error(data.message || 'Failed to update category');
      } else if (error.request) {
        setServerError('Network error. Please check your internet connection.');
        toast.error('Network error. Please check your internet connection.');
      } else {
        setServerError(error.message || 'An unexpected error occurred');
        toast.error(error.message || 'Failed to update category');
      }
    }
  });

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const initialValues = {
    name_En: category?.name_En || '',
    name_Np: category?.name_Np || '',
    slug: category?.slug || ''
  };

  if (isLoadingCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
              <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/admin/categories/manage')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col items-start gap-8 space-x-4">
            <button
              onClick={() => navigate('/admin/categories/manage')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm"
            >
              <FiArrowLeft className="mr-2" size={16} />
              Back to Categories
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
              <p className="text-gray-600 mt-1">Update category information</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <FiEdit3 className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Category Information</h2>
          </div>

          {serverError && (
            <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-start">
              <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium">Error!</h3>
                <p className="text-sm mt-1">{serverError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={(values) => updateCategoryMutation.mutate({ id, ...values })}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Category Name (English)"
                    id="name_En"
                    name="name_En"
                    value={values.name_En}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue('slug', generateSlug(e.target.value));
                    }}
                    onBlur={handleBlur}
                    error={touched.name_En && errors.name_En}
                    placeholder="Enter category name in English"
                    icon={FiGlobe}
                  />

                  <FormInput
                    label="Category Name (नेपाली)"
                    id="name_Np"
                    name="name_Np"
                    value={values.name_Np}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name_Np && errors.name_Np}
                    placeholder="नेपालीमा श्रेणी नाम लेख्नुहोस्"
                    icon={FiGlobe}
                  />
                </div>

                <FormInput
                  label="URL Slug"
                  id="slug"
                  name="slug"
                  value={values.slug}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.slug && errors.slug}
                  placeholder="category-url-slug"
                  helperText="This will be used in the category URL"
                  icon={FiTag}
                />

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/categories/manage')}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <FormButton
                      type="submit"
                      disabled={updateCategoryMutation.isLoading}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiEdit3 className="mr-2" size={18} />
                      {updateCategoryMutation.isLoading ? 'Updating...' : 'Update Category'}
                    </FormButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;