import connectToDatabase from '../../lib/event-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path') || '/'
    revalidatePath(path)

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Fetch all the events from the 'events' collection
    const collection = db.collection('chronology')
    const events = (await collection.find({}).toArray()).reverse();

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}