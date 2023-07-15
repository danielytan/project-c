import connectToDatabase from '../../lib/event-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '../../lib/event-pusher';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")!;
    const eventTitle = (await request.json()).title

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Edit the event from the database
    const collection = db.collection('chronology');
    const eventId = new ObjectId(id)

    const result = await collection.updateOne({ "_id": eventId }, {
      $set: {
        title: eventTitle
      }
    });

    if (result.acknowledged === true) {
      // Trigger the 'event-edited' event on the 'events' channel
      const pusherServer = getPusherServer();
      await pusherServer.trigger('chronology', 'event-updated', { _id: id, title: eventTitle } );

      return NextResponse.json({ message: 'Event edited successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error editing event:', error);
    return NextResponse.json({ error: 'Failed to edit event' }, { status: 500 });
  }
}