import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sellerAPI } from '../../api/sellerAPI';
import { toast } from 'react-hot-toast';

export const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, action: null, listingId: null });
  const [viewModal, setViewModal] = useState({ show: false, listing: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [statusFilter, searchTerm, listings]);

  const fetchListings = async () => {
    try {
      const response = await sellerAPI.getListings();
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    if (statusFilter) {
      filtered = filtered.filter((listing) => listing.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  };

  const handleMarkSold = async (id) => {
    try {
      await sellerAPI.markAsSold(id);
      toast.success('Listing marked as sold');
      fetchListings();
    } catch (error) {
      console.error('Error marking as sold:', error);
      toast.error(error.response?.data?.message || 'Failed to mark as sold');
    }
    setConfirmDialog({ show: false, action: null, listingId: null });
  };

  const handleMarkRented = async (id) => {
    try {
      await sellerAPI.markAsRented(id);
      toast.success('Listing marked as rented');
      fetchListings();
    } catch (error) {
      console.error('Error marking as rented:', error);
      toast.error(error.response?.data?.message || 'Failed to mark as rented');
    }
    setConfirmDialog({ show: false, action: null, listingId: null });
  };

  const handleArchive = async (id) => {
    try {
      await sellerAPI.archiveListing(id);
      toast.success('Listing archived');
      fetchListings();
    } catch (error) {
      console.error('Error archiving listing:', error);
      toast.error('Failed to archive listing');
    }
    setConfirmDialog({ show: false, action: null, listingId: null });
  };

  const handleDelete = async (id) => {
    try {
      await sellerAPI.deleteListing(id);
      toast.success('Listing deleted successfully');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error(error.response?.data?.message || 'Failed to delete listing');
    }
    setConfirmDialog({ show: false, action: null, listingId: null });
  };

  const openConfirmDialog = (action, listingId) => {
    setConfirmDialog({ show: true, action, listingId });
  };

  const openViewModal = (listing) => {
    setViewModal({ show: true, listing });
  };

  const closeViewModal = () => {
    setViewModal({ show: false, listing: null });
  };

  const executeAction = () => {
    const { action, listingId } = confirmDialog;
    if (action === 'sold') {
      handleMarkSold(listingId);
    } else if (action === 'rented') {
      handleMarkRented(listingId);
    } else if (action === 'archive') {
      handleArchive(listingId);
    } else if (action === 'delete') {
      handleDelete(listingId);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SOLD: 'bg-blue-100 text-blue-800',
      RENTED: 'bg-purple-100 text-purple-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
        <Link
          to="/seller/listings/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md font-medium"
        >
          + Create New Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Title
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No listings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Rs. {listing.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.rentOrSale}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.city}, {listing.district}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(listing)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <Link
                          to={`/seller/listings/${listing.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </Link>
                        {listing.status === 'APPROVED' && listing.rentOrSale === 'SALE' && (
                          <button
                            onClick={() => openConfirmDialog('sold', listing.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Sold
                          </button>
                        )}
                        {listing.status === 'APPROVED' && listing.rentOrSale === 'RENT' && (
                          <button
                            onClick={() => openConfirmDialog('rented', listing.id)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Rented
                          </button>
                        )}
                        <button
                          onClick={() => openConfirmDialog('archive', listing.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => openConfirmDialog('delete', listing.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal.show && viewModal.listing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{viewModal.listing.title}</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Photos Gallery */}
              {viewModal.listing.photoUrls && viewModal.listing.photoUrls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewModal.listing.photoUrls.map((photo, index) => (
                      <div key={index} className="aspect-video overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={photo}
                          alt={`${viewModal.listing.title} - Photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price and Type */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-primary-600">
                    Rs. {viewModal.listing.price.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {viewModal.listing.rentOrSale}
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-900">{viewModal.listing.bedrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-900">{viewModal.listing.bathrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Land Size</p>
                    <p className="text-lg font-semibold text-gray-900">{viewModal.listing.landSize} sq ft</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">{getStatusBadge(viewModal.listing.status)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Posted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(viewModal.listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {viewModal.listing.address}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {viewModal.listing.city}, {viewModal.listing.district}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{viewModal.listing.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <Link
                  to={`/seller/listings/${viewModal.listing.id}/edit`}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  onClick={closeViewModal}
                >
                  Edit Listing
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
            <p className="text-gray-600 mb-6">
              {confirmDialog.action === 'delete' 
                ? 'Are you sure you want to permanently delete this listing? This action cannot be undone and will remove the listing from your dashboard.'
                : confirmDialog.action === 'archive'
                ? 'Are you sure you want to archive this listing? It will be hidden from public view but remain in your dashboard.'
                : `Are you sure you want to mark this listing as ${confirmDialog.action}?`
              }
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDialog({ show: false, action: null, listingId: null })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 rounded-md text-white ${
                  confirmDialog.action === 'delete' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
