export const ListingCard = ({ listing }) => {
  const firstPhoto = listing.photoUrls?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  const statusColors = {
    PENDING: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
    SUSPENDED: 'bg-orange-50 text-orange-700 ring-orange-200',
    SOLD: 'bg-blue-50 text-blue-700 ring-blue-200',
    RENTED: 'bg-purple-50 text-purple-700 ring-purple-200',
    ARCHIVED: 'bg-slate-50 text-slate-700 ring-slate-200',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
      <div className="relative h-52">
        <img
          src={firstPhoto}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-primary-700 shadow-sm">
            {listing.rentOrSale}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusColors[listing.status] || 'bg-gray-50 text-gray-700 ring-gray-200'}`}>
            {listing.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
          {listing.propertyType}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
          {listing.title}
        </h3>

        <div className="flex items-center text-sm text-slate-600 mb-3">
          <svg className="w-4 h-4 mr-1 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.city}, {listing.district}
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-700">
            LKR {listing.price?.toLocaleString()}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            {listing.bedrooms > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {listing.bedrooms}
              </span>
            )}
            {listing.bathrooms > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {listing.bathrooms}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
