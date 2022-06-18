import { randomRoomId } from "./RoomId"

describe('RoomId', () => {
  it('should be 6 digits', () => {
    expect(randomRoomId()).toMatch(/[0-9]{6}/);
  });
});
