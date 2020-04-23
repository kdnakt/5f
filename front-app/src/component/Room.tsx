import React from 'react';
import FingerSelect from './FingerSelect';

const Room: React.FC<{roomId: string}> = ({
  roomId,
}) => {
  return (
    <>
      <div>Room ID: {roomId}</div>
      <div>
        <FingerSelect />
      </div>
    </>
  );
}

export default Room;
