import axios from 'axios';
import {
  storeOfflineNote,
  getOfflineNote,
  getOfflineNotes,
  deleteOfflineNote,
  editOfflineNote
} from './note-indexeddb';

export interface Note {
  _id?: number; // Used by MongoDB
  localId?: string;

  localDeleteSynced?: boolean;
  localEditSynced?: boolean;

  time: Date;
  location: string;
  details: string;

  createdAt: Date;
}

function createServerNote(note: Note) {
  const serverNote: Note = {
    time: note.time,
    location: note.location,
    details: note.details,

    localId: note.localId,
    createdAt: note.createdAt
  }
  return serverNote
}

export function createNote(noteProps: any) {
  const note: Note = {
    time: noteProps.time,
    location: noteProps.location,
    details: noteProps.details,

    localId: crypto.randomUUID(),
    createdAt: new Date() // Add the current timestamp
  };
  return note;
}

export async function submitNote(note: Note) {
  // Store the note in IndexedDB first
  await storeOfflineNote(note);

  // Check if the browser is online
  if (navigator.onLine) {
    // Send a POST request to the save-note endpoint
    try {
      const response = await fetch('/chronology/api/save-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createServerNote(note)),
        cache: 'no-store'
      });

      if (response.ok) {
        console.log('Note submitted successfully');
        await response.json().then(async (data) => {
          note._id = data.insertedId;
          await editOfflineNote(note);
        });
      } else {
        console.error('Failed to submit note');
      }
    } catch (error) {
      console.error('Failed to submit note:', error);
    }
  }
}

export async function deleteNote(noteId: string) {
  try {
    const note = await getOfflineNote(noteId);
    if (note !== undefined) {
      if (note._id === undefined) {
        await deleteOfflineNote(noteId);
      } else {
        // Check if the browser is online
        if (navigator.onLine) {
          // Make a DELETE request to the API endpoint
          try {
            await deleteOfflineNote(noteId);
            await axios.delete(`/chronology/api/delete-note?id=${note._id}`);
          } catch (error) {
            console.error('Error deleting note:', error);
          }
        } else {
          note.localDeleteSynced = false;
          await editOfflineNote(note);
        }
      }
    }
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
}

export async function editNote(noteId: string, updatedNoteProps: any) {
  try {
    const note = await getOfflineNote(noteId);
    if (note !== undefined) {
      if (note._id === undefined) {
        note.time = updatedNoteProps.time;
        note.location = updatedNoteProps.location;
        note.details = updatedNoteProps.details;
        await editOfflineNote(note);
      } else {
        note.localEditSynced = false;
        // Check if the browser is online
        if (navigator.onLine) {
          // Make a PUT request to the API endpoint
          try {
            await axios.put(`/chronology/api/edit-note?id=${note._id}`, { 
              time: updatedNoteProps.time,
              location: updatedNoteProps.location,
              details: updatedNoteProps.details
            });
            note.time = updatedNoteProps.time;
            note.location = updatedNoteProps.location;
            note.details = updatedNoteProps.details;

            note.localEditSynced = undefined;
            await editOfflineNote(note);
          } catch (error) {
            console.error('Error editing note:', error);
          }
        } else {
          note.time = updatedNoteProps.time;
          note.location = updatedNoteProps.location;
          note.details = updatedNoteProps.details;

          await editOfflineNote(note);
        }
      }
    }
  } catch (error) {
    console.error('Failed to edit note:', error);
  }
}

export async function updateSavedNote(serverNote: Note, localNotes: Note[]) {
  const matchingSyncedLocalNote = localNotes.find(
    (localNote: Note) => localNote._id === serverNote._id
  );
  if (matchingSyncedLocalNote === undefined) {
    const matchingUnsyncedLocalNote = localNotes.find(
      (localNote: Note) => localNote.localId === serverNote.localId
    );
    if (matchingUnsyncedLocalNote !== undefined) {
      matchingUnsyncedLocalNote._id = serverNote._id;
      await editOfflineNote(matchingUnsyncedLocalNote);
    } else {
      serverNote.localId = crypto.randomUUID();
      await storeOfflineNote(serverNote);
    }
  }
}

export async function updateEditedNote(serverNote: Note, localNotes: Note[]) {
  const matchingLocalNote = localNotes.find((localNote: Note) => localNote._id === serverNote._id);
  if (matchingLocalNote !== undefined) {
    if (matchingLocalNote.localEditSynced === false) {
      await axios.put(`/chronology/api/edit-note?id=${matchingLocalNote._id}`, {
        time: matchingLocalNote.time,
        location: matchingLocalNote.location,
        details: matchingLocalNote.details
      });
      matchingLocalNote.localEditSynced = undefined;
      await editOfflineNote(matchingLocalNote);
    } else if (matchingLocalNote.localEditSynced === undefined) {
      matchingLocalNote.time = serverNote.time;
      matchingLocalNote.location = serverNote.location;
      matchingLocalNote.details = serverNote.details;
      await editOfflineNote(matchingLocalNote);
    }
  }
}

export async function updateDeletedNote(serverId: number, localNotes: Note[]) {
  const matchingLocalNote = localNotes.find((localNote: Note) => localNote._id === serverId);
  if (matchingLocalNote !== undefined) {
    await deleteOfflineNote(matchingLocalNote.localId);
  }
}

export async function refreshNotes() {
  if (navigator.onLine) {
    try {
      const localNotes = await getOfflineNotes();
      const response = await fetch('/chronology/api/fetch-notes', { cache: 'no-store' });
      const serverNotes = await response.json();
      console.log(serverNotes)

      for (const localNote of localNotes) {
        if (localNote._id !== undefined) {
          const matchingServerNote = serverNotes.find((serverNote: Note) => localNote._id === serverNote._id);
          if (matchingServerNote !== undefined) {
            if (localNote.localDeleteSynced === false) {
              await deleteOfflineNote(localNote.localId);
              await axios.delete(`/chronology/api/delete-note?id=${localNote._id}`);
            }
          } else {
            await deleteOfflineNote(localNote.localId);
          }
        } else {
          const submittedNoteResponse = await fetch('/chronology/api/save-note', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createServerNote(localNote)),
          });
          await submittedNoteResponse.json().then(async (data) => {
            localNote._id = data.insertedId;
            await editOfflineNote(localNote);
          });
        }
      }
  
      const updatedLocalNotes = await getOfflineNotes();
      const updatedResponse = await fetch('/chronology/api/fetch-notes', { cache: 'no-store' });
      const updatedServerNotes = await updatedResponse.json();

      for (const serverNote of updatedServerNotes) {
        updateSavedNote(serverNote, updatedLocalNotes); // make sure to keep into account locally deleted notes
        updateEditedNote(serverNote, updatedLocalNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }
}

export async function getNotes() {
  const notes = await getOfflineNotes();
  notes.sort(function(a: Note, b: Note) {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });
  return notes;
}