import React from 'react';

type ProgressProps = {
  notPostedCount: number;
  myCount: number;
};

const Progress: React.FC<ProgressProps> = ({
  notPostedCount,
  myCount,
}) => {
  const isLast = notPostedCount === 1 && myCount === -1;
  return (
    <>
      <div>Waiting for everyone to choose ...</div>
      {isLast ? (
        <div>You are the last one to choose!</div>
      ) : (
        <div>{notPostedCount} person{notPostedCount === 1 ? '' : 's'} left.</div>
      )}
    </>
  );
}

export default Progress;
