import connectToDatabase from '../../lib/event-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '../../lib/event-pusher';
import { ObjectId } from 'mongodb';

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")!;

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Delete the event from the database
    const collection = db.collection('chronology');
    const eventId = new ObjectId(id)
    const result = await collection.deleteOne({ "_id": eventId });

    if (result.deletedCount === 1) {
      // Trigger the 'event-deleted' event on the 'events' channel
      const pusherServer = getPusherServer();
      await pusherServer.trigger('chronology', 'event-deleted', eventId );

      return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}