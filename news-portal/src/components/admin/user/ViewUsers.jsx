import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { getUsers, deleteUser, updateUserStatus } from '../../../api/user-services';
import { Role } from '../../common/Role';
import './ViewUsers.module.css';

const SkeletonRow = () => (
  <tr className="skeleton-row">
    <td className="table-cell"><div className="skeleton-bar" /></td>
    <td className="table-cell"><div className="skeleton-bar" /></td>
    <td className="table-cell"><div className="skeleton-bar-small" /></td>
    <td className="table-cell"><div className="skeleton-toggle" /></td>
    <td className="table-cell flex gap-3">
      <div className="skeleton-icon" />
      <div className="skeleton-icon" />
    </td>
  </tr>
);

const ViewUsers = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users', { page, pageSize, search: searchTerm }],
    queryFn: getUsers,
    keepPreviousData: true,
  });

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

  return (
    <div className="view-users-container">
      <div className="view-users-card">
        <div className="view-users-header">
          <h1 className="view-users-title">Manage Users</h1>
          <button
            onClick={() => navigate('/admin/users/add')}
            className="add-user-btn"
          >
            Add User
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by username or email"
            className="search-input"
          />
          <div className="pagination-buttons flex gap-2">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              className="pagination-btn"
              disabled={users.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
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
                <tr><td colSpan="5" className="error-message">Failed to load users.</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="no-users-row">No users found</td></tr>
              ) : (
                users.map((user) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
