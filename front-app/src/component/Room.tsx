import React from 'react';
import FingerSelect from './FingerSelect';

const Room: React.FC<{
  roomId: string;
  sessionId: string;
}> = ({
  roomId,
  sessionId,
}) => {
  return (
    <>
      <hr />
      <div>Room ID: {roomId}</div>
      <div>
        <FingerSelect roomId={roomId} sessionId={sessionId} />
      </div>
    </>
  );
}

export default Room;
