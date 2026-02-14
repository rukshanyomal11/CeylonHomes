import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const AllListings = () => {
  const [listings, setListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;
  const startIndex = page * pageSize;

  useEffect(() => {
    fetchListings();
  }, [statusFilter, ownerFilter, titleFilter, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { page, size: pageSize };
      if (statusFilter) params.status = statusFilter;
      const trimmedOwner = ownerFilter.trim();
      const trimmedTitle = titleFilter.trim();
      if (trimmedOwner) params.owner = trimmedOwner;
      if (trimmedTitle) params.title = trimmedTitle;
      const response = await adminAPI.getListings(params);
      setListings(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id) => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;
    
    try {
      await adminAPI.suspendListing(id, reason);
      toast.success('Listing suspended');
      fetchListings();
    } catch (error) {
      toast.error('Failed to suspend listing');
    }
  };

  const handleUnsuspend = async (id) => {
    try {
      await adminAPI.unsuspendListing(id, 'Unsuspended by admin');
      toast.success('Listing unsuspended');
      fetchListings();
    } catch (error) {
      toast.error('Failed to unsuspend listing');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
      APPROVED: 'bg-green-50 text-green-800 ring-green-200',
      REJECTED: 'bg-red-50 text-red-800 ring-red-200',
      SUSPENDED: 'bg-purple-50 text-purple-800 ring-purple-200',
      SOLD: 'bg-blue-50 text-blue-800 ring-blue-200',
      RENTED: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Listings</h1>

      <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
          </select>

          <input
            type="text"
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by owner name or email"
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
          />

          <input
            type="text"
            value={titleFilter}
            onChange={(e) => {
              setTitleFilter(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by listing title"
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((listing, index) => (
                <tr key={listing.id} className="transition-colors even:bg-slate-50/50 hover:bg-primary-50/50">
                  <td className="px-6 py-4 text-slate-500">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{listing.title}</td>
                  <td className="px-6 py-4 text-slate-600">{listing.ownerName}</td>
                  <td className="px-6 py-4 text-slate-700">Rs. {listing.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(listing.status)}</td>
                  <td className="px-6 py-4">
                    {listing.status === 'APPROVED' && (
                      <button
                        onClick={() => handleSuspend(listing.id)}
                        className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:border-red-300 hover:bg-red-100"
                      >
                        Suspend
                      </button>
                    )}
                    {listing.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleUnsuspend(listing.id)}
                        className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:border-green-300 hover:bg-green-100"
                      >
                        Unsuspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
            <p className="text-sm text-slate-600">
              Page {Math.min(page + 1, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={totalPages === 0 || page + 1 >= totalPages}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
