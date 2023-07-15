"use client"

import { useCallback, useEffect, useState } from 'react';
import { SpinnerContainer } from './loading-spinner';
import { pusherClient } from '../lib/event-pusher'
import { Note,
  createNote, submitNote, deleteNote, editNote, refreshNotes, getNotes,
  updateSavedNote, updateEditedNote, updateDeletedNote
} from '../lib/event-actions'

import styled from 'styled-components';

import NoteForm from './note-form';
import NoteItem from './note-item';
import OfflineIndicator from './offline-indicator';

const Container = styled.div`
  max-width: 100%;
  margin: 0 1;
  padding: 20px;
`;

const NotesContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const NoteListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 90%; /* Adjust the width to a percentage value */
  margin: 0 0; /* Add margin: auto to center the wrapper */
`;

const NoteListLoadingSpinner = styled(SpinnerContainer)`
  margin-top: 0px;
  margin-bottom: 20px;
  align-self: center;
`;

export default function NoteList() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNoteSubmit = useCallback(async (noteTitle: string) => {
    const note: Note = createNote(noteTitle);
    await submitNote(note);
    setAllNotes(await getNotes());
  }, []);

  const handleNoteDelete = useCallback(async (noteId: string) => {
    await deleteNote(noteId);
    setAllNotes(await getNotes());
  }, []);

  const handleEditNote = useCallback(async (noteId: string, updatedTitle: string) => {
    await editNote(noteId, updatedTitle);
    setAllNotes(await getNotes());
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoading(true);

    // Simulate a longer loading time (e.g., 2 seconds)
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await refreshNotes();
      setAllNotes(await getNotes());
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();

    /*
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { type: 'module' })
        .then((registration) => {
          console.log('Service Worker registered:', registration);
  
          // Listen for the "online" event to trigger sync
          window.addEventListener('online', async () => {
            registration.sync.register('sync-notes')
              .then(() => {
                console.log('Sync event registered');
              })
              .catch((error) => {
                console.error('Sync event registration failed:', error);
              });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
    */

    window.addEventListener('online', async () => {
      await fetchNotes();
    })

    const channel = pusherClient?.subscribe('chronology');

    if (channel) {
      channel.bind('note-saved', async (savedNote: Note) => {
        updateSavedNote(savedNote, await getNotes());
        setAllNotes(await getNotes());
      });

      channel.bind('note-updated', async (updatedNote: Note) => {
        updateEditedNote(updatedNote, await getNotes());
        setAllNotes(await getNotes());
      });
      
      channel.bind('note-deleted', async (deletedNoteId: number) => {
        updateDeletedNote(deletedNoteId, await getNotes());
        setAllNotes(await getNotes());
      });
    }

    return () => {
      pusherClient?.unsubscribe('chronology');
    };
  }, [handleNoteSubmit, fetchNotes]);

  return (
    <NotesContainer>
      <OfflineIndicator />
    </NotesContainer>
  );
}