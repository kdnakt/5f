import React, { useCallback, useEffect } from 'react';
import axios from 'axios';

const FingerSelect: React.FC<{roomId: string}> = ({
  roomId,
}) => {
  const postFingers = useCallback((
    count: number
  ) => {
    axios.post(`/room/${roomId}/fingers`, {
      count: count,
    }).then(res => {
      alert(res.data)
    });
  }, [roomId]);
  let sessionId = '';
  document.cookie.split('; ').forEach(c => {
    if (c.indexOf('sessionId=') === 0) {// startsWith
      sessionId = c.split('=')[1].trim();
    }
  });
  useEffect(() => {
    if (!roomId || !sessionId) return;
    const ws = new WebSocket(`ws://localhost:8080/rooms/${roomId}/${sessionId}`);
    ws.onopen = () => {
      alert('connected');
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
  }, [roomId, sessionId]);
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
          onClick={() => postFingers(o.count)}
        >
          {o.text}
        </span>
      ))}
    </>
  );
};

export default FingerSelect;
