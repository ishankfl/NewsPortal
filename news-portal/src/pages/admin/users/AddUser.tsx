import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FiSave, FiUser, FiMail, FiLock, FiUserCheck } from 'react-icons/fi'
// import { Role } from '../../../types/enums' // Assuming you have this enum defined
// import { createUser } from '../../../services/userService' // Service to call your API
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// Define types based on your C# DTOs
interface CreateUserForm {
  username: string
  email: string
  plainPassword: string
//   role: Role
}

const AddUser = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // Form state
  const [formData, setFormData] = useState<CreateUserForm>({
    username: '',
    email: '',
    plainPassword: '',
    // role: Role.User // Default role
  })
  
  const [errors, setErrors] = useState<Partial<CreateUserForm>>({})

  // Mutation for creating user
  const createUserMutation = useMutation({
    // mutationFn: (userData: CreateUserForm) => createUser(userData),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['users'] })
    //   toast.success('User created successfully!')
    //   navigate('/users/manage')
    // },
    // onError: (error: any) => {
    //   toast.error(error.message || 'Failed to create user')
    // }
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when field is edited
    if (errors[name as keyof CreateUserForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserForm> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.plainPassword) {
      newErrors.plainPassword = 'Password is required'
    } else if (formData.plainPassword.length < 6) {
      newErrors.plainPassword = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      createUserMutation.mutate(formData)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New User</h1>
        <button
          onClick={() => navigate('/users/manage')}
          className="px-4 py-2 text-sm text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Back to Users
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter username"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="plainPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="plainPassword"
                  name="plainPassword"
                  value={formData.plainPassword}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-md border ${errors.plainPassword ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter password"
                />
              </div>
              {errors.plainPassword && (
                <p className="text-sm text-red-500">{errors.plainPassword}</p>
              )}
            </div>
            
            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiUserCheck className="text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={Role.Admin}>Admin</option>
                  <option value={Role.Editor}>Editor</option>
                  <option value={Role.User}>User</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              {createUserMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser