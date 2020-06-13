import React from 'react';
import SocketError from './SocketError';
import { render } from '@testing-library/react';

test('render SocketError', () => {
  const errorPage = render(<SocketError />);
  expect(errorPage).toMatchSnapshot();
});
