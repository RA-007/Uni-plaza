import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/students/components/StudentDashboard';

import SingleAd from './pages/students/components/SingleAd';
import SavedAds from './pages/students/components/SavedAds';
import LikedAds from './pages/students/LikedAds';
import InterestedAds from './pages/students/InterestedAds';

import ClubDashboard from './pages/clubs/ClubDashboard';

// ✅ NEW: Import auth pages
import Signup from './pages/Signup';
import Login from './pages/Login';
import EnterOtp from './pages/EnterOtp';
import ForgotPassword from './pages/ForgotPassword';

import Profile from './pages/Profile';


function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-title">Uni Plaza</h1>
        <div className="nav-links">
          <Link 
            to="/admin" 
            className={`nav-link admin ${isActive('/admin') ? 'active' : ''}`}
          >
            Admin Dashboard
          </Link>
          <Link 
            to="/student" 
            className={`nav-link student ${isActive('/student') ? 'active' : ''}`}
          >
            Student Dashboard
          </Link>
          <Link 
            to="/clubs" 
            className={`nav-link club ${isActive('/clubs') ? 'active' : ''}`}
          >
            Club Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/ad/:adType/:adId" element={<SingleAd />} />
          <Route path="/clubs" element={<ClubDashboard />} />


          <Route path="/saved-ads" element={<SavedAds />} />
          <Route path="/liked-ads" element={<LikedAds />} />
          <Route path="/interested-ads" element={<InterestedAds />} />

          {/* ✅ NEW Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<EnterOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
