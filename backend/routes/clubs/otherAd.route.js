const express = require('express');
const router = express.Router();
const OtherAd = require('../../models/clubs/otherAd.model');

router.get('/', async (req, res) => {
  try {
    const otherAds = await OtherAd.find();
    return res.status(200).json(otherAds);
  } catch (error) {
    console.error('Error fetching other ads:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

router.post('/', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    const newOtherAd = new OtherAd(req.body);
    const savedOtherAd = await newOtherAd.save();
    return res.status(201).json(savedOtherAd);
  } catch (error) {
    console.error('Error creating other ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Other ad ID is required' });
    }

    const otherAd = await OtherAd.findById(id);

    if (!otherAd) {
      return res.status(404).json({ message: 'Other ad not found' });
    }
    return res.status(200).json(otherAd);
  } catch (error) {
    console.error('Error fetching other ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Event ad ID is required' });
    }
    if (!req.body) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    const updatedOtherAd = await OtherAd.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOtherAd) {
      return res.status(404).json({ message: 'Other ad not found' });
    }
    return res.status(200).json(updatedOtherAd);
  } catch (error) {
    console.error('Error updating other ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Other ad ID is required' });
    }

    const deletedOtherAd = await OtherAd.findByIdAndDelete(id);

    if (!deletedOtherAd) {
      return res.status(404).json({ message: 'Other ad not found' });
    }

    return res.status(200).json({ message: 'Other ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting other ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;