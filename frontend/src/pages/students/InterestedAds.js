import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark, FaArrowLeft } from 'react-icons/fa';

const InterestedAds = () => {
  const [interestedAds, setInterestedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchInterestedAds();
  }, []);

  const fetchInterestedAds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view interested ads');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/student/ads/interested`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInterestedAds(response.data);
    } catch (err) {
      console.error('Error fetching interested ads:', err);
      setError('Failed to load interested ads');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/student/ads/${adId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the ad in the list
      setInterestedAds(prevAds => 
        prevAds.map(ad => 
          ad._id === adId 
            ? { ...ad, likes: ad.likes.includes(JSON.parse(localStorage.getItem('user'))._id) 
                ? ad.likes.filter(id => id !== JSON.parse(localStorage.getItem('user'))._id)
                : [...ad.likes, JSON.parse(localStorage.getItem('user'))._id]
              }
            : ad
        )
      );
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleInterest = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/student/ads/${adId}/interest`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the ad from interested ads list
      setInterestedAds(prevAds => prevAds.filter(ad => ad._id !== adId));
    } catch (err) {
      console.error('Error updating interest:', err);
    }
  };

  const handleShare = (ad) => {
    const shareUrl = `${window.location.origin}/ad/${ad.adType}/${ad._id}`;
    if (navigator.share) {
      navigator.share({
        title: ad.adData.evntAdTitle || ad.adData.prodAdName || ad.adData.otherAdTitle,
        text: ad.adData.evntAdDescription || ad.adData.prodAdDescription || ad.adData.otherAdDescription,
        url: shareUrl,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const getAdTitle = (ad) => {
    return ad.adData.evntAdTitle || ad.adData.prodAdName || ad.adData.otherAdTitle || 'Untitled Ad';
  };

  const getAdDescription = (ad) => {
    return ad.adData.evntAdDescription || ad.adData.prodAdDescription || ad.adData.otherAdDescription || 'No description available';
  };

  const getAdImage = (ad) => {
    const images = ad.adData.evntAdImage || ad.adData.prodAdImage || ad.adData.otherAdImage || [];
    return images.length > 0 ? images[0] : null;
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    if (typeof imageData === 'string') return imageData;
    if (typeof imageData === 'object' && imageData.filePath) return imageData.filePath;
    if (typeof imageData === 'object' && imageData.url) return imageData.url;
    return null;
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

  const isLiked = (ad) => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    return ad.likes?.includes(userId) || false;
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        <p>Loading interested ads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#d32f2f'
      }}>
        <p>Error: {error}</p>
        <button 
          onClick={() => navigate('/student-dashboard')}
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
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/student-dashboard')}
            style={{
              padding: '10px 15px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px'
            }}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 style={{ 
            fontSize: '28px', 
            color: '#333', 
            margin: '0',
            fontWeight: '600'
          }}>
            🔖 Interested Ads ({interestedAds.length})
          </h1>
        </div>
      </div>

      {/* Ads Grid */}
      {interestedAds.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
          <h2 style={{ color: '#666', marginBottom: '10px' }}>No Interested Ads Yet</h2>
          <p style={{ color: '#999', marginBottom: '30px' }}>
            Start exploring ads and mark the ones that interest you!
          </p>
          <button
            onClick={() => navigate('/student-dashboard')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Explore Ads
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px' 
        }}>
          {interestedAds.map((ad) => (
            <div key={ad._id} style={{ 
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => navigate(`/ad/${ad.adType}/${ad._id}`)}
            >
              {/* Image */}
              {getAdImage(ad) && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={constructImageUrl(getImageUrl(getAdImage(ad)))}
                    alt={getAdTitle(ad)}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '20px' }}>
                {/* Type Badge */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: ad.adType === 'event' ? '#e3f2fd' : ad.adType === 'product' ? '#f3e5f5' : '#e8f5e8',
                    color: ad.adType === 'event' ? '#1976d2' : ad.adType === 'product' ? '#7b1fa2' : '#388e3c'
                  }}>
                    {ad.adType.toUpperCase()} AD
                  </span>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    backgroundColor: '#e8f5e9',
                    color: '#388e3c'
                  }}>
                    🔖 Interested
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ 
                  fontSize: '18px', 
                  color: '#333', 
                  marginBottom: '10px',
                  fontWeight: '600',
                  lineHeight: '1.4'
                }}>
                  {getAdTitle(ad)}
                </h3>

                {/* University */}
                {ad.university && (
                  <p style={{ 
                    color: '#1976d2', 
                    fontSize: '14px', 
                    marginBottom: '10px',
                    fontWeight: '500'
                  }}>
                    🏫 {ad.university}
                  </p>
                )}

                {/* Description */}
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  marginBottom: '15px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {getAdDescription(ad)}
                </p>

                {/* Price */}
                {ad.adData.prodAdPrice && (
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#2e7d32',
                    marginBottom: '15px'
                  }}>
                    ₹{ad.adData.prodAdPrice}
                  </p>
                )}

                {/* Interaction Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(ad._id);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: isLiked(ad) ? '#ffebee' : '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: isLiked(ad) ? '#d32f2f' : '#333'
                      }}
                    >
                      {isLiked(ad) ? <FaHeart color="#d32f2f" /> : <FaRegHeart />}
                      {isLiked(ad) ? 'Liked' : 'Like'}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInterest(ad._id);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#e8f5e9',
                        border: '1px solid #c8e6c9',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: '#388e3c'
                      }}
                    >
                      <FaBookmark color="#388e3c" /> Remove Interest
                    </button>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(ad);
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#e3f2fd',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      color: '#1976d2'
                    }}
                  >
                    <FaShare /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestedAds; 