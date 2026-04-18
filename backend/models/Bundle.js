const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  name: String,
  hours: Number,
  price: Number,
  description: String,
  features: [String],
  platformNames: [String],
  eligibleModes: {
    type: [String],
    enum: ['train', 'flight', 'bus', 'hotel'],
    default: ['train', 'flight']
  },
  airlinePartners: [String],
  railwayPartners: [String],
  hotelPartners: [String],
  ottPlatforms: Number,
  quality: {
    type: String,
    enum: ['SD', 'HD', 'Full HD', '4K'],
    default: 'SD'
  },
  languages: [String],
  canDownload: Boolean,
  canOffline: Boolean,
  isPopular: Boolean,
  category: {
    type: String,
    enum: ['free', 'short', 'medium', 'long', 'unlimited'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bundle', bundleSchema);
