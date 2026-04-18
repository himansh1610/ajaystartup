'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SelectedTravelData {
  id?: string;
  name?: string;
  from?: string;
  to?: string;
  departureTime?: string;
  arrivalTime?: string;
  price?: number;
  [key: string]: unknown;
}

export default function PaymentPage() {
  const router = useRouter();
  const [selectedTravelData, setSelectedTravelData] = useState<SelectedTravelData | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedTravel = window.sessionStorage.getItem('selectedTravelData');
    const savedUserId = window.sessionStorage.getItem('selectedUserId');

    if (savedTravel) {
      setSelectedTravelData(JSON.parse(savedTravel));
    }

    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  const handlePayNow = async () => {
    if (!userId || !selectedTravelData) {
      setErrorMessage('Missing user or travel selection. Please restart checkout.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          selectedTravelData,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Payment failed');
      }

      router.push(`/confirmation/${data.bookingReference}`);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setIsProcessing(false);
    }
  };

  if (!selectedTravelData) {
    return (
      <div className="page-container">
        <h1>Payment</h1>
        <p>No travel selection found. Please choose a travel option first.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Confirm Payment</h1>
      <section className="summary-card">
        <h2>{selectedTravelData.name ?? 'Selected Travel'}</h2>
        <p>
          <strong>From:</strong> {selectedTravelData.from ?? 'N/A'}
        </p>
        <p>
          <strong>To:</strong> {selectedTravelData.to ?? 'N/A'}
        </p>
        <p>
          <strong>Departure:</strong> {selectedTravelData.departureTime ?? 'N/A'}
        </p>
        <p>
          <strong>Arrival:</strong> {selectedTravelData.arrivalTime ?? 'N/A'}
        </p>
        <p>
          <strong>Total:</strong> ₹{selectedTravelData.price ?? 0}
        </p>
      </section>

      <button onClick={handlePayNow} disabled={isProcessing}>
        {isProcessing ? 'Processing payment...' : 'Pay Now'}
      </button>

      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <style jsx>{`
        .page-container {padding: 24px; max-width: 720px; margin: 0 auto;}
        .summary-card {background: #111827; border: 1px solid #334155; padding: 20px; border-radius: 18px; margin: 24px 0;}
        .summary-card h2 {margin-bottom: 12px;}
        .summary-card p {margin: 6px 0; color: #cbd5e1;}
        button {background: #6366f1; color: white; border: none; border-radius: 12px; padding: 14px 20px; cursor: pointer; font-size: 1rem;}
        button:disabled {opacity: 0.65; cursor: not-allowed;}
        .error {color: #f87171; margin-top: 16px;}
      `}</style>
    </div>
  );
}
