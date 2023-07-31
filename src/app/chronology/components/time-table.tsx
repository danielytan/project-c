import React from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { Note } from '../lib/note-actions';

const Grid = styled.div<{ $isEditing?: boolean }>`
  display: grid;

  .row {
    display: grid;
    grid-template-columns: ${props => props.$isEditing ? '0.8fr 1fr 2.2fr' : '1fr 3fr'} 8fr;

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background-color: #f5f5f5;
      text-align: center;
      font-weight: bold;
      box-sizing: content-box;
      outline: 1px solid #ddd;
    }

    .content {
      text-align: center;
      padding: 0.5rem 1rem;
      box-sizing: content-box;
      outline: 1px solid #ddd;
    }

    .details {
      text-align: left;
      padding: 0.5rem 1rem;
      box-sizing: content-box;
      outline: 1px solid #ddd;
    }
  }

  .separator {
    border-bottom: 5px solid #ddd;
    float: right;
    margin-left: auto;
    width: ${props => props.$isEditing ? 'calc(11.2/12 * 100%)' : '100%'};
  }

  .date {
    text-align: center;
    font-weight: bold;
    font-size: 1.5rem;
    background-color: #f5f5f5;
    margin-left: auto;
    box-sizing: content-box;
    outline: 1px solid #ddd;
    width: ${props => props.$isEditing ? 'calc(11.2/12 * 100%)' : '100%'};
  }
`;

const UtilityButton = styled(Button)`
  font-size: 1rem;
`

const EditButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const OfflineIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Update to column */
  align-items: flex-end; /* Align text elements to the right */
  justify-content: flex-end; /* Align text elements to the bottom */
  position: relative;
  bottom: 0;
  right: 0;
  font-size: 0.75rem; /* Adjust the font size to make the icon smaller */
  color: #fff;
`;

const OfflineIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.25rem; /* Add margin-bottom for spacing between pairs */
`;

const OfflineIndicatorText = styled.span`
  font-size: 0.8rem;
  color: red;
`;

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
    <Grid $isEditing={isEditing}>
      <div className="row">
        {isEditing && (<div></div>)}
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
              <div className="separator" />
              <div className="date">{eventMonth + "/" + eventDay}</div>
            </>
          )}
          <div className="row">
            {isEditing && (
              <EditButtonContainer>
                <UtilityButton variant="ghost" onClick={() => { onEventDelete(event.localId!) }}>🆑</UtilityButton>
                <UtilityButton variant="ghost" onClick={() => { setEventBeingEdited(event) }}>📑</UtilityButton>
              </EditButtonContainer>
            )}
            <div className="content">
              {dateTime.toLocaleTimeString('en-Gb', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Japan'
              })}
            </div>
            <div className="content">{event.location}</div>
            <div className="details">
              {event.details}
              {(event.localDeleteSynced === false || event.localEditSynced === false || event._id === undefined) && (
                <OfflineIndicatorWrapper>
                  {event.localDeleteSynced === false && (
                    <OfflineIndicator>
                      <OfflineIndicatorText>削除が同期されていない</OfflineIndicatorText>
                    </OfflineIndicator>
                  )}
                  {event.localEditSynced === false && (
                    <OfflineIndicator>
                      <OfflineIndicatorText>編集が同期されていない</OfflineIndicatorText>
                    </OfflineIndicator>
                  )}
                  {event._id === undefined && (
                    <OfflineIndicator>
                      <OfflineIndicatorText>投稿が同期されていない</OfflineIndicatorText>
                    </OfflineIndicator>
                  )}
                </OfflineIndicatorWrapper>
              )}
            </div>
          </div>
        </div>
      })}
    </Grid>
  );
};

export default TimeTable;