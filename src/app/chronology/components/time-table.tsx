import React from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { Note } from '../lib/note-actions';

const Grid = styled.div`
  display: grid;
  border: 1px solid #ddd;

  .row {
    display: grid;
    grid-template-columns: 1fr 3fr 8fr; /* Adjust column count as needed */
    
    .header {
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

    .content {
      text-align: center;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      padding: 0.5rem 1rem;
    }

    .details {
      text-align: left;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      padding: 0.5rem 1rem;
    }
  }

  .date {
    text-align: center;
    font-weight: bold;
    font-size: 1.5rem;
    background-color: #f5f5f5;
  }

  .bar {
    border-bottom: 5px solid #ddd;
  }
`;

const UtilityButton = styled(Button)`
  font-size: 1rem;
`

interface TimeTableProps {
  events: Note[];
  isEditing: boolean;
  setEventBeingEdited: any;
  onEventDelete: (noteId: string) => Promise<void>;
}

const TimeTable: React.FC<TimeTableProps> = ({
  isEditing, events, onEventDelete, setEventBeingEdited
}) => {
  let currentDay = 0;

  return (
    <Grid>
      <div className="row">
        <div className="header">時刻</div>
        <div className="header">発信元</div>
        <div className="header">内容</div>
      </div>
      {events.map((event, index) => {
        const dateTime = new Date(event.time)
        const eventDay = dateTime.getDate();
        const eventMonth = dateTime.getMonth() + 1;
        const isSameDay = currentDay === eventDay;
        if (!isSameDay) {
          currentDay = eventDay;
        }
        
        return <div key={index}>
          {!isSameDay && (
            <>
              <div className="bar"></div>
              <div className="date">{eventMonth + "/" + eventDay}</div>
            </>
          )}
          <div className="row">
            <div className="content">
              {dateTime.toLocaleTimeString('en-Gb', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Japan'
              })}
              {isEditing && (
                <>
                  <UtilityButton variant="ghost" onClick={() => { onEventDelete(event.localId!) }}>削除</UtilityButton>
                  <UtilityButton variant="ghost" onClick={() => { setEventBeingEdited(event) }}>編集</UtilityButton>
                </>
              )}
            </div>
            <div className="content">{event.location}</div>
            <div className="details">{event.details}</div>
          </div>
        </div>
    })}
    </Grid>
  );
};

export default TimeTable;