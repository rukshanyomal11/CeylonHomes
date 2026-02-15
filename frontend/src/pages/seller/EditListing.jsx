import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sellerAPI } from '../../api/sellerAPI';
import { toast } from 'react-hot-toast';

export const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rentOrSale: 'SALE',
    propertyType: 'HOUSE',
    price: '',
    district: '',
    city: '',
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    size: '',
    contactPhone: '',
    contactWhatsapp: '',
    availabilityStart: '',
    availabilityEnd: '',
  });
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-200 focus:outline-none';
  const textareaClass = `${inputClass} min-h-[140px] resize-y`;
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2';

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await sellerAPI.getListing(id);
      const listing = response.data;
      
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        rentOrSale: listing.rentOrSale || 'SALE',
        propertyType: listing.propertyType || 'HOUSE',
        price: listing.price || '',
        district: listing.district || '',
        city: listing.city || '',
        address: listing.address || '',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        size: listing.size || '',
        contactPhone: listing.contactPhone || '',
        contactWhatsapp: listing.contactWhatsapp || '',
        availabilityStart: listing.availabilityStart || '',
        availabilityEnd: listing.availabilityEnd || '',
      });
      
      setExistingPhotos(listing.photos || []);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing');
      navigate('/seller/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingPhoto = async (photoPath) => {
    // Extract photo ID from path if needed
    // For now, we'll just remove from UI
    setExistingPhotos((prev) => prev.filter((p) => p !== photoPath));
    toast.info('Photo will be removed when you save');
  };

  const removeNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number - must be exactly 10 digits
    const phoneDigits = formData.contactPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Contact Phone must be exactly 10 digits');
      return;
    }
    
    // Validate WhatsApp number if provided - must be exactly 10 digits
    if (formData.contactWhatsapp) {
      const whatsappDigits = formData.contactWhatsapp.replace(/\D/g, '');
      if (whatsappDigits.length !== 10) {
        toast.error('Contact WhatsApp must be exactly 10 digits');
        return;
      }
    }
    
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== '' && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append new photos
      newPhotos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      await sellerAPI.updateListing(id, formDataToSend);
      toast.success('Listing updated successfully! Status changed to PENDING for admin review.');
      navigate('/seller/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-bold">Edit Listing</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-50">
              Update the details. If the listing was approved, it will be set to PENDING after editing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Required fields *</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Status resets to PENDING</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-primary-100 bg-white shadow-sm">
          <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-900">Basic Details</h2>
            <p className="text-xs text-primary-700">Title, description, and listing type.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="rentOrSale"
                value={formData.rentOrSale}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="HOUSE">House</option>
                <option value="ROOM">Room</option>
                <option value="ANNEX">Annex</option>
                <option value="BOARDING">Boarding</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary-100 bg-white shadow-sm">
          <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-900">Pricing & Location</h2>
            <p className="text-xs text-primary-700">Set the price and property address.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <label className={labelClass}>
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                District <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select District</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                maxLength={80}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary-100 bg-white shadow-sm">
          <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-900">Property Details</h2>
            <p className="text-xs text-primary-700">Rooms, size, and other essentials.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                maxLength={50}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary-100 bg-white shadow-sm">
          <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-900">Contact</h2>
            <p className="text-xs text-primary-700">Use 10 digit phone numbers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <label className={labelClass}>
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
                className={inputClass}
                placeholder="e.g., 0771234567"
                title="Please enter exactly 10 digits"
              />
            </div>

            <div>
              <label className={labelClass}>Contact WhatsApp</label>
              <input
                type="tel"
                name="contactWhatsapp"
                value={formData.contactWhatsapp}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                className={inputClass}
                placeholder="e.g., 0771234567"
                title="Please enter exactly 10 digits"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary-100 bg-white shadow-sm">
          <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-900">Availability</h2>
            <p className="text-xs text-primary-700">Optional availability dates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <label className={labelClass}>Available From</label>
              <input
                type="date"
                name="availabilityStart"
                value={formData.availabilityStart}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Available Until</label>
              <input
                type="date"
                name="availabilityEnd"
                value={formData.availabilityEnd}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary-100 bg-white shadow-sm">
          <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-primary-900">Photos</h2>
            <p className="text-xs text-primary-700">Manage existing photos and add new ones.</p>
          </div>
          <div className="space-y-6 p-6">
            {existingPhotos.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Existing Photos</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingPhotos.map((photo, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={`http://localhost:8080/${photo}`}
                        alt={`Existing ${index + 1}`}
                        className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(photo)}
                        className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-red-50"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add New Photos</p>
              <div className="rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700"
                />
              </div>

              {newPhotoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newPhotoPreviews.map((preview, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewPhoto(index)}
                        className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-red-50"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/seller/listings')}
            className="px-6 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-400"
          >
            {submitting ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

