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
import axios from 'axios';
import { server } from './server';

// Fetch users with pagination and search
export const getUsers = async ({ queryKey }) => {
  const [_key, params = {}] = queryKey;
  const { page = 1, pageSize = 10, search = '' } = params;

  try {
    const response = await axios.get(`${server}/user`, {
      params: { page, pageSize, search },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // assume API returns array of users here
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Delete user by id
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

// Update user suspension status
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
