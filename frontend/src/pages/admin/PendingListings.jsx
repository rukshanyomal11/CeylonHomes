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
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Listings</h1>

      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No pending listings to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                        {listing.rentOrSale}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {listing.propertyType}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Owner:</strong> {listing.ownerName} ({listing.ownerEmail})
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Location:</strong> {listing.city}, {listing.district}
                    </p>
                    <p className="text-gray-900 font-semibold text-lg mb-2">
                      Rs. {listing.price?.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {listing.description?.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openApproveDialog(listing)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectDialog(listing)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedListing.title}</h2>
              <button onClick={closeDialog} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Photos */}
              {selectedListing.photoUrls && selectedListing.photoUrls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedListing.photoUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Photo ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-xl font-bold text-primary-600">Rs. {selectedListing.price?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-semibold">{selectedListing.rentOrSale}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-lg font-semibold">{selectedListing.bedrooms}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-lg font-semibold">{selectedListing.bathrooms}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedListing.description}</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={closeDialog} className="px-4 py-2 border rounded-md hover:bg-gray-50">Close</button>
                <button onClick={() => openApproveDialog(selectedListing)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                <button onClick={() => openRejectDialog(selectedListing)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation */}
      {actionType === 'approve' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Approve Listing</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to approve "{selectedListing.title}"?</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeDialog} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleApprove} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {actionType === 'reject' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Listing</h3>
            <p className="text-gray-600 mb-4">Provide a reason for rejecting "{selectedListing.title}":</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 mb-4"
              rows="4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={closeDialog} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
