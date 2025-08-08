import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllArticles, deleteArticle, publishArticle } from '../../../api/news-services';
import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiUser,
    FiTag,
    FiFileText,
    FiSend
} from 'react-icons/fi';

const ViewNews = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch articles with debounced search
    const { data: articlesData, isLoading, isError } = useQuery({
        queryKey: ['articles', { page: currentPage, pageSize, search: searchTerm, status: statusFilter }],
        queryFn: () => getAllArticles({
            page: currentPage,
            pageSize,
            search: searchTerm.trim(),
            status: statusFilter
        }),
        keepPreviousData: true,
        staleTime: 30000, // 30 seconds
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article deleted successfully!');
            setDeleteConfirm(null);
        },
        onError: (error) => {
            console.error('Delete error:', error);
            toast.error('Failed to delete article');
        }
    });

    // Publish mutation
    const publishMutation = useMutation({
        mutationFn: publishArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article published successfully!');
        },
        onError: (error) => {
            console.error('Publish error:', error);
            toast.error('Failed to publish article');
        }
    });

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const handlePublish = (id) => {
        publishMutation.mutate(id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
            published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
            archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const articles = articlesData?.items || [];
    const totalPages = Math.ceil((articlesData?.totalCount || 0) / pageSize);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiFileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Manage News</h1>
                                    <p className="text-gray-600 mt-1">View, edit, and manage all your news articles</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/admin/news/add')}
                                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg"
                            >
                                <FiPlus className="mr-2" size={18} />
                                Add New Article
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Articles Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading articles...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">Failed to load articles</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-12">
                            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No articles found</p>
                            <button
                                onClick={() => navigate('/admin/news/add')}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Create your first article
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Article
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Author
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Published
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {articles.map((article) => (
                                            <tr key={article.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {article.coverImageId && (
                                                            <img
                                                                src={`${imgServer}uploads/${article.coverImageId}`}
                                                                alt=""
                                                                className="w-12 h-12 rounded-lg object-cover mr-4"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {article.title || 'Untitled'}
                                                            </div>
                                                            <div className="text-sm text-gray-500 truncate">
                                                                {article.slug || 'No slug'}
                                                            </div>
                                                            {article.summary && (
                                                                <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                                    {article.summary.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">
                                                            {article.authorId ? `Author ${article.authorId}` : 'No Author'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(article.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <FiCalendar className="w-4 h-4 mr-2" />
                                                        {article.publicationDatetime ? 
                                                            formatDate(article.publicationDatetime) : 
                                                            'Not published'
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Created: {article.createdAt !== "0001-01-01T00:00:00" ? 
                                                            formatDate(article.createdAt) : 
                                                            'Unknown'
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/news/edit/${article.id}`)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                    >
                                                        <FiEdit className="mr-1" size={14} />
                                                        Edit
                                                    </button>
                                                    
                                                    {article.status === 'draft' && (
                                                        <button
                                                            onClick={() => handlePublish(article.id)}
                                                            disabled={publishMutation.isPending}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                                        >
                                                            <FiSend className="mr-1" size={14} />
                                                            Publish
                                                        </button>
                                                    )}
                                                    
                                                    <button
                                                        onClick={() => setDeleteConfirm(article.id)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        <FiTrash2 className="mr-1" size={14} />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-gray-700">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                                    <span className="font-medium">
                                                        {Math.min(currentPage * pageSize, articlesData?.totalCount || 0)}
                                                    </span>{' '}
                                                    of <span className="font-medium">{articlesData?.totalCount || 0}</span> results
                                                    {searchTerm && (
                                                        <span className="text-indigo-600 ml-2">
                                                            for "{searchTerm}"
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    <button
                                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Previous
                                                    </button>
                                                    
                                                    {/* Page numbers */}
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = currentPage - 2 + i;
                                                        }
                                                        
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    pageNum === currentPage
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                    
                                                    <button
                                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <FiTrash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Delete Article</h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete this article? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="items-center px-4 py-3">
                                    <button
                                        onClick={() => handleDelete(deleteConfirm)}
                                        disabled={deleteMutation.isPending}
                                        className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewNews;


