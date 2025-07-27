import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ClubDashboard from './pages/clubs/ClubDashboard';

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
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/clubs" element={<ClubDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
