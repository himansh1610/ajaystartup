require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Models
const Journey = require('./models/Journey');
const Bundle = require('./models/Bundle');

// Routes
const journeyRoutes = require('./routes/journeys');
const bundleRoutes = require('./routes/bundles');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/journeys', journeyRoutes);
app.use('/api/routes', journeyRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✓', timestamp: new Date() });
});

// Seed initial data
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Journey.deleteMany({});
    await Bundle.deleteMany({});

    // Seed journeys
    const journeys = [
      {
        mode: 'train',
        name: 'Rajdhani Express',
        from: 'Mumbai',
        to: 'Delhi',
        departureTime: '06:00',
        arrivalTime: '21:40',
        duration: '15h 40m',
        price: 1240,
        ottHours: 6,
        rating: 4.8,
        seats: 42,
        class: 'AC 2-Tier'
      },
      {
        mode: 'train',
        name: 'Shatabdi Express',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '07:30',
        arrivalTime: '10:45',
        duration: '3h 15m',
        price: 540,
        ottHours: 3,
        rating: 4.5,
        seats: 120,
        class: 'Chair Car'
      },
      {
        mode: 'flight',
        name: 'IndiGo 6E-204',
        from: 'Mumbai',
        to: 'Delhi',
        departureTime: '09:15',
        arrivalTime: '11:30',
        duration: '2h 15m',
        price: 3820,
        ottHours: 2,
        rating: 4.3,
        seats: 8,
        class: 'Economy'
      },
      {
        mode: 'bus',
        name: 'Neeta Travels',
        from: 'Mumbai',
        to: 'Goa',
        departureTime: '22:00',
        arrivalTime: '08:00',
        duration: '10h',
        price: 680,
        ottHours: 4,
        rating: 4.2,
        seats: 22,
        class: 'Volvo AC'
      },
      {
        mode: 'hotel',
        name: 'Taj Palace Stay',
        from: 'Mumbai',
        to: 'Mumbai',
        departureTime: '14:00',
        arrivalTime: '12:00',
        duration: '22h',
        price: 6490,
        ottHours: 10,
        rating: 4.9,
        seats: 12,
        class: 'Deluxe Suite'
      }
    ];

    const bundles = [
      {
        name: 'City Hop Pack',
        hours: 1,
        price: 0,
        description: 'Perfect for metro connectors and airport shuttles.',
        features: ['Ad-lite streaming', 'SD quality', 'Regional short-form picks'],
        platformNames: ['JioHotstar', 'ZEE5', 'SonyLIV', 'ShemarooMe', 'Chaupal'],
        eligibleModes: ['train', 'flight'],
        airlinePartners: ['IndiGo', 'Akasa Air'],
        railwayPartners: ['IRCTC', 'Vande Bharat'],
        hotelPartners: ['Lemon Tree Hotels'],
        ottPlatforms: 5,
        quality: 'SD',
        languages: ['Hindi', 'English', 'Punjabi'],
        canDownload: false,
        canOffline: false,
        isPopular: false,
        category: 'free'
      },
      {
        name: 'Intercity Express Pack',
        hours: 3,
        price: 29,
        description: 'Built for medium-haul flights and premium trains.',
        features: ['HD streaming', 'Live TV snippets', 'Sports highlights'],
        platformNames: ['JioHotstar', 'SonyLIV', 'ZEE5', 'aha', 'SunNXT', 'Hoichoi', 'ETV Win'],
        eligibleModes: ['train', 'flight'],
        airlinePartners: ['IndiGo', 'Air India', 'SpiceJet'],
        railwayPartners: ['Rajdhani Express', 'Shatabdi Express', 'Vande Bharat'],
        hotelPartners: ['Ginger Hotels', 'FabHotels'],
        ottPlatforms: 15,
        quality: 'HD',
        languages: ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali'],
        canDownload: false,
        canOffline: false,
        isPopular: false,
        category: 'short'
      },
      {
        name: 'Pan India Voyage Pack',
        hours: 6,
        price: 49,
        description: 'Best for overnight rail and long domestic routes.',
        features: ['Full HD streaming', 'Download queue', 'Kids + sports lane'],
        platformNames: ['JioHotstar', 'SonyLIV', 'ZEE5', 'SunNXT', 'aha', 'Hoichoi', 'Chaupal', 'ShemarooMe', 'ManoramaMAX'],
        eligibleModes: ['train', 'flight', 'bus', 'hotel'],
        airlinePartners: ['Air India', 'Akasa Air', 'IndiGo'],
        railwayPartners: ['IRCTC', 'Rajdhani Express', 'Shatabdi Express'],
        hotelPartners: ['Taj Hotels', 'ITC Hotels', 'The Leela'],
        ottPlatforms: 30,
        quality: 'Full HD',
        languages: ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada', 'Gujarati'],
        canDownload: true,
        canOffline: false,
        isPopular: true,
        category: 'medium'
      },
      {
        name: 'Bharat Unlimited Journey Pack',
        hours: 999,
        price: 79,
        description: 'Unlimited entertainment for complete travel itineraries.',
        features: ['4K where available', 'Offline mode', 'Multi-device continuation', 'Priority CDN lanes'],
        platformNames: ['JioHotstar', 'SonyLIV', 'ZEE5', 'SunNXT', 'aha', 'Hoichoi', 'Chaupal', 'ShemarooMe', 'ETV Win', 'ManoramaMAX'],
        eligibleModes: ['train', 'flight', 'bus', 'hotel'],
        airlinePartners: ['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet'],
        railwayPartners: ['IRCTC', 'Rajdhani Express', 'Shatabdi Express', 'Vande Bharat'],
        hotelPartners: ['Taj Hotels', 'Oberoi Hotels', 'Marriott India', 'Hyatt India'],
        ottPlatforms: 50,
        quality: '4K',
        languages: ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada', 'Gujarati'],
        canDownload: true,
        canOffline: true,
        isPopular: false,
        category: 'unlimited'
      }
    ];

    await Journey.insertMany(journeys);
    await Bundle.insertMany(bundles);

    res.json({
      message: 'Database seeded successfully',
      journeys: journeys.length,
      bundles: bundles.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      JourneyPlay Backend Server        ║
║              v1.0.0                    ║
╚════════════════════════════════════════╝

✓ Server running on http://localhost:${PORT}
✓ API Base: http://localhost:${PORT}/api
✓ Database: MongoDB

Available Endpoints:
  GET    /api/health                - Health check
  POST   /api/seed                  - Seed database
  GET    /api/journeys              - List all journeys
  GET    /api/bundles               - List all bundles
  POST   /api/users/register        - Register new user
  POST   /api/users/login           - Login user
  POST   /api/bookings              - Create booking
  GET    /api/bookings/user/:userId - Get user bookings

Press Ctrl+C to stop the server
  `);
});

module.exports = app;
