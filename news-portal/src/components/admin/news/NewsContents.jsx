import { FiFileText } from "react-icons/fi";
import { RichTextEditor } from "./RichTextEditor";

export const NewsContenxt = (
    { activeLanguage, values, errors, touched, setFieldValue }
) => {
    return (<div>
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
                        value={values.content}
                        onChange={(content) => {
                            console.log('📝 RichTextEditor onChange called with:', content);
                            setFieldValue('content', content);
                        }}
                        placeholder={`Write your article content in ${activeLanguage === 'en' ? 'English' : 'Nepali'}...`}
                    />
                    {touched[`content_${activeLanguage}`] && errors[`content_${activeLanguage}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`content_${activeLanguage}`]}</p>
                    )}
                </div>
            </div>
        </div>
    </div>)
}
