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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center">
                  <span className="text-lg font-bold text-primary-600">Ceylon</span>
                  <span className="text-lg font-bold text-gray-800">Homes</span>
                </Link>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">
                  Login
                </Link>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="0771234567 or +94771234567"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 10 digits starting with 0 or with country code +94</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>

              <div className="text-center mt-3">
                <span className="text-xs text-gray-600">
                  Or With
                </span>
              </div>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex bg-gradient-to-br from-primary-500 to-primary-700 p-12 items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <div className="w-80 h-80 mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <img 
                    src="/9778741.jpg" 
                    alt="CeylonHomes Registration" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-white text-lg font-medium">Find your perfect home in Sri Lanka</p>
              <p className="text-yellow-100 mt-2">Join thousands of property seekers and sellers</p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-yellow-300 bg-opacity-40 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
