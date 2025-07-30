import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiUserX, FiRefreshCw } from 'react-icons/fi';
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
    },
    onError: () => toast.error('Failed to delete user')
  });

  const suspendMutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update status')
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
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

  // Error State Component
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
                          onClick={() => handleDelete(user.id)}
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
  );
};

export default ViewUsers;
