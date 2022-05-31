export const MASK_VALUE = 99999;
export const NOT_POSTED_VALUE = -1;

export type Finger = {
  nm: string;
  sid: string;
  cnt: number;
};

export const mask = (fingers: Finger[]) => {
  return fingers.some(f => f.cnt === NOT_POSTED_VALUE) ? fingers.map(f => {
    return Object.assign({}, f, {
        cnt: f.cnt > 0 ? MASK_VALUE : NOT_POSTED_VALUE
    });
  }) : fingers;
}
