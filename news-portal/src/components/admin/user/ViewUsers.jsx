import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiUserX, FiRefreshCw, FiAlertTriangle, FiX } from 'react-icons/fi';
import { getUsers, deleteUser, updateUserStatus } from '../../../api/user-services';
import { Role } from '../../common/Role';
import './ViewUsers.module.css';
import SearchBox from '../../common/SearchBox';
import { SkeletonRow } from '../../common/SkeletonRow';

const ViewUsers = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const pageSize = 8;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', { page, pageSize, search: searchTerm }],
    queryFn: getUsers,
    keepPreviousData: true,
    retry: 2,
    onError: (error) => {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users. Please try again.');
    }
  });

  const users = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setUserToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete user');
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  });

  const suspendMutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update status')
  });

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleToggleSuspend = (id, currentStatus) => {
    suspendMutation.mutate({ id, isSuspended: !currentStatus });
  };

  const handleSearch = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    refetch();
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
          </div>
          <button
            onClick={handleCancelDelete}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Are you sure?</h4>
            <p className="text-gray-600 mb-4">
              You are about to delete the user <strong>"{userToDelete?.username}"</strong>. 
              This action cannot be undone.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <FiAlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-medium text-red-800 mb-1">Warning</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• All user data will be permanently deleted</li>
                    <li>• User's articles and content may be affected</li>
                    <li>• This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleCancelDelete}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {deleteMutation.isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="mr-2 w-4 h-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Error State Component (unchanged)
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-md mb-8">
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Background */}
          <rect x="0" y="0" width="400" height="300" fill="#f8fafc"/>
          
          {/* Server/Database icon */}
          <rect x="150" y="80" width="100" height="80" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2"/>
          <rect x="160" y="90" width="80" height="8" rx="4" fill="#94a3b8"/>
          <rect x="160" y="105" width="80" height="8" rx="4" fill="#94a3b8"/>
          <rect x="160" y="120" width="80" height="8" rx="4" fill="#94a3b8"/>
          <rect x="160" y="135" width="80" height="8" rx="4" fill="#94a3b8"/>
          
          {/* Error symbol */}
          <circle cx="200" cy="120" r="25" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2"/>
          <path d="M190 110 L210 130 M210 110 L190 130" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
          
          {/* Disconnected lines */}
          <path d="M120 120 L140 120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
          <path d="M260 120 L280 120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
          
          {/* Warning indicators */}
          <circle cx="100" cy="100" r="4" fill="#f59e0b"/>
          <circle cx="300" cy="140" r="4" fill="#f59e0b"/>
          
          {/* Floating error indicators */}
          <g opacity="0.6">
            <circle cx="80" cy="180" r="2" fill="#ef4444"/>
            <circle cx="320" cy="80" r="2" fill="#ef4444"/>
            <circle cx="60" cy="60" r="1.5" fill="#ef4444"/>
          </g>
        </svg>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Users</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          We couldn't retrieve the user data. This might be due to a network issue or server problem.
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FiRefreshCw className="mr-2" size={16} />
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="view-users-container">
        <div className="view-users-card">
          <div className="view-users-header">
            <h1 className="view-users-title">Manage Users</h1>
            <button
              onClick={() => navigate('/admin/users/add')}
              className="add-btn"
            >
              Add User
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by username or email..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm text-sm placeholder-gray-500 transition-colors"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell">Username</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Role</th>
                  <th className="table-header-cell">Suspended</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan="5" className="p-0">
                      <ErrorState />
                    </td>
                  </tr>
                ) : (
                  <>
                    {users.map((user) => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell">{user.username}</td>
                        <td className="table-cell">{user.email}</td>
                        <td className="table-cell">
                          {Object.keys(Role).find((key) => Role[key] === user.role)}
                        </td>
                        <td className="table-cell">
                          <label className="toggle-label">
                            <input
                              type="checkbox"
                              checked={!user.isSuspended}
                              onChange={() => handleToggleSuspend(user.id, user.isSuspended)}
                              className="toggle-input peer"
                            />
                            <div className="toggle-switch">
                              <span className="toggle-slider"></span>
                            </div>
                            <span className="toggle-text">
                              {user.isSuspended ? 'Disabled' : 'Active'}
                            </span>
                          </label>
                        </td>
                        <td className="actions-container">
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            className="edit-btn"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="delete-btn"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && !isError && (
                      <tr>
                        <td colSpan="5" className="no-users-row">No users found</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
            
            {!isError && (
              <div className="pagination-container">
                <button
                  className="add-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
                <button
                  className="add-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <DeleteConfirmationModal />}
    </>
  );
};

export default ViewUsers;
