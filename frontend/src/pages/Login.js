import { useState } from 'react';
import api from '../axiosInstance'; // ✅ Make sure this is correctly configured

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
      const res = await api.post('/auth/login', form); // ✅ Using baseURL: http://localhost:3000/api
      alert(res.data.message);
      localStorage.setItem('token', res.data.token); // ✅ Store JWT
      setTimeout(() => {
        window.location.href = 'http://localhost:3001/student';
      }, 500); // Give it some time to process login
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
      </form>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span>If you haven't an account, </span>
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
          onClick={() => window.location.href = '/signup'}
        >
          Sign Up
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <span style={{ display: 'block', marginBottom: '8px' }}>Or login with</span>
        <button
          type="button"
          style={{
            margin: '0 8px',
            padding: '10px 20px',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            style={{
              width: '24px',
              height: '24px',
              display: 'inline-block',
              background: 'white',
              borderRadius: '50%',
              objectFit: 'contain',
              marginRight: '8px'
            }}
          />
          Google
        </button>
        <button
          type="button"
          style={{
            margin: '0 8px',
            padding: '10px 20px',
            background: '#3b5998',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => window.location.href = 'http://localhost:3000/api/auth/facebook'}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
            alt="Facebook"
            style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}
          />
          Facebook
        </button>
      </div>
    </>
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
    backgroundColor: '#388e3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
