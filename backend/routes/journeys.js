const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey');

// Get all journeys
router.get('/', async (req, res) => {
  try {
    const { mode, from, to } = req.query;
    let filter = {};
    
    if (mode) filter.mode = mode;
    if (from) filter.from = { $regex: from, $options: 'i' };
    if (to) filter.to = { $regex: to, $options: 'i' };
    
    const journeys = await Journey.find(filter).limit(50);
    res.json(journeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get journey by ID
router.get('/:id', async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);
    if (!journey) return res.status(404).json({ message: 'Journey not found' });
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create journey (admin)
router.post('/', async (req, res) => {
  const journey = new Journey(req.body);
  try {
    const saved = await journey.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update journey
router.put('/:id', async (req, res) => {
  try {
    const journey = await Journey.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(journey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete journey
router.delete('/:id', async (req, res) => {
  try {
    await Journey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journey deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
