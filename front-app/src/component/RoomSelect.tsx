import React, { useState, useCallback } from 'react';
import {
  Button, FormGroup, FormControl, Form,
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
      <Form>
        <FormGroup>
          <FormControl />
        </FormGroup>
      </Form>
      <Button variant='outline-primary'>
        Enter the Room
      </Button>
      <hr />
      <Button variant='outline-primary' onClick={create} >
        Create New Room
      </Button>
    </>
  );
};

export default RoomSelect;
