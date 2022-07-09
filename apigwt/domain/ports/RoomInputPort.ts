import { Room } from "../entities/Room"
import { FingerType } from "../values/FingerType";
import { randomRoomId } from "../values/RoomId";
import { randomSessionId } from "../values/SessionId";
import { IRoomOutputPort } from "./RoomOutputPort";

type ResponseBase = {
  statusCode: number;
}

export type NewRoomCommand = {
  fingerType: FingerType;
}

type NewRoomResponse = ResponseBase & {
  info: RoomInfo | ErrorInfo
}

export type RoomInfo = {
  roomId: string;
} & SessionInfo

export type JoinRoomCommand = {
  roomId: string;
}

type JoinRoomResponse = ResponseBase & {
  info: SessionInfo | ErrorInfo;
}

export type SessionInfo = {
  sessionId: string;
  type: FingerType | undefined;
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
    const fingerType = command.fingerType;
    console.log(`SessionId=${sessionId} is trying to create a room=${roomId}/${fingerType}`);
    const created = await this.roomOutputPort.create({
      id: roomId,
      fingerType,
      sessionIds: [sessionId]
    }).catch(e => {
      console.log(e);
      return false;
    });
    console.log(`SessionId=${sessionId} create result: ${created}`);
    return {
      statusCode: created ? 200 : 500,
      info: created ? {
        roomId,
        sessionId,
        type: fingerType
      } : {
        error: "Create failed"
      }
    };
  }

  public async joinRoom(command: JoinRoomCommand): Promise<JoinRoomResponse> {
    console.log(`Looking for a room=${command.roomId}`);
    if (!command.roomId) {
      return {
        statusCode: 400,
        info: {
          error: "Bad Request"
        }
      }
    }
    const room: Room = await this.roomOutputPort.getRoom(command.roomId)
      .catch(e => {
        console.log(e);
        return undefined;
      });
    console.log("Room found:", room);
    if (!room) {
      return {
        statusCode: 404,
        info: {
          error: `Room not found: ${command.roomId}`
        }
      };
    }
    const sessionId = randomSessionId();
    room.sessionIds.push(sessionId);
    console.log(`SessionId=${sessionId} is trying to join the room:`, room);
    const updated = await this.roomOutputPort.update(room).catch(e => {
      console.log(e);
      return false;
    });
    console.log(`SessionId=${sessionId} join result: ${updated}`);
    return {
      statusCode: updated ? 200 : 500,
      info: updated ? {
        sessionId,
        type: room.fingerType
      } : {
        error: 'Update failed'
      }
    };
  }
}
