import React, { useState } from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  .timeGrid {
    display: grid;
    grid-template-columns: 1fr 3fr 8fr; /* Adjust column count as needed */
    border: 1px solid #ddd;
  }

  .timeHeader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #ddd;
    padding: 10px;
    background-color: #f5f5f5;
    text-align: center;
    font-weight: bold;
  }
  
  .timesHeader {
    font-size: 1rem;
    margin: 0;
  }

  .columnHeader {
    border-right: 1px solid #ddd;
    padding: 10px;
    background-color: #f5f5f5;
    text-align: center;
    font-weight: bold;
  }

  .timeSlot {
    border-right: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  .columnSlot {
    border-right: 1px solid #ddd;
  }

  .addEventForm {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .addEventForm input {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
  }
`
const TimeGrid: React.FC = () => {
  const getTimeSlots = (): Date[] => {
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // Set start time to midnight

    const timeSlots: Date[] = [];
    for (let i = 0; i < 24; i++) {
      const timeSlot = new Date(startTime.getTime() + i * 60 * 60 * 1000); // Increment time by 1 hour
      timeSlots.push(timeSlot);
    }

    return timeSlots;
  };

  const timeSlots = getTimeSlots();
  const columns = ['発信元', '内容'];

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDetails, setEventDetails] = useState('');

  const handleAddEvent = () => {
    setIsAddingEvent(true);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      time: eventTime,
      location: eventLocation,
      details: eventDetails
    };

    // Logic to save the new event or update the existing events list

    setEventTime('');
    setEventLocation('');
    setEventDetails('');
    setIsAddingEvent(false);
  };

  return (
    <Grid>
      <div className="timeGrid">
        <div className="timeHeader">
          <span className="timesHeader">時刻</span>
        </div>
        <div className="columnHeader">発信元</div>
        <div className="columnHeader">内容</div>

        {timeSlots.map((timeSlot) => (
          <React.Fragment key={timeSlot.toISOString()}>
            <div className="timeSlot">
              {timeSlot.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
            <div className="columnSlot" />
            <div className="columnSlot" />
          </React.Fragment>
        ))}
      </div>
      {isAddingEvent ? (
        <form className="addEventForm" onSubmit={handleEventSubmit}>
          <input
            type="text"
            placeholder="Time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Details"
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      ) : (
        <button onClick={handleAddEvent}>Add Event</button>
      )}
    </Grid>
  );
};

export default TimeGrid;