import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getReports();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async (id) => {
    try {
      await adminAPI.markReportAsReviewed(id);
      toast.success('Report marked as reviewed');
      fetchReports();
    } catch (error) {
      toast.error('Failed to update report');
    }
  };

  const handleClose = async (id) => {
    try {
      await adminAPI.closeReport(id);
      toast.success('Report closed');
      fetchReports();
    } catch (error) {
      toast.error('Failed to close report');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      OPEN: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
      REVIEWED: 'bg-blue-50 text-blue-800 ring-blue-200',
      CLOSED: 'bg-green-50 text-green-800 ring-green-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredReports = reports.filter((report) => {
    const matchesStatus = statusFilter === 'ALL' ? true : report.status === statusFilter;
    if (!matchesStatus) return false;
    if (!normalizedSearch) return true;
    return (
      report.listingTitle?.toLowerCase().includes(normalizedSearch) ||
      report.reporterName?.toLowerCase().includes(normalizedSearch) ||
      report.reporterEmail?.toLowerCase().includes(normalizedSearch) ||
      report.reason?.toLowerCase().includes(normalizedSearch)
    );
  });

  const totalPages = Math.max(Math.ceil(filteredReports.length / pageSize), 1);
  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * pageSize;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="OPEN">Open</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="CLOSED">Closed</option>
                <option value="ALL">All</option>
              </select>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                placeholder="Search by listing, reporter, or reason"
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <p className="text-slate-500">No reports found</p>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Listing</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Reporter</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedReports.map((report, index) => (
                    <tr key={report.id} className="transition-colors even:bg-slate-50/50 hover:bg-primary-50/50">
                      <td className="px-6 py-4 text-slate-500">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(report.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{report.listingTitle}</td>
                      <td className="px-6 py-4 text-slate-700">
                        <div className="font-medium">{report.reporterName}</div>
                        <div className="text-xs text-slate-500">{report.reporterEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="font-medium text-slate-700">{report.reason}</div>
                        <div className="text-xs text-slate-500">{report.details}</div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {report.status === 'OPEN' && (
                            <button
                              onClick={() => handleMarkReviewed(report.id)}
                              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-100"
                            >
                              Mark Reviewed
                            </button>
                          )}
                          {report.status !== 'CLOSED' && (
                            <button
                              onClick={() => handleClose(report.id)}
                              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
                <p className="text-sm text-slate-600">
                  Page {Math.min(safePage + 1, totalPages)} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={safePage === 0}
                    className="px-3 py-1.5 text-sm rounded-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={safePage + 1 >= totalPages}
                    className="px-3 py-1.5 text-sm rounded-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
