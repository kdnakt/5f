import React, { useState, useCallback } from 'react';
import {
  Button, FormGroup, FormControl, Form, FormLabel,
} from 'react-bootstrap';
import axios from 'axios';

const RoomSelect: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const create = useCallback(() => {
    axios.get('/room/new').then(res => {
      setSelectedRoom(res.data);
    });
  }, []);

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
      >
        <FormGroup>
          <FormLabel>Enter Room ID</FormLabel>
          <FormControl />
        </FormGroup>
        <Button variant='outline-primary'>
          Enter the Room
        </Button>
      </Form>
      <Button style={{
          margin: '8px auto',
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
