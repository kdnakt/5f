
export type FingerType = 'finger' | 'like';

export const toFingerType = (type: any): FingerType => {
  switch (type) {
    case 'finger':
    case 'like':
        return type;
    default:
        return 'finger';
  }
}