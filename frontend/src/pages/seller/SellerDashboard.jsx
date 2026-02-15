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
      <div className="flex min-h-screen bg-gradient-to-br from-primary-50 via-yellow-50 to-white pt-16">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700"
          aria-label="Toggle seller navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-primary-600 via-primary-800 to-primary-900 text-primary-50 flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-16 lg:mt-0
        `}>
          <div className="p-6 border-b border-primary-700/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-100/20 border border-primary-200/30 flex items-center justify-center text-primary-50 font-bold">
                CH
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary-50">Seller Dashboard</h1>
                <p className="text-xs text-primary-200/80">CeylonHomes</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-primary-500/30 text-primary-50 ring-1 ring-primary-300/40 shadow-sm'
                        : 'text-primary-100/80 hover:bg-primary-800/40 hover:text-primary-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 text-xs text-primary-100/70 border-t border-primary-700/40">
            Seller Area
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
