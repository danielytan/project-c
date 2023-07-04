import connectToDatabase from '../../lib/note-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '../../lib/note-pusher';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")!;
    const noteTitle = (await request.json()).title

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Edit the note from the database
    const collection = db.collection('chronology');
    const noteId = new ObjectId(id)

    const result = await collection.updateOne({ "_id": noteId }, {
      $set: {
        title: noteTitle
      }
    });

    if (result.acknowledged === true) {
      // Trigger the 'note-edited' event on the 'notes' channel
      const pusherServer = getPusherServer();
      await pusherServer.trigger('chronology', 'note-updated', { _id: id, title: noteTitle } );

      return NextResponse.json({ message: 'Note edited successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error editing note:', error);
    return NextResponse.json({ error: 'Failed to edit note' }, { status: 500 });
  }
}