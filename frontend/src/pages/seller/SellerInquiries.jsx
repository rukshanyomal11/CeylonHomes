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
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Rejected Listings</h1>

      {rejectedListings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No rejected listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rejectedListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Photos Gallery */}
                  {listing.photoUrls && listing.photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {listing.photoUrls.map((photo, index) => (
                        <div key={index} className="aspect-square">
                          <img
                            src={photo}
                            alt={`${listing.title} - Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        REJECTED
                      </span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                        {listing.rentOrSale}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {listing.propertyType}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Location:</strong> {listing.city}, {listing.district}
                    </p>
                    <p className="text-gray-900 font-semibold text-lg mb-3">
                      Rs. {listing.price?.toLocaleString()}
                    </p>
                    
                    {/* Rejection Reason */}
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-sm font-semibold text-red-900 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-800">
                        {listing.rejectionReason || 'No reason provided'}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mt-3">
                      <strong>Description:</strong> {listing.description?.substring(0, 150)}...
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-2">
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
