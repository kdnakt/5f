import { IRoomAdapter } from "../adapters/RoomAdapter";
import { Room } from "../entities/Room";
import { RoomOutputPort } from "./RoomOutputPort";

const type = "like"
const sessionId = "1234567890";

class DummyRoomAdapter implements IRoomAdapter {
  public async put(_: Room): Promise<boolean> {
    return true;
  }
  public async get(roomId: string): Promise<Room> {
    return {
        id: roomId,
        fingerType: type,
        sessionIds: [sessionId]
    }
  }
  public async update(_: Room): Promise<boolean> {
    return true;
  }
}

describe('RoomOutputPort', () => {
  const sut = new RoomOutputPort(new DummyRoomAdapter());
  it('getRoomById', async () => {
    const id = "999999";
    const room = await sut.getRoom(id);

    expect(room.id).toBe(id);
    expect(room.fingerType).toBe(type);
    expect(room.sessionIds).toHaveLength(1);
    expect(room.sessionIds).toContain(sessionId);
  })
});
