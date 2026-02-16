import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'SELLER'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validatePhone = (phone) => {
    // Remove any non-digit characters for validation
    const digits = phone.replace(/\D/g, '');
    
    // Sri Lankan phone numbers: 10 digits (0771234567) or with country code +94771234567 (12 digits)
    if (digits.length === 10 && digits.startsWith('0')) {
      return true;
    }
    if (digits.length === 11 && digits.startsWith('94')) {
      return true;
    }
    if (digits.length === 12 && phone.startsWith('+94')) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      toast.error('Phone number must be 10 digits (e.g., 0771234567 or +94771234567)');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      login(response.data);
      toast.success('Registration successful! Welcome to CeylonHomes!');
      
      // Redirect based on role
      if (formData.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already')) {
        toast.error('This email is already registered. Please use a different email or login.');
      } else if (errorMessage.toLowerCase().includes('phone') && errorMessage.toLowerCase().includes('already')) {
        toast.error('This phone number is already registered. Please use a different number.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-amber-50 to-white overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative z-10 max-w-5xl w-full rounded-[32px] border border-primary-100 bg-white/90 backdrop-blur shadow-[0_45px_120px_-70px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center">
                  <span className="text-lg font-bold text-primary-600">Ceylon</span>
                  <span className="text-lg font-bold text-gray-800">Homes</span>
                </Link>
                <Link to="/login" className="text-xs font-semibold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  Login
                </Link>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-600 font-semibold">Get started</p>
              <h2 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Create your account</h2>
              <p className="text-sm text-slate-600 mt-2">List properties and connect with serious buyers.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-xs text-gray-500">(10 digits)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                  placeholder="0771234567 or +94771234567"
                />
                <p className="text-xs text-slate-500 mt-1">Enter 10 digits starting with 0 or with country code +94</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.21-2.72 3.41-4.89 6.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7a11.07 11.07 0 0 1-2.64 3.88" />
                        <path d="M1 1l22 22" />
                        <path d="M10.7 10.7a2.5 2.5 0 0 0 3.54 3.54" />
                        <path d="M9.5 9.5a2.5 2.5 0 0 1 3.54 3.54" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white text-sm shadow-sm"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20c-5 0-9.27-3.11-11-7 1.21-2.72 3.41-4.89 6.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7a11.07 11.07 0 0 1-2.64 3.88" />
                        <path d="M1 1l22 22" />
                        <path d="M10.7 10.7a2.5 2.5 0 0 0 3.54 3.54" />
                        <path d="M9.5 9.5a2.5 2.5 0 0 1 3.54 3.54" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm shadow-sm"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
              <p className="text-xs text-slate-500 text-center">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-800">
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:block relative overflow-hidden">
            <img
              src="/9778741.jpg"
              alt="CeylonHomes Registration"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700/80 to-amber-500/60"></div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center text-white">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <img
                  src="/9778741.jpg"
                  alt="CeylonHomes Registration"
                  className="w-72 h-72 object-cover rounded-2xl shadow-xl"
                />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">Find your perfect home in Sri Lanka</h3>
              <p className="text-primary-100 mt-2">Join thousands of property seekers and sellers</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white/15 px-3 py-1">Seller profiles</span>
                <span className="rounded-full bg-white/15 px-3 py-1">Admin approved</span>
                <span className="rounded-full bg-white/15 px-3 py-1">Secure access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
