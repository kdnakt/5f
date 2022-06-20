import { toFingerType } from "./FingerType"

describe('toFingerType', () => {
  it('should return default `finger`', () => {
    expect(toFingerType(undefined)).toBe('finger');
  });
  it('should return original finger type', () => {
    expect(toFingerType('finger')).toBe('finger');
    expect(toFingerType('like')).toBe('like');
  });
})