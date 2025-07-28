import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', specialization: '' });
  const [editMode, setEditMode] = useState(false);
  const [token] = useState(localStorage.getItem('token')); // Store token on login

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await axios.put('/api/auth/me', {
      name: user.name,
      specialization: user.specialization,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert(res.data.message);
    setEditMode(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.05)' }}>
      <h2>User Profile</h2>
      <form onSubmit={handleUpdate}>
        <input name="name" value={user.name} onChange={handleChange} disabled={!editMode} />
        <input name="email" value={user.email} disabled />
        <select name="specialization" value={user.specialization} onChange={handleChange} disabled={!editMode}>
          <option value="IT">IT</option>
          <option value="Medical">Medical</option>
          <option value="Engineering">Engineering</option>
        </select>
        {editMode ? (
          <button type="submit">Save</button>
        ) : (
          <button type="button" onClick={() => setEditMode(true)}>Edit</button>
        )}
      </form>
    </div>
  );
};

export default Profile;
