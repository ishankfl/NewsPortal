import axios from 'axios';
import { server } from './server';

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${server}/Categories`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${server}/Categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${server}/Categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Update category by ID
export const updateCategory = async ({ id, ...categoryData }) => {
  try {
    const response = await axios.put(`${server}/Categories/${id}`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Delete category by ID
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${server}/Categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};