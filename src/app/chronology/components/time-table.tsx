import React from 'react';
import styled from 'styled-components';
import { Note } from '../lib/note-actions';

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

  .eventDetails {
    display: grid;
    text-align: left;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 0.5rem 1rem;
  }

  .eventRow {
    display: grid;
    text-align: center;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 0.5rem 1rem;
  }

  .eventRow span {
    display: block;
    line-height: 1.5;
    font-size: 1rem;
  }
`;

interface TimeTableProps {
  events: Note[];
}

const TimeTable: React.FC<TimeTableProps> = ({ events }) => {
  return (
    <Grid>
      <div className="timeGrid">
        <div>
          <div className="timeHeader">時刻</div>
          {events.map((event, index) => (
            <div key={index} className="eventRow">
              <span>
                {new Date(event.time).toLocaleTimeString('en-Gb', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Japan'
                })}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div className="columnHeader">発信元</div>
          {events.map((event, index) => (
            <div key={index} className="eventRow">
              <span>{event.location}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="columnHeader">内容</div>
          {events.map((event, index) => (
            <div key={index} className="eventDetails">
              <span>{event.details}</span>
            </div>
          ))}
        </div>
      </div>
    </Grid>
  );
};

export default TimeTable;