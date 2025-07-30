import { useState } from 'react';
import api from '../axiosInstance'; // ✅ Uses baseURL: http://localhost:3000/api

export default function EnterOtp() {
  const [form, setForm] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', form);
      alert(res.data.message);
      localStorage.setItem('token', res.data.token); // ✅ Save token
    } catch (err) {
      console.error('OTP verification failed:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Verify OTP</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="otp"
        placeholder="Enter OTP"
        value={form.otp}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2d3a4a',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
