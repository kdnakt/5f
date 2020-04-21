import React, { useState, useCallback, FormEvent } from 'react';
import {
  Button, FormGroup, FormControl, Form, FormLabel,
} from 'react-bootstrap';
import axios from 'axios';

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

  if (selectedRoom) return <div>Room ID: {selectedRoom}</div>;
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
            onChange={(e: FormEvent<HTMLInputElement>) => {
              setRoomIdInput(e.currentTarget.value);
              if (roomNotExists) setRoomNotExists(false);
            }}
            placeholder='123456'
            pattern='[0-9]{6}'
            isValid={!roomNotExists && !!roomIdInput}
            isInvalid={roomNotExists}
          />
          <FormControl.Feedback type='invalid'>
            {roomNotExists ? `Room ${roomIdInput} doesn't exist.`
              : '6 digits are allowed.'}
          </FormControl.Feedback>
        </FormGroup>
        <Button variant='outline-primary'
          onClick={enter} disabled={!roomIdInput}
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
