import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const PendingListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const response = await adminAPI.getPendingListings({ page: 0, size: 100 });
      setListings(response.data.content || []);
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      toast.error('Failed to load pending listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      console.log('=== APPROVE DEBUG ===');
      console.log('Token:', localStorage.getItem('token'));
      console.log('User:', JSON.parse(localStorage.getItem('user')));
      console.log('Listing ID:', selectedListing.id);
      
      await adminAPI.approveListing(selectedListing.id, 'Approved by admin');
      toast.success('Listing approved successfully');
      
      // Remove the approved listing from the UI immediately
      setListings((prevListings) => 
        prevListings.filter(listing => listing.id !== selectedListing.id)
      );
      
      setSelectedListing(null);
      setActionType(null);
    } catch (error) {
      console.error('Error approving listing:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request headers:', error.config?.headers);
      
      if (error.response?.status === 403 || error.response?.status === 401) {
        toast.error('Authentication error! Please logout and login as admin.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to approve listing');
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      await adminAPI.rejectListing(selectedListing.id, rejectReason);
      toast.success('Listing rejected');
      
      // Remove the rejected listing from the UI immediately
      setListings((prevListings) => 
        prevListings.filter(listing => listing.id !== selectedListing.id)
      );
      
      setSelectedListing(null);
      setRejectReason('');
      setActionType(null);
    } catch (error) {
      console.error('Error rejecting listing:', error);
      toast.error(error.response?.data?.message || 'Failed to reject listing');
    }
  };

  const openApproveDialog = (listing) => {
    setSelectedListing(listing);
    setActionType('approve');
  };

  const openRejectDialog = (listing) => {
    setSelectedListing(listing);
    setActionType('reject');
    setRejectReason('');
  };

  const closeDialog = () => {
    setSelectedListing(null);
    setActionType(null);
    setRejectReason('');
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 px-6 py-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary-100">Admin Panel</p>
            <h1 className="text-3xl font-bold">Pending Listings</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-50">
              Review new submissions before they go live. Approving will publish immediately.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Pending: {listings.length}</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Action required</span>
          </div>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-primary-100 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600 text-lg">No pending listings to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="group rounded-2xl border border-primary-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{listing.title}</h3>
                        <span className="text-xs text-slate-400">ID #{listing.id}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                          {listing.rentOrSale}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {listing.propertyType}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Owner</p>
                        <p className="text-sm font-semibold text-slate-900">{listing.ownerName}</p>
                        <p className="text-xs text-slate-500">{listing.ownerEmail}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="text-sm font-semibold text-slate-900">{listing.city}, {listing.district}</p>
                        <p className="text-xs text-slate-500">{listing.address}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-2">
                        <p className="text-xs text-primary-700">Price</p>
                        <p className="text-lg font-semibold text-primary-700">Rs. {listing.price?.toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{listing.description}</p>
                    </div>

                    {listing.photoUrls && listing.photoUrls.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {listing.photoUrls.slice(0, 4).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Listing ${listing.title} ${index + 1}`}
                            className="h-16 w-24 rounded-lg border border-slate-200 object-cover"
                          />
                        ))}
                        {listing.photoUrls.length > 4 && (
                          <div className="h-16 w-24 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 flex items-center justify-center">
                            +{listing.photoUrls.length - 4} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No photos uploaded</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[170px]">
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="px-4 py-2 rounded-full border border-primary-200 bg-white text-primary-700 font-semibold hover:bg-primary-50"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openApproveDialog(listing)}
                      className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectDialog(listing)}
                      className="px-4 py-2 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {selectedListing && !actionType && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[32px] border border-primary-100/60 bg-white/95 shadow-[0_50px_160px_-80px_rgba(0,0,0,0.75)] flex flex-col">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.18),transparent_55%)]" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative flex flex-col flex-1 min-h-0">
              <div className="relative overflow-hidden border-b border-primary-200/40 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 px-6 py-5">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary-100">Pending Listing</p>
                    <h2 className="text-3xl font-bold text-white mt-1">{selectedListing.title}</h2>
                  </div>
                  <button
                    onClick={closeDialog}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    aria-label="Close modal"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                  <div className="space-y-4">
                    {selectedListing.photoUrls && selectedListing.photoUrls.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedListing.photoUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Photo ${index + 1}`}
                            className="h-40 w-full rounded-2xl border border-slate-200 object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-40 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                        No photos available
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-primary-100/80 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Price</p>
                      <p className="text-2xl font-bold text-primary-700">Rs. {selectedListing.price?.toLocaleString()}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">{selectedListing.rentOrSale}</span>
                        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">{selectedListing.propertyType}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Owner</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{selectedListing.ownerName}</p>
                      <p className="text-xs text-slate-500">{selectedListing.ownerEmail}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Location</p>
                      <p className="mt-2 text-sm text-slate-700">{selectedListing.address}</p>
                      <p className="text-xs text-slate-500">{selectedListing.city}, {selectedListing.district}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Property</p>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                        <div>Bedrooms: <span className="font-semibold">{selectedListing.bedrooms}</span></div>
                        <div>Bathrooms: <span className="font-semibold">{selectedListing.bathrooms}</span></div>
                        {selectedListing.size && (
                          <div className="col-span-2">Size: <span className="font-semibold">{selectedListing.size}</span></div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Description</p>
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{selectedListing.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-slate-200">
                  <button onClick={closeDialog} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Close</button>
                  <button onClick={() => openApproveDialog(selectedListing)} className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Approve</button>
                  <button onClick={() => openRejectDialog(selectedListing)} className="px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation */}
      {actionType === 'approve' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-semibold mb-2">Approve Listing</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to approve "{selectedListing.title}"?</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeDialog} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleApprove} className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {actionType === 'reject' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-semibold mb-2">Reject Listing</h3>
            <p className="text-slate-600 mb-4">Provide a reason for rejecting "{selectedListing.title}":</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 mb-4"
              rows="4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={closeDialog} className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

