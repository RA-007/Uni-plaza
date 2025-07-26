import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product Ads API
export const productAdsAPI = {
  getAll: () => api.get('/club/product-ads'),
  getById: (id) => api.get(`/club/product-ads/${id}`),
  create: (data) => api.post('/club/product-ads', data),
  update: (id, data) => api.put(`/club/product-ads/${id}`, data),
  delete: (id) => api.delete(`/club/product-ads/${id}`),
};

// Event Ads API
export const eventAdsAPI = {
  getAll: () => api.get('/club/event-ads'),
  getById: (id) => api.get(`/club/event-ads/${id}`),
  create: (data) => api.post('/club/event-ads', data),
  update: (id, data) => api.put(`/club/event-ads/${id}`, data),
  delete: (id) => api.delete(`/club/event-ads/${id}`),
};

// Other Ads API
export const otherAdsAPI = {
  getAll: () => api.get('/club/other-ads'),
  getById: (id) => api.get(`/club/other-ads/${id}`),
  create: (data) => api.post('/club/other-ads', data),
  update: (id, data) => api.put(`/club/other-ads/${id}`, data),
  delete: (id) => api.delete(`/club/other-ads/${id}`),
};

export default api;
