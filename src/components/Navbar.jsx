import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../App';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
              Women's Street
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-700 hover:text-pink-600 border-b-2 border-transparent hover:border-pink-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/contact"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive('/contact')
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-700 hover:text-pink-600 border-b-2 border-transparent hover:border-pink-300'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors duration-300 group"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 