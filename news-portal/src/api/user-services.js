import axios from 'axios';
import { server } from './server';

// Create a new user
export const createUser = async (userData) => {
  if (typeof userData.role === 'string') {
    userData.role = parseInt(userData.role, 10);
  }

  try {
    console.log('in sensor', userData);
    const response = await axios.post(`${server}/user?autoGeneratePassword=false`, userData, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${server}/user`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Delete a user by ID
export const deleteUser = async (id) => {
  try {
    await axios.delete(`${server}/user/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Update user suspension status// Update user suspension status
export const updateUserStatus = async ({ id, isSuspended }) => {
  try {
    const url = `${server}/user/${id}/${isSuspended ? 'suspend' : 'unsuspend'}`;
    const response = await axios.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};
