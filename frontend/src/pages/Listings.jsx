import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listingAPI } from '../services/api';
import { ListingCard } from '../components/ListingCard';
import { FiltersSidebar } from '../components/FiltersSidebar';
import { Pagination } from '../components/Pagination';

export const Listings = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    district: searchParams.get('district') || '',
    city: searchParams.get('city') || '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewModal, setViewModal] = useState({ show: false, listing: null });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [currentPage]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: 6,
      };
      
      // Add filters only if they have values
      if (filters.district) params.district = filters.district;
      if (filters.city) params.city = filters.city;
      if (filters.rentOrSale) params.rentOrSale = filters.rentOrSale;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.bathrooms) params.bathrooms = filters.bathrooms;
      
      const response = await listingAPI.search(params);
      setListings(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchListings();
    setShowFilters(false); // Close filters on mobile after search
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setTimeout(() => fetchListings(), 100);
    setShowFilters(false); // Close filters on mobile after clear
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 px-6 py-6 text-white shadow-lg mb-6">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary-100">Browse</p>
              <h1 className="text-3xl font-bold">Browse Properties</h1>
              <p className="mt-2 text-sm text-primary-50">
                Discover verified listings across Sri Lanka. Filter by location, price, or type.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {filters.district && (
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">District: {filters.district}</span>
              )}
              {filters.city && (
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">City: {filters.city}</span>
              )}
              {filters.rentOrSale && (
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">{filters.rentOrSale}</span>
              )}
              {filters.propertyType && (
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">{filters.propertyType}</span>
              )}
              {!filters.district && !filters.city && !filters.rentOrSale && !filters.propertyType && (
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">All listings</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 flex items-center justify-center shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Mobile Drawer / Desktop Sidebar */}
          <div className={`
            lg:w-1/4
            ${showFilters ? 'block' : 'hidden lg:block'}
          `}>
            <FiltersSidebar
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-600">Results</p>
                <p className="text-sm text-slate-600">
                  {loading ? 'Loading listings...' : `${listings.length} listing${listings.length === 1 ? '' : 's'} found`}
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-8 text-center">
                <p className="text-slate-600">No listings found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div key={listing.id} onClick={() => openViewModal(listing)}>
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>


      {/* View Listing Modal */}
      {viewModal.show && viewModal.listing && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-primary-100/60 bg-white/95 shadow-[0_50px_160px_-80px_rgba(0,0,0,0.75)] flex flex-col">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.18),transparent_55%)]" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative flex flex-col">
              {/* Modal Header */}
              <div className="relative overflow-hidden border-b border-primary-200/40 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 px-6 py-5">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary-100">Listing Details</p>
                    <h2 className="text-3xl font-bold text-white mt-1">{viewModal.listing.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{viewModal.listing.rentOrSale}</span>
                      <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{viewModal.listing.propertyType}</span>
                      {viewModal.listing.status && (
                        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{viewModal.listing.status}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={closeViewModal}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    aria-label="Close modal"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                  {/* Gallery */}
                  <div className="space-y-4">
                    {viewModal.listing.photoUrls && viewModal.listing.photoUrls.length > 0 ? (
                      <>
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                          <img
                            src={viewModal.listing.photoUrls[currentPhotoIndex]}
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                            }}
                          />
                          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                            {currentPhotoIndex + 1} / {viewModal.listing.photoUrls.length}
                          </div>

                          {viewModal.listing.photoUrls.length > 1 && (
                            <>
                              <button
                                onClick={prevPhoto}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-slate-800 p-2 rounded-full shadow-sm transition"
                                aria-label="Previous photo"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={nextPhoto}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-slate-800 p-2 rounded-full shadow-sm transition"
                                aria-label="Next photo"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>

                        {viewModal.listing.photoUrls.length > 1 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {viewModal.listing.photoUrls.map((photo, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`aspect-video overflow-hidden rounded-xl border transition-all ${
                                  currentPhotoIndex === index
                                    ? 'border-primary-500 ring-2 ring-primary-200'
                                    : 'border-slate-200 hover:border-primary-300'
                                }`}
                              >
                                <img
                                  src={photo}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="aspect-video rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                        No photos available
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-primary-100/80 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Location</p>
                          <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
                            <svg className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
                              <circle cx="12" cy="11" r="2" />
                            </svg>
                            {viewModal.listing.city}, {viewModal.listing.district}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{viewModal.listing.address}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Price</p>
                          <p className="text-2xl font-bold text-primary-700">LKR {viewModal.listing.price?.toLocaleString()}</p>
                          <p className="text-xs text-slate-500 mt-1">Posted {new Date(viewModal.listing.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary-100/80 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Highlights</p>
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Bedrooms</p>
                          <p className="text-lg font-semibold text-slate-900">{viewModal.listing.bedrooms || 0}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Bathrooms</p>
                          <p className="text-lg font-semibold text-slate-900">{viewModal.listing.bathrooms || 0}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Size</p>
                          <p className="text-lg font-semibold text-slate-900">{viewModal.listing.size || 'N/A'}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Type</p>
                          <p className="text-sm font-semibold text-slate-900">{viewModal.listing.propertyType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Contact</p>
                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{viewModal.listing.contactPhone || 'N/A'}</span>
                        </div>
                        {viewModal.listing.contactWhatsapp && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span>{viewModal.listing.contactWhatsapp}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Description</p>
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                        {viewModal.listing.description || 'No description provided.'}
                      </p>
                    </div>

                    {(viewModal.listing.availabilityStart || viewModal.listing.availabilityEnd) && (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Availability</p>
                        <div className="mt-2 text-sm text-slate-700">
                          {viewModal.listing.availabilityStart && (
                            <p>
                              <span className="font-semibold">From:</span>{' '}
                              {new Date(viewModal.listing.availabilityStart).toLocaleDateString()}
                            </p>
                          )}
                          {viewModal.listing.availabilityEnd && (
                            <p>
                              <span className="font-semibold">Until:</span>{' '}
                              {new Date(viewModal.listing.availabilityEnd).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
