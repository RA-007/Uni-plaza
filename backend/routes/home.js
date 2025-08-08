const express = require('express');
const router = express.Router();

// GET homepage content
router.get('/', (req, res) => {
  res.json({
    title: 'Uni-Plaza',
    description: 'Your one-stop platform for university clubs, events, and student opportunities.',
    features: [
      {
        title: 'Student Dashboard',
        description: 'Browse and save ads from clubs and organizations',
        icon: '🎓'
      },
      {
        title: 'Club Dashboard', 
        description: 'Post ads and manage your club\'s presence',
        icon: '🏢'
      },
      {
        title: 'Admin Panel',
        description: 'Manage users and monitor platform activity',
        icon: '👨‍💼'
      }
    ]
  });
});

module.exports = router;
