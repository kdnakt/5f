import React from 'react';
import FingerSelect from './FingerSelect';
import { Session } from '../App';

export type RoomProps = {
  session: Session;
}

const Room: React.FC<RoomProps> = ({session}) => {
  return (
    <>
      <hr />
      <div>Room ID: {session.roomId}</div>
      <div>
        <FingerSelect session={session} />
      </div>
    </>
  );
}

export default Room;
