
export type FingerType = 'finger' | 'like';

type FingerOption = {
  id: FingerType;
  label: string;
}

export const FingerOptions: FingerOption[] = [
  {
    id: 'finger',
    label: 'Finger 🖐',
  },
  {
    id: 'like',
    label: 'Like ❤️',
  },
];

export type Def = {
  count: number;
  text: string;
};

const FingerDefs: Def[] = [
  { count: 5, text: '🖐very good'},
  { count: 4, text: '👌good'},
  { count: 3, text: '🤟normal'},
  { count: 2, text: '✌️bad'},
  { count: 1, text: '👎too bad'},
  { count: 0, text: '✊no way'},
];

const LikeDefs: Def[] = [
  { count: 5, text: '❤️❤️❤️❤️❤️'},
  { count: 4, text: '❤️❤️❤️❤️🤍'},
  { count: 3, text: '❤️❤️❤️🤍🤍'},
  { count: 2, text: '❤️❤️️🤍🤍🤍'},
  { count: 1, text: '️❤️🤍🤍🤍🤍'},
  { count: 0, text: '🤍🤍🤍🤍🤍'},
];

export const useFinger = (type: FingerType) => {
  switch (type) {
    case 'finger':
      return FingerDefs;
    case 'like':
      return LikeDefs;
    default:
      return FingerDefs;
  }
}

export type Finger = {
  nm: string;
  sid: string;
  cnt: number;
};
