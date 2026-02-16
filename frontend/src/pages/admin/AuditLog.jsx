import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const AuditLog = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;
  const startIndex = page * pageSize;

  useEffect(() => {
    fetchAuditLog();
  }, [page]);

  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getApprovalHistory({ page, size: pageSize });
      setActions(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      toast.error('Failed to load audit log');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      APPROVED: 'bg-green-50 text-green-800 ring-green-200',
      REJECTED: 'bg-red-50 text-red-800 ring-red-200',
      SUSPENDED: 'bg-purple-50 text-purple-800 ring-purple-200',
      UNSUSPENDED: 'bg-blue-50 text-blue-800 ring-blue-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${colors[action]}`}>
        {action}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Audit Log</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            Loading audit log...
          </div>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actions.map((action, index) => (
                <tr key={action.id} className="transition-colors even:bg-slate-50/50 hover:bg-primary-50/50">
                  <td className="px-6 py-4 text-slate-500">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(action.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{action.listingTitle}</td>
                  <td className="px-6 py-4">{getActionBadge(action.action)}</td>
                  <td className="px-6 py-4 text-slate-700">{action.adminName}</td>
                  <td className="px-6 py-4 text-slate-600">{action.note}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

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
