import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/date-time-picker"
import styled from 'styled-components';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

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

const EventForm = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  input {
    margin-top: 1rem;
    margin-bottom: 1rem; /* Add margin between the input elements */
    padding: 0.5rem; /* Optional: Add padding to the input elements */
  }

  .buttonContainer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
  }

  .buttonContainer button {
    flex: 1;
    margin: 0 0.25rem;
    padding: 0.5rem 1rem; /* Adjust the padding to change the button size */
    font-size: 1rem; /* Adjust the font size to change the button size */
  }

  .customInput {
    /* Custom styles for the "内容" input */
    height: 100px; /* Adjust the height to increase the size of the input */
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

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

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTime, setEventTime] = useState(new Date());
  const [eventLocation, setEventLocation] = useState('');
  const [eventDetails, setEventDetails] = useState('');

  const handleAddEvent = () => {
    setIsAddingEvent(true);
  };

  const handleCancelEvent = () => {
    setIsAddingEvent(false);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      time: eventTime,
      location: eventLocation,
      details: eventDetails
    };

    // Logic to save the new event or update the existing events list

    setEventTime(new Date());
    setEventLocation('');
    setEventDetails('');
    setIsAddingEvent(false);
  };

  return (
    <Grid>
      <div>
        <Container>
          <Button onClick={handleAddEvent}>イベントを追加</Button>
          <Command className="md:w-[25px] lg:w-[300px] rounded-lg border">
            <CommandInput placeholder="Elasticsearch (WIP)" />
          </Command>
        </Container>
        {isAddingEvent && (
          <>
            <EventForm onSubmit={handleEventSubmit}>
              <DateTimePicker date={new Date()} setDate={function (date: Date): void {
                setEventTime(date);
              }} />
              <Input
                type="text"
                placeholder="発信元"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
              <Textarea
                placeholder="内容"
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
                className="customInput" // Add a custom class to target the "内容" input
              />
            <div className="buttonContainer">
              <Button type="button" onClick={handleCancelEvent}>
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </div>
            </EventForm>
          </>
        )}
      </div>
      <div className="timeGrid">
        <div className="timeHeader">
          <span className="timesHeader">時刻</span>
        </div>
        <div className="columnHeader">発信元</div>
        <div className="columnHeader">内容</div>

        {timeSlots.map((timeSlot) => (
          <React.Fragment key={timeSlot.toISOString()}>
            <div className="timeSlot">
              {timeSlot.toLocaleString('en-Gb', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false,
                timeZone: "Japan"
              })}
            </div>
            <div className="columnSlot" />
            <div className="columnSlot" />
          </React.Fragment>
        ))}
      </div>
    </Grid>
  );
};

export default TimeGrid;