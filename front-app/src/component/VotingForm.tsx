import React from 'react';
import { Button } from 'react-bootstrap';
import { Def } from '../data/Fingers';
import { Session } from '../App';

type VotingFormProps = {
  defs: Def[];
  session: Session;
  socket: WebSocket | undefined;
  setMyCount: (myCount: number) => void;
};

const VotingForm: React.FC<VotingFormProps> = ({
  defs,
  session,
  socket,
  setMyCount,
}) => {
  return (
    <>
      {defs.map(o => (
        <Button key={o.count}
          variant='info'
          onClick={() => {
            socket?.send(JSON.stringify({
              nm: session.nickName,
              rid: session.roomId,
              sid: session.sessionId,
              cnt: o.count,
            }));
            setMyCount(o.count);
          }}
          style={{
            margin: '16px',
            width: '128px'
          }}
        >
          {o.text}
        </Button>
      ))}
    </>
  );
}

export default VotingForm;
