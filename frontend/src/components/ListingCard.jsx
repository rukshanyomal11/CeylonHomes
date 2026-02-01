import { Link } from 'react-router-dom';

export const ListingCard = ({ listing }) => {
  const firstPhoto = listing.photoUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-orange-100 text-orange-800',
    SOLD: 'bg-blue-100 text-blue-800',
    RENTED: 'bg-purple-100 text-purple-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary-400 cursor-pointer">
        <div className="relative h-48">
          <img
            src={firstPhoto}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[listing.status] || 'bg-gray-100 text-gray-800'}`}>
              {listing.status}
            </span>
          </div>
          <div className="absolute top-2 left-2">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {listing.rentOrSale}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {listing.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.city}, {listing.district}
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary-600">
              LKR {listing.price?.toLocaleString()}
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              {listing.bedrooms > 0 && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {listing.bedrooms}
                </span>
              )}
              {listing.bathrooms > 0 && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  {listing.bathrooms}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            {listing.propertyType}
          </div>
        </div>
      </div>
  );
};
