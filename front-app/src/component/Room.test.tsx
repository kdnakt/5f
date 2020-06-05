import React from 'react';
import Room from './Room';
import { Session } from '../App';
import { render } from '@testing-library/react';

test('renders room id', () => {
  const dummySession: Session = {
    roomId: 'dummyRoomId',
    sessionId: 'dummySessionId',
    fingerType: 'like',
    nickName: 'dummyNickName',
  };
  const dummyRoom = render(<Room session={dummySession} />);
  const roomIdDiv = dummyRoom.getByTestId('roomid');
  expect(roomIdDiv).toHaveTextContent('Room ID: dummyRoomId');
});
