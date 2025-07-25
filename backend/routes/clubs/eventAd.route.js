const express = require('express');
const router = express.Router();
const EventAd = require('../../models/clubs/eventAd.model');

router.get('/', async (req, res) => {
  try {
    const eventAds = await EventAd.find();
    return res.status(200).json(eventAds);
  } catch (error) {
    console.error('Error fetching event ads:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

router.post('/', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    const newEventAd = new EventAd(req.body);
    const savedEventAd = await newEventAd.save();
    return res.status(201).json(savedEventAd);
  } catch (error) {
    console.error('Error creating event ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ad ID is required' });
    }

    const eventAd = await EventAd.findById(id);

    if (!eventAd) {
      return res.status(404).json({ message: 'Event ad not found' });
    }
    return res.status(200).json(eventAd);
  } catch (error) {
    console.error('Error fetching event ad:', error);
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
    const updatedEventAd = await EventAd.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEventAd) {
      return res.status(404).json({ message: 'Event ad not found' });
    }
    return res.status(200).json(updatedEventAd);
  } catch (error) {
    console.error('Error updating event ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Event ad ID is required' });
    }

    const deletedEventAd = await EventAd.findByIdAndDelete(id);

    if (!deletedEventAd) {
      return res.status(404).json({ message: 'Event ad not found' });
    }

    return res.status(200).json({ message: 'Event ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting event ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;