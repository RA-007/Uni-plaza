const express = require('express');
const router = express.Router();
const StudentAd = require('../../models/students/studentAd.model');
const EventAd = require('../../models/clubs/eventAd.model');
const ProductAd = require('../../models/clubs/productAd.model');
const OtherAd = require('../../models/clubs/otherAd.model');
const auth = require('../../middleware/auth');

// Like an ad
router.post('/:adId/like', auth, async (req, res) => {
  try {
    const ad = await StudentAd.findById(req.params.adId);
    if (!ad) return res.status(404).send({ error: 'Ad not found' });

    const userId = req.user._id;
    const likeIndex = ad.likes.indexOf(userId);

    if (likeIndex === -1) {
      ad.likes.push(userId);
    } else {
      ad.likes.splice(likeIndex, 1);
    }

    await ad.save();
    res.send(ad);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Mark interest in an ad
router.post('/:adId/interest', auth, async (req, res) => {
  try {
    const ad = await StudentAd.findById(req.params.adId);
    if (!ad) return res.status(404).send({ error: 'Ad not found' });

    const userId = req.user._id;
    const interestIndex = ad.interests.indexOf(userId);

    if (interestIndex === -1) {
      ad.interests.push(userId);
    } else {
      ad.interests.splice(interestIndex, 1);
    }

    await ad.save();
    res.send(ad);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Increment share count
router.post('/:adId/share', async (req, res) => {
  try {
    const ad = await StudentAd.findByIdAndUpdate(
      req.params.adId,
      { $inc: { shareCount: 1 } },
      { new: true }
    );
    if (!ad) return res.status(404).send({ error: 'Ad not found' });
    res.send(ad);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Get user's liked ads
router.get('/liked', auth, async (req, res) => {
  try {
    const ads = await StudentAd.find({ likes: req.user._id })
      .sort({ createdAt: -1 });
    res.send(ads);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Get user's interested ads
router.get('/interested', auth, async (req, res) => {
  try {
    const ads = await StudentAd.find({ interests: req.user._id })
      .sort({ createdAt: -1 });
    res.send(ads);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Get single ad by ID
router.get('/:adId', async (req, res) => {
  try {
    const ad = await StudentAd.findById(req.params.adId);
    if (!ad) {
      return res.status(404).send({ error: 'Ad not found' });
    }
    res.send(ad);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Add this new endpoint at the top of your file
router.get('/force-sync', async (req, res) => {
  try {
    // 1. Delete all existing student ads
    await StudentAd.deleteMany({});
    
    // 2. Get ALL ads from all collections (not just active)
    const allEvents = await EventAd.find({});
    const allProducts = await ProductAd.find({}); 
    const allOthers = await OtherAd.find({});
    
    // 3. Convert all ads to student format
    const allAds = [
      ...allEvents.map(e => ({
        adType: 'event',
        adData: e.toObject(),
        university: e.university
      })),
      ...allProducts.map(p => ({
        adType: 'product', 
        adData: p.toObject(),
        university: p.university
      })),
      ...allOthers.map(o => ({
        adType: 'other',
        adData: o.toObject(),
        university: o.university
      }))
    ];
    
    // 4. Insert all ads
    await StudentAd.insertMany(allAds);
    
    res.status(200).json({
      success: true,
      message: `Synced ${allAds.length} ads to student database`
    });
    
  } catch (error) {
    console.error('Force sync error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all ads for student dashboard
router.get('/', async (req, res) => {
  try {
    const { university, search, type, tags } = req.query;
    
    let query = { university };
    
    if (search) {
      query.$or = [
        { 'adData.evntAdTitle': { $regex: search, $options: 'i' } },
        { 'adData.prodAdName': { $regex: search, $options: 'i' } },
        { 'adData.otherAdTitle': { $regex: search, $options: 'i' } },
        { 'adData.evntAdDescription': { $regex: search, $options: 'i' } },
        { 'adData.prodAdDescription': { $regex: search, $options: 'i' } },
        { 'adData.otherAdDescription': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.adType = type;
    }
    
    if (tags) {
      const tagsArray = tags.split(',');
      query['adData.evntAdTags'] = { $in: tagsArray };
      query['adData.prodAdTags'] = { $in: tagsArray };
      query['adData.otherAdTags'] = { $in: tagsArray };
    }
    
    const ads = await StudentAd.find(query).sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sync all active ads from clubs to student ads
router.post('/sync', async (req, res) => {
  try {
    // Clear existing student ads
    await StudentAd.deleteMany({});
    
    // Get all active ads from each type
    const activeEvents = await EventAd.find({ evntAdStatus: 'active' });
    const activeProducts = await ProductAd.find({ prodAdStatus: 'active' });
    const activeOthers = await OtherAd.find({ otherAdStatus: 'active' });
    
    // Convert and save as student ads
    const eventAds = activeEvents.map(event => ({
      adType: 'event',
      adData: event.toObject(),
      university: event.university
    }));
    
    const productAds = activeProducts.map(product => ({
      adType: 'product',
      adData: product.toObject(),
      university: product.university
    }));
    
    const otherAds = activeOthers.map(other => ({
      adType: 'other',
      adData: other.toObject(),
      university: other.university
    }));
    
    // Insert all ads
    await StudentAd.insertMany([...eventAds, ...productAds, ...otherAds]);
    
    res.status(200).json({ message: 'Ads synced successfully' });
  } catch (error) {
    console.error('Error syncing ads:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/debug-stats', async (req, res) => {
  try {
    const [events, products, others, studentAds] = await Promise.all([
      EventAd.find().limit(1),
      ProductAd.find().limit(1),
      OtherAd.find().limit(1),
      StudentAd.find().limit(1)
    ]);

    res.json({
      Club_EventAd: { count: await EventAd.countDocuments(), sample: events[0] },
      Club_ProductAd: { count: await ProductAd.countDocuments(), sample: products[0] },
      Club_OtherAd: { count: await OtherAd.countDocuments(), sample: others[0] },
      StudentAd: { count: await StudentAd.countDocuments(), sample: studentAds[0] }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;