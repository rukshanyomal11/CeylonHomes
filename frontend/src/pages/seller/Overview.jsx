import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellerAPI } from '../../api/sellerAPI';
import { toast } from 'react-hot-toast';

export const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [recentRejected, setRecentRejected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, rejectedRes] = await Promise.all([
        sellerAPI.getListingSummary(),
        sellerAPI.getListings('REJECTED'),
      ]);
      setSummary(summaryRes.data);
      // Get only the first 3 rejected listings
      setRecentRejected(rejectedRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching overview data:', error);
      toast.error('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const stats = [
    { label: 'Pending', value: summary?.pending || 0, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { label: 'Approved', value: summary?.approved || 0, color: 'bg-green-500', textColor: 'text-green-600' },
    { label: 'Rejected', value: summary?.rejected || 0, color: 'bg-red-500', textColor: 'text-red-600' },
    { label: 'Sold', value: summary?.sold || 0, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { label: 'Rented', value: summary?.rented || 0, color: 'bg-purple-500', textColor: 'text-purple-600' },
    { label: 'Archived', value: summary?.archived || 0, color: 'bg-gray-500', textColor: 'text-gray-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full opacity-20`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Rejected Listings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Recent Rejected Listings</h2>
            <Link
              to="/seller/inquiries"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
        </div>

        <div className="p-6">
          {recentRejected.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No rejected listings</p>
          ) : (
            <div className="space-y-4">
              {recentRejected.map((listing) => (
                <div
                  key={listing.id}
                  className="border border-red-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{listing.title}</h3>
                      <p className="text-sm text-gray-600">
                        {listing.city}, {listing.district} • Rs. {listing.price?.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      REJECTED
                    </span>
                  </div>
                  <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-xs font-semibold text-red-900 mb-1">Rejection Reason:</p>
                    <p className="text-xs text-red-800">{listing.rejectionReason || 'No reason provided'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
