import connectToDatabase from '../../lib/note-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '../../lib/note-pusher';

export async function POST(request: NextRequest) {
  try {
    const noteData = await request.json();

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Save the note data to the database
    const collection = db.collection('chronology');
    const savedNote = await collection.insertOne(noteData);

    // Trigger the 'note-saved' event on the 'notes' channel
    const pusherServer = getPusherServer();
    await pusherServer.trigger('chronology', 'note-saved', noteData);

    return NextResponse.json(savedNote, { status: 200 });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}