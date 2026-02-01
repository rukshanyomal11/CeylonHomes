import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../services/api';
import { ListingCard } from '../components/ListingCard';

export const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState({ show: false, listing: null });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchLatestListings();
  }, []);

  const fetchLatestListings = async () => {
    try {
      const response = await listingAPI.latest({ page: 0, size: 6 });
      setListings(response.data.content);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (listing) => {
    setViewModal({ show: true, listing });
    setCurrentPhotoIndex(0);
  };

  const closeViewModal = () => {
    setViewModal({ show: false, listing: null });
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (viewModal.listing?.photoUrls) {
      setCurrentPhotoIndex((prev) => 
        prev === viewModal.listing.photoUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (viewModal.listing?.photoUrls) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? viewModal.listing.photoUrls.length - 1 : prev - 1
      );
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Find Your Perfect Home in Sri Lanka</h1>
              <p className="text-xl mb-8">Browse thousands of properties for rent and sale across the island</p>
              
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Search by city or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Link
                    to={`/listings${searchTerm ? `?city=${searchTerm}` : ''}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold text-center"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="/Wavy_REst-03_Single-01.jpg" 
                alt="CeylonHomes Property" 
                className="rounded-lg shadow-2xl w-2/4 h-auto object-cover mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Latest Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Listings</h2>
          <Link to="/listings" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} onClick={() => openViewModal(listing)}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CeylonHomes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary-400">
              <div className="text-primary-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">All listings are reviewed and approved by our admin team</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary-400">
              <div className="text-primary-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find properties with advanced filters and search options</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary-400">
              <div className="text-primary-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
              <p className="text-gray-600">Connect directly with property owners and sellers</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Listing Modal */}
      {viewModal.show && viewModal.listing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{viewModal.listing.title}</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Photo Gallery */}
              {viewModal.listing.photoUrls && viewModal.listing.photoUrls.length > 0 && (
                <div className="mb-6">
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={viewModal.listing.photoUrls[currentPhotoIndex]}
                      alt={`Photo ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                      }}
                    />
                    
                    {viewModal.listing.photoUrls.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentPhotoIndex + 1} / {viewModal.listing.photoUrls.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Photo Thumbnails */}
                  {viewModal.listing.photoUrls.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {viewModal.listing.photoUrls.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentPhotoIndex
                              ? 'border-primary-500 ring-2 ring-primary-200'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Price and Type */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-primary-600">
                    LKR {viewModal.listing.price?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {viewModal.listing.rentOrSale}
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="text-lg font-semibold text-gray-900">{viewModal.listing.propertyType}</p>
                  </div>
                  {viewModal.listing.bedrooms > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="text-lg font-semibold text-gray-900">{viewModal.listing.bedrooms}</p>
                    </div>
                  )}
                  {viewModal.listing.bathrooms > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="text-lg font-semibold text-gray-900">{viewModal.listing.bathrooms}</p>
                    </div>
                  )}
                  {viewModal.listing.size && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Land Size</p>
                      <p className="text-lg font-semibold text-gray-900">{viewModal.listing.size}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {viewModal.listing.address}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {viewModal.listing.city}, {viewModal.listing.district}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{viewModal.listing.description}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-900 font-medium">{viewModal.listing.contactPhone}</span>
                  </div>
                  {viewModal.listing.contactWhatsapp && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="text-gray-900 font-medium">{viewModal.listing.contactWhatsapp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              {(viewModal.listing.availabilityStart || viewModal.listing.availabilityEnd) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {viewModal.listing.availabilityStart && (
                      <p className="text-gray-700">
                        <span className="font-medium">Available from:</span>{' '}
                        {new Date(viewModal.listing.availabilityStart).toLocaleDateString()}
                      </p>
                    )}
                    {viewModal.listing.availabilityEnd && (
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Available until:</span>{' '}
                        {new Date(viewModal.listing.availabilityEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Posted Date */}
              <div className="text-sm text-gray-500 border-t pt-4">
                Posted on {new Date(viewModal.listing.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
