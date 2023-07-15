"use client"

import React, { useCallback } from 'react';
import styled from 'styled-components';
import UtilityBar from './utility-bar';
import TimeTable from './time-table';
import OfflineIndicator from './offline-indicator';

const Container = styled.div`
  max-width: 100%;
  margin: 0 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: left;
`

const TimeScheduler: React.FC = () => {
  const handleNoteSubmit = useCallback(async (noteTitle: string) => {
    //const note: Note = createNote(noteTitle);
    //await submitNote(note);
    //setAllNotes(await getNotes());
  }, []);

  return (
    <Container>
      <UtilityBar onEventSubmit={handleNoteSubmit}/>
      <TimeTable />
      <OfflineIndicator />
    </Container>
  );
};

export default TimeScheduler;