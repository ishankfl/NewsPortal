import axios from 'axios';
import { server } from './server';

// Create a new article
export const createArticle = async (articleData) => {
  try {
    const response = await axios.post(`${server}/Article`, articleData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error.response?.data || error;
  }
};

// Update an existing article
export const updateArticle = async (id, articleData) => {
  try {
    const response = await axios.put(`${server}/Article/${id}`, articleData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error.response?.data || error;
  }
};

// Get article by ID
export const getArticleById = async (id) => {
  try {
    const response = await axios.get(`${server}/Article/${id}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error.response?.data || error;
  }
};

// Get article by slug
export const getArticleBySlug = async (slug) => {
  try {
    const response = await axios.get(`${server}/Article/slug/${slug}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw error.response?.data || error;
  }
};

// Delete article
export const deleteArticle = async (id) => {
  try {
    const response = await axios.delete(`${server}/Article/${id}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error.response?.data || error;
  }
};

// Get all articles with filtering and pagination
export const getAllArticles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.languageCode) queryParams.append('languageCode', params.languageCode);
    if (params.status) queryParams.append('status', params.status);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params.authorId) queryParams.append('authorId', params.authorId);
    if (params.reporterId) queryParams.append('reporterId', params.reporterId);

    const response = await axios.get(`${server}/Article?${queryParams.toString()}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error.response?.data || error;
  }
};

// Get articles by author
export const getArticlesByAuthor = async (authorId, page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${server}/Article/author/${authorId}`, {
      params: { page, pageSize },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles by author:', error);
    throw error.response?.data || error;
  }
};

// Get published articles
export const getPublishedArticles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.languageCode) queryParams.append('languageCode', params.languageCode);

    const response = await axios.get(`${server}/Article/published?${queryParams.toString()}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching published articles:', error);
    throw error.response?.data || error;
  }
};

// Publish an article
export const publishArticle = async (id, publicationDateTime = null) => {
  try {
    const requestBody = publicationDateTime ? { publicationDateTime } : {};
    const response = await axios.post(`${server}/Article/${id}/publish`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error publishing article:', error);
    throw error.response?.data || error;
  }
};

// Unpublish an article
export const unpublishArticle = async (id) => {
  try {
    const response = await axios.post(`${server}/Article/${id}/unpublish`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error unpublishing article:', error);
    throw error.response?.data || error;
  }
};

// Generate slug from title
export const generateSlug = async (title, excludeId = null) => {
  try {
    const params = new URLSearchParams({ title });
    if (excludeId) params.append('excludeId', excludeId);

    const response = await axios.get(`${server}/Article/generate-slug?${params.toString()}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating slug:', error);
    throw error.response?.data || error;
  }
};

// Helper function to format article data for API
export const formatArticleForApi = (articleData) => {
  return {
    languageCode: articleData.languageCode || 'en',
    title: articleData.title,
    slug: articleData.slug,
    content: articleData.content || '',
    summary: articleData.summary || '',
    status: articleData.status || 'draft',
    publicationDatetime: articleData.publicationDatetime || null,
    allowComments: articleData.allowComments !== undefined ? articleData.allowComments : true,
    coverImageId: articleData.coverImageId || null,
    authorId: articleData.authorId,
    reporterId: articleData.reporterId || null,
    seoTitle: articleData.seoTitle || '',
    seoDescription: articleData.seoDescription || '',
    seoKeywords: articleData.seoKeywords || '',
  };
};

// Helper function to validate article data before submission
export const validateArticleData = (articleData) => {
  const errors = [];

  if (!articleData.title?.trim()) {
    errors.push('Title is required');
  }

  if (!articleData.languageCode) {
    errors.push('Language code is required');
  } else if (!['en', 'np'].includes(articleData.languageCode)) {
    errors.push('Language code must be "en" or "np"');
  }

  if (!articleData.authorId) {
    errors.push('Author is required');
  }

  if (articleData.seoTitle && articleData.seoTitle.length > 70) {
    errors.push('SEO title must be 70 characters or less');
  }

  if (articleData.seoDescription && articleData.seoDescription.length > 160) {
    errors.push('SEO description must be 160 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
