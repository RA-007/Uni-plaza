import { useState } from 'react';
import api from '../axiosInstance';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      alert(res.data.message);
      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        window.location.href = 'http://localhost:3001/student';
      }, 500);
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Login</h2>
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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div style={styles.divider}><span>or</span></div>
          <div style={styles.socialContainer}>
            <button
              type="button"
              style={styles.socialButtonGoogle}
              onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                style={styles.socialLogo}
              />
              Login with Google
            </button>
            <button
              type="button"
              style={styles.socialButtonFacebook}
              onClick={() => window.location.href = 'http://localhost:3000/api/auth/facebook'}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook"
                style={styles.socialLogo}
              />
              Login with Facebook
            </button>
          </div>
          <div style={styles.switchContainer}>
            <span>If you haven't an account, </span>
            <button
              style={styles.switchButton}
              type="button"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up
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
  divider: {
    textAlign: 'center',
    margin: '12px 0',
    color: '#aaa',
    fontSize: '0.95rem',
    position: 'relative',
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '8px',
  },
  socialButtonGoogle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fff',
    color: '#444',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(44,62,80,0.07)',
    transition: 'box-shadow 0.2s',
  },
  socialButtonFacebook: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#3b5998',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(44,62,80,0.07)',
    transition: 'box-shadow 0.2s',
  },
  socialLogo: {
    width: '24px',
    height: '24px',
    background: 'white',
    borderRadius: '50%',
    objectFit: 'contain',
    marginRight: '4px',
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
};
