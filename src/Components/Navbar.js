// src/components/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        } md:w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className={`text-xl font-bold ${isOpen || window.innerWidth >= 768 ? '' : 'hidden'}`}>
            <Link to="/">Admin Panel</Link>
          </h2>
          <button
            className="md:hidden text-white"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        <nav
          className={`flex flex-col p-4 space-y-2 ${
            isOpen || window.innerWidth >= 768 ? '' : 'hidden'
          }`}
        >
          {/* Navigation links here */}
          <Link
            to="/"
            className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
              location.pathname === '/' ? 'bg-gray-700' : ''
            }`}
          >
           <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/sites"
            className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
              location.pathname === '/sites' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Sites</span>
          </Link>

          <Link
            to="/admin/cancelticket"
            className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
              location.pathname === '/admin/cancelticket' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Cancelled Tickets</span>
          </Link>

          <Link
            to="/admin/refunds"
            className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${
              location.pathname === '/admin/refunds' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Refunds</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Wrapper */}
      <main className="ml-16 md:ml-64 flex-1 h-screen overflow-y-auto p-4 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Navbar;
