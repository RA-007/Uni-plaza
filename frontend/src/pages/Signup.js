import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosInstance';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
      });
      alert('OTP sent to email');
    } catch (err) {
      console.error('Signup failed:', err);
      alert('Signup failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.backLink}>
        <Link to="/" style={styles.backButton}>← Back to Home</Link>
      </div>
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Register</h2>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Specialization</option>
            <option value="IT">IT</option>
            <option value="Medical">Medical</option>
            <option value="Engineering">Engineering</option>
          </select>
          <button type="submit" style={styles.button}>Sign Up</button>
          <div style={styles.switchContainer}>
            <span>Already registered? </span>
            <button
              style={styles.switchButton}
              type="button"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(44,62,80,0.12)',
    padding: '40px 32px',
    maxWidth: '400px',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: '2rem',
    letterSpacing: '1px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s',
    marginBottom: '4px',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(90deg, #388e3c 0%, #43a047 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
    transition: 'background 0.2s',
  },
  switchContainer: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '1rem',
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#388e3c',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
    fontWeight: 'bold',
  },
  backLink: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#388e3c',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
    fontWeight: 'bold',
  }
};
