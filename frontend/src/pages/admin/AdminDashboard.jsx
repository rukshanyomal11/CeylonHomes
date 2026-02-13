import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { useState } from 'react';

export const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Overview', icon: '📊' },
    { path: '/admin/pending', label: 'Pending Listings', icon: '⏳' },
    { path: '/admin/listings', label: 'All Listings', icon: '🏘️' },
    { path: '/admin/reports', label: 'Reports', icon: '🚨' },
    { path: '/admin/audit', label: 'Audit Log', icon: '📝' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100 pt-16">
        {/* Mobile Sidebar Toggle  */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Overlay for mobile  */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar  */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-16 lg:mt-0
        `}>
          <div className="p-4 lg:p-6 border-b border-gray-700">
            <h1 className="text-xl lg:text-2xl font-bold text-primary-400">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">CeylonHomes</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content  */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
