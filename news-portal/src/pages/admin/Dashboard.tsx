import { FiFileText, FiImage, FiUsers, FiFilm } from 'react-icons/fi'

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FiFileText size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500">News</h3>
              <p className="text-2xl font-bold">481</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiImage size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500">Medias</h3>
              <p className="text-2xl font-bold">807</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiFilm size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500">Videos</h3>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiUsers size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500">Users</h3>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">News Reports</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Chart or statistics would go here
        </div>
      </div>
    </div>
  )
}

export default Dashboard