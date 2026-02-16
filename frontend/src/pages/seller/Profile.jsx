import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { sellerAPI } from '../../api/sellerAPI';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-200 focus:outline-none';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await sellerAPI.getProfile();
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Phone must be exactly 10 digits');
      return;
    }
    setConfirmOpen(true);
  };

  const executeSave = async () => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    setConfirmOpen(false);
    setSaving(true);
    try {
      const response = await sellerAPI.updateProfile({
        name: formData.name,
        phone: phoneDigits,
      });
      setFormData((prev) => ({
        ...prev,
        name: response.data.name,
        phone: response.data.phone,
      }));
      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
        <div className="relative flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-100">Profile</p>
          <h1 className="text-3xl font-bold">Seller Profile</h1>
          <p className="mt-1 text-sm text-primary-50">
            Update your name and phone number. Email cannot be changed.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-primary-100 bg-white shadow-sm">
        <div className="border-b border-primary-100 bg-primary-50/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-primary-900">Account Details</h2>
          <p className="text-xs text-primary-700">Keep your contact info up to date.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="md:col-span-2">
            <label className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              className={inputClass}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              className={inputClass}
              placeholder="e.g., 0771234567"
              title="Please enter exactly 10 digits"
            />
          </div>
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Changes</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save these changes to your profile?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={executeSave}
                className="px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
                disabled={saving}
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
