import axios from 'axios';

// Base URL untuk API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend.pesantrenalihsanbekasi.or.id/api';

// Base URL untuk server (untuk static files)
export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_URL || 'https://backend.pesantrenalihsanbekasi.or.id/';

// Helper function untuk get full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${SERVER_BASE_URL}${path}`;
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // Jangan set Content-Type default agar FormData bisa set sendiri
  withCredentials: true,
});

// Request interceptor untuk menambahkan token jika ada
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Frontend Request:', {
      method: config.method.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    });
    
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      const admin = JSON.parse(adminData);
      // Jika ada token di data admin (untuk future enhancement)
      if (admin.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => {
    console.log('✅ Frontend Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Frontend Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage dan redirect ke login
      localStorage.removeItem('adminData');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;
