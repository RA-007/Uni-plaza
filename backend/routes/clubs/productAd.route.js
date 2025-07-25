const express = require('express');
const router = express.Router();
const ProductAd = require('../../models/clubs/productAd.model'); 

router.get('/', async (req, res) => {
  try {
    const productAds = await ProductAd.find();
    return res.status(200).json(productAds);
  }catch (error) {
    console.error('Error fetching product ads:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    const newProductAd = new ProductAd(req.body);
    const savedProductAd = await newProductAd.save();
    return res.status(201).json(savedProductAd);
  } catch (error) {
    console.error('Error creating product ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ad ID is required' });
    }

    const productAd = await ProductAd.findById(id);

    if (!productAd) {
      return res.status(404).json({ message: 'Product ad not found' });
    }
    return res.status(200).json(productAd);
  } catch (error) {
    console.error('Error fetching product ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ad ID is required' });
    }
    if (!req.body) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    const updatedProductAd = await ProductAd.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProductAd) {
      return res.status(404).json({ message: 'Product ad not found' });
    }
    return res.status(200).json(updatedProductAd);
  } catch (error) {
    console.error('Error updating product ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ad ID is required' });
    }

    const deletedProductAd = await ProductAd.findByIdAndDelete(id);
    
    if (!deletedProductAd) {
      return res.status(404).json({ message: 'Product ad not found' });
    }

    return res.status(200).json({ message: 'Product ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting product ad:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
