import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark, FaArrowLeft } from 'react-icons/fa';

const InterestedAds = () => {
  const [interestedAds, setInterestedAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get interested ads from localStorage
    const storedInterestedAds = localStorage.getItem('interestedAds');
    if (storedInterestedAds) {
      setInterestedAds(JSON.parse(storedInterestedAds));
    }
  }, []);

  const handleLike = (ad) => {
    // Toggle like status
    const updatedAd = { ...ad, isLiked: !ad.isLiked };
    const updatedInterestedAds = interestedAds.map(interestedAd => 
      interestedAd._id === ad._id ? updatedAd : interestedAd
    );
    setInterestedAds(updatedInterestedAds);
    localStorage.setItem('interestedAds', JSON.stringify(updatedInterestedAds));
  };

  const handleInterest = (ad) => {
    const updatedInterestedAds = interestedAds.filter(interestedAd => interestedAd._id !== ad._id);
    setInterestedAds(updatedInterestedAds);
    localStorage.setItem('interestedAds', JSON.stringify(updatedInterestedAds));
  };

  const handleShare = (ad) => {
    const shareUrl = `${window.location.origin}/ad/${ad.type}/${ad._id}`;
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: shareUrl,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const getAdTitle = (ad) => {
    return ad.title || 'Untitled Ad';
  };

  const getAdDescription = (ad) => {
    return ad.description || 'No description available';
  };

  const getAdImage = (ad) => {
    return ad.image || null;
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
    
    if (imagePath.startsWith('http')) return imagePath;
    
    if (imagePath.includes('/')) {
      return `http://localhost:5000/uploads/${imagePath}`;
    }
    
    return `http://localhost:5000/uploads/club-ads/${imagePath}`;
  };

  const isLiked = (ad) => {
    const likedAds = JSON.parse(localStorage.getItem('likedAds') || '[]');
    return likedAds.some(likedAd => likedAd._id === ad._id);
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
            onClick={() => navigate(`/ad/${ad.type}/${ad._id}`)}
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
                    backgroundColor: ad.type === 'event' ? '#e3f2fd' : ad.type === 'product' ? '#f3e5f5' : '#e8f5e8',
                    color: ad.type === 'event' ? '#1976d2' : ad.type === 'product' ? '#7b1fa2' : '#388e3c'
                  }}>
                    {ad.type.toUpperCase()} AD
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
                {ad.price && (
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#2e7d32',
                    marginBottom: '15px'
                  }}>
                    ₹{ad.price}
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
                        handleLike(ad);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: ad.isLiked ? '#ffebee' : '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: ad.isLiked ? '#d32f2f' : '#333'
                      }}
                    >
                      {ad.isLiked ? <FaHeart color="#d32f2f" /> : <FaRegHeart />}
                      {ad.isLiked ? 'Liked' : 'Like'}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInterest(ad);
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