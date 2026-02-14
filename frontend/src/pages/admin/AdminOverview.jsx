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
    { label: 'Pending Listings', value: stats?.pendingCount || 0, color: 'bg-yellow-100 text-yellow-800', accent: 'bg-yellow-200/40', link: '/admin/pending' },
    { label: 'Approved Listings', value: stats?.approvedCount || 0, color: 'bg-green-100 text-green-800', accent: 'bg-green-200/40', link: '/admin/listings?status=APPROVED' },
    { label: 'Rejected Listings', value: stats?.rejectedCount || 0, color: 'bg-red-100 text-red-800', accent: 'bg-red-200/40', link: '/admin/listings?status=REJECTED' },
    { label: 'Suspended Listings', value: stats?.suspendedCount || 0, color: 'bg-purple-100 text-purple-800', accent: 'bg-purple-200/40', link: '/admin/listings?status=SUSPENDED' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-600 font-semibold">Admin Dashboard</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Overview</h1>
            <p className="text-sm text-slate-600 mt-2">
              Track listings and approvals in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/pending"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-primary-700 transition"
            >
              Review Pending
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${stat.accent}`}></div>
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${stat.color}`}>
              {stat.label}
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">View details</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
          <span className="text-xs text-slate-500">Fast access</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/pending"
            className="flex items-center justify-between p-5 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white hover:border-primary-400 hover:shadow-md transition-all"
          >
            <div>
              <h3 className="font-semibold text-slate-900">Review Pending Listings</h3>
              <p className="text-sm text-slate-600">Approve or reject new listings</p>
            </div>
            <span className="text-primary-600 text-xl font-bold">-&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
