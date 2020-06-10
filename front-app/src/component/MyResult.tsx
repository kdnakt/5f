import React from 'react';
import { Button } from 'react-bootstrap';
import { Def } from '../data/Fingers';
import { RoomProps } from './Room';

type MyResultProps = {
  defs: Def[];
  myCount: number;
  setMyCount: (myCount: number) => void;
  socket: WebSocket | undefined;
}

const MyResult: React.FC<MyResultProps & RoomProps> = ({
  defs,
  myCount,
  setMyCount,
  socket,
  session,
}) => {
  return (
    <>
      <div>Your Choice: {defs.filter(def => def.count === myCount)[0].text}</div>
      <Button variant='warning'
        size='sm'
        onClick={() => {
          socket?.send(JSON.stringify({
            nm: session.nickName,
            rid: session.roomId,
            sid: session.sessionId,
            cnt: -1,
          }));
          setMyCount(-1);
        }}
      >Reset</Button>
    </>
  );
};

export default MyResult;
