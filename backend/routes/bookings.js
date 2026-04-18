const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { validateBookingCreate } = require('../middleware/validate');

// Create booking
router.post('/', validateBookingCreate, async (req, res) => {
  try {
    const {
      userId,
      journeyId,
      bundleId,
      passengers,
      travelPrice,
      ottPrice,
      taxAmount,
      totalAmount,
      language,
      paymentMethod,
      journeyDate
    } = req.body;

    const booking = new Booking({
      userId,
      journeyId,
      bundleId,
      passengers,
      travelPrice,
      ottPrice,
      taxAmount,
      totalAmount,
      language,
      paymentMethod,
      journeyDate,
      paymentStatus: 'pending'
    });

    const saved = await booking.save();
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: {
        sessionsCount: 1,
        totalSpent: totalAmount
      }
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user bookings
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('journeyId')
      .populate('bundleId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate('journeyId')
      .populate('bundleId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: 'cancelled', updatedAt: new Date() },
      { new: true }
    );
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId')
      .populate('journeyId')
      .populate('bundleId')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
