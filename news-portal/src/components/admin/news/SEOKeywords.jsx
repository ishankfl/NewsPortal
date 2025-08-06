import { FiTag, FiPlus, FiX, FiSearch, FiMessageCircle } from "react-icons/fi";

const SeoKeywords = ({ 
    setKeywordInput, 
    keywordInput, 
    addKeyword, 
    seoKeywords, 
    removeKeyword,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    allowComments,
    setAllowComments
}) => {
    return (
        <div>
            {/* SEO & Search Snippet */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                    <FiSearch className="w-6 h-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">SEO & Search Snippet</h2>
                </div>

                <div className="space-y-6">
                    {/* SEO Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Title
                            <span className="text-xs text-gray-500 ml-2">
                                ({seoTitle?.length || 0}/70 characters)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={seoTitle || ''}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="Enter SEO title (roughly 70 characters)"
                            maxLength={70}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Comes in at roughly 70 characters including spaces.
                        </p>
                    </div>

                    {/* SEO Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Description
                            <span className="text-xs text-gray-500 ml-2">
                                ({seoDescription?.length || 0}/160 characters)
                            </span>
                        </label>
                        <textarea
                            value={seoDescription || ''}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            placeholder="Enter SEO description (140-160 characters)"
                            maxLength={160}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Between 140 & 160 characters, including spaces.
                        </p>
                    </div>

                    {/* SEO Keywords */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Keywords
                        </label>
                        <div className="flex space-x-2 mb-3">
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
                        <p className="text-xs text-gray-500 mt-1">
                            Comes with related tags.
                        </p>
                    </div>
                </div>
            </div>

            {/* News Options */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-8">
                <div className="flex items-center mb-6">
                    <FiMessageCircle className="w-6 h-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">News Options</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="allowComments"
                            checked={allowComments}
                            onChange={(e) => setAllowComments(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-900">
                            Allow comments on this post
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeoKeywords;
