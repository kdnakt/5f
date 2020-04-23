import React from 'react';

const FingerSelect: React.FC = () => {
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
          onClick={() => alert(o.count)}
        >
          {o.text}
        </span>
      ))}
    </>
  );
};

export default FingerSelect;
