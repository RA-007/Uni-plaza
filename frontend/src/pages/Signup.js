import { useState } from 'react';
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
      console.log('📤 Sending to API:', form);

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
    <>
      <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          required
        >
          <option value="">Select Specialization</option>
          <option value="IT">IT</option>
          <option value="Medical">Medical</option>
          <option value="Engineering">Engineering</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span>Already registered? </span>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#388e3c',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: 0,
          }}
          type="button"
          onClick={() => window.location.href = '/login'}
        >
          Login
        </button>
      </div>
    </>
  );
}
