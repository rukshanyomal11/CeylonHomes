export const FiltersSidebar = ({ filters, setFilters, onSearch, onClearFilters }) => {
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2';
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-200 focus:outline-none';

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-2xl border border-primary-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-primary-50/80 px-5 py-4 border-b border-primary-100">
        <h2 className="text-sm font-semibold text-primary-900">Filters</h2>
        <p className="text-xs text-primary-700">Narrow your search quickly.</p>
      </div>

      <div className="space-y-4 p-5">
        {/* District */}
        <div>
          <label className={labelClass}>District</label>
          <select
            value={filters.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            className={inputClass}
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Enter city"
            className={inputClass}
          />
        </div>

        {/* Rent or Sale */}
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={filters.rentOrSale || ''}
            onChange={(e) => handleChange('rentOrSale', e.target.value)}
            className={inputClass}
          >
            <option value="">All</option>
            <option value="RENT">For Rent</option>
            <option value="SALE">For Sale</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className={labelClass}>Property Type</label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            className={inputClass}
          >
            <option value="">All Types</option>
            <option value="HOUSE">House</option>
            <option value="ROOM">Room</option>
            <option value="ANNEX">Annex</option>
            <option value="BOARDING">Boarding</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className={labelClass}>Price Range (LKR)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Min"
              className={inputClass}
            />
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className={labelClass}>Min Bedrooms</label>
          <select
            value={filters.bedrooms || ''}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
            className={inputClass}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className={labelClass}>Min Bathrooms</label>
          <select
            value={filters.bathrooms || ''}
            onChange={(e) => handleChange('bathrooms', e.target.value)}
            className={inputClass}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <button
          onClick={onSearch}
          className="w-full rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 transition-colors"
        >
          Apply Filters
        </button>

        <button
          onClick={onClearFilters || (() => {
            setFilters({});
            onSearch();
          })}
          className="w-full rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
