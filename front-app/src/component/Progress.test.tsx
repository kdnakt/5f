import React from 'react';
import Progress from './Progress';
import { render } from '@testing-library/react';

test('renders Progress 5 persons including the user not posted', () => {
  const progress = render(<Progress
    notPostedCount={5}
    myCount={-1}
  />);
  expect(progress).toMatchSnapshot();
});

test('renders Progress 1 person not posted other than the user', () => {
  const progress = render(<Progress
    notPostedCount={1}
    myCount={3}
  />);
  expect(progress).toMatchSnapshot();
});

test('renders Progress if the user is the last one to choose', () => {
  const progress = render(<Progress
    notPostedCount={1}
    myCount={-1}
  />);
  expect(progress).toMatchSnapshot();
})