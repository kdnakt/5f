import React, { useCallback } from 'react';
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
  }, []);
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
