import React from 'react';
import FingerSelect from './FingerSelect';

const Room: React.FC<{
  roomId: string;
  sessionId: string;
  fingerType: 'finger' | 'like'
}> = ({
  roomId,
  sessionId,
  fingerType,
}) => {
  return (
    <>
      <hr />
      <div>Room ID: {roomId}</div>
      <div>
        <FingerSelect roomId={roomId} sessionId={sessionId}
          fingerType={fingerType}
        />
      </div>
    </>
  );
}

export default Room;
