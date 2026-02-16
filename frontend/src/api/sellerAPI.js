import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const sellerAPI = {
  // Get all seller's listings
  getListings: (status = null) => {
    const params = status ? { status } : {};
    return axiosInstance.get('/seller/listings', { params });
  },

  // Get listing summary (counts by status)
  getListingSummary: () => {
    return axiosInstance.get('/seller/listings/summary');
  },

  // Get seller profile
  getProfile: () => {
    return axiosInstance.get('/seller/profile');
  },

  // Update seller profile
  updateProfile: (data) => {
    return axiosInstance.put('/seller/profile', data);
  },

  // Get single listing
  getListing: (id) => {
    return axiosInstance.get(`/seller/listings/${id}`);
  },

  // Create new listing
  createListing: (formData) => {
    return axiosInstance.post('/seller/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update listing
  updateListing: (id, formData) => {
    return axiosInstance.put(`/seller/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Mark listing as sold
  markAsSold: (id) => {
    return axiosInstance.post(`/seller/listings/${id}/mark-sold`);
  },

  // Mark listing as rented
  markAsRented: (id) => {
    return axiosInstance.post(`/seller/listings/${id}/mark-rented`);
  },

  // Archive listing
  archiveListing: (id) => {
    return axiosInstance.post(`/seller/listings/${id}/archive`);
  },

  // Delete listing
  deleteListing: (id) => {
    return axiosInstance.delete(`/seller/listings/${id}`);
  },

  // Delete photo
  deletePhoto: (photoId) => {
    return axiosInstance.delete(`/seller/listings/photos/${photoId}`);
  },

  // Get all inquiries for seller's listings
  getInquiries: () => {
    return axiosInstance.get('/seller/inquiries');
  },

  // Get recent inquiries
  getRecentInquiries: (limit = 5) => {
    return axiosInstance.get('/seller/inquiries/recent', { params: { limit } });
  },
};
