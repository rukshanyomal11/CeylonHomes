import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.data.user.role === 'SELLER') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      if (errorMessage.toLowerCase().includes('password')) {
        toast.error('Wrong password! Please try again.');
      } else if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('email')) {
        toast.error('Email not found! Please check your email.');
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
                <Link to="/register" className="text-sm text-gray-600 hover:text-primary-600">
                  Sign Up
                </Link>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  placeholder="Enter your email"
                />
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

              <div className="text-xs text-gray-600 bg-primary-50 p-3 rounded-md">
                <p className="font-semibold">Admin Login:</p>
                <p>Email: admin@local</p>
                <p>Password: Admin@123</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
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
                    src="/Wavy_REst-03_Single-04.jpg" 
                    alt="CeylonHomes Login" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-white text-lg font-medium">Welcome back to CeylonHomes</p>
              <p className="text-yellow-100 mt-2">Sign in to manage your properties</p>
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
