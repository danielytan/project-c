import connectToDatabase from '../../lib/event-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '../../lib/event-pusher';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Save the event data to the database
    const collection = db.collection('chronology');
    const savedNote = await collection.insertOne(eventData);

    // Trigger the 'event-saved' event on the 'events' channel
    const pusherServer = getPusherServer();
    await pusherServer.trigger('chronology', 'event-saved', eventData);

    return NextResponse.json(savedNote, { status: 200 });
  } catch (error) {
    console.error('Error saving event:', error);
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
  }
}