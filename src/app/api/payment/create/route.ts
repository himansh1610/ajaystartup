import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../../db/mongodb';

function createBookingReference() {
  return `BK-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, selectedTravelData } = body;

    if (!userId || !selectedTravelData) {
      return NextResponse.json({ message: 'Missing userId or selectedTravelData' }, { status: 400 });
    }

    if (typeof userId !== 'string') {
      return NextResponse.json({ message: 'userId must be a string' }, { status: 400 });
    }

    let userObjectId: ObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }

    const db = await getDb();
    const bookingReference = createBookingReference();
    const createdAt = new Date();

    // Simulated payment success
    const paymentResult = {
      success: true,
      bookingReference,
      paidAt: createdAt,
      amount: selectedTravelData.price ?? 0,
    };

    if (!paymentResult.success) {
      return NextResponse.json({ message: 'Payment simulation failed' }, { status: 502 });
    }

    const bookingDocument = {
      userId: userObjectId,
      bookingReference,
      travelData: selectedTravelData,
      status: 'confirmed',
      createdAt,
    };

    const bookingInsert = await db.collection('bookings').insertOne(bookingDocument);

    try {
      const sessionDocument = {
        userId: userObjectId,
        bookingId: bookingInsert.insertedId,
        totalMinutes: 120,
        remainingMinutes: 120,
        status: 'active',
        lastHeartbeatAt: new Date(),
        createdAt: new Date(),
      };

      await db.collection('sessions').insertOne(sessionDocument);
    } catch (sessionError) {
      await db.collection('bookings').deleteOne({ _id: bookingInsert.insertedId });
      console.error('Session creation failed, rolled back booking:', sessionError);
      return NextResponse.json({ message: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookingReference }, { status: 201 });
  } catch (error) {
    console.error('POST /api/payment/create error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
