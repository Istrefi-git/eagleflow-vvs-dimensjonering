import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity animate-gradient-x"></div>
              <div className="relative bg-gradient-to-br from-purple-600 via-cyan-500 to-purple-600 p-2.5 rounded-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                <svg 
                  className="w-8 h-8 text-white" 
                  viewBox="0 0 512 512" 
                  fill="currentColor"
                >
                  {/* Eagle in flight - elegant silhouette */}
                  <path d="M256 140c-10 0-20 5-25 12l-15 20c-8-15-22-25-40-25-25 0-45 20-45 45 0 15 8 28 20 35-20 10-35 30-35 55 0 35 28 63 63 63 15 0 28-5 40-13v50c0 15 12 27 27 27s27-12 27-27v-50c12 8 25 13 40 13 35 0 63-28 63-63 0-25-15-45-35-55 12-7 20-20 20-35 0-25-20-45-45-45-18 0-32 10-40 25l-15-20c-5-7-15-12-25-12z"/>
                  <path d="M100 200c-15-8-30-20-40-35-12-18-20-40-20-60 0-8 2-15 5-22 8 5 18 8 28 8 25 0 45-12 55-30 8 15 22 25 40 28-15 25-28 55-35 85-10 8-20 18-33 26z"/>
                  <path d="M412 200c15-8 30-20 40-35 12-18 20-40 20-60 0-8-2-15-5-22-8 5-18 8-28 8-25 0-45-12-55-30-8 15-22 25-40 28 15 25 28 55 35 85 10 8 20 18 33 26z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 transition-all">EagleFlow</h1>
              <p className="text-xs text-cyan-400 group-hover:text-purple-400 transition-colors">VVS Dimensjonering</p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all font-medium relative group">
              Forside
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/om-oss" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all font-medium relative group">
              Om oss
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/priser" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all font-medium relative group">
              Priser
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/kontakt" className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all font-medium relative group">
              Kontakt oss
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all font-medium">
              Logg inn
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:via-cyan-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/50 animate-gradient-x">
              Prøv gratisversjon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 z-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-950/98 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl">
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2"
              >
                Forside
              </Link>
              <Link 
                to="/om-oss" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2"
              >
                Om oss
              </Link>
              <Link 
                to="/priser" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2"
              >
                Priser
              </Link>
              <Link 
                to="/kontakt" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2"
              >
                Kontakt oss
              </Link>
              <div className="pt-4 border-t border-purple-500/20 space-y-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  Logg inn
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
                >
                  Prøv gratisversjon
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

