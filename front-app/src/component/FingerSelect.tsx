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
  const [count, setCount] = useState(0);
  const [fingers, setFingers] = useState<Array<Finger>>();
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    if (!roomId || !sessionId) return;
    const ws = new WebSocket(`ws://localhost:8080/rooms/${roomId}/${sessionId}`);
    setSocket(ws);
    ws.onopen = () => {
      ws.send('0');
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data) as Array<Finger>;
      setFingers(data);
    };
    ws.onclose = () => {
      ws.close();
    };
    return () => {
      ws.close();
    };
  }, [roomId, sessionId, setSocket, setFingers]);
  return (
    <>
      {!count ? <div>Select Your Status!</div> : undefined}
      {!count ? FingerDefs.map(o => (
        <Button key={o.count}
          variant='info'
          onClick={() => {
            socket?.send(`${o.count}`);
            setCount(o.count);
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
          <div>Your Choice: {count}</div>
          <Button variant='warning'
            onClick={() => {
              socket?.send('0');
              setCount(0);
            }}
          >Reset</Button>
        </>
      )}
      <hr />
      {fingers?.map((f, i) => {
        const name = sessionId === f.sid ? 'Your Choice' : `User ${++i}`;
        const count = f.cnt === 0 ? 'Not Selected' : FingerDefs.filter(def => def.count === f.cnt)[0].text;
        return (
          <div key={f.sid}>
            <span>{`${name}: ${count}`}</span>
            <br />
          </div>
        );
      })}
    </>
  );
};

export default FingerSelect;
