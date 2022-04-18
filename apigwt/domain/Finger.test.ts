import { Finger, mask, MASK_VALUE } from "./Finger";

test('when everyone posted, no masked value', () => {
  const data: Finger[] = [{
    nm: '',
    sid: '',
    cnt: 1,
  }, {
    nm: '',
    sid: '',
    cnt: 2,
  }, {
    nm: '',
    sid: '',
    cnt: 3,
  }];
  expect(mask(data).some(f => f.cnt === MASK_VALUE)).toBe(false);
});


test('when someone not posted yet, there is masked value', () => {
  const data: Finger[] = [{
    nm: '',
    sid: '',
    cnt: 1,
  }, {
    nm: '',
    sid: '',
    cnt: -1,
  }, {
    nm: '',
    sid: '',
    cnt: 3,
  }];
  expect(mask(data).some(f => f.cnt === MASK_VALUE)).toBe(true);
});