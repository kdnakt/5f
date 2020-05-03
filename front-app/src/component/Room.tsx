import React from 'react';
import FingerSelect from './FingerSelect';

const Room: React.FC<{roomId: string}> = ({
  roomId,
}) => {
  return (
    <>
      <hr />
      <div>Room ID: {roomId}</div>
      <div>
        <FingerSelect roomId={roomId} />
      </div>
    </>
  );
}

export default Room;
