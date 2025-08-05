import { FiCheck, FiFolder, FiImage, FiUpload, FiX,  } from "react-icons/fi";
import { uploadImage, getAllImages } from '../../../api/images-service';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
export
const ImageGalleryModal = ({ isOpen, onClose, onSelectImage }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [newImageName, setNewImageName] = useState('');
    // const queryClient = useQueryClient();

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