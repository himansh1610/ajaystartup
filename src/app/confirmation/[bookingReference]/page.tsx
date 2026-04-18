import { notFound } from 'next/navigation';

interface BookingResponse {
  booking: {
    bookingReference: string;
    travelData: Record<string, unknown>;
    status: string;
    createdAt: string;
  };
  session: {
    status: string;
    totalMinutes: number;
    remainingMinutes: number;
    lastHeartbeatAt: string;
    createdAt: string;
  } | null;
}

async function fetchBooking(bookingReference: string): Promise<BookingResponse> {
  const res = await fetch(`/api/booking/${bookingReference}`);

  if (!res.ok) {
    throw new Error('Unable to fetch booking confirmation.');
  }

  return res.json();
}

export default async function ConfirmationPage({ params }: { params: { bookingReference: string } }) {
  const bookingReference = params.bookingReference;
  let bookingResponse: BookingResponse;

  try {
    bookingResponse = await fetchBooking(bookingReference);
  } catch (error) {
    notFound();
  }

  const { booking, session } = bookingResponse;

  return (
    <div className="page-container">
      <h1>Booking Confirmed</h1>
      <p>Your booking reference is:</p>
      <div className="reference">{booking.bookingReference}</div>

      <section className="details-card">
        <h2>Travel Details</h2>
        {Object.entries(booking.travelData).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {String(value)}
          </p>
        ))}
      </section>

      {session ? (
        <section className="details-card">
          <h2>Session Status</h2>
          <p>
            <strong>Status:</strong> {session.status}
          </p>
          <p>
            <strong>Remaining minutes:</strong> {session.remainingMinutes}
          </p>
          <p>
            <strong>Last heartbeat:</strong> {new Date(session.lastHeartbeatAt).toLocaleString()}
          </p>
        </section>
      ) : (
        <p>Session details not available yet.</p>
      )}

      <style jsx>{`
        .page-container { padding: 24px; max-width: 760px; margin: 0 auto; }
        .reference { background: #111827; padding: 14px 16px; border-radius: 14px; margin: 16px 0; color: #f8fafc; }
        .details-card { background: #0f172a; border: 1px solid #334155; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
        .details-card h2 { margin-bottom: 14px; }
        .details-card p { margin: 8px 0; color: #cbd5e1; }
      `}</style>
    </div>
  );
}
