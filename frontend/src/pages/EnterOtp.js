import { useState } from 'react';
import axios from 'axios';

export default function EnterOtp() {
  const [form, setForm] = useState({ email: '', otp: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post('/api/auth/verify-otp', form);
    alert(res.data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="otp" placeholder="Enter OTP" onChange={handleChange} required />
      <button type="submit">Verify OTP</button>
    </form>
  );
}
