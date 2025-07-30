import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [ads, setAds] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [form, setForm] = useState({ title: "", description: "", type: "event" });

  const token = localStorage.getItem("token");
  const API = "http://localhost:3000"; // ✅ Ensure this matches your backend PORT

  useEffect(() => {
    fetchAds();
    fetchAnalytics();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/ads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(res.data);
    } catch (error) {
      console.error("Failed to fetch ads", error);
      setAds([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
      setAnalytics({});
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/ads`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: "", description: "", type: "event" });
      fetchAds();
    } catch (error) {
      console.error("Error adding ad:", error.response?.data || error.message);
      alert("Error adding ad: " + (error.response?.data?.error || error.message));
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/api/admin/ads/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAds();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAds();
    } catch (error) {
      console.error("Error deleting ad", error);
    }
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
