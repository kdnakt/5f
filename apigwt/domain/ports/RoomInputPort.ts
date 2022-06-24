import { FingerType } from "../values/FingerType";
import { randomRoomId } from "../values/RoomId";
import { randomSessionId } from "../values/SessionId";
import { IRoomOutputPort } from "./RoomOutputPort";

export type NewRoomCommand = {
  fingerType: FingerType;
}

export type NewRoomResponse = {
  success: boolean;
  roomId: string;
  sessionId: string;
}

export type JoinRoomCommand = {
  roomId: string;
}

export type JoinRoomResponse = {
  statusCode: number;
  info: RoomInfo | ErrorInfo;
}

export type RoomInfo = {
  sessionId: string;
  fingerType: FingerType | undefined;
}

export type ErrorInfo = {
  error: string;
}

export interface IRoomInputPort {
  makeNewRoom(command: NewRoomCommand): Promise<NewRoomResponse>;
  joinRoom(command: JoinRoomCommand): Promise<JoinRoomResponse>;
}

export class RoomInputPort implements IRoomInputPort {
  private roomOutputPort: IRoomOutputPort;

  constructor(roomOutputPort: IRoomOutputPort) {
    this.roomOutputPort = roomOutputPort;
  }

  public async makeNewRoom(command: NewRoomCommand): Promise<NewRoomResponse> {
    const roomId = randomRoomId();
    const sessionId = randomSessionId();
    const created = await this.roomOutputPort.create({
      id: roomId,
      fingerType: command.fingerType,
      sessionIds: [sessionId]
    });
    return {
      success: created,
      roomId,
      sessionId
    };
  }

  public async joinRoom(command: JoinRoomCommand): Promise<JoinRoomResponse> {
    const room = await this.roomOutputPort.getRoom(command.roomId);
    const sessionId = randomSessionId();
    room.sessionIds.push(sessionId);
    await this.roomOutputPort.update(room);
    return {
      statusCode: 200,
      info: {
        sessionId,
        fingerType: room.fingerType
      }
    };
  }
}
