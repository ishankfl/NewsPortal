import { 
  FiBold, 
  FiImage, 
  FiItalic, 
  FiList, 
  FiType, 
  FiUnderline, 
  FiLink, 
  FiFolder, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight, 
  FiAlignJustify, 
  FiMaximize2, 
  FiMinimize2 
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import { ImageGalleryModal } from "./ImageGalleryModal";
import { imgServer } from "../../../api/server";

export const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState("medium");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: null,
    fontSize: null,
    list: null,
    heading: null
  });

  // Save and restore cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const restoreCursorPosition = (range) => {
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Handle placeholder and initial content
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentContent = editor.innerHTML;
    const placeholderContent = `<div class="text-gray-400">${placeholder}</div>`;
    const sanitizedValue = value ? DOMPurify.sanitize(value) : "";

    if (!value && !currentContent && placeholder) {
      editor.innerHTML = placeholderContent;
    } else if (sanitizedValue && currentContent !== sanitizedValue) {
      const cursorRange = saveCursorPosition();
      editor.innerHTML = sanitizedValue;
      restoreCursorPosition(cursorRange);
    }
  }, [value, placeholder]);

  // Track selection changes and update formatting state
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const checkFormatting = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;

      // Check text formatting
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      
      // Check alignment
      let align = null;
      const textAlign = parentElement.style.textAlign || window.getComputedStyle(parentElement).textAlign;
      if (textAlign === 'left') align = 'left';
      else if (textAlign === 'center') align = 'center';
      else if (textAlign === 'right') align = 'right';
      else if (textAlign === 'justify') align = 'justify';

      // Check list type
      let list = null;
      if (parentElement.closest('ul')) list = 'ul';
      else if (parentElement.closest('ol')) list = 'ol';

      // Check heading
      let heading = null;
      const headingTag = parentElement.closest('h1, h2, h3, h4, h5, h6');
      if (headingTag) heading = headingTag.tagName.toLowerCase();

      setCurrentFormat(prev => ({
        ...prev,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        align,
        list,
        heading
      }));
    };

    const handleSelectionChange = () => {
      requestAnimationFrame(checkFormatting);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    editor.addEventListener('input', checkFormatting);
    editor.addEventListener('click', checkFormatting);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      editor.removeEventListener('input', checkFormatting);
      editor.removeEventListener('click', checkFormatting);
    };
  }, []);

  // Add click handler for images
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleClick = (e) => {
      if (e.target.tagName === 'IMG') {
        setSelectedImage(e.target);
        // Check if image has size class to set current size
        const sizeClasses = ['max-w-xs', 'max-w-md', 'max-w-2xl', 'w-full'];
        const currentSize = sizeClasses.find(size => e.target.classList.contains(size));
        if (currentSize) {
          if (currentSize === 'max-w-xs') setImageSize('small');
          else if (currentSize === 'max-w-md') setImageSize('medium');
          else if (currentSize === 'max-w-2xl') setImageSize('large');
          else if (currentSize === 'w-full') setImageSize('full');
        }
      } else {
        setSelectedImage(null);
      }
    };

    editor.addEventListener('click', handleClick);
    return () => {
      editor.removeEventListener('click', handleClick);
    };
  }, []);

  const formatText = (command, value = null) => {
    const cursorRange = saveCursorPosition();
    document.execCommand(command, false, value);
    editorRef.current.focus();
    restoreCursorPosition(cursorRange);
    handleInput();
  };

  const setAlignment = (align) => {
    formatText("justify" + align.charAt(0).toUpperCase() + align.slice(1));
  };

  const setFontSize = (size) => {
    const cursorRange = saveCursorPosition();
    document.execCommand("fontSize", false, "7");
    const fontElements = editorRef.current.getElementsByTagName("font");
    if (fontElements.length > 0) {
      const fontElement = fontElements[fontElements.length - 1];
      const span = document.createElement("span");
      span.style.fontSize = size;
      while (fontElement.firstChild) {
        span.appendChild(fontElement.firstChild);
      }
      fontElement.parentNode.replaceChild(span, fontElement);
    }
    restoreCursorPosition(cursorRange);
    handleInput();
  };

  const setHeading = (heading) => {
    formatText("formatBlock", heading || "<div>");
  };

  const getSizeClass = (size) => {
    switch (size) {
      case "small": return "max-w-xs";
      case "medium": return "max-w-md";
      case "large": return "max-w-2xl";
      case "full": return "w-full";
      default: return "max-w-md";
    }
  };

  const updateImageSize = (size) => {
    if (selectedImage) {
      const sizeClass = getSizeClass(size);
      selectedImage.className = `${sizeClass} h-auto mx-auto my-2`;
      setImageSize(size);
      handleInput();
    }
  };

  const insertImage = () => {
    if (imageUrl && /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)$/i.test(imageUrl)) {
      const cursorRange = saveCursorPosition();
      const sizeClass = getSizeClass(imageSize);
      
      const img = document.createElement("img");
      img.src = imageUrl;
      img.className = `${sizeClass} h-auto mx-auto my-2`;
      img.alt = "Inserted image";
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
      }
      
      editorRef.current.focus();
      setImageUrl("");
      setShowImageModal(false);
      restoreCursorPosition(cursorRange);
      handleInput();
    } else {
      alert("Please enter a valid image URL (e.g., ending with .png, .jpg, .jpeg, .gif, .svg, or .webp)");
    }
  };

  const handleGalleryImageSelect = (image) => {
    const imageUrl = image.url || `${imgServer}${image.imageUrl}`;
    const cursorRange = saveCursorPosition();
    const sizeClass = getSizeClass(imageSize);
    
    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = `${sizeClass} h-auto mx-auto my-2`;
    img.alt = "Gallery image";
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
    }
    
    setShowGalleryModal(false);
    restoreCursorPosition(cursorRange);
    handleInput();
  };

  const handleInput = () => {
    const content = editorRef.current.innerHTML;
    const placeholderContent = `<div class="text-gray-400">${placeholder}</div>`;
    if (content === placeholderContent) {
      onChange("");
    } else {
      onChange(DOMPurify.sanitize(content));
    }
  };

  const handleFocus = () => {
    const placeholderContent = `<div class="text-gray-400">${placeholder}</div>`;
    if (editorRef.current.innerHTML === placeholderContent) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleBlur = () => {
    if (!editorRef.current.innerHTML && placeholder) {
      editorRef.current.innerHTML = `<div class="text-gray-400">${placeholder}</div>`;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden font-sans relative">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        {/* Headings */}
        <select
          onChange={(e) => setHeading(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={currentFormat.heading || ""}
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <select
          onChange={(e) => setFontSize(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Font Size</option>
          <option value="12px">Small</option>
          <option value="16px">Medium</option>
          <option value="20px">Large</option>
          <option value="24px">Extra Large</option>
        </select>

        <div className="border-l border-gray-300 mx-1 h-6"></div>

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => formatText("bold")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.bold ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Bold"
        >
          <FiBold size={16} />
        </button>

        <button
          type="button"
          onClick={() => formatText("italic")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.italic ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Italic"
        >
          <FiItalic size={16} />
        </button>

        <button
          type="button"
          onClick={() => formatText("underline")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.underline ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Underline"
        >
          <FiUnderline size={16} />
        </button>

        <div className="border-l border-gray-300 mx-1 h-6"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => setAlignment("left")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.align === 'left' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Align Left"
        >
          <FiAlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => setAlignment("center")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.align === 'center' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Align Center"
        >
          <FiAlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={() => setAlignment("right")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.align === 'right' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Align Right"
        >
          <FiAlignRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => setAlignment("justify")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.align === 'justify' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Justify"
        >
          <FiAlignJustify size={16} />
        </button>

        <div className="border-l border-gray-300 mx-1 h-6"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => formatText("insertUnorderedList")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.list === 'ul' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Bullet List"
        >
          <FiList size={16} />
        </button>

        <button
          type="button"
          onClick={() => formatText("insertOrderedList")}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            currentFormat.list === 'ol' ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Numbered List"
        >
          <FiType size={16} />
        </button>

        <div className="border-l border-gray-300 mx-1 h-6"></div>

        {/* Links and Images */}
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter link URL:");
            if (url && /^https?:\/\/.*/.test(url)) {
              formatText("createLink", url);
            } else if (url) {
              alert("Please enter a valid URL starting with http:// or https://");
            }
          }}
          className="p-2 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Insert Link"
        >
          <FiLink size={16} />
        </button>

        <button
          type="button"
          onClick={() => setShowGalleryModal(true)}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            showGalleryModal ? "bg-indigo-100 text-indigo-600" : "hover:bg-indigo-100 bg-indigo-50 text-indigo-600"
          }`}
          title="Insert Image from Gallery"
        >
          <FiFolder size={16} />
        </button>

        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            showImageModal ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-200"
          }`}
          title="Insert Image URL"
        >
          <FiImage size={16} />
        </button>
      </div>

      {/* Image resize toolbar (shown when an image is selected) */}
      {selectedImage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 flex gap-2 z-10">
          {["small", "medium", "large", "full"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateImageSize(size)}
              className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                imageSize === size
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={`Set image to ${size} size`}
            >
              {size === "small" && <FiMinimize2 size={14} />}
              {size === "medium" && <span className="text-xs">M</span>}
              {size === "large" && <span className="text-sm">L</span>}
              {size === "full" && <FiMaximize2 size={14} />}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 prose max-w-none"
        style={{ minHeight: "400px" }}
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
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
              <div className="flex gap-2">
                {["small", "medium", "large", "full"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`px-3 py-1 text-sm rounded ${
                      imageSize === size
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
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
        imageSize={imageSize}
        setImageSize={setImageSize}
      />
    </div>
  );
};