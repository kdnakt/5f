import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RoomSelect from './RoomSelect';
import { Session } from '../App';

const setSession = (s: Session) => {};

test('renders initial nickName feedback', () => {
  const App = render(<RoomSelect setSession={setSession} />);
  const nickNameFeedback = App.getByText(/Required/i);
  expect(nickNameFeedback).toBeInTheDocument();
});

test('renders Enter Room ID', () => {
  const App = render(<RoomSelect setSession={setSession} />);
  const enterButton = App.getByTestId('enter-button');
  expect(enterButton).toBeInTheDocument();
  expect(enterButton).toBeDisabled();
  
  const roomIdInput = App.getByPlaceholderText(/123456/i);
  expect(roomIdInput).toBeInTheDocument();
  fireEvent.change(roomIdInput, { target: { value : 'aaa' }});
  let roomIdFeedback = App.getByTestId('room-id-feedback');
  expect(roomIdFeedback).toBeInTheDocument();
  expect(enterButton).toBeDisabled();

  fireEvent.change(roomIdInput, { target: { value : '123' }});
  roomIdFeedback = App.getByTestId('room-id-feedback');
  expect(roomIdFeedback).toBeInTheDocument();
  expect(enterButton).toBeDisabled();

  fireEvent.change(roomIdInput, { target: { value : '456789' }});
  roomIdFeedback = App.getByTestId('room-id-feedback');
  expect(roomIdFeedback).toBeEmpty();

  const nickNameInput = App.getByTestId('nickname-input');
  fireEvent.change(nickNameInput, { target: { value: 'hoge' }});
  expect(enterButton).toBeEnabled();
});

test('renders Create New Room', () => {
  const App =render(<RoomSelect setSession={setSession} />);
  const createButton = App.getByTestId('create-button');
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeDisabled();

  const nickNameInput = App.getByTestId('nickname-input');
  fireEvent.change(nickNameInput, { target: { value: 'hoge' }});
  expect(createButton).toBeEnabled();
});
