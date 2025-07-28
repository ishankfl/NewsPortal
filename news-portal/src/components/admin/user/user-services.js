// services/userService.js

const API_BASE_URL = 'https://your-api-base-url.com/api'; // <-- Change this to your actual API base URL

export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include auth token here if required, e.g.:
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create user');
  }

  return response.json();
};
