import { div } from "framer-motion/client";
import { FiTag, FiPlus, FiX } from "react-icons/fi";
const SeoKeywords = ({ setKeywordInput, keywordInput, addKeyword, seoKeywords, removeKeyword }) => {
    return (<div>

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
    </div>
    );
};
export default SeoKeywords;