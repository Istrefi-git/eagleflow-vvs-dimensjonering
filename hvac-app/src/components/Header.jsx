import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 p-2.5 rounded-xl transform group-hover:scale-110 transition-transform duration-300 shadow-md">
              <svg 
                className="w-8 h-8 text-white" 
                viewBox="0 0 512 512" 
                fill="currentColor"
              >
                <path d="M256 140c-10 0-20 5-25 12l-15 20c-8-15-22-25-40-25-25 0-45 20-45 45 0 15 8 28 20 35-20 10-35 30-35 55 0 35 28 63 63 63 15 0 28-5 40-13v50c0 15 12 27 27 27s27-12 27-27v-50c12 8 25 13 40 13 35 0 63-28 63-63 0-25-15-45-35-55 12-7 20-20 20-35 0-25-20-45-45-45-18 0-32 10-40 25l-15-20c-5-7-15-12-25-12z"/>
                <path d="M100 200c-15-8-30-20-40-35-12-18-20-40-20-60 0-8 2-15 5-22 8 5 18 8 28 8 25 0 45-12 55-30 8 15 22 25 40 28-15 25-28 55-35 85-10 8-20 18-33 26z"/>
                <path d="M412 200c15-8 30-20 40-35 12-18 20-40 20-60 0-8-2-15-5-22-8 5-18 8-28 8-25 0-45-12-55-30-8 15-22 25-40 28 15 25 28 55 35 85 10 8 20 18 33 26z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-teal-600 transition-all">EagleFlow</h1>
              <p className="text-xs text-gray-600">VVS Dimensjonering</p>
            </div>
          </Link>

          {/* Navigation Links - Left Side (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-teal-600 transition-all font-medium relative group">
              Forside
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/om-oss" className="text-gray-700 hover:text-teal-600 transition-all font-medium relative group">
              Om oss
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/priser" className="text-gray-700 hover:text-teal-600 transition-all font-medium relative group">
              Priser
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/kontakt" className="text-gray-700 hover:text-teal-600 transition-all font-medium relative group">
              Kontakt oss
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Auth Buttons - Right Side (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-gray-700 hover:text-teal-600 transition-all font-medium">
              Logg inn
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Prøv gratisversjon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 pb-4 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>Forside</Link>
            <Link to="/om-oss" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>Om oss</Link>
            <Link to="/priser" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>Priser</Link>
            <Link to="/kontakt" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>Kontakt oss</Link>
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700 mt-2" onClick={() => setIsMobileMenuOpen(false)}>Logg inn</Link>
            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:shadow-lg mt-1" onClick={() => setIsMobileMenuOpen(false)}>Prøv gratisversjon</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
