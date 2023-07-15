import connectToDatabase from '../../lib/note-mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path') || '/'
    revalidatePath(path)

    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Fetch all the notes from the 'notes' collection
    const collection = db.collection('chronology')
    const notes = (await collection.find({}).toArray()).reverse();

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}