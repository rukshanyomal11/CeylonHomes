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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Listing</h1>
        <p className="text-gray-600 mt-2">
          Update the details. If the listing was approved, it will be set to PENDING after editing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={150}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Rent or Sale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="rentOrSale"
              value={formData.rentOrSale}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="HOUSE">House</option>
              <option value="ROOM">Room</option>
              <option value="ANNEX">Annex</option>
              <option value="BOARDING">Boarding</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              maxLength={80}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 0771234567"
              title="Please enter exactly 10 digits"
            />
          </div>

          {/* Contact WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact WhatsApp
            </label>
            <input
              type="tel"
              name="contactWhatsapp"
              value={formData.contactWhatsapp}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 0771234567"
              title="Please enter exactly 10 digits"
            />
          </div>

          {/* Availability Start */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available From
            </label>
            <input
              type="date"
              name="availabilityStart"
              value={formData.availabilityStart}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Availability End */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Until
            </label>
            <input
              type="date"
              name="availabilityEnd"
              value={formData.availabilityEnd}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Existing Photos */}
          {existingPhotos.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing Photos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:8080/${photo}`}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photo)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Photos */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            {/* New Photo Previews */}
            {newPhotoPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {newPhotoPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/seller/listings')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-gray-400"
          >
            {submitting ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
