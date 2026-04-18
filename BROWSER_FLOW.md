# Browser Implementation Guide — Payment Flow

## Flow Overview

```
Selection Page (/selection)
    ↓ [User selects travel + enters userId]
    ↓ [Saves to sessionStorage]
    ↓
Payment Page (/payment)
    ↓ [Reads from sessionStorage]
    ↓ [Shows summary, "Pay Now" button]
    ↓
Payment API (POST /api/payment/create)
    ↓ [Simulated payment success]
    ↓ [Creates booking in DB]
    ↓ [Creates session in DB]
    ↓
Confirmation Page (/confirmation/[bookingReference])
    ↓ [Fetches booking details]
    ↓ [Shows confirmation + session info]
```

---

## Page URLs

| Page | URL | File |
|------|-----|------|
| Selection | `http://localhost:3000/selection` | `src/app/selection/page.tsx` |
| Payment | `http://localhost:3000/payment` | `src/app/payment/page.tsx` |
| Confirmation | `http://localhost:3000/confirmation/BK-XXXX-1234567890` | `src/app/confirmation/[bookingReference]/page.tsx` |

---

## API Endpoints

### 1. Payment Processing
**Endpoint**: `POST /api/payment/create`

**Request**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "selectedTravelData": {
    "id": "1",
    "name": "Rajdhani Express",
    "from": "Mumbai",
    "to": "Delhi",
    "departureTime": "06:00",
    "arrivalTime": "21:40",
    "price": 1240,
    "mode": "train"
  }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "bookingReference": "BK-A7F3K2M9-1713426611234"
}
```

### 2. Fetch Booking
**Endpoint**: `GET /api/booking/BK-A7F3K2M9-1713426611234`

**Response**:
```json
{
  "booking": {
    "_id": "607f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-A7F3K2M9-1713426611234",
    "travelData": {
      "id": "1",
      "name": "Rajdhani Express",
      "from": "Mumbai",
      "to": "Delhi",
      "price": 1240
    },
    "status": "confirmed",
    "createdAt": "2026-04-18T10:30:11.234Z"
  },
  "session": {
    "_id": "607f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "bookingId": "607f1f77bcf86cd799439011",
    "totalMinutes": 120,
    "remainingMinutes": 120,
    "status": "active",
    "lastHeartbeatAt": "2026-04-18T10:30:11.234Z",
    "createdAt": "2026-04-18T10:30:11.234Z"
  }
}
```

---

## Step-by-Step User Flow

### Step 1: Selection Page
```
1. User visits http://localhost:3000/selection
2. Sees list of travel options (Rajdhani, IndiGo, Neeta, etc.)
3. Enters User ID (MongoDB ObjectId format)
4. Clicks on a travel card to select
5. Clicks "Proceed to Payment"
```

**What happens**:
- Selected travel data saved to `sessionStorage.selectedTravelData`
- User ID saved to `sessionStorage.selectedUserId`
- Browser navigates to `/payment`

---

### Step 2: Payment Page
```
1. User arrives at http://localhost:3000/payment
2. Sees travel summary (name, route, price)
3. Reviews booking details
4. Clicks "Pay Now"
```

**What happens**:
- Reads data from sessionStorage
- Calls `POST /api/payment/create`
- API creates booking + session in MongoDB
- Browser navigates to `/confirmation/[bookingReference]`

---

### Step 3: Confirmation Page
```
1. User arrives at http://localhost:3000/confirmation/BK-A7F3K2M9-1713426611234
2. Sees booking confirmation with reference number
3. Views travel details
4. Sees session status (120 remaining minutes)
```

**What happens**:
- Fetches booking from `GET /api/booking/BK-A7F3K2M9-1713426611234`
- Displays booking + session info

---

## Database Collections

### `bookings` Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "bookingReference": "BK-A7F3K2M9-1713426611234",
  "travelData": { /* full travel object */ },
  "status": "confirmed",
  "createdAt": ISODate
}
```

### `sessions` Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "bookingId": ObjectId,
  "totalMinutes": 120,
  "remainingMinutes": 120,
  "status": "active",
  "lastHeartbeatAt": ISODate,
  "createdAt": ISODate
}
```

---

## Testing with Mock Data

### Get a test User ID
1. Run backend seed: `node backend/scripts/seed.js`
2. Check MongoDB for users collection
3. Copy an ObjectId from a user document
   ```
   Example: 507f1f77bcf86cd799439011
   ```

### Manual Test Steps
1. Open: `http://localhost:3000/selection`
2. Paste User ID in input field
3. Click a travel card
4. Click "Proceed to Payment"
5. Click "Pay Now"
6. See confirmation page with booking reference

---

## Code Integration Points

### Selection Page saves data
```ts
window.sessionStorage.setItem('selectedTravelData', JSON.stringify(selectedTravel));
window.sessionStorage.setItem('selectedUserId', userId);
router.push('/payment');
```

### Payment Page reads data
```ts
const savedTravel = window.sessionStorage.getItem('selectedTravelData');
const savedUserId = window.sessionStorage.getItem('selectedUserId');
```

### Payment Page calls API
```ts
const response = await fetch('/api/payment/create', {
  method: 'POST',
  body: JSON.stringify({ userId, selectedTravelData })
});
```

### Confirmation Page fetches booking
```ts
const res = await fetch(`/api/booking/${bookingReference}`);
const data = await res.json();
```

---

## Environment Setup

**MongoDB Connection**: `mongodb://localhost:27017`
**Database**: `journeyplay`
**Backend Port**: `5000`
**Frontend Port**: `3000`

---

## Next.js App Router Structure
```
src/
├── app/
│   ├── selection/
│   │   └── page.tsx         ← Travel selection UI
│   ├── payment/
│   │   └── page.tsx         ← Payment confirmation UI
│   ├── confirmation/
│   │   └── [bookingReference]/
│   │       └── page.tsx     ← Booking confirmation UI
│   └── api/
│       ├── payment/
│       │   └── create/
│       │       └── route.ts ← Payment API
│       └── booking/
│           └── [bookingReference]/
│               └── route.ts ← Confirmation API
└── db/
    └── mongodb.ts           ← DB connection
```

---

## Browser Test Commands

```bash
# Start backend (port 5000)
cd backend
npm run dev

# Start Next.js frontend (port 3000)
cd ..  # go to root
npx next dev

# Open browser
http://localhost:3000/selection
```
