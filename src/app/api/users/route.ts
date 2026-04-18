import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../db/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('GET /api/users failed:', error);
    return NextResponse.json(
      { message: 'Unable to fetch users', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const testDocument = {
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      isTest: true,
    };

    const result = await db.collection('users').insertOne(testDocument);
    return NextResponse.json(
      { insertedId: result.insertedId, document: testDocument },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/users failed:', error);
    return NextResponse.json(
      { message: 'Unable to insert user', error: (error as Error).message },
      { status: 500 }
    );
  }
}
