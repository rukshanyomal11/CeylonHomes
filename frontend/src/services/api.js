import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-logout, let components handle 401 errors
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Listing APIs
export const listingAPI = {
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  getById: (id) => api.get(`/listings/${id}`),
  search: (params) => api.get('/listings/search', { params }),
  latest: (params) => api.get('/listings/latest', { params }),
  uploadPhotos: (id, formData) => api.post(`/listings/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePhoto: (photoId) => api.delete(`/listings/photos/${photoId}`),
  markSold: (id) => api.patch(`/listings/${id}/sold`),
  markRented: (id) => api.patch(`/listings/${id}/rented`),
  archive: (id) => api.patch(`/listings/${id}/archive`),
};

// Seller APIs
export const sellerAPI = {
  getMyListings: () => api.get('/seller/listings'),
};

// Inquiry APIs
export const inquiryAPI = {
  create: (listingId, data) => api.post(`/inquiries/listing/${listingId}`, data),
  getSellerInquiries: () => api.get('/inquiries/seller'),
  getListingInquiries: (listingId) => api.get(`/inquiries/listing/${listingId}`),
};

// Report APIs
export const reportAPI = {
  create: (listingId, data) => api.post(`/reports/listing/${listingId}`, data),
};

// Admin APIs
export const adminAPI = {
  getPendingListings: (params) => api.get('/admin/listings/pending', { params }),
  approveListing: (id, data) => api.post(`/admin/listings/${id}/approve`, data),
  rejectListing: (id, data) => api.post(`/admin/listings/${id}/reject`, data),
  suspendListing: (id, data) => api.post(`/admin/listings/${id}/suspend`, data),
  unsuspendListing: (id, data) => api.post(`/admin/listings/${id}/unsuspend`, data),
  getReports: () => api.get('/admin/reports'),
  getOpenReports: () => api.get('/admin/reports/open'),
  markReportReviewed: (id) => api.patch(`/admin/reports/${id}/reviewed`),
  markReportClosed: (id) => api.patch(`/admin/reports/${id}/closed`),
  getApprovalHistory: () => api.get('/admin/approval-actions'),
  getListingApprovalHistory: (listingId) => api.get(`/admin/approval-actions/listing/${listingId}`),
};

export default api;
