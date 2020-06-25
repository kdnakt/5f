import React from 'react';
import AppTitle from './AppTitle';
import { render } from '@testing-library/react';

test('renders title', () => {
  const title = render(<AppTitle />);
  expect(title).toMatchSnapshot();
});
