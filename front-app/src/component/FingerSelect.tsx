import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const FingerSelect: React.FC<{roomId: string}> = ({
  roomId,
}) => {
  let sessionId = '';
  document.cookie.split('; ').forEach(c => {
    if (c.indexOf('sessionId=') === 0) {// startsWith
      sessionId = c.split('=')[1].trim();
    }
  });
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    if (!roomId || !sessionId) return;
    const ws = new WebSocket(`ws://localhost:8080/rooms/${roomId}/${sessionId}`);
    setSocket(ws);
    ws.onopen = () => {
      console.log('connected');
    };
    ws.onmessage = (e) => {
      alert(`msg: ${e.data}`);
    };
    ws.onclose = () => {
      ws.close();
    };
    return () => {
      ws.close();
    };
  }, [roomId, sessionId, setSocket]);
  return (
    <>
      <div>Select Your Status!</div>
      {[
          { count: 1, text: 'too bad'},
          { count: 2, text: 'bad'},
          { count: 3, text: 'normal'},
          { count: 4, text: 'good'},
          { count: 5, text: 'very good'}
       ].map(o => (
        <span key={o.count}
          style={{
            border: '1px solid red',
            margin: '4px'
          }}
          onClick={() => {
            socket?.send(`${o.count}`)
          }}
        >
          {o.text}
        </span>
      ))}
    </>
  );
};

export default FingerSelect;
