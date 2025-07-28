import { useState } from 'react'

interface NewsItem {
  id: number
  title: string
  category: string
  date: string
  status: 'published' | 'draft' | 'archived'
}

const ManageNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    { id: 1, title: 'Latest Tech Trends', category: 'Technology', date: '2023-05-15', status: 'published' },
    { id: 2, title: 'Global Market Update', category: 'Business', date: '2023-05-14', status: 'published' },
    { id: 3, title: 'Health and Wellness Tips', category: 'Health', date: '2023-05-13', status: 'draft' },
    { id: 4, title: 'Sports Highlights', category: 'Sports', date: '2023-05-12', status: 'published' },
  ])

  const handleDelete = (id: number) => {
    setNewsItems(newsItems.filter(item => item.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage News</h1>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.status === 'published' ? 'bg-green-100 text-green-800' : 
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageNews