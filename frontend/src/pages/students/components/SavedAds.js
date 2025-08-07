import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SavedAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('liked'); // 'liked' or 'interested'

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchSavedAds = async () => {
      try {
        setLoading(true);
        const endpoint = activeTab === 'liked' ? '/student/ads/liked' : '/student/ads/interested';
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        setAds(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching saved ads:', err);
        setError('Failed to load saved ads');
        setLoading(false);
      }
    };

    fetchSavedAds();
  }, [activeTab]);

  const handleAdClick = (ad) => {
    navigate(`/ad/${ad.adType}/${ad._id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Your Saved Ads</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('liked')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'liked' ? '#ffebee' : '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            color: activeTab === 'liked' ? '#d32f2f' : '#333'
          }}
        >
          Liked Ads
        </button>
        <button
          onClick={() => setActiveTab('interested')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'interested' ? '#e8f5e9' : '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            color: activeTab === 'interested' ? '#388e3c' : '#333'
          }}
        >
          Interested Ads
        </button>
      </div>

      {ads.length === 0 ? (
        <p>No {activeTab} ads found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {ads.map(ad => (
            <div 
              key={ad._id} 
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '12px', 
                padding: '20px',
                cursor: 'pointer',
                backgroundColor: '#fff'
              }}
              onClick={() => handleAdClick(ad)}
            >
              <h3>{ad.title}</h3>
              <p style={{ color: '#666' }}>{ad.description.substring(0, 100)}...</p>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                backgroundColor: ad.adType === 'event' ? '#e3f2fd' : ad.adType === 'product' ? '#f3e5f5' : '#e8f5e8',
                color: ad.adType === 'event' ? '#1976d2' : ad.adType === 'product' ? '#7b1fa2' : '#388e3c'
              }}>
                {ad.adType.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAds;