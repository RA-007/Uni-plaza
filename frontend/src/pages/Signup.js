import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/auth/signup', form);
    alert('OTP sent to email');
  };

  return (
    <>
      <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <select name="specialization" onChange={handleChange} required>
          <option value="">Select Specialization</option>
          <option value="IT">IT</option>
          <option value="Medical">Medical</option>
          <option value="Engineering">Engineering</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}
