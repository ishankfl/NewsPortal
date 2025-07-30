import axios from 'axios';
import { server } from './server';

// Create a new user
export const loginUser = async (userData) => {
  if (typeof userData.role === 'string') {
    userData.role = parseInt(userData.role, 10);
  }

  try {
    console.log('in sensor', userData);
    const response = await axios.post(
      `${server}/Authentication/login?autoGeneratePassword=false`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000 // ⏱ Set timeout to 5 seconds (5000 ms)
      }
    );
    return response;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
      throw new Error('Request timed out. Please try again.');
    }
    console.error(error);
    throw error.response?.data || error;
  }
};
