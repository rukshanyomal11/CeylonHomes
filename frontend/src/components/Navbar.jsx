import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path) => {
    return isActive(path)
      ? "bg-primary-500 text-white px-3 py-2 rounded-md text-sm font-medium"
      : "text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium";
  };

  const getMobileLinkClass = (path) => {
    return isActive(path)
      ? "block bg-primary-500 text-white px-3 py-2 rounded-md text-base font-medium"
      : "block text-gray-700 hover:bg-gray-100 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b-4 border-primary-400 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold text-primary-600">Ceylon</span>
              <span className="text-2xl font-bold text-gray-800">Homes</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link to="/listings" className={getLinkClass('/listings')}>
              Browse Listings
            </Link>

            {isAuthenticated() && user?.role === 'SELLER' && (
              <Link to="/seller" className={getLinkClass('/seller')}>
                Seller Dashboard
              </Link>
            )}

            {isAuthenticated() && user?.role === 'ADMIN' && (
              <Link to="/admin" className={getLinkClass('/admin')}>
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated() ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 hidden lg:inline">
                    {user?.name} <span className="text-xs text-primary-600">({user?.role})</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={getMobileLinkClass('/')} onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/listings" className={getMobileLinkClass('/listings')} onClick={() => setMobileMenuOpen(false)}>
              Browse Listings
            </Link>

            {isAuthenticated() && user?.role === 'SELLER' && (
              <Link to="/seller" className={getMobileLinkClass('/seller')} onClick={() => setMobileMenuOpen(false)}>
                Seller Dashboard
              </Link>
            )}

            {isAuthenticated() && user?.role === 'ADMIN' && (
              <Link to="/admin" className={getMobileLinkClass('/admin')} onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated() ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 mb-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-primary-600">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:bg-gray-100 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
