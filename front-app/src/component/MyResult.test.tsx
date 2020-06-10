import React from 'react';
import MyResult from './MyResult';
import { useFinger } from '../data/Fingers';
import { render } from '@testing-library/react';


test('renders MyResult', () => {
  const fingerType = 'finger'
  let myCount = 5;
  const setMyCount = (newCount: number) => myCount = newCount;
  const myResult = render(<MyResult
    defs={useFinger(fingerType)}
    myCount={myCount}
    setMyCount={setMyCount}
    socket={undefined}
    session={{
      roomId: 'dummyRoomId',
      sessionId: 'dummySessionId',
      fingerType: fingerType,
      nickName: 'dummyNickName',
    }}
  />);
  expect(myResult).toMatchSnapshot();
});
