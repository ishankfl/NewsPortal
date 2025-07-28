import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiHome, 
  FiFileText, 
  FiImage, 
  FiDollarSign, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiChevronDown, 
  FiChevronRight 
} from 'react-icons/fi'

const AdminLayout = () => {
  const [isNewsOpen, setIsNewsOpen] = useState<boolean>(false)
  const [isAdvertiseOpen, setIsAdvertiseOpen] = useState<boolean>(false)
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white shadow-lg">
        <div className="p-4 border-b border-indigo-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 rounded hover:bg-indigo-700">
                <FiHome className="mr-3" />
                Dashboard
              </Link>
            </li>
            
            {/* News Dropdown */}
            <li>
              <button 
                onClick={() => setIsNewsOpen(!isNewsOpen)}
                className="flex items-center justify-between w-full p-2 rounded hover:bg-indigo-700"
              >
                <div className="flex items-center">
                  <FiFileText className="mr-3" />
                  News
                </div>
                {isNewsOpen ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              <AnimatePresence>
                {isNewsOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                  >
                    <li>
                      <Link to="/news/manage" className="block p-2 rounded hover:bg-indigo-700">
                        Manage News
                      </Link>
                    </li>
                    <li>
                      <Link to="/news/add" className="block p-2 rounded hover:bg-indigo-700">
                        Add New News
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            
            <li>
              <Link to="/media/manage" className="flex items-center p-2 rounded hover:bg-indigo-700">
                <FiImage className="mr-3" />
                Manage Media
              </Link>
            </li>
            
            {/* Advertise Dropdown */}
            <li>
              <button 
                onClick={() => setIsAdvertiseOpen(!isAdvertiseOpen)}
                className="flex items-center justify-between w-full p-2 rounded hover:bg-indigo-700"
              >
                <div className="flex items-center">
                  <FiDollarSign className="mr-3" />
                  Advertises
                </div>
                {isAdvertiseOpen ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              <AnimatePresence>
                {isAdvertiseOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                  >
                    <li>
                      <Link to="/advertises/manage" className="block p-2 rounded hover:bg-indigo-700">
                        Manage Advertises
                      </Link>
                    </li>
                    <li>
                      <Link to="/advertises/add" className="block p-2 rounded hover:bg-indigo-700">
                        Add New Advertise
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            
            <li>
              <Link to="/banner" className="flex items-center p-2 rounded hover:bg-indigo-700">
                <FiImage className="mr-3" />
                Banner News
              </Link>
            </li>
            
            {/* User Dropdown */}
            <li>
              <button 
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="flex items-center justify-between w-full p-2 rounded hover:bg-indigo-700"
              >
                <div className="flex items-center">
                  <FiUsers className="mr-3" />
                  Users
                </div>
                {isUserOpen ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              <AnimatePresence>
                {isUserOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                  >
                    <li>
                      <Link to="/users/manage" className="block p-2 rounded hover:bg-indigo-700">
                        Manage Users
                      </Link>
                    </li>
                    <li>
                      <Link to="/users/add" className="block p-2 rounded hover:bg-indigo-700">
                        Add New User
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="block p-2 rounded hover:bg-indigo-700">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/reset-password" className="block p-2 rounded hover:bg-indigo-700">
                        Reset Password
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            
            <li>
              <Link to="/logout" className="flex items-center p-2 rounded hover:bg-indigo-700">
                <FiLogOut className="mr-3" />
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <FiSettings className="text-gray-600" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="ml-2 text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout