import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StudentDashboard.module.css";

export default function StudentDashboard() {
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [saved, setSaved] = useState([]);
  const [interested, setInterested] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAds();
    fetchSaved();
    fetchInterested();
  }, [type, search]);

  const fetchAds = async () => {
    const params = {};
    if (type) params.type = type;
    if (search) params.search = search;
    const res = await axios.get("http://localhost:5000/api/student/ads", {
      headers: { Authorization: `Bearer ${token}` },
      params
    }).catch(() => setAds([]));
    if (res) setAds(res.data);
  };

  const fetchSaved = async () => {
    const res = await axios.get("http://localhost:5000/api/student/saved", {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => setSaved([]));
    if (res) setSaved(res.data);
  };

  const fetchInterested = async () => {
    const res = await axios.get("http://localhost:5000/api/student/interested", {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => setInterested([]));
    if (res) setInterested(res.data);
  };

  const handleSave = async id => {
    await axios.post(`http://localhost:5000/api/student/save/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchSaved();
  };

  const handleInterest = async id => {
    await axios.post(`http://localhost:5000/api/student/interest/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchInterested();
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.heading}>Student Dashboard</h2>
      <div className={styles.filterSection}>
        <input className={styles.input} placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.select} value={type} onChange={e => setType(e.target.value)}>
          <option value="">All</option>
          <option value="event">Event</option>
          <option value="product">Product</option>
          <option value="other">Other</option>
        </select>
        <button className={styles.filterButton} onClick={fetchAds}>Filter</button>
      </div>
      <div className={styles.adsSection}>
        <h3>Available Ads</h3>
        <table className={styles.adsTable}>
          <thead>
            <tr>
              <th>Title</th><th>Description</th><th>Type</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>{ad.type}</td>
                <td>
                  <button className={styles.saveButton} onClick={() => handleSave(ad._id)}>Save</button>
                  <button className={styles.interestButton} onClick={() => handleInterest(ad._id)}>Interest</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.savedSection}>
        <h3>Saved Ads</h3>
        <ul>
          {saved.map(ad => <li key={ad._id}>{ad.title}</li>)}
        </ul>
      </div>
      <div className={styles.interestedSection}>
        <h3>Interested Ads</h3>
        <ul>
          {interested.map(ad => <li key={ad._id}>{ad.title}</li>)}
        </ul>
      </div>
      <div className={styles.calendarSection}>
        <h3>Availability Calendar (Demo)</h3>
        <p>Feature placeholder: You can integrate a calendar library here.</p>
      </div>
    </div>
  );
} 