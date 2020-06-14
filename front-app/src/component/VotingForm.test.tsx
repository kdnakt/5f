import React from 'react';
import VotingForm from './VotingForm';
import { render } from '@testing-library/react';
import { useFinger } from '../data/Fingers';

test('renders VotingForm', () => {
  const form = render(<VotingForm
    defs={useFinger('finger')}
    session={{
      sessionId: 'dummySessionId',
      roomId: 'dummyRoomId',
      fingerType: 'finger',
      nickName: 'dummyNickName',
    }}
    socket={undefined}
    setMyCount={(c: number) => console.log(c)}
  />);
  expect(form).toMatchSnapshot();
});
