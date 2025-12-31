import React, { useState } from 'react';
import { Eye, EyeOff, BarChart3, Droplets, Thermometer, Wind, CheckSquare, Wrench, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('NO');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employer: '',
    position: '',
    password: ''
  });

  const countries = [
    { code: 'NO', name: 'Norge', dialCode: '+47', flag: '🇳🇴' },
    { code: 'SE', name: 'Sverige', dialCode: '+46', flag: '🇸🇪' },
    { code: 'DK', name: 'Danmark', dialCode: '+45', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
    { code: 'IS', name: 'Island', dialCode: '+354', flag: '🇮🇸' },
    { code: 'GB', name: 'Storbritannia', dialCode: '+44', flag: '🇬🇧' },
    { code: 'DE', name: 'Tyskland', dialCode: '+49', flag: '🇩🇪' },
    { code: 'PL', name: 'Polen', dialCode: '+48', flag: '🇵🇱' },
  ];

  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('eagleflow_users') || '[]');
    const emailExists = existingUsers.some(user => user.email === formData.email);
    
    if (emailExists) {
      alert('En bruker med denne e-postadressen eksisterer allerede!');
      return;
    }
    
    // Create new user account
    const newUser = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      employer: formData.employer,
      position: formData.position,
      countryCode: selectedCountry,
      password: formData.password, // In real app, this would be hashed
      createdAt: new Date().toISOString(),
      profileImage: null
    };
    
    // Save to users array
    existingUsers.push(newUser);
    localStorage.setItem('eagleflow_users', JSON.stringify(existingUsers));
    
    console.log('User registered:', newUser);
    
    // Redirect to login
    alert('Konto opprettet! Du kan nå logge inn.');
    navigate('/login');
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
          <div className="flex items-center justify-center gap-4 md:gap-12 py-6 flex-wrap">
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

      {/* Main Register Form */}
      <div className="relative flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          {/* Register Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-lg border-4 border-teal-700 shadow-2xl p-8 md:p-12">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 via-cyan-500 to-purple-600 rounded-full mb-4 shadow-lg shadow-purple-500/50 animate-gradient-x">
                <UserPlus className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-teal-800 mb-2">Opprett ny konto</h2>
              <p className="text-gray-600 font-medium">Registrer deg for å komme i gang</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fornavn *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Fornavn"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Etternavn *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Etternavn"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-post *
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

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefonnummer *
                </label>
                <div className="flex gap-2">
                  {/* Country Selector */}
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="h-full px-3 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all cursor-pointer appearance-none pr-8"
                      style={{ minWidth: '100px' }}
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.dialCode}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Phone Input */}
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="xxx xx xxx"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Valgt land: {currentCountry.flag} {currentCountry.name} ({currentCountry.dialCode})
                </p>
              </div>

              {/* Employer and Position */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employer" className="block text-sm font-semibold text-gray-700 mb-2">
                    Arbeidsgiver *
                  </label>
                  <input
                    id="employer"
                    name="employer"
                    type="text"
                    required
                    value={formData.employer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Firmanavn"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                    Stilling *
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    placeholder="Din stilling"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Passord *
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
                    placeholder="Minst 8 tegn"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minst 8 tegn, inkluder tall og spesialtegn</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Opprett konto
              </button>

              <div className="text-center">
                <span className="text-gray-700">Har du allerede en konto? </span>
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Logg inn her
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

export default Register;

