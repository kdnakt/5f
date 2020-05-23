import React from 'react';
import FingerSelect from './FingerSelect';

const Room: React.FC<{
  roomId: string;
  sessionId: string;
  fingerType: 'finger' | 'like'
  nickName: string;
}> = ({
  roomId,
  sessionId,
  fingerType,
  nickName,
}) => {
  return (
    <>
      <hr />
      <div>Room ID: {roomId}</div>
      <div>
        <FingerSelect roomId={roomId} sessionId={sessionId}
          fingerType={fingerType}
          nickName={nickName}
        />
      </div>
    </>
  );
}

export default Room;
