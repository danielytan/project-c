"use client"

import React from 'react';
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
  return (
    <Container>
      <UtilityBar />
      <TimeTable />
      <OfflineIndicator />
    </Container>
  );
};

export default TimeScheduler;