// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300
     "bg-white shadow-md py-2" }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="ml-2 text-xl font-bold text-gray-800"><Link to='/' class>Museum guide</Link></h2>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/visit" className="text-gray-600 hover:text-blue-600 font-medium">Visit</Link>
            <Link to="/events" className="text-gray-600 hover:text-blue-600 font-medium">Events</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
            <Link to="/exhibitions" className="text-gray-600 hover:text-blue-600 font-medium">Exhibitions</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="/book" className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              Book Tickets
            </a>
            <button className="md:hidden text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
  );
};

export default Navbar;
