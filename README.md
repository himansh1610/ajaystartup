# JourneyPlay - Travel + Entertainment Platform

A full-stack web application for booking travel and streaming OTT content simultaneously.

## Project Structure

```
journey2/
├── frontend/
│   └── index.html                 # Frontend application
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── models/
│   │   ├── Journey.js            # Journey/Route schema
│   │   ├── Bundle.js             # OTT Bundle schema
│   │   ├── User.js               # User schema
│   │   └── Booking.js            # Booking schema
│   ├── routes/
│   │   ├── journeys.js           # Journey API endpoints
│   │   ├── bundles.js            # Bundle API endpoints
│   │   ├── users.js              # User authentication & profile
│   │   └── bookings.js           # Booking management
│   ├── server.js                 # Main Express server
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables
└── README.md                      # This file
```

## Technologies

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design with CSS Grid & Flexbox
- RESTful API integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure MongoDB connection in `.env`
```bash
MONGODB_URI=mongodb://localhost:27017/journeyplay
```

4. Start the server
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Open `frontend/index.html` in a browser or serve with a local server
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend -p 8000
```

2. Frontend will be available at `http://localhost:8000`

## API Endpoints

### Journeys
- `GET /api/journeys` - List all journeys
- `GET /api/journeys?mode=train&from=Mumbai` - Filter journeys
- `GET /api/journeys/:id` - Get specific journey
- `POST /api/journeys` - Create journey (admin)
- `PUT /api/journeys/:id` - Update journey
- `DELETE /api/journeys/:id` - Delete journey

### Bundles
- `GET /api/bundles` - List all bundles
- `GET /api/bundles?category=free` - Filter bundles
- `GET /api/bundles/:id` - Get specific bundle
- `POST /api/bundles` - Create bundle (admin)
- `PUT /api/bundles/:id` - Update bundle
- `DELETE /api/bundles/:id` - Delete bundle

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users` - List all users (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings` - List all bookings (admin)

### Utilities
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database with sample data

## Database Models

### Journey
```javascript
{
  mode: 'train'|'flight'|'bus'|'hotel',
  name: String,
  from: String,
  to: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  price: Number,
  ottHours: Number,
  rating: Number
}
```

### Bundle
```javascript
{
  name: String,
  hours: Number,
  price: Number,
  features: [String],
  ottPlatforms: Number,
  quality: 'SD'|'HD'|'Full HD'|'4K',
  languages: [String],
  canDownload: Boolean,
  canOffline: Boolean
}
```

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  city: String,
  plan: 'free'|'basic'|'premium'|'business',
  totalWatchTime: Number,
  totalSpent: Number
}
```

### Booking
```javascript
{
  userId: ObjectId,
  journeyId: ObjectId,
  bundleId: ObjectId,
  bookingReference: String (unique),
  totalAmount: Number,
  paymentStatus: 'pending'|'completed'|'failed',
  bookingStatus: 'confirmed'|'cancelled'|'completed'
}
```

## Features

- ✓ Journey search and filtering
- ✓ OTT bundle selection
- ✓ User authentication (JWT)
- ✓ Booking management
- ✓ Payment tracking
- ✓ Admin dashboard
- ✓ Responsive UI
- ✓ RESTful API

## Development

### Start both services
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npx http-server -p 8000
```

### Seed database
```bash
curl -X POST http://localhost:5000/api/seed
```

## Environment Variables

Create `.env` file in backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/journeyplay
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
API_BASE=http://localhost:5000/api
FRONTEND_URL=http://localhost:8000
```

## Error Handling

The API returns standardized error responses:

```json
{
  "message": "Error description",
  "status": 400
}
```

## Performance Considerations

- Database indexes on frequently queried fields
- CORS enabled for cross-origin requests
- JWT token-based authentication
- MongoDB connection pooling
- Request validation with mongoose

## Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications
- [ ] Real-time session tracking
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] WebSocket for live updates
- [ ] Multi-language support
- [ ] Rate limiting & throttling

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use different port in http-server

### CORS Error
- Backend has CORS enabled
- Check frontend URL configuration

## License

MIT

## Support

For issues and questions, please contact the development team.
