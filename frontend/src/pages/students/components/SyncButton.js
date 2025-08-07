import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const SyncButton = () => {
  const handleSync = async () => {
    try {
      const response = await axios.get('/api/student/ads/force-sync');
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert('Sync failed: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <Button variant="danger" onClick={handleSync}>
      🔄 Force Sync Ads
    </Button>
  );
};

export default SyncButton;