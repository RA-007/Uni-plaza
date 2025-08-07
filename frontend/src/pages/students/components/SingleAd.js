import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const SingleAd = () => {
  const { adType, adId } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAdDetails();
  }, [adType, adId]);

  useEffect(() => {
    if (ad) {
      checkUserInteraction();
    }
  }, [ad]);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      
      // First try to get from student ads
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/student/ads/${adId}`);
        const studentAd = response.data;
        
        // Transform the student ad data to match our display format
        const transformedAd = {
          ...studentAd,
          type: studentAd.adType,
          title: studentAd.adData.evntAdTitle || studentAd.adData.prodAdName || studentAd.adData.otherAdTitle,
          description: studentAd.adData.evntAdDescription || studentAd.adData.prodAdDescription || studentAd.adData.otherAdDescription,
          price: studentAd.adData.prodAdPrice || null,
          location: studentAd.adData.evntAdLocation || studentAd.adData.otherAdLocation || null,
          contact: studentAd.adData.contactNumber ? studentAd.adData.contactNumber.join(', ') : '',
          images: studentAd.adData.evntAdImage || studentAd.adData.prodAdImage || studentAd.adData.otherAdImage || [],
          date: studentAd.adData.evntAdDate || studentAd.adData.otherAdDate || null,
          time: studentAd.adData.evntAdTime || null,
          university: studentAd.university,
          tags: studentAd.adData.evntAdTags || studentAd.adData.prodAdTags || studentAd.adData.otherAdTags || [],
          links: studentAd.adData.evntAdRelatedLinks || studentAd.adData.prodAdRelatedLinks || studentAd.adData.otherAdRelatedLinks || [],
          status: studentAd.adData.evntAdStatus || studentAd.adData.prodAdStatus || studentAd.adData.otherAdStatus,
          likes: studentAd.likes || [],
          interests: studentAd.interests || []
        };

        setAd(transformedAd);
        setShareUrl(`${window.location.origin}/ad/${studentAd.adType}/${adId}`);
        checkUserInteraction();
        return;
      } catch (studentAdError) {
        console.log('Student ad not found, trying club APIs...');
      }
      
      // Fallback to club APIs if student ad not found
      switch (adType) {
        case 'event':
          response = await axios.get(`${API_BASE_URL}/club/event-ads/${adId}`);
          break;
        case 'product':
          response = await axios.get(`${API_BASE_URL}/club/product-ads/${adId}`);
          break;
        case 'other':
          response = await axios.get(`${API_BASE_URL}/club/other-ads/${adId}`);
          break;
        default:
          throw new Error('Invalid ad type');
      }

      const adData = response.data;
      
      // Transform the data to match our display format
      const transformedAd = {
        ...adData,
        type: adType,
        title: adData.evntAdTitle || adData.prodAdName || adData.otherAdTitle,
        description: adData.evntAdDescription || adData.prodAdDescription || adData.otherAdDescription,
        price: adData.prodAdPrice || null,
        location: adData.evntAdLocation || adData.otherAdLocation || null,
        contact: adData.contactNumber ? adData.contactNumber.join(', ') : '',
        images: adData.evntAdImage || adData.prodAdImage || adData.otherAdImage || [],
        date: adData.evntAdDate || adData.otherAdDate || null,
        time: adData.evntAdTime || null,
        university: adData.university,
        tags: adData.evntAdTags || adData.prodAdTags || adData.otherAdTags || [],
        links: adData.evntAdRelatedLinks || adData.prodAdRelatedLinks || adData.otherAdRelatedLinks || [],
        status: adData.evntAdStatus || adData.prodAdStatus || adData.otherAdStatus,
        likes: [],
        interests: []
      };

      setAd(transformedAd);
      setShareUrl(`${window.location.origin}/ad/${adType}/${adId}`);
      checkUserInteraction();
    } catch (err) {
      console.error('Error fetching ad details:', err);
      setError('Failed to load ad details');
    } finally {
      setLoading(false);
    }
  };

  const checkUserInteraction = () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      if (userId && ad) {
        setIsLiked(ad.likes?.includes(userId) || false);
        setIsInterested(ad.interests?.includes(userId) || false);
      }
    } catch (err) {
      console.error('Error checking interactions:', err);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like ads');
        return;
      }
      
      await axios.post(`${API_BASE_URL}/student/ads/${adId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error updating like:', err);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleInterest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to mark interest');
        return;
      }
      
      await axios.post(`${API_BASE_URL}/student/ads/${adId}/interest`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsInterested(!isInterested);
    } catch (err) {
      console.error('Error updating interest:', err);
      alert('Failed to update interest. Please try again.');
    }
  };

  const handleShare = () => {
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

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        <p>Loading ad details...</p>
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

  if (!ad) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Ad not found</p>
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
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/student-dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Dashboard
          </button>
          <span style={{ color: '#666', fontSize: '14px' }}>
            / {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)} Ad
          </span>
        </div>
        <span style={{ 
          padding: '6px 12px', 
          borderRadius: '20px', 
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: ad.type === 'event' ? '#e3f2fd' : ad.type === 'product' ? '#f3e5f5' : '#e8f5e8',
          color: ad.type === 'event' ? '#1976d2' : ad.type === 'product' ? '#7b1fa2' : '#388e3c'
        }}>
          {ad.type.toUpperCase()} AD
        </span>
      </div>

      {/* Title */}
      <h1 style={{ 
        fontSize: '28px', 
        color: '#333', 
        marginBottom: '15px',
        fontWeight: '600'
      }}>
        {ad.title}
      </h1>

      {/* University */}
      {ad.university && (
        <p style={{ 
          color: '#1976d2', 
          fontSize: '16px', 
          marginBottom: '20px', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🏫 {ad.university}
        </p>
      )}

      {/* Images */}
      {ad.images && ad.images.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            {ad.images.map((image, index) => {
              const imageUrl = getImageUrl(image);
              if (!imageUrl) return null;
              
              return (
                <img 
                  key={index}
                  src={`http://localhost:5000/uploads/${imageUrl}`} 
                  alt={`${ad.title} - Image ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    console.log('Image URL:', imageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          color: '#333', 
          marginBottom: '10px',
          fontWeight: '600'
        }}>
          Description
        </h3>
        <p style={{ 
          color: '#666', 
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          {ad.description}
        </p>
      </div>

      {/* Details Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '25px'
      }}>
        {/* Price */}
        {ad.price && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Price
            </h4>
            <p style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#2e7d32',
              margin: '0'
            }}>
              ₹{ad.price}
            </p>
          </div>
        )}

        {/* Date & Time */}
        {ad.date && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Date & Time
            </h4>
            <p style={{ 
              fontSize: '16px', 
              color: '#333',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📅 {new Date(ad.date).toLocaleDateString()}
              {ad.time && (
                <span style={{ color: '#666' }}>
                  at {ad.time}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Location */}
        {ad.location && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Location
            </h4>
            <p style={{ 
              fontSize: '16px', 
              color: '#333',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📍 {ad.location}
            </p>
          </div>
        )}

        {/* Contact */}
        {ad.contact && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Contact
            </h4>
            <p style={{ 
              fontSize: '16px', 
              color: '#333',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📞 {ad.contact}
            </p>
          </div>
        )}
      </div>

      {/* Tags */}
      {ad.tags && ad.tags.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            color: '#333', 
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            Tags
          </h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px' 
          }}>
            {ad.tags.map((tag, index) => (
              <span key={index} style={{ 
                padding: '6px 12px', 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Links */}
      {ad.links && ad.links.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            color: '#333', 
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            Related Links
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px' 
          }}>
            {ad.links.map((link, index) => (
              <a 
                key={index}
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontSize: '16px',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                🔗 {link}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Interaction Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        margin: '30px 0',
        padding: '20px 0',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
      }}>
        <button
          onClick={handleLike}
          style={{
            padding: '10px 20px',
            backgroundColor: isLiked ? '#ffebee' : '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            color: isLiked ? '#d32f2f' : '#333'
          }}
        >
          {isLiked ? <FaHeart color="#d32f2f" /> : <FaRegHeart />}
          {isLiked ? 'Liked' : 'Like'}
        </button>
        
        <button
          onClick={handleInterest}
          style={{
            padding: '10px 20px',
            backgroundColor: isInterested ? '#e8f5e9' : '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            color: isInterested ? '#388e3c' : '#333'
          }}
        >
          {isInterested ? <FaBookmark color="#388e3c" /> : <FaRegBookmark />}
          {isInterested ? 'Interested' : 'Mark Interest'}
        </button>
        
        <button
          onClick={handleShare}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            color: '#1976d2'
          }}
        >
          <FaShare /> Share
        </button>
      </div>

      {/* Status */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: ad.status === 'active' ? '#e8f5e8' : '#fff3e0',
        borderRadius: '8px',
        border: '1px solid #c8e6c9',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '16px', 
          color: ad.status === 'active' ? '#2e7d32' : '#f57c00',
          fontWeight: '600',
          margin: '0'
        }}>
          Status: {ad.status === 'active' ? '🟢 Active' : '🟡 Inactive'}
        </p>
      </div>

      {/* Created Date */}
      {ad.createdAt && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
          color: '#999',
          fontSize: '14px'
        }}>
          <p>Posted on {new Date(ad.createdAt).toLocaleDateString()} at {new Date(ad.createdAt).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
};

export default SingleAd;