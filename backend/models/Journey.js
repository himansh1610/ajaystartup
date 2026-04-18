const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['train', 'flight', 'bus', 'hotel'],
    required: true
  },
  name: String,
  from: String,
  to: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  price: Number,
  ottHours: Number,
  rating: Number,
  seats: Number,
  class: String,
  operatorId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journey', journeySchema);
