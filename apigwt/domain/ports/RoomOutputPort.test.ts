import { IRoomAdapter } from "../adapters/RoomAdapter";
import { Room } from "../entities/Room";
import { RoomOutputPort } from "./RoomOutputPort";

const id = "999999";
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

class ErrorRoomAdapter implements IRoomAdapter {
  public async put(_: Room): Promise<boolean> {
    return false;
  }
  public async get(roomId: string): Promise<Room> {
    throw new Error(`no room found with id: ${roomId}`);
  }
  public async update(_: Room): Promise<boolean> {
    return false;
  }
}

describe('RoomOutputPort', () => {
  const sut = new RoomOutputPort(new DummyRoomAdapter());
  it('getRoomById', async () => {
    const room = await sut.getRoom(id);

    expect(room.id).toBe(id);
    expect(room.fingerType).toBe(type);
    expect(room.sessionIds).toHaveLength(1);
    expect(room.sessionIds).toContain(sessionId);
  });

  it('create', async () => {
    const room: Room = {
        id: id,
        fingerType: type,
        sessionIds: [sessionId]
    };
    const result = await sut.create(room);
    expect(result).toBe(true);
  });

  it('update', async () => {
    const room = await sut.getRoom(id);
    room.sessionIds.push("0000000000");
    const result = await sut.update(room);
    expect(result).toBe(true);
  });

});

describe('RoomOutputPort error test', () => {
  const sut = new RoomOutputPort(new ErrorRoomAdapter());
  it('getRoomById', async () => {
    expect.assertions(1);
    return sut.getRoom(id)
        .catch(e => {
            expect(e).toMatchObject(new Error('no room found with id: 999999'));
        });
  });
});
