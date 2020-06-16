import React, { useEffect, useState } from 'react';
import { RoomProps } from './Room';
import { useFinger, Finger } from '../data/Fingers';
import MyResult from './MyResult';
import Progress from './Progress';
import RoomResult from './RoomResult';
import SocketError from './SocketError';
import VotingForm from './VotingForm';

const FingerSelect: React.FC<RoomProps> = ({session}) => {
  const defs = useFinger(session.fingerType);
  const [myCount, setMyCount] = useState(-1);
  const [fingers, setFingers] = useState<Array<Finger>>([]);
  const [connected, setConnected] = useState(false);
  const [closed, setClosed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    if (!session.roomId || !session.sessionId) return;
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);
    setSocket(ws);
    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({
        nm: session.nickName,
        rid: session.roomId,
        sid: session.sessionId,
        cnt: -1,
      }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data) as Array<Finger>;
      setFingers(data);
    };
    ws.onerror = (e) => {
      console.log('error', e);
      setHasError(true);
    };
    ws.onclose = () => {
      ws.close();
      setClosed(true);
    };
    return () => {
      ws.close();
    };
  }, [session, setSocket, setFingers]);
  const notPostedCount = fingers?.filter(f => f.cnt === -1).length;
  return hasError || closed ? (
    <SocketError />
  ) : connected ? (
    <>
      {myCount === -1 ? <div>Select Your Status!</div> : undefined}
      {myCount === -1 ? (<VotingForm defs={defs}
        session={session}
        socket={socket}
        setMyCount={setMyCount}
      />) : (<MyResult
        defs={defs}
        myCount={myCount}
        setMyCount={setMyCount}
        socket={socket}
        session={session}
      />)}
      <hr />
      {notPostedCount === 0 ? (<RoomResult
        fingers={fingers}
        session={session}
        defs={defs}
      />) : (<Progress
        notPostedCount={notPostedCount}
        myCount={myCount}
      />)}
    </>
  ) : (
    <>
      <div>Connecting to server ...</div>
    </>
  );
};

export default FingerSelect;
