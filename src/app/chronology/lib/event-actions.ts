import axios from 'axios';
import {
  storeOfflineEvent,
  getOfflineEvent,
  getOfflineEvents,
  deleteOfflineEvent,
  editOfflineEvent
} from './event-indexeddb';

export interface Event {
  _id?: number; // Used by MongoDB
  localId?: string;

  localDeleteSynced?: boolean;
  localEditSynced?: boolean;

  title: string;
  createdAt: Date;
}

function createServerEvent(event: Event) {
  const serverEvent: Event = {
    title: event.title,
    localId: event.localId,
    createdAt: event.createdAt
  }
  return serverEvent
}

export function createEvent(eventTitle: string) {
  const event: Event = {
    title: eventTitle,
    localId: crypto.randomUUID(),
    createdAt: new Date() // Add the current timestamp
  };
  return event;
}

export async function submitEvent(event: Event) {
  // Store the event in IndexedDB first
  await storeOfflineEvent(event);

  // Check if the browser is online
  if (navigator.onLine) {
    // Send a POST request to the save-event endpoint
    try {
      const response = await fetch('/chronology/api/save-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createServerEvent(event)),
        cache: 'no-store'
      });

      if (response.ok) {
        console.log('Event submitted successfully');
        await response.json().then(async (data) => {
          event._id = data.insertedId;
          await editOfflineEvent(event);
        });
      } else {
        console.error('Failed to submit event');
      }
    } catch (error) {
      console.error('Failed to submit event:', error);
    }
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const event = await getOfflineEvent(eventId);
    if (event !== undefined) {
      if (event._id === undefined) {
        await deleteOfflineEvent(eventId);
      } else {
        // Check if the browser is online
        if (navigator.onLine) {
          // Make a DELETE request to the API endpoint
          try {
            await deleteOfflineEvent(eventId);
            await axios.delete(`/chronology/api/delete-event?id=${event._id}`);
          } catch (error) {
            console.error('Error deleting event:', error);
          }
        } else {
          event.localDeleteSynced = false;
          await editOfflineEvent(event);
        }
      }
    }
  } catch (error) {
    console.error('Failed to delete event:', error);
  }
}

export async function editEvent(eventId: string, updatedTitle: string) {
  try {
    const event = await getOfflineEvent(eventId);
    if (event !== undefined) {
      if (event._id === undefined) {
        event.title = updatedTitle;
        await editOfflineEvent(event);
      } else {
        event.localEditSynced = false;
        // Check if the browser is online
        if (navigator.onLine) {
          // Make a PUT request to the API endpoint
          try {
            await axios.put(`/chronology/api/edit-event?id=${event._id}`, { title: updatedTitle });
            event.title = updatedTitle;
            event.localEditSynced = undefined;
            await editOfflineEvent(event);
          } catch (error) {
            console.error('Error editing event:', error);
          }
        } else {
          event.title = updatedTitle;
          await editOfflineEvent(event);
        }
      }
    }
  } catch (error) {
    console.error('Failed to edit event:', error);
  }
}

export async function updateSavedEvent(serverEvent: Event, localEvents: Event[]) {
  const matchingSyncedLocalEvent = localEvents.find(
    (localEvent: Event) => localEvent._id === serverEvent._id
  );
  if (matchingSyncedLocalEvent === undefined) {
    const matchingUnsyncedLocalEvent = localEvents.find(
      (localEvent: Event) => localEvent.localId === serverEvent.localId
    );
    if (matchingUnsyncedLocalEvent !== undefined) {
      matchingUnsyncedLocalEvent._id = serverEvent._id;
      await editOfflineEvent(matchingUnsyncedLocalEvent);
    } else {
      serverEvent.localId = crypto.randomUUID();
      await storeOfflineEvent(serverEvent);
    }
  }
}

export async function updateEditedEvent(serverEvent: Event, localEvents: Event[]) {
  const matchingLocalEvent = localEvents.find((localEvent: Event) => localEvent._id === serverEvent._id);
  if (matchingLocalEvent !== undefined) {
    if (matchingLocalEvent.localEditSynced === false) {
      await axios.put(`/chronology/api/edit-event?id=${matchingLocalEvent._id}`, { title: matchingLocalEvent.title });
      matchingLocalEvent.localEditSynced = undefined;
      await editOfflineEvent(matchingLocalEvent);
    } else if (matchingLocalEvent.localEditSynced === undefined) {
      matchingLocalEvent.title = serverEvent.title;
      await editOfflineEvent(matchingLocalEvent);
    }
  }
}

export async function updateDeletedEvent(serverId: number, localEvents: Event[]) {
  const matchingLocalEvent = localEvents.find((localEvent: Event) => localEvent._id === serverId);
  if (matchingLocalEvent !== undefined) {
    await deleteOfflineEvent(matchingLocalEvent.localId);
  }
}

export async function refreshEvents() {
  if (navigator.onLine) {
    try {
      const localEvents = await getOfflineEvents();
      const response = await fetch('/chronology/api/fetch-events', { cache: 'no-store' });
      const serverEvents = await response.json();
      console.log(serverEvents)

      for (const localEvent of localEvents) {
        if (localEvent._id !== undefined) {
          const matchingServerEvent = serverEvents.find((serverEvent: Event) => localEvent._id === serverEvent._id);
          if (matchingServerEvent !== undefined) {
            if (localEvent.localDeleteSynced === false) {
              await deleteOfflineEvent(localEvent.localId);
              await axios.delete(`/chronology/api/delete-event?id=${localEvent._id}`);
            }
          } else {
            await deleteOfflineEvent(localEvent.localId);
          }
        } else {
          const submittedEventResponse = await fetch('/chronology/api/save-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createServerEvent(localEvent)),
          });
          await submittedEventResponse.json().then(async (data) => {
            localEvent._id = data.insertedId;
            await editOfflineEvent(localEvent);
          });
        }
      }
  
      const updatedLocalEvents = await getOfflineEvents();
      const updatedResponse = await fetch('/chronology/api/fetch-events', { cache: 'no-store' });
      const updatedServerEvents = await updatedResponse.json();

      for (const serverEvent of updatedServerEvents) {
        updateSavedEvent(serverEvent, updatedLocalEvents); // make sure to keep into account locally deleted events
        updateEditedEvent(serverEvent, updatedLocalEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
}

export async function getEvents() {
  const events = await getOfflineEvents();
  events.sort(function(a: Event, b: Event) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return events;
}