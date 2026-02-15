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
  const [activePhoto, setActivePhoto] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
    setPage(0);
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
    setActivePhoto(0);
    setViewModal({ show: true, listing });
  };

  const closeViewModal = () => {
    setActivePhoto(0);
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
      PENDING: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
      APPROVED: 'bg-green-50 text-green-800 ring-green-200',
      REJECTED: 'bg-red-50 text-red-800 ring-red-200',
      SOLD: 'bg-blue-50 text-blue-800 ring-blue-200',
      RENTED: 'bg-purple-50 text-purple-800 ring-purple-200',
      ARCHIVED: 'bg-slate-50 text-slate-700 ring-slate-200',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${statusColors[status] || 'bg-gray-100 text-gray-800 ring-gray-200'}`}>
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
                {filteredListings
                  .slice(page * pageSize, page * pageSize + pageSize)
                  .map((listing) => (
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

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
              <p className="text-sm text-gray-600">
                Page {Math.min(page + 1, Math.max(Math.ceil(filteredListings.length / pageSize), 1))} of {Math.max(Math.ceil(filteredListings.length / pageSize), 1)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page + 1 >= Math.ceil(filteredListings.length / pageSize)}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal.show && viewModal.listing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[34px] border border-primary-100/60 bg-white/95 shadow-[0_50px_160px_-80px_rgba(0,0,0,0.75)]">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.18),transparent_55%)]" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative">
              {/* Modal Header */}
              <div className="relative overflow-hidden border-b border-primary-200/40 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-500 px-6 py-5">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary-100">Listing Details</p>
                    <h2 className="text-3xl font-bold text-white mt-1">{viewModal.listing.title}</h2>
                  </div>

                  <button
                    onClick={closeViewModal}
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

              {/* Modal Body */}
              <div className="max-h-[80vh] overflow-y-auto p-6 lg:p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6">
                  {/* Gallery */}
                  <div className="space-y-4">
                    {viewModal.listing.photoUrls && viewModal.listing.photoUrls.length > 0 ? (
                      <>
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                          <img
                            src={viewModal.listing.photoUrls[activePhoto]}
                            alt={`${viewModal.listing.title} - Photo ${activePhoto + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                            {activePhoto + 1} / {viewModal.listing.photoUrls.length}
                          </div>
                        </div>
                        {viewModal.listing.photoUrls.length > 1 && (
                          <div className="grid grid-cols-4 gap-3">
                            {viewModal.listing.photoUrls.map((photo, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setActivePhoto(index)}
                                className={`aspect-video overflow-hidden rounded-xl border transition-all ${activePhoto === index ? 'border-primary-500 ring-2 ring-primary-200' : 'border-slate-200 hover:border-primary-300'}`}
                              >
                                <img
                                  src={photo}
                                  alt={`${viewModal.listing.title} - Thumbnail ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                        No photos available
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-primary-100/80 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Location</p>
                          <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
                            <svg className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
                              <circle cx="12" cy="11" r="2" />
                            </svg>
                            {viewModal.listing.city}, {viewModal.listing.district}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{viewModal.listing.address}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Price</p>
                          <p className="text-2xl font-bold text-primary-700">Rs. {viewModal.listing.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-500 mt-1">Posted {new Date(viewModal.listing.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {getStatusBadge(viewModal.listing.status)}
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {viewModal.listing.rentOrSale}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {viewModal.listing.propertyType}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary-100/80 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Highlights</p>
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Bedrooms</p>
                          <p className="text-lg font-semibold text-slate-900">{viewModal.listing.bedrooms}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Bathrooms</p>
                          <p className="text-lg font-semibold text-slate-900">{viewModal.listing.bathrooms}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Size</p>
                          <p className="text-lg font-semibold text-slate-900">{viewModal.listing.size || 'N/A'}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Contact</p>
                          <p className="text-sm font-medium text-slate-900">{viewModal.listing.contactPhone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">WhatsApp</p>
                      <p className="mt-1 text-sm text-slate-700">{viewModal.listing.contactWhatsapp || 'N/A'}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Description</p>
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{viewModal.listing.description}</p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={closeViewModal}
                        className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                      >
                        Close
                      </button>
                      <Link
                        to={`/seller/listings/${viewModal.listing.id}/edit`}
                        className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition"
                        onClick={closeViewModal}
                      >
                        Edit Listing
                      </Link>
                    </div>
                  </div>
                </div>
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
