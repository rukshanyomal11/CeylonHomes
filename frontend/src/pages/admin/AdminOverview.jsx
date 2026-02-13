import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    { label: 'Pending Listings', value: stats?.pendingCount || 0, color: 'bg-yellow-100 text-yellow-800', link: '/admin/pending' },
    { label: 'Approved Listings', value: stats?.approvedCount || 0, color: 'bg-green-100 text-green-800', link: '/admin/listings?status=APPROVED' },
    { label: 'Rejected Listings', value: stats?.rejectedCount || 0, color: 'bg-red-100 text-red-800', link: '/admin/listings?status=REJECTED' },
    { label: 'Suspended Listings', value: stats?.suspendedCount || 0, color: 'bg-purple-100 text-purple-800', link: '/admin/listings?status=SUSPENDED' },
    { label: 'Open Reports', value: stats?.openReportsCount || 0, color: 'bg-orange-100 text-orange-800', link: '/admin/reports' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Overview</h1>

      {/* Statistics Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mb-3 ${stat.color}`}>
              {stat.label}
            </div>
            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions  */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/pending"
            className="flex items-center justify-between p-4 border-2 border-primary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900">Review Pending Listings</h3>
              <p className="text-sm text-gray-600">Approve or reject new listings</p>
            </div>
            <span className="text-primary-500 text-2xl">→</span>
          </Link>
          <Link
            to="/admin/reports"
            className="flex items-center justify-between p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-600">Review and manage user reports</p>
            </div>
            <span className="text-orange-500 text-2xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
