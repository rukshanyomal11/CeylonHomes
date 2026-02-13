import api from '../services/api';

export const adminAPI = {
  // Statistics
  getStats: () => api.get('/admin/stats'),

  //  Listings Management
  getListings: (params) => api.get('/admin/listings', { params }),
  getPendingListings: (params) => api.get('/admin/listings', { params: { ...params, status: 'PENDING' } }),
  approveListing: (id, note) => api.post(`/admin/listings/${id}/approve`, { action: 'APPROVE', note }),
  rejectListing: (id, reason) => api.post(`/admin/listings/${id}/reject`, { action: 'REJECT', note: reason }),
  suspendListing: (id, reason) => api.post(`/admin/listings/${id}/suspend`, { reason }),
  unsuspendListing: (id, note) => api.post(`/admin/listings/${id}/unsuspend`, { note }),

  // Reports Management
  getReports: (params) => api.get('/admin/reports', { params }),
  getOpenReports: () => api.get('/admin/reports/open'),
  markReportAsReviewed: (id) => api.patch(`/admin/reports/${id}/reviewed`),
  closeReport: (id) => api.patch(`/admin/reports/${id}/closed`),

  // Audit Log
  getApprovalHistory: (params) => api.get('/admin/approval-actions', { params }),
  getListingApprovalHistory: (listingId) => api.get(`/admin/approval-actions/listing/${listingId}`),
};
