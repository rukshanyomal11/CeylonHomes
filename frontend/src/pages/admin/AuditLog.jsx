import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const AuditLog = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const fetchAuditLog = async () => {
    try {
      const response = await adminAPI.getApprovalHistory({ page: 0, size: 100 });
      setActions(response.data || []);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      toast.error('Failed to load audit log');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-purple-100 text-purple-800',
      UNSUSPENDED: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[action]}`}>{action}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Audit Log</h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {actions.map((action) => (
                <tr key={action.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{new Date(action.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">{action.listingTitle}</td>
                  <td className="px-6 py-4">{getActionBadge(action.action)}</td>
                  <td className="px-6 py-4 text-sm">{action.adminName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{action.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
