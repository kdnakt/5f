import React from 'react';

const Room: React.FC<{roomId: string}> = ({
  roomId,
}) => {
  return (
    <>
      <div>Room ID: {roomId}</div>
    </>
  );
}

export default Room;
