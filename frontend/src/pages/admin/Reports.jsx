import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await adminAPI.getOpenReports();
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No open reports</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Listing: {report.listingTitle}</h3>
                  <p className="text-sm text-gray-600 mb-2"><strong>Reporter:</strong> {report.reporterName} ({report.reporterEmail})</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Reason:</strong> {report.reason}</p>
                  <p className="text-gray-700">{report.details}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleMarkReviewed(report.id)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Mark Reviewed
                  </button>
                  <button 
                    onClick={() => handleClose(report.id)} 
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
