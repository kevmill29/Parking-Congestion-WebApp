import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export async function POST(req: Request) {
  try {
    const { plate, permitType } = await req.json();

    if (!plate || !permitType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = client.db('ParkingApp');
    const cars = db.collection('cars');

    // Check for existing plate
    const existing = await cars.findOne({ plate });
    if (existing) {
      return NextResponse.json({ error: 'Plate already registered' }, { status: 409 });
    }

    await cars.insertOne({ plate, permitType });

    return NextResponse.json({ message: 'Vehicle registered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error registering vehicle:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
