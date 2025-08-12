// src/services/bannerService.js
import axios from 'axios';

const API_URL = '/api/banners';

export const getBanners = (page, pageSize) => {
  return axios.get(API_URL, {
    params: { page, pageSize }
  });
};

export const deleteBanner = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const updateBannerStatus = (id, isActive) => {
  return axios.put(`${API_URL}/${id}/status`, { isActive });
};

export const assignBannerToPosition = (bannerId, positionId) => {
  return axios.post(`${API_URL}/${bannerId}/positions/${positionId}`);
};

export const removeBannerFromPosition = (bannerId, positionId) => {
  return axios.delete(`${API_URL}/${bannerId}/positions/${positionId}`);
};
