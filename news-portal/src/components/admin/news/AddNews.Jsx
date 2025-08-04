import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { imgServer, server } from '../../../api/server';
import {
    FiSave,
    FiArrowLeft,
    FiFileText,
    FiUser,
    FiTag,
    FiImage,
    FiGlobe,
    FiEye,
    FiUpload,
    FiX,
    FiPlus,
    FiBold,
    FiItalic,
    FiUnderline,
    FiList,
    FiLink,
    FiType,
    FiFolder,
    FiCheck
} from 'react-icons/fi';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import FormButton from '../../common/FormButton';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import { uploadImage, getAllImages } from '../../../api/images-service';

const ImageGalleryModal = ({ isOpen, onClose, onSelectImage }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [newImageName, setNewImageName] = useState('');
    const queryClient = useQueryClient();

    const { data: images = [], isLoading, refetch } = useQuery({
        queryKey: ['images'],
        queryFn: getAllImages,
        enabled: isOpen
    });

    const uploadImageMutation = useMutation({
        mutationFn: ({ file, name }) => uploadImage(file, name),
        onSuccess: () => {
            toast.success('Image uploaded successfully!');
            setUploadingImage(false);
            setNewImageName('');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to upload image');
            setUploadingImage(false);
        }
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!newImageName.trim()) {
            toast.error('Please enter an image name');
            return;
        }

        setUploadingImage(true);
        uploadImageMutation.mutate({ file, name: newImageName.trim() });
    };

    const handleSelectImage = () => {
        if (selectedImage) {
            onSelectImage(selectedImage);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-5/6 h-5/6 max-w-6xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FiFolder className="mr-3" />
                        Image Gallery
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Upload Section */}
                <div className="p-6 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
                    <div className="flex space-x-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image Name
                            </label>
                            <input
                                type="text"
                                value={newImageName}
                                onChange={(e) => setNewImageName(e.target.value)}
                                placeholder="Enter image name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="galleryImageUpload"
                                disabled={uploadingImage}
                            />
                            <label
                                htmlFor="galleryImageUpload"
                                className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                    uploadingImage
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white`}
                            >
                                <FiUpload className="w-4 h-4 mr-2" />
                                {uploadingImage ? 'Uploading...' : 'Upload'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500">Loading images...</div>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No images found</p>
                                <p className="text-sm text-gray-400">Upload your first image above</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImage?.id === image.id
                                            ? 'border-indigo-500 ring-2 ring-indigo-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <div className="aspect-square">
                                        <img
                                            src={image.url || `${imgServer}${image.imageUrl}`}
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {selectedImage?.id === image.id && (
                                        <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                                            <FiCheck size={16} />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                                        <p className="text-sm truncate">{image.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {selectedImage ? `Selected: ${selectedImage.name}` : 'Select an image to continue'}
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSelectImage}
                            disabled={!selectedImage}
                            className={`px-6 py-2 rounded-lg transition-colors ${
                                selectedImage
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Select Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus();
    };

    const insertImage = () => {
        if (imageUrl) {
            formatText('insertImage', imageUrl);
            setImageUrl('');
            setShowImageModal(false);
        }
    };

    const handleGalleryImageSelect = (image) => {
        const imageUrl = image.url || `/api/images/${image.id}`;
        formatText('insertImage', imageUrl);
        setShowGalleryModal(false);
    };

    const handleInput = () => {
        const content = editorRef.current.innerHTML;
        onChange(content);
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <select
                    onChange={(e) => formatText('formatBlock', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    defaultValue=""
                >
                    <option value="">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                </select>

                <div className="border-l border-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Bold"
                >
                    <FiBold size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Italic"
                >
                    <FiItalic size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => formatText('underline')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Underline"
                >
                    <FiUnderline size={16} />
                </button>

                <div className="border-l border-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Bullet List"
                >
                    <FiList size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => formatText('insertOrderedList')}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Numbered List"
                >
                    <FiType size={16} />
                </button>

                <div className="border-l border-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Enter link URL:');
                        if (url) formatText('createLink', url);
                    }}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Insert Link"
                >
                    <FiLink size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => setShowGalleryModal(true)}
                    className="p-2 hover:bg-gray-200 rounded bg-indigo-50 text-indigo-600"
                    title="Insert Image from Gallery"
                >
                    <FiFolder size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Insert Image URL"
                >
                    <FiImage size={16} />
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[400px] p-4 focus:outline-none"
                style={{ minHeight: '400px' }}
                dangerouslySetInnerHTML={{ __html: value }}
                placeholder={placeholder}
            />

            {/* Image URL Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Insert Image URL</h3>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowImageModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={insertImage}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Gallery Modal */}
            <ImageGalleryModal
                isOpen={showGalleryModal}
                onClose={() => setShowGalleryModal(false)}
                onSelectImage={handleGalleryImageSelect}
            />
        </div>
    );
};

const AddNews = () => {
    const [serverError, setServerError] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('en');
    const [seoKeywords, setSeoKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [showCoverGallery, setShowCoverGallery] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch categories and authors
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetch('/api/categories').then(res => res.json())
    });

    const { data: authors = [] } = useQuery({
        queryKey: ['authors'],
        queryFn: () => fetch('/api/users?role=author').then(res => res.json())
    });

    const validationSchema = Yup.object({
        title_en: Yup.string().required('English title is required'),
        title_np: Yup.string().required('Nepali title is required'),
        slug: Yup.string().required('Slug is required'),
        content_en: Yup.string().required('English content is required'),
        content_np: Yup.string().required('Nepali content is required'),
        categoryId: Yup.number().required('Category is required'),
        authorId: Yup.number().required('Author is required'),
        publishedAt: Yup.date().required('Publish date is required')
    });

    const createNewsMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await fetch('/api/articles', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to create article');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article created successfully!');
            navigate('/admin/news/manage');
        },
        onError: (error) => {
            setServerError(error.message);
            toast.error(error.message || 'Failed to create article');
        }
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setCoverImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCoverImageSelect = (image) => {
        const imageUrl = image.url || `${imgServer}${image.imageUrl}`;
        setCoverImagePreview(imageUrl);
        setCoverImage(imageUrl); // Store URL instead of file for gallery images
        setShowCoverGallery(false);
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim())) {
            setSeoKeywords([...seoKeywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword) => {
        setSeoKeywords(seoKeywords.filter(k => k !== keyword));
    };

    const initialValues = {
        title_en: '',
        title_np: '',
        slug: '',
        content_en: '',
        content_np: '',
        categoryId: '',
        authorId: '',
        publishedAt: new Date().toISOString().slice(0, 16)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate('/admin/news/manage')}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm"
                        >
                            <FiArrowLeft className="mr-2" size={16} />
                            Back to News
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiFileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Add New Article</h1>
                                    <p className="text-gray-600 mt-1">Create and publish a new news article with rich content</p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="text-sm font-medium text-orange-600">Draft</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <FiFileText className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        const formData = new FormData();
                        Object.keys(values).forEach(key => {
                            formData.append(key, values[key]);
                        });
                        if (coverImage) {
                            if (typeof coverImage === 'string') {
                                // Gallery image URL
                                formData.append('coverImageUrl', coverImage);
                            } else {
                                // Uploaded file
                                formData.append('coverImage', coverImage);
                            }
                        }
                        formData.append('seoKeywords', JSON.stringify(seoKeywords));
                        createNewsMutation.mutate(formData);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                        <Form className="space-y-8">
                            {/* Basic Information */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiFileText className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Language Toggle */}
                                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                                        <button
                                            type="button"
                                            onClick={() => setActiveLanguage('en')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeLanguage === 'en'
                                                    ? 'bg-white text-indigo-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            <FiGlobe className="w-4 h-4 inline mr-1" />
                                            English
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveLanguage('np')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeLanguage === 'np'
                                                    ? 'bg-white text-indigo-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            नेपाली
                                        </button>
                                    </div>

                                    {/* Title Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput
                                            label="Title (English)"
                                            id="title_en"
                                            name="title_en"
                                            value={values.title_en}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (!values.slug) {
                                                    setFieldValue('slug', generateSlug(e.target.value));
                                                }
                                            }}
                                            onBlur={handleBlur}
                                            error={touched.title_en && errors.title_en}
                                            placeholder="Enter article title in English"
                                            className={activeLanguage === 'en' ? 'ring-2 ring-indigo-200' : ''}
                                        />

                                        <FormInput
                                            label="Title (नेपाली)"
                                            id="title_np"
                                            name="title_np"
                                            value={values.title_np}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.title_np && errors.title_np}
                                            placeholder="नेपालीमा शीर्षक लेख्नुहोस्"
                                            className={activeLanguage === 'np' ? 'ring-2 ring-indigo-200' : ''}
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
                                        placeholder="article-url-slug"
                                        helperText="This will be used in the article URL"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormSelect
                                            label="Category"
                                            id="categoryId"
                                            name="categoryId"
                                            value={values.categoryId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.categoryId && errors.categoryId}
                                            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                            icon={FiTag}
                                        />

                                        <FormSelect
                                            label="Author"
                                            id="authorId"
                                            name="authorId"
                                            value={values.authorId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.authorId && errors.authorId}
                                            options={authors.map(author => ({ value: author.id, label: author.username }))}
                                            icon={FiUser}
                                        />

                                        <FormInput
                                            label="Publish Date"
                                            id="publishedAt"
                                            name="publishedAt"
                                            type="datetime-local"
                                            value={values.publishedAt}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.publishedAt && errors.publishedAt}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiImage className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Cover Image</h2>
                                </div>

                                <div className="space-y-4">
                                    {coverImagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={coverImagePreview}
                                                alt="Cover preview"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCoverImage(null);
                                                    setCoverImagePreview(null);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                                            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Upload cover image</p>
                                            <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB</p>
                                            <div className="flex justify-center space-x-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="coverImage"
                                                />
                                                <label
                                                    htmlFor="coverImage"
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                                                >
                                                    <FiUpload className="w-4 h-4 mr-2" />
                                                    Upload New
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCoverGallery(true)}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <FiFolder className="w-4 h-4 mr-2" />
                                                    Choose from Gallery
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiFileText className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">Article Content</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Content ({activeLanguage === 'en' ? 'English' : 'नेपाली'})
                                        </label>
                                        <RichTextEditor
                                            value={activeLanguage === 'en' ? values.content_en : values.content_np}
                                            onChange={(content) => {
                                                setFieldValue(activeLanguage === 'en' ? 'content_en' : 'content_np', content);
                                            }}
                                            placeholder={`Write your article content in ${activeLanguage === 'en' ? 'English' : 'Nepali'}...`}
                                        />
                                        {touched[`content_${activeLanguage}`] && errors[`content_${activeLanguage}`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`content_${activeLanguage}`]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SEO Keywords */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center mb-6">
                                    <FiTag className="w-6 h-6 text-indigo-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">SEO Keywords</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                            placeholder="Add SEO keyword"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addKeyword}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            <FiPlus size={16} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {seoKeywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                            >
                                                {keyword}
                                                <button
                                                    type="button"
                                                    onClick={() => removeKeyword(keyword)}
                                                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FiEye className="w-4 h-4 mr-2" />
                                            Preview
                                        </button>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/admin/news/manage')}
                                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <FormButton
                                            type="submit"
                                            disabled={createNewsMutation.isLoading}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center transition-colors"
                                        >
                                            <FiSave className="mr-2" size={18} />
                                            {createNewsMutation.isLoading ? 'Publishing...' : 'Publish Article'}
                                        </FormButton>
                                    </div>
                                </div>
                            </div>

                            {serverError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-600">{serverError}</p>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                {/* Cover Image Gallery Modal */}
                <ImageGalleryModal
                    isOpen={showCoverGallery}
                    onClose={() => setShowCoverGallery(false)}
                    onSelectImage={handleCoverImageSelect}
                />
            </div>
        </div>
    );
};

export default AddNews;
