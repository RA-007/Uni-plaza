import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [ads, setAds] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [form, setForm] = useState({ title: "", description: "", type: "event" });

  const token = localStorage.getItem("token");

  // Fetch ads and analytics
  useEffect(() => {
    fetchAds();
    fetchAnalytics();
  }, []);

  const fetchAds = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/ads", {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => setAds([]));
    if (res) setAds(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => setAnalytics({}));
    if (res) setAnalytics(res.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddAd = async e => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/admin/ads", form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ title: "", description: "", type: "event" });
    fetchAds();
  };

  const handleStatus = async (id, status) => {
    await axios.patch(`http://localhost:5000/api/admin/ads/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAds();
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:5000/api/admin/ads/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAds();
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.heading}>Admin Dashboard</h2>
      <div className={styles.analyticsSection}>
        <h3>Analytics</h3>
        <ul className={styles.analyticsList}>
          <li>Total Posts: {analytics.postCount}</li>
          <li>Total Users: {analytics.userCount}</li>
          <li>Company Ads: {analytics.companyCount}</li>
          <li>Private Ads: {analytics.privateCount}</li>
        </ul>
      </div>
      <div className={styles.formSection}>
        <h3>Add New Ad</h3>
        <form onSubmit={handleAddAd} className={styles.adForm}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className={styles.input} />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required className={styles.input} />
          <select name="type" value={form.type} onChange={handleChange} className={styles.select}>
            <option value="event">Event</option>
            <option value="product">Product</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className={styles.addButton}>Add Ad</button>
        </form>
      </div>
      <div className={styles.adsSection}>
        <h3>All Ads</h3>
        <table className={styles.adsTable}>
          <thead>
            <tr>
              <th>Title</th><th>Description</th><th>Type</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>{ad.type}</td>
                <td>{ad.status}</td>
                <td>
                  {ad.status === "pending" && (
                    <>
                      <button className={styles.approveButton} onClick={() => handleStatus(ad._id, "approved")}>Approve</button>
                      <button className={styles.denyButton} onClick={() => handleStatus(ad._id, "denied")}>Deny</button>
                    </>
                  )}
                  <button className={styles.deleteButton} onClick={() => handleDelete(ad._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 