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
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          Loading overview...
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Pending',
      value: summary?.pending || 0,
      icon: '\u23F3',
      valueColor: 'text-yellow-700',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-700',
      bar: 'bg-yellow-400',
      helper: 'Awaiting admin review',
    },
    {
      label: 'Approved',
      value: summary?.approved || 0,
      icon: '\u2705',
      valueColor: 'text-green-700',
      iconBg: 'bg-green-100',
      iconText: 'text-green-700',
      bar: 'bg-green-400',
      helper: 'Live and visible',
    },
    {
      label: 'Rejected',
      value: summary?.rejected || 0,
      icon: '\u274C',
      valueColor: 'text-red-700',
      iconBg: 'bg-red-100',
      iconText: 'text-red-700',
      bar: 'bg-red-400',
      helper: 'Needs your attention',
    },
    {
      label: 'Sold',
      value: summary?.sold || 0,
      icon: '\uD83D\uDCB0',
      valueColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-700',
      bar: 'bg-blue-400',
      helper: 'Successfully sold',
    },
    {
      label: 'Rented',
      value: summary?.rented || 0,
      icon: '\uD83C\uDFE0',
      valueColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-700',
      bar: 'bg-purple-400',
      helper: 'Currently rented',
    },
    {
      label: 'Archived',
      value: summary?.archived || 0,
      icon: '\uD83D\uDCC3',
      valueColor: 'text-slate-700',
      iconBg: 'bg-slate-100',
      iconText: 'text-slate-700',
      bar: 'bg-slate-400',
      helper: 'Hidden from listings',
    },
  ];

  const totalListings = stats.reduce((sum, stat) => sum + stat.value, 0);
  const getPercent = (value) => (totalListings ? Math.round((value / totalListings) * 100) : 0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 px-6 py-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-100">Seller Dashboard</p>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-primary-50 max-w-2xl">
            Track how your listings are performing and respond quickly to rejections.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/seller/listings/new"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
            >
              Create Listing
            </Link>
            <Link
              to="/seller/listings"
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              View Listings
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{stat.label}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</span>
                  <span className="text-xs text-slate-400">listings</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{stat.helper}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconText} shadow-sm`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
            <div className="relative mt-4 h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${stat.bar}`} style={{ width: `${getPercent(stat.value)}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              {totalListings ? `${getPercent(stat.value)}% of your listings` : 'No listings yet'}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-primary-100 bg-primary-50/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Rejected Listings</h2>
              <p className="text-xs text-primary-700">Last 3 rejected listings</p>
            </div>
            <Link
              to="/seller/inquiries"
              className="text-sm text-primary-700 hover:text-primary-800 font-semibold"
            >
              View All {'\u2192'}
            </Link>
          </div>
        </div>

        <div className="p-6">
          {recentRejected.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xl">
                <span>{'\u2714'}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">No rejected listings right now.</p>
              <p className="text-xs text-slate-400">Great job keeping your listings clean.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRejected.map((listing) => (
                <div
                  key={listing.id}
                  className="group rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{listing.title}</h3>
                      <p className="text-sm text-slate-600">
                        {listing.city}, {listing.district} - Rs. {listing.price?.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
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
