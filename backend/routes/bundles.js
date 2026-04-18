const express = require('express');
const router = express.Router();
const Bundle = require('../models/Bundle');

// Get all bundles
router.get('/', async (req, res) => {
  try {
    const { category, mode, partnerType, partner } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (mode) filter.eligibleModes = mode;

    if (partnerType === 'airline') {
      filter.airlinePartners = partner
        ? { $regex: partner, $options: 'i' }
        : { $exists: true, $ne: [] };
    }

    if (partnerType === 'railway') {
      filter.railwayPartners = partner
        ? { $regex: partner, $options: 'i' }
        : { $exists: true, $ne: [] };
    }

    if (partnerType === 'hotel') {
      filter.hotelPartners = partner
        ? { $regex: partner, $options: 'i' }
        : { $exists: true, $ne: [] };
    }
    
    const bundles = await Bundle.find(filter);
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bundle by ID
router.get('/:id', async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
    res.json(bundle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bundle (admin)
router.post('/', async (req, res) => {
  const bundle = new Bundle(req.body);
  try {
    const saved = await bundle.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bundle
router.put('/:id', async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bundle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete bundle
router.delete('/:id', async (req, res) => {
  try {
    await Bundle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bundle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
