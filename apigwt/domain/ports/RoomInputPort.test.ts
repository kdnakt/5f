import { Room } from "../entities/Room";
import { ErrorInfo, JoinRoomCommand, NewRoomCommand, RoomInfo, RoomInputPort, SessionInfo } from "./RoomInputPort";
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

class CreateGetErrorRoomOutputPort implements IRoomOutputPort {
  public async create(room: Room): Promise<boolean> {
    throw new Error(`Failed to create a room: ${room.id}`);
  }
  public async getRoom(roomId: string): Promise<Room> {
    throw new Error(`Failed to get a room: ${roomId}`);
  }
  public async update(_: Room): Promise<boolean> {
    return true;
  }
}

class UpdateErrorRoomOutputPort implements IRoomOutputPort {
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
  public async update(room: Room): Promise<boolean> {
    throw new Error(`Failed to update a room: ${room.id}`);
  }
}

describe('RoomInputPort', () => {
  const sut = new RoomInputPort(new DummyRoomOutputPort());
  it('makeNewRoom', async () => {
    const command: NewRoomCommand = {
      fingerType: "like"
    };
    const res = await sut.makeNewRoom(command);
    expect(res.statusCode).toBe(200);
    const { roomId, sessionId, type } = res.info as RoomInfo;
    expect(roomId).toBeTruthy();
    expect(sessionId).toBeTruthy();
    expect(type).toBe('like');
  });

  it('joinRoom', async () => {
    const command: JoinRoomCommand = {
      roomId: '987654'
    };
    const res = await sut.joinRoom(command);
    expect(res.statusCode).toBe(200);
    const { type, sessionId } = res.info as SessionInfo
    expect(type).toBe('like');
    expect(sessionId).toBeTruthy();
  });
});

describe('RoomInputPort Create & Get error handling', () => {
  const sut = new RoomInputPort(new CreateGetErrorRoomOutputPort());
  it('makeNewRoom', async () => {
    const command: NewRoomCommand = {
      fingerType: "like"
    };
    const res = await sut.makeNewRoom(command);
    expect(res.statusCode).toBe(500);
    const { error } = res.info as ErrorInfo
    expect(error).toBe('Create failed');
  });

  it('joinRoom: room not found', async () => {
    const command: JoinRoomCommand = {
      roomId: '987654'
    };
    const res = await sut.joinRoom(command);
    expect(res.statusCode).toBe(404);
    const { error } = res.info as ErrorInfo
    expect(error).toBe('Room not found: 987654');
  });

  it('joinRoom: bad request', async () => {
    const command: JoinRoomCommand = {
      roomId: undefined
    };
    const res = await sut.joinRoom(command);
    expect(res.statusCode).toBe(400);
    const { error } = res.info as ErrorInfo
    expect(error).toBe('Bad Request');
  });
});

describe('RoomInputPort Update error handling', () => {
  const sut = new RoomInputPort(new UpdateErrorRoomOutputPort());

  it('joinRoom', async () => {
    const command: JoinRoomCommand = {
      roomId: '987654'
    };
    const res = await sut.joinRoom(command);
    expect(res.statusCode).toBe(500);
    const { error } = res.info as ErrorInfo
    expect(error).toBe('Update failed');
  });
});
