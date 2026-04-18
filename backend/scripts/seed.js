const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Booking = require('../models/Booking');
const Journey = require('../models/Journey');
const Bundle = require('../models/Bundle');

const connectDB = require('../config/db');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Journey.deleteMany({});
    await Bundle.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed data from JSON files
    const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../seeds/travelstream-seed.json'), 'utf-8'));

    // Insert users
    if (seedData.users && seedData.users.length > 0) {
      await User.insertMany(seedData.users);
      console.log(`✅ Inserted ${seedData.users.length} users`);
    }

    // Insert bookings
    if (seedData.bookings && seedData.bookings.length > 0) {
      await Booking.insertMany(seedData.bookings);
      console.log(`✅ Inserted ${seedData.bookings.length} bookings`);
    }

    // Insert contents as journeys (assuming Journey model represents content)
    if (seedData.contents && seedData.contents.length > 0) {
      await Journey.insertMany(seedData.contents);
      console.log(`✅ Inserted ${seedData.contents.length} journeys`);
    }

    // Insert partners as bundles (assuming Bundle model represents partners)
    if (seedData.partners && seedData.partners.length > 0) {
      await Bundle.insertMany(seedData.partners);
      console.log(`✅ Inserted ${seedData.partners.length} bundles`);
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();