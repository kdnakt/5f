import React from 'react';
import { Session } from '../App';
import { Finger, Def } from '../data/Fingers';

type RoomResultProps = {
  fingers: Array<Finger>;
  session: Session;
  defs: Def[];
};

const RoomResult: React.FC<RoomResultProps> = ({
  fingers,
  session,
  defs,
}) => {
  const res = fingers?.map((f, i) => {
    const name = session.sessionId === f.sid ? 'Your Choice' : f.nm;
    const count = f.cnt === -1 ? 'Not Selected' : defs.filter(def => def.count === f.cnt)[0].text;
    return (
      <div key={f.sid}>
        <span>{`${name}: ${count}`}</span>
        <br />
      </div>
    );
  });
  return (
    <>{res}</>
  );
};

export default RoomResult;
