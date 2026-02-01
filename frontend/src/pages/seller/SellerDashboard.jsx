import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { useState } from 'react';

export const SellerDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', path: '/seller', icon: '📊' },
    { name: 'My Listings', path: '/seller/listings', icon: '🏠' },
    { name: 'Create Listing', path: '/seller/listings/new', icon: '➕' },
    { name: 'Rejected Listings', path: '/seller/inquiries', icon: '❌' },
  ];

  const isActive = (path) => {
    // Exact match for overview and create listing
    if (path === '/seller' || path === '/seller/listings/new') {
      return location.pathname === path;
    }
    // For My Listings, match /seller/listings but not /seller/listings/new
    if (path === '/seller/listings') {
      return location.pathname === '/seller/listings' || 
             (location.pathname.startsWith('/seller/listings/') && 
              !location.pathname.startsWith('/seller/listings/new'));
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100 pt-16 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 pt-16"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 lg:p-6 bg-primary-500">
            <h1 className="text-xl lg:text-2xl font-bold text-white">Seller Dashboard</h1>
          </div>

          <nav className="mt-6 pb-20 lg:pb-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};
