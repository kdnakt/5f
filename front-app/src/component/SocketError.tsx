import React from 'react';
import { Button } from 'react-bootstrap';

const SocketError: React.FC = () => {
  return (
    <>
      <div>
        Sorry, something went wrong.
      </div>
      <Button variant='outline-primary'
        onClick={() => document.location.reload()}
      >
        Back to Lobby
      </Button>
    </>
  );
};

export default SocketError;
