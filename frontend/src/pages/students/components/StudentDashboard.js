import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark } from 'react-icons/fa';



// import api from '../../clubs/services/api';
import { productAdsAPI, eventAdsAPI, otherAdsAPI } from '../../clubs/services/api';
//import EventAds from './EventAds';
// import ProductAds from './ProductAds';
// import OtherAds from './OtherAds';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable or fallback URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  // Fetch all ads (Event, Product, Other)
  const fetchAds = async () => {
    try {
      const [eventRes, productRes, otherRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/club/event-ads`),
        axios.get(`${API_BASE_URL}/club/product-ads`),
        axios.get(`${API_BASE_URL}/club/other-ads`),
      ]);

      console.log('Event ads:', eventRes.data);
      console.log('Product ads:', productRes.data);
      console.log('Other ads:', otherRes.data);
      
      // Test if we can access an image directly
      if (eventRes.data.length > 0 && eventRes.data[0].evntAdImage && eventRes.data[0].evntAdImage.length > 0) {
        const testImage = eventRes.data[0].evntAdImage[0];
        console.log('Testing image access for:', testImage);
        console.log('Full image URL would be:', `http://localhost:5000/uploads/club-ads/${testImage}`);
      }
      
      // Debug image fields
      eventRes.data.forEach(ad => {
        console.log('Event ad image:', ad.evntAdImage);
        console.log('Event ad image type:', typeof ad.evntAdImage);
        if (ad.evntAdImage && ad.evntAdImage.length > 0) {
          console.log('First image item:', ad.evntAdImage[0]);
          console.log('First image item type:', typeof ad.evntAdImage[0]);
          console.log('Full ad data:', ad);
        }
      });
      productRes.data.forEach(ad => {
        console.log('Product ad image:', ad.prodAdImage);
        console.log('Product ad image type:', typeof ad.prodAdImage);
        if (ad.prodAdImage && ad.prodAdImage.length > 0) {
          console.log('First image item:', ad.prodAdImage[0]);
          console.log('First image item type:', typeof ad.prodAdImage[0]);
          console.log('Full ad data:', ad);
        }
      });
      otherRes.data.forEach(ad => {
        console.log('Other ad image:', ad.otherAdImage);
        console.log('Other ad image type:', typeof ad.otherAdImage);
        if (ad.otherAdImage && ad.otherAdImage.length > 0) {
          console.log('First image item:', ad.otherAdImage[0]);
          console.log('First image item type:', typeof ad.otherAdImage[0]);
          console.log('Full ad data:', ad);
        }
      });

      const events = eventRes.data.map(ad => ({ 
        ...ad, 
        type: 'event',
        title: ad.evntAdTitle,
        description: ad.evntAdDescription,
        price: null,
        location: ad.evntAdLocation,
        contact: ad.contactNumber ? ad.contactNumber.join(', ') : '',
        image: ad.evntAdImage && ad.evntAdImage.length > 0 ? 
          (typeof ad.evntAdImage[0] === 'string' ? ad.evntAdImage[0] : 
           typeof ad.evntAdImage[0] === 'object' ? (ad.evntAdImage[0].filePath || ad.evntAdImage[0].url || ad.evntAdImage[0].fileName) : null) : null,
        date: ad.evntAdDate,
        time: ad.evntAdTime
      }));
      const products = productRes.data.map(ad => ({ 
        ...ad, 
        type: 'product',
        title: ad.prodAdName,
        description: ad.prodAdDescription,
        price: ad.prodAdPrice,
        location: null,
        contact: ad.contactNumber ? ad.contactNumber.join(', ') : '',
        image: ad.prodAdImage && ad.prodAdImage.length > 0 ? 
          (typeof ad.prodAdImage[0] === 'string' ? ad.prodAdImage[0] : 
           typeof ad.prodAdImage[0] === 'object' ? (ad.prodAdImage[0].filePath || ad.prodAdImage[0].url || ad.prodAdImage[0].fileName) : null) : null
      }));
      const others = otherRes.data.map(ad => ({ 
        ...ad, 
        type: 'other',
        title: ad.otherAdTitle,
        description: ad.otherAdDescription,
        price: null,
        location: ad.otherAdLocation,
        contact: ad.contactNumber ? ad.contactNumber.join(', ') : '',
        image: ad.otherAdImage && ad.otherAdImage.length > 0 ? 
          (typeof ad.otherAdImage[0] === 'string' ? ad.otherAdImage[0] : 
           typeof ad.otherAdImage[0] === 'object' ? (ad.otherAdImage[0].filePath || ad.otherAdImage[0].url || ad.otherAdImage[0].fileName) : null) : null,
        date: ad.otherAdDate
      }));

      // Merge and sort by createdAt
      const allAds = [...events, ...products, ...others].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAds(allAds);
      setFilteredAds(allAds);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load ads');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Filter by type and search
  useEffect(() => {
    let updatedAds = [...ads];
    if (typeFilter !== 'all') {
      updatedAds = updatedAds.filter(ad => ad.type === typeFilter);
    }
    if (search.trim()) {
      const searchText = search.toLowerCase();
      updatedAds = updatedAds.filter(
        ad =>
          (ad.title && ad.title.toLowerCase().includes(searchText)) ||
          (ad.description && ad.description.toLowerCase().includes(searchText)) ||
          (ad.university && ad.university.toLowerCase().includes(searchText))
      );
    }
    setFilteredAds(updatedAds);
  }, [typeFilter, search, ads]);

  const handleAdClick = (ad) => {
    navigate(`/ad/${ad.type}/${ad._id}`);
  };

  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it contains a path with slashes, it might be a subdirectory
    if (imagePath.includes('/')) {
      return `http://localhost:5000/uploads/${imagePath}`;
    }
    
    // Default to club-ads subdirectory
    return `http://localhost:5000/uploads/club-ads/${imagePath}`;
  };

  if (loading) return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontSize: '18px',
      color: '#666'
    }}>
      <p>Loading ads...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      color: '#d32f2f'
    }}>
      <p>Error: {error}</p>
      <button 
        onClick={fetchAds}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>

// In your navigation component
<nav>
  {/* other nav items */}
  <Link to="/saved-ads" className="nav-link">
    <FaHeart /> Saved Ads
  </Link>
</nav>

// Or in your dashboard header
<div className="dashboard-header">
  <h2>Student Dashboard</h2>
  <div>
    <Link to="/saved-ads" className="btn btn-saved">
      View Saved Ads
    </Link>
    <button className="btn btn-refresh" onClick={fetchAds}>
      Refresh Ads
    </button>
  </div>
</div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0', color: '#333' }}>Student Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/liked-ads')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ❤️ Liked Ads
          </button>
          <button
            onClick={() => navigate('/interested-ads')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e8f5e9',
              color: '#388e3c',
              border: '1px solid #c8e6c9',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔖 Interested Ads
          </button>
          <button
            onClick={fetchAds}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Refresh Ads
          </button>
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search ads by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ 
            padding: '12px 16px', 
            flex: 1, 
            minWidth: '250px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ 
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#fff'
          }}
        >
          <option value="all">All Types</option>
          <option value="event">Event Ads</option>
          <option value="product">Product Ads</option>
          <option value="other">Other Ads</option>
        </select>
        <button
          onClick={() => {
            setSearch('');
            setTypeFilter('all');
          }}
          style={{
            padding: '12px 20px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Clear Filters
        </button>
      </div>

      {filteredAds.length === 0 ? (
        <p>No ads found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredAds.map(ad => (
            <div key={ad._id} style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '12px', 
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => handleAdClick(ad)}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '10px' 
              }}>
                <h3 style={{ margin: '0', color: '#333' }}>{ad.title}</h3>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: ad.type === 'event' ? '#e3f2fd' : ad.type === 'product' ? '#f3e5f5' : '#e8f5e8',
                  color: ad.type === 'event' ? '#1976d2' : ad.type === 'product' ? '#7b1fa2' : '#388e3c'
                }}>
                  {ad.type.toUpperCase()}
                </span>
              </div>
              <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.5' }}>{ad.description}</p>
              
              {ad.university && (
                <p style={{ color: '#1976d2', fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>
                  🏫 {ad.university}
                </p>
              )}
              
              {ad.price && (
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#2e7d32',
                  marginBottom: '10px' 
                }}>
                  ₹{ad.price}
                </p>
              )}
              
              {ad.date && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  📅 {new Date(ad.date).toLocaleDateString()}
                  {ad.time && ` at ${ad.time}`}
                </p>
              )}
              
              {ad.location && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  📍 {ad.location}
                </p>
              )}
              
              {ad.contact && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  📞 {ad.contact}
                </p>
              )}
              
              {ad.image && (
                <img 
                  src={constructImageUrl(ad.image)} 
                  alt={ad.title}
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    console.log('Ad image data:', ad.image);
                    console.log('Constructed URL:', constructImageUrl(ad.image));
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', constructImageUrl(ad.image));
                  }}
                />
              )}
              
              {ad.createdAt && (
                <p style={{ 
                  fontSize: '12px', 
                  color: '#999', 
                  margin: '0',
                  borderTop: '1px solid #eee',
                  paddingTop: '10px'
                }}>
                  Posted: {new Date(ad.createdAt).toLocaleDateString()} at {new Date(ad.createdAt).toLocaleTimeString()}
                </p>
              )}
              
              <div style={{ 
                marginTop: '15px',
                textAlign: 'center'
              }}>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdClick(ad);
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
