import React, { useState, useEffect, useRef } from 'react';
import { User, ArrowLeft, Mail, Phone, Building, Briefcase, Save, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function ProfileSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState('NO');
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employer: '',
    position: ''
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

  // Load current user data from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem('eagleflow_current_user');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      setFormData({
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        employer: parsed.employer || '',
        position: parsed.position || ''
      });
      if (parsed.countryCode) {
        setSelectedCountry(parsed.countryCode);
      }
      if (parsed.profileImage) {
        setProfileImage(parsed.profileImage);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('eagleflow_current_user'));
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Update user data
    const updatedUser = {
      ...currentUser,
      ...formData,
      countryCode: selectedCountry,
      profileImage: profileImage
    };
    
    // Save to current user
    localStorage.setItem('eagleflow_current_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('eagleflow_users') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    localStorage.setItem('eagleflow_users', JSON.stringify(updatedUsers));
    
    alert('Profil oppdatert!');
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Bildet er for stort. Maksimal størrelse er 5MB.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Vennligst velg en bildefil.');
        return;
      }

      // Read file as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Tilbake til Dashboard
        </Link>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-teal-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profilbilde" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg transition-colors"
                title="Last opp bilde"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors text-xs"
                  title="Fjern bilde"
                >
                  ✕
                </button>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-teal-800">Profilinnstillinger</h1>
              <p className="text-gray-600 mt-1">Rediger din personlige informasjon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  placeholder="Etternavn"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                E-post *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                placeholder="din@epost.no"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
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
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="employer" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Arbeidsgiver *
                </label>
                <input
                  id="employer"
                  name="employer"
                  type="text"
                  required
                  value={formData.employer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  placeholder="Firmanavn"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Stilling *
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  placeholder="Din stilling"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/dashboard"
                className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-all duration-200 text-center"
              >
                Avbryt
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-800 hover:to-cyan-800 text-white font-bold rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lagre endringer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;

