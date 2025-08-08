import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const sampleImages = [
  'C:\Users\Narthanan\Desktop\UP\Uni-plaza\frontend\public\samplae.webp',
  '/sample2.jpg',
  '/sample3.jpg',
  '/sample4.jpg',
  '/sample5.jpg',
];

function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sampleImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-section">
          <img src="/logo192.png" alt="Logo" className="home-logo" />
          <span className="home-title">Uni-Plaza</span>
        </div>
        <div className="login-section">
          <Link to="/login" className="login-link">
            <img src="/login-icon.png" alt="Login" className="login-icon" />
            <span>Login</span>
          </Link>
        </div>
      </header>
      <section className="slideshow-section">
        <div className="slideshow">
          {sampleImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Slide ${idx + 1}`}
              className={`slide-img${idx === current ? ' active' : ''}`}
              style={{ display: idx === current ? 'block' : 'none' }}
            />
          ))}
          <div className="slideshow-dots">
            {sampleImages.map((_, idx) => (
              <span key={idx} className={idx === current ? 'dot active' : 'dot'}></span>
            ))}
          </div>
        </div>
      </section>
      <section className="auth-section">
        <Link to="/login" className="auth-btn">Login</Link>
        <Link to="/signup" className="auth-btn">Sign Up</Link>
      </section>
      <section className="details-section">
        <h2>Welcome to Uni-Plaza</h2>
        <p>
          Uni-Plaza is your one-stop platform for university clubs, events, and student opportunities. Discover, connect, and participate in campus life like never before!
        </p>
        <div className="features">
          <div className="feature">
            <h3>🎓 Student Dashboard</h3>
            <p>Browse and save ads from clubs and organizations</p>
          </div>
          <div className="feature">
            <h3>🏢 Club Dashboard</h3>
            <p>Post ads and manage your club's presence</p>
          </div>
          <div className="feature">
            <h3>👨‍💼 Admin Panel</h3>
            <p>Manage users and monitor platform activity</p>
          </div>
        </div>
      </section>
      <footer className="home-footer">
        &copy; {new Date().getFullYear()} Uni-Plaza. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
