import React, { useState, useCallback, FormEvent, createRef, RefObject, useEffect } from 'react';
import {
  Button, FormGroup, FormControl, Form, FormLabel,
} from 'react-bootstrap';
import axios from 'axios';
import Room from './Room';

function validateRoomId(roomIdInput: string) {
  if (isNaN(Number(roomIdInput))) {
    return 'Only digits allowed.';
  } else if (roomIdInput.length < 6) {
    return '6 digits needed.';
  } else {
    return '';
  }
}

const RoomSelect: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomNotExists, setRoomNotExists] = useState(false);

  const create = useCallback(() => {
    axios.get('/room/new').then(res => {
      setSelectedRoom(res.data);
    });
  }, []);
  const enter = useCallback(() => {
    axios.get(`/room?id=${roomIdInput}`).then(res => {
      setSelectedRoom(res.data);
    }).catch(_ => {
      setRoomNotExists(true);
    });
  }, [roomIdInput]);
  const [roomIdFeedback, setRoomIdFeedback] = useState('');
  const roomIdRef = createRef<HTMLInputElement>();
  useEffect(() => {
    if (roomIdRef.current) {
      const result = roomNotExists ? `Room ${roomIdInput} doesn't exist.`
        : validateRoomId(roomIdInput);
      setRoomIdFeedback(result);
      roomIdRef.current!.setCustomValidity(result);
    }
  }, [roomIdInput, roomIdRef, roomNotExists]);
  if (selectedRoom) return <Room roomId={selectedRoom} />
  return (
    <div style={{
      width: '80%',
      margin: '0 auto',
    }}>
      <Form style={{
          width: '160px',
          margin: '16px auto',
        }}
        validated={!!roomIdInput}
      >
        <FormGroup>
          <FormLabel>Enter Room ID</FormLabel>
          <FormControl value={roomIdInput}
            ref={roomIdRef as RefObject<any>}
            onChange={(e: FormEvent<HTMLInputElement>) => {
              setRoomIdInput(e.currentTarget.value);
              if (roomNotExists) setRoomNotExists(false);
            }}
            placeholder='123456'
            pattern='[0-9]{6}'
            maxLength={6}
          />
          <FormControl.Feedback type='invalid'>
            {roomIdFeedback}
          </FormControl.Feedback>
        </FormGroup>
        <Button variant='outline-primary'
          onClick={enter} disabled={!roomIdInput || roomNotExists}
        >
          Enter the Room
        </Button>
      </Form>
      <Button style={{
          margin: '16px auto',
          width: '160px',
        }}
        variant='outline-primary' onClick={create}
      >
        Create New Room
      </Button>
    </div>
  );
};

export default RoomSelect;
