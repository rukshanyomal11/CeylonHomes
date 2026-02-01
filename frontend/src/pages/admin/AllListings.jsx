import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const AllListings = () => {
  const [listings, setListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [statusFilter]);

  const fetchListings = async () => {
    try {
      const params = { page: 0, size: 100 };
      if (statusFilter) params.status = statusFilter;
      const response = await adminAPI.getListings(params);
      setListings(response.data.content || []);
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
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-purple-100 text-purple-800',
      SOLD: 'bg-blue-100 text-blue-800',
      RENTED: 'bg-indigo-100 text-indigo-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>{status}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Listings</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-md">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="SOLD">Sold</option>
          <option value="RENTED">Rented</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{listing.title}</td>
                  <td className="px-6 py-4 text-sm">{listing.ownerName}</td>
                  <td className="px-6 py-4">Rs. {listing.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(listing.status)}</td>
                  <td className="px-6 py-4">
                    {listing.status === 'APPROVED' && (
                      <button onClick={() => handleSuspend(listing.id)} className="text-red-600 hover:text-red-900 text-sm mr-3">Suspend</button>
                    )}
                    {listing.status === 'SUSPENDED' && (
                      <button onClick={() => handleUnsuspend(listing.id)} className="text-green-600 hover:text-green-900 text-sm">Unsuspend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
