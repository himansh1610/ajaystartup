import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../../../db/mongodb';

interface Params {
  bookingReference: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Params }
) {
  try {
    const { bookingReference } = params;
    if (!bookingReference) {
      return NextResponse.json({ message: 'Booking reference is required' }, { status: 400 });
    }

    const db = await getDb();
    const booking = await db.collection('bookings').findOne({ bookingReference });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const session = await db.collection('sessions').findOne({ bookingId: booking._id });

    return NextResponse.json({ booking, session }, { status: 200 });
  } catch (error) {
    console.error('GET /api/booking/[bookingReference] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
