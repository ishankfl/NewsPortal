import axios from 'axios';
import { server } from './server';

// Upload image (multipart/form-data)
export const uploadImage = async (file, name) => {
  if (!file) throw new Error("File is required.");
  if (!name) throw new Error("Image name is required.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  try {
    const response = await axios.post(`${server}/Image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000,
    });
    return response.data;  // Assuming returns inserted image ID or object
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Get all images
export const getAllImages = async () => {
  try {
    const response = await axios.get(`${server}/Image`, {
      timeout: 5000,
    });
    return response.data; // array of images
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Get image by ID
export const getImageById = async (id) => {
  try {
    const response = await axios.get(`${server}/Image/${id}`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Delete image by ID
export const deleteImage = async (id) => {
  try {
    await axios.delete(`${server}/Image/${id}`, {
      timeout: 5000,
    });
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};
