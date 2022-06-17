import { Room } from "../entities/Room";
import { NewRoomCommand, RoomInputPort } from "./RoomInputPort";
import { IRoomOutputPort } from "./RoomOutputPort";

const sessionIds = ["1234567890"];

class DummyRoomOutputPort implements IRoomOutputPort {
  public async create(_: Room): Promise<boolean> {
    return true;
  }
  public async getRoom(roomId: string): Promise<Room> {
    return {
      id: roomId,
      fingerType: "like",
      sessionIds: sessionIds
    }
  }
  public async update(_: Room): Promise<boolean> {
    return true;
  }
}

describe('RoomInputPort', () => {
  const sut = new RoomInputPort(new DummyRoomOutputPort());
  it('makeNewRoom', async () => {
    const command: NewRoomCommand = {
      fingerType: "like"
    }
    const res = await sut.makeNewRoom(command);
    expect(res.success).toBe(true);
    expect(res.roomId).toBeTruthy();
    expect(res.sessionId).toBeTruthy();
  });
});
