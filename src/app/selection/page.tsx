'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Travel {
  id: string;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  mode: string;
}

const mockTravelOptions: Travel[] = [
  {
    id: '1',
    name: 'Rajdhani Express',
    from: 'Mumbai',
    to: 'Delhi',
    departureTime: '06:00',
    arrivalTime: '21:40',
    price: 1240,
    mode: 'train',
  },
  {
    id: '2',
    name: 'IndiGo 6E-204',
    from: 'Mumbai',
    to: 'Delhi',
    departureTime: '09:15',
    arrivalTime: '11:30',
    price: 3820,
    mode: 'flight',
  },
  {
    id: '3',
    name: 'Neeta Travels',
    from: 'Mumbai',
    to: 'Goa',
    departureTime: '22:00',
    arrivalTime: '08:00',
    price: 680,
    mode: 'bus',
  },
];

export default function SelectionPage() {
  const router = useRouter();
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectTravel = (travel: Travel) => {
    setSelectedTravel(travel);
    setErrorMessage(null);
  };

  const handleProceedToPayment = () => {
    if (!userId) {
      setErrorMessage('Please enter a user ID');
      return;
    }

    if (!selectedTravel) {
      setErrorMessage('Please select a travel option');
      return;
    }

    // Save to sessionStorage for payment page to access
    window.sessionStorage.setItem('selectedTravelData', JSON.stringify(selectedTravel));
    window.sessionStorage.setItem('selectedUserId', userId);

    // Navigate to payment page
    router.push('/payment');
  };

  return (
    <div className="container">
      <h1>Select Your Travel</h1>

      {/* User ID Input */}
      <section className="user-input-section">
        <label htmlFor="userId">User ID (MongoDB ObjectId):</label>
        <input
          id="userId"
          type="text"
          placeholder="e.g., 507f1f77bcf86cd799439011"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </section>

      {/* Travel Options */}
      <section className="travel-options">
        <h2>Available Options</h2>
        <div className="options-grid">
          {mockTravelOptions.map((travel) => (
            <div
              key={travel.id}
              className={`option-card ${selectedTravel?.id === travel.id ? 'selected' : ''}`}
              onClick={() => handleSelectTravel(travel)}
            >
              <div className="option-header">
                <h3>{travel.name}</h3>
                <span className="mode-badge">{travel.mode}</span>
              </div>
              <div className="route">
                {travel.from} → {travel.to}
              </div>
              <div className="times">
                <span>Depart: {travel.departureTime}</span>
                <span>Arrive: {travel.arrivalTime}</span>
              </div>
              <div className="price">₹{travel.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Summary */}
      {selectedTravel && (
        <section className="summary-section">
          <h2>Selected Option</h2>
          <div className="summary">
            <p>
              <strong>{selectedTravel.name}</strong>
            </p>
            <p>
              {selectedTravel.from} → {selectedTravel.to}
            </p>
            <p>₹{selectedTravel.price}</p>
          </div>
        </section>
      )}

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Action Button */}
      <button className="proceed-button" onClick={handleProceedToPayment}>
        Proceed to Payment
      </button>

      <style jsx>{`
        .container {
          padding: 40px 24px;
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 32px;
          text-align: center;
          background: linear-gradient(120deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #e2e8f0;
        }

        .user-input-section {
          background: #111827;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
          border: 1px solid #334155;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #cbd5e1;
        }

        input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #475569;
          border-radius: 10px;
          background: #0f172a;
          color: #f1f5f9;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .travel-options {
          margin-bottom: 40px;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .option-card {
          background: #1e293b;
          border: 2px solid #334155;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .option-card:hover {
          border-color: #6366f1;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
          transform: translateY(-4px);
        }

        .option-card.selected {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .option-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #f1f5f9;
        }

        .mode-badge {
          background: #6366f1;
          color: white;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .route {
          color: #cbd5e1;
          font-size: 1rem;
          margin-bottom: 12px;
        }

        .times {
          display: flex;
          gap: 20px;
          margin-bottom: 12px;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #6366f1;
        }

        .summary-section {
          background: #111827;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
          border: 1px solid #6366f1;
        }

        .summary {
          background: #0f172a;
          padding: 16px;
          border-radius: 12px;
        }

        .summary p {
          margin: 8px 0;
          color: #cbd5e1;
        }

        .error-message {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid #f87171;
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .proceed-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(120deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .proceed-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3);
        }

        .proceed-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
