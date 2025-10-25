import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">LOGO</h1>
      </div>
      <nav className="mt-6">
        <Link
          to="/organizations"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            location.pathname.includes('/organizations') ? 'bg-blue-50 border-r-4 border-blue-500' : ''
          }`}
        >
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        <Link
          to="/organizations"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            location.pathname.includes('/organizations') ? 'bg-blue-50' : ''
          }`}
        >
          <span className="text-sm font-medium">Manage B2B organizations</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
