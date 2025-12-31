import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateProject from './components/CreateProject';
import ProfileSettings from './components/ProfileSettings';
import SanitaryDesign from './components/SanitaryDesign';
import SanitaryWater from './components/SanitaryWater';
import StormwaterDesign from './components/StormwaterDesign';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/om-oss" element={<><Header /><AboutUs /></>} />
          <Route path="/priser" element={<><Header /><Pricing /></>} />
          <Route path="/kontakt" element={<><Header /><Contact /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/sanitary" element={<SanitaryDesign />} />
          <Route path="/sanitary/water" element={<SanitaryWater />} />
          <Route path="/sanitary/overvann" element={<StormwaterDesign />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
