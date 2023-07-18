"use client"

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import UtilityBar from './utility-bar';
import TimeTable from './time-table';
import OfflineIndicator from './offline-indicator';
import { SpinnerContainer } from '../components/loading-spinner';
import { 
  Note, createNote, deleteNote, editNote, getNotes, refreshNotes,
  submitNote, updateDeletedNote, updateEditedNote, updateSavedNote
} from '../lib/note-actions';
import { pusherClient } from '../lib/note-pusher';

const Container = styled.div`
  max-width: 100%;
  margin: 0 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
`

const LoadingSpinner = styled(SpinnerContainer)`
  margin-top: 20px;
  margin-bottom: 10px;
`

const TimeScheduler: React.FC = () => {
  const [events, setEvents] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventBeingEdited, setEventBeingEdited] = useState(undefined);

  const toggleIsEditing = useCallback(() => {
    setIsEditing((current) => !current);
  }, []);

  const handleEventSubmit = useCallback(async (noteProps: any) => {
    const note: Note = createNote(noteProps);
    await submitNote(note);
    setEvents(await getNotes());
  }, []);

  const handleEventDelete = useCallback(async (noteId: string) => {
    await deleteNote(noteId);
    setEvents(await getNotes());
  }, []);

  const handleEventEdit = useCallback(async (noteId: string, updatedNoteProps: any) => {
    await editNote(noteId, updatedNoteProps);
    setEvents(await getNotes());
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);

    // Simulate a longer loading time (e.g., 2 seconds)
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await refreshNotes();
      setEvents(await getNotes());
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

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
      await fetchEvents();
    })

    const channel = pusherClient?.subscribe('chronology');

    if (channel) {
      channel.bind('note-saved', async (savedNote: Note) => {
        updateSavedNote(savedNote, await getNotes());
        setEvents(await getNotes());
      });

      channel.bind('note-updated', async (updatedNote: Note) => {
        updateEditedNote(updatedNote, await getNotes());
        setEvents(await getNotes());
      });
      
      channel.bind('note-deleted', async (deletedNoteId: number) => {
        updateDeletedNote(deletedNoteId, await getNotes());
        setEvents(await getNotes());
      });
    }

    return () => {
      pusherClient?.unsubscribe('chronology');
    };
  }, [handleEventSubmit, fetchEvents]);

  return (
    <Container>
      <UtilityBar
        onEventSubmit={handleEventSubmit}
        onEventEdit={handleEventEdit}
        toggleIsEditing={toggleIsEditing}
        eventBeingEdited={eventBeingEdited}
        setEventBeingEdited={setEventBeingEdited}
      />
      <TimeTable
        events={events}
        isEditing={isEditing}
        onEventDelete={handleEventDelete}
        setEventBeingEdited={setEventBeingEdited}
      />
      {loading && <LoadingSpinner />}
      <OfflineIndicator />
    </Container>
  );
};

export default TimeScheduler;