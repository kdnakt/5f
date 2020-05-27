import React from 'react';
import { render } from '@testing-library/react';
import RoomSelect from './RoomSelect';
import { Session } from '../App';

test('renders RoomSelect with no session', () => {
  const setSession = (s: Session) => {};
  const App = render(<RoomSelect setSession={setSession} />);
  const elem = App.getByText(/Required/i);
  expect(elem).toBeInTheDocument();
});
