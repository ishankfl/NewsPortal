import { FiBold, FiImage, FiItalic, FiList, FiType, FiUnderline , FiLink, FiFolder} from "react-icons/fi";
import { useState, useRef } from "react";
import { ImageGalleryModal } from "./ImageGalleryModal";
export const RichTextEditor = ({ value, onChange, placeholder }) => {
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
