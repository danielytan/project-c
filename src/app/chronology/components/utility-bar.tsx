import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

interface UtilityBarProps {
  onEventSubmit: (noteProps: any) => Promise<void>;
  onEventEdit: (noteId: string, updatedNoteProps: any) => Promise<void>;
  toggleIsEditing: () => void;
  eventBeingEdited: any;
  setEventBeingEdited: any;
}

const UtilityBar: React.FC<UtilityBarProps> = ({
  onEventSubmit, onEventEdit, toggleIsEditing, eventBeingEdited, setEventBeingEdited
}) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTime, setEventTime] = useState(new Date());
  const [eventLocation, setEventLocation] = useState('');
  const [eventDetails, setEventDetails] = useState('');

  const handleAddEvent = () => {
    setEventTime(new Date());
    setEventLocation('');
    setEventDetails('');
    setIsAddingEvent(true);
  };

  const handleCancelEvent = () => {
    setIsAddingEvent(false);
    setEventBeingEdited(undefined);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      time: eventTime,
      location: eventLocation,
      details: eventDetails
    };

    // Logic to save the new event or update the existing events list
    if (eventBeingEdited === undefined) {
      await onEventSubmit(newEvent);
    } else {
      await onEventEdit(eventBeingEdited.localId, newEvent);
    }

    handleCancelEvent();
  };

  useEffect(() => {
    if (!isAddingEvent && eventBeingEdited !== undefined) {
      setEventTime(new Date(eventBeingEdited.time));
      setEventLocation(eventBeingEdited.location);
      setEventDetails(eventBeingEdited.details);
      setIsAddingEvent(true);
    }
  }, [isAddingEvent, eventBeingEdited])

  return (
    <div>
      <Container>
        <ButtonContainer>
          <Button onClick={handleAddEvent}>追加</Button>
          <div className="flex items-center space-x-2">
            <Switch onCheckedChange={toggleIsEditing} id="toggle-edit"/>
            <Label htmlFor="toggle-edit">エディット</Label>
          </div>
        </ButtonContainer>
        <Command className="md:w-[25px] lg:w-[300px] rounded-lg border">
          <CommandInput placeholder="Elasticsearch (WIP)" />
        </Command>
      </Container>
      {(isAddingEvent) && (
        <>
          <EventForm onSubmit={handleEventSubmit}>
            <DateTimePicker
              date={new Date()}
              setDate={function (date: Date): void {
                setEventTime(date);
              }} 
            />
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
  );
};

export default UtilityBar;