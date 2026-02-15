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
    <div className="bg-slate-50">
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" style={{ animation: 'floatSlow 10s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" style={{ animation: 'floatSlow 12s ease-in-out infinite' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" style={{ animation: 'fadeUp 0.9s ease both' }}>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">CeylonHomes</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-tight">
                Find Your Perfect Home in Sri Lanka
              </h1>
              <p className="text-lg text-primary-100/90">
                Browse verified properties for rent and sale across the island. Discover your next home with confidence.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Verified listings</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Direct owner contact</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Islandwide coverage</span>
              </div>

              <div className="rounded-2xl bg-white/95 text-slate-900 shadow-2xl border border-white/40 p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by city or district..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                    />
                  </div>
                  <Link
                    to={`/listings${searchTerm ? `?city=${searchTerm}` : ''}`}
                    className="rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 font-semibold text-center shadow-sm transition"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block" style={{ animation: 'fadeUp 1.1s ease both' }}>
              <div className="relative rounded-[32px] border border-white/20 bg-white/10 p-4 backdrop-blur">
                <img
                  src="/Wavy_REst-03_Single-01.jpg"
                  alt="CeylonHomes Property"
                  className="rounded-2xl shadow-2xl w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-8 rounded-2xl bg-white px-5 py-4 text-slate-800 shadow-lg border border-slate-100">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Latest verified</p>
                <p className="text-lg font-semibold">Fresh listings added daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Latest Listings</p>
              <h2 className="text-3xl font-serif font-semibold text-slate-900">Fresh on CeylonHomes</h2>
              <p className="text-slate-600 mt-2">Explore the newest properties approved by our admin team.</p>
            </div>
            <Link to="/listings" className="text-primary-700 hover:text-primary-800 font-semibold">
              View all listings &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => openViewModal(listing)}
                  className="group cursor-pointer transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary-500/10 opacity-0 group-hover:opacity-100 transition" />
                    <ListingCard listing={listing} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-14 bg-gradient-to-b from-white via-primary-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Why CeylonHomes</p>
            <h2 className="text-3xl font-serif font-semibold text-slate-900">Why Choose CeylonHomes?</h2>
            <p className="text-slate-600 mt-3">A trusted marketplace designed for buyers, renters, and sellers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Verified Listings</h3>
              <p className="text-slate-600">All listings are reviewed and approved by our admin team.</p>
              <div className="mt-4 h-1 w-12 rounded-full bg-primary-500" />
            </div>
            <div className="group rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Search</h3>
              <p className="text-slate-600">Find properties fast with filters and smart search tools.</p>
              <div className="mt-4 h-1 w-12 rounded-full bg-primary-500" />
            </div>
            <div className="group rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Direct Contact</h3>
              <p className="text-slate-600">Connect directly with owners and sellers to move faster.</p>
              <div className="mt-4 h-1 w-12 rounded-full bg-primary-500" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 p-8 text-white shadow-lg">
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-serif font-semibold">Ready to list your property?</h3>
                <p className="mt-2 text-primary-100">Create a listing and reach serious buyers across Sri Lanka.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
                >
                  List your property
                </Link>
                <Link
                  to="/listings"
                  className="rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Browse listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">CeylonHomes</h3>
              <p className="mt-3 text-sm text-slate-600">
                Trusted property listings across Sri Lanka. Find, list, and manage
                homes with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</h4>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a href="/" className="text-slate-600 hover:text-primary-700">Home</a>
                <a href="/listings" className="text-slate-600 hover:text-primary-700">Browse Listings</a>
                <a href="/login" className="text-slate-600 hover:text-primary-700">Login</a>
                <a href="/register" className="text-slate-600 hover:text-primary-700">Register</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Contact</h4>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>support@ceylonhomes.lk</p>
                <p>+94 77 123 4567</p>
                <p>Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500">
            <p>© 2026 CeylonHomes. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-primary-700">Privacy</a>
              <a href="/terms" className="hover:text-primary-700">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* View Listing Modal  */}
      {viewModal.show && viewModal.listing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-primary-100/60 bg-white/95 shadow-[0_50px_160px_-80px_rgba(0,0,0,0.75)]">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.18),transparent_55%)]" />
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative">
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
              <div className="max-h-[80vh] overflow-y-auto p-6 lg:p-8">
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
                          <div className="grid grid-cols-4 gap-3">
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
                      <div className="mt-4 grid grid-cols-2 gap-3">
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

