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
  return (!!selectedRoom ?
    <>
      <div>Room ID: {selectedRoom}</div>
    </>
    :
    <>
      <Form style={{
          width: '160px',
          margin: '16px 8px',
          float: 'left'
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
      <div style={{
          float: 'left',
          margin: '56px 0'
        }}
      >or</div>
      <Button style={{
          float: 'left',
          margin: '48px 8px',
          width: '160px'
        }}
        variant='outline-primary' onClick={create}
      >
        Create New Room
      </Button>
    </>
  );
};

export default RoomSelect;
