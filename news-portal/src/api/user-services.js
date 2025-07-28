// services/userService.js
import axios from 'axios';
import { server } from './server';


export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${server}/users`, userData, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    // Throw the error for react-query or form to catch
    throw error.response?.data || error;
  }
};
