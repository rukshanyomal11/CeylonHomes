import { useEffect, useState } from 'react';
import { sellerAPI } from '../../api/sellerAPI';
import { toast } from 'react-hot-toast';

export const SellerInquiries = () => {
  const [rejectedListings, setRejectedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedListings();
  }, []);

  const fetchRejectedListings = async () => {
    try {
      const response = await sellerAPI.getListings('REJECTED');
      setRejectedListings(response.data);
    } catch (error) {
      console.error('Error fetching rejected listings:', error);
      toast.error('Failed to load rejected listings');
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

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 px-6 py-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary-100">Seller Dashboard</p>
            <h1 className="text-3xl font-bold">Rejected Listings</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-50">
              Review why listings were rejected and update them before resubmitting.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Rejected: {rejectedListings.length}</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Needs action</span>
          </div>
        </div>
      </div>

      {rejectedListings.length === 0 ? (
        <div className="rounded-2xl border border-primary-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600 text-lg">No rejected listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rejectedListings.map((listing) => (
            <div key={listing.id} className="group rounded-2xl border border-primary-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    {listing.photoUrls && listing.photoUrls.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {listing.photoUrls.slice(0, 4).map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`${listing.title} - Photo ${index + 1}`}
                            className="h-20 w-28 rounded-xl border border-slate-200 object-cover"
                          />
                        ))}
                        {listing.photoUrls.length > 4 && (
                          <div className="h-20 w-28 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 flex items-center justify-center">
                            +{listing.photoUrls.length - 4} more
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{listing.title}</h3>
                        <span className="text-xs text-slate-400">ID #{listing.id}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">REJECTED</span>
                        <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{listing.rentOrSale}</span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{listing.propertyType}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="text-sm font-semibold text-slate-900">{listing.city}, {listing.district}</p>
                        <p className="text-xs text-slate-500">{listing.address}</p>
                      </div>
                      <div className="rounded-xl border border-primary-100 bg-primary-50 p-3">
                        <p className="text-xs text-primary-700">Price</p>
                        <p className="text-lg font-semibold text-primary-700">Rs. {listing.price?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Rejection Reason</p>
                      <p className="mt-2 text-sm text-rose-800">{listing.rejectionReason || 'No reason provided'}</p>
                    </div>

                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Description:</span> {listing.description?.substring(0, 150)}...
                    </p>

                    <p className="text-xs text-slate-500">
                      Rejected on {new Date(listing.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

