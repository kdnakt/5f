import React from 'react';
import {
  Button,
} from 'react-bootstrap';

const RoomSelect: React.FC = () => {
  return (
    <>
      <input
        value=''
      />
      <Button variant='outline-primary'>
        Enter the Room
      </Button>
      <br />
      <Button variant='outline-primary'>
        Create New Room
      </Button>
    </>
  );
};

export default RoomSelect;
