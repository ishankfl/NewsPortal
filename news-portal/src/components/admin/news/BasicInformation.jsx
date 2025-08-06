import { FiFileText, FiGlobe, FiTag, FiUser } from "react-icons/fi";
import FormInput from "../../common/FormInput";
import FormSelect from "../../common/FormSelect";

export const BasicInformation = (
    {
        activeLanguage,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        categories,
        authors,
        generateSlug,
        setActiveLanguage,
        selectedCategories,
        setSelectedCategories
    }
) => {
    const handleCategoryChange = (categoryId) => {
        const updatedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        
        setSelectedCategories(updatedCategories);
        setFieldValue('categoryIds', updatedCategories);
    };

    return (
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
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'en'
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
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeLanguage === 'np'
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categories Checkboxes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            <FiTag className="w-4 h-4 inline mr-1" />
                            {activeLanguage === 'en' ? 'Categories' : 'श्रेणीहरू'}
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`category-${category.id}`}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={`category-${category.id}`}
                                        className="ml-2 text-sm text-gray-900 cursor-pointer"
                                    >
                                        {activeLanguage === 'en' 
                                            ? (category.name_En || category.name) 
                                            : (category.name_Np || category.name_En || category.name)
                                        }
                                    </label>
                                </div>
                            ))}
                        </div>
                        {selectedCategories.length === 0 && touched.categoryIds && errors.categoryIds && (
                            <p className="mt-1 text-sm text-red-600">{errors.categoryIds}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {activeLanguage === 'en' 
                                ? 'Select one or more categories for this article'
                                : 'यस लेखको लागि एक वा बढी श्रेणीहरू चयन गर्नुहोस्'
                            }
                        </p>
                    </div>

                    <div className="space-y-6">
                        <FormSelect
                            label={activeLanguage === 'en' ? 'Author' : 'लेखक'}
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
                            label={activeLanguage === 'en' ? 'Publish Date' : 'प्रकाशन मिति'}
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
        </div>
    );
};
