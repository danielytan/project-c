import connectToDatabase from '../../lib/note-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '../../lib/note-pusher';
import { ObjectId } from 'mongodb';

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")!;

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Delete the note from the database
    const collection = db.collection('chronology');
    const noteId = new ObjectId(id)
    const result = await collection.deleteOne({ "_id": noteId });

    if (result.deletedCount === 1) {
      // Trigger the 'note-deleted' event on the 'notes' channel
      const pusherServer = getPusherServer();
      await pusherServer.trigger('chronology', 'note-deleted', noteId );

      return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}