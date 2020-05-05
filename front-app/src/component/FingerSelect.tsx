import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

type Finger = {
  sid: string;
  cnt: number;
};

const FingerDefs = [
  { count: 1, text: 'too bad (1)'},
  { count: 2, text: 'bad (2)'},
  { count: 3, text: 'normal (3)'},
  { count: 4, text: 'good (4)'},
  { count: 5, text: 'very good (5)'}
];

const FingerSelect: React.FC<{roomId: string}> = ({
  roomId,
}) => {
  let sessionId = '';
  document.cookie.split('; ').forEach(c => {
    if (c.indexOf('sessionId=') === 0) {// startsWith
      sessionId = c.split('=')[1].trim();
    }
  });
  const [myCount, setMyCount] = useState(0);
  const [fingers, setFingers] = useState<Array<Finger>>();
  const [connected, setConnected] = useState(false);
  const [closed, setClosed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    if (!roomId || !sessionId) return;
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}//rooms/${roomId}/${sessionId}`);
    setSocket(ws);
    ws.onopen = () => {
      setConnected(true);
      ws.send('0');
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
  }, [roomId, sessionId, setSocket, setFingers]);
  const notPostedCount = fingers?.filter(f => f.cnt === 0).length;
  return hasError || closed ? (
    <>
      <div>
        Sorry, something went wrong.
      </div>
      <Button variant='outline-primary'
        onClick={() => document.location.reload()}
      >
        Back to Lobby
      </Button>
    </>
  ) : connected ? (
    <>
      {!myCount ? <div>Select Your Status!</div> : undefined}
      {!myCount ? FingerDefs.map(o => (
        <Button key={o.count}
          variant='info'
          onClick={() => {
            socket?.send(`${o.count}`);
            setMyCount(o.count);
          }}
          style={{
            margin: '16px',
            width: '128px'
          }}
        >
          {o.text}
        </Button>
      )) : (
        <>
          <div>Your Choice: {FingerDefs.filter(def => def.count === myCount)[0].text}</div>
          <Button variant='warning'
            size='sm'
            onClick={() => {
              socket?.send('0');
              setMyCount(0);
            }}
          >Reset</Button>
        </>
      )}
      <hr />
      {notPostedCount === 0 ? fingers?.map((f, i) => {
        const name = sessionId === f.sid ? 'Your Choice' : `User ${++i}`;
        const count = f.cnt === 0 ? 'Not Selected' : FingerDefs.filter(def => def.count === f.cnt)[0].text;
        return (
          <div key={f.sid}>
            <span>{`${name}: ${count}`}</span>
            <br />
          </div>
        );
      }) : (
        <>
          <div>Waiting for everyone to choose ...</div>
          {(notPostedCount === 1 && myCount === 0) ? (
            <div>You are the last one to choose!</div>
          ) : (
            <div>{notPostedCount} person{notPostedCount === 1 ? '' : 's'} left.</div>
          )}
        </>
      )}
    </>
  ) : (
    <>
      <div>Connecting to server ...</div>
    </>
  );
};

export default FingerSelect;
