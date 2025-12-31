import React, { useState } from 'react';
import { Eye, EyeOff, BarChart3, Droplets, Thermometer, Wind, CheckSquare, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for admin login first
    if (formData.email === 'Admin' && formData.password === '1234') {
      const adminUser = {
        id: 0,
        firstName: 'Admin',
        lastName: 'User',
        email: 'Admin',
        phone: '',
        employer: 'EagleFlow',
        position: 'Administrator',
        password: '1234',
        countryCode: 'NO',
        profileImage: null,
        createdAt: new Date().toISOString(),
      };
      
      // Set admin as current user
      localStorage.setItem('eagleflow_current_user', JSON.stringify(adminUser));
      console.log('Admin logged in:', adminUser);
      navigate('/dashboard');
      return;
    }
    
    // Check if regular user exists
    const existingUsers = JSON.parse(localStorage.getItem('eagleflow_users') || '[]');
    const user = existingUsers.find(u => u.email === formData.email && u.password === formData.password);
    
    if (!user) {
      alert('Feil e-postadresse eller passord. Vennligst prøv igjen.');
      return;
    }
    
    // Set current logged in user
    localStorage.setItem('eagleflow_current_user', JSON.stringify(user));
    
    console.log('User logged in:', user);
    
    // Redirect til dashboard
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="relative bg-gradient-to-r from-gray-50 to-slate-100 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Tilbake til forsiden
            </Link>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
              VVS Beregningsverktøy
            </h1>

            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 md:gap-12 py-6">
            <div className="flex flex-col items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-lg border-2 border-teal-700 group-hover:bg-teal-50 transition-colors">
                <BarChart3 className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">Dashboard</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-lg border-2 border-teal-700 group-hover:bg-teal-50 transition-colors">
                <Droplets className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">Sanitær</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-lg border-2 border-teal-700 group-hover:bg-teal-50 transition-colors">
                <Thermometer className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">Varme/Kjøling</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-lg border-2 border-teal-700 group-hover:bg-teal-50 transition-colors">
                <Wind className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">Ventilasjon</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-lg border-2 border-teal-700 group-hover:bg-teal-50 transition-colors">
                <CheckSquare className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">Oppgaver</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors cursor-pointer group">
              <div className="p-3 bg-white rounded-lg border-2 border-teal-700 group-hover:bg-teal-50 transition-colors">
                <Wrench className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">Verktøy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Form */}
      <div className="relative flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-lg border-4 border-teal-700 shadow-2xl p-8 md:p-12">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 via-cyan-500 to-purple-600 rounded-full mb-4 shadow-lg shadow-purple-500/50 animate-gradient-x">
                <svg 
                  className="w-12 h-12 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 2C10 2 8 3 7 5L5 8C4 9 3 11 3 13C3 15 4 16 5 17L7 19C8 20 10 21 12 21C14 21 16 20 17 19L19 17C20 16 21 15 21 13C21 11 20 9 19 8L17 5C16 3 14 2 12 2Z" />
                  <path d="M12 2L15 8M12 2L9 8" />
                  <path d="M8 10C8 10 10 12 12 12C14 12 16 10 16 10" />
                  <path d="M12 12V16" />
                  <path d="M9 16L12 16L15 16" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-teal-800 mb-2">Velkommen</h2>
              <p className="text-gray-600 font-medium">Logg inn på min side</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-postadresse
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  placeholder="din@epost.no"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Passord
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="text-left">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Glemt passord?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Fortsett
              </button>

              <div className="text-center">
                <span className="text-gray-700">Har du ikke noen konto? </span>
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Registrer deg
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative bg-gradient-to-r from-gray-50 to-slate-100 border-t border-gray-200 py-6">
        <div className="text-center">
          <p className="text-gray-600">
            Powered by <span className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">EagleFlow</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

