import { FingerType } from "../values/FingerType";
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
  sessionId: string;
}

export interface IRoomInputPort {
  makeNewRoom(command: NewRoomCommand): Promise<NewRoomResponse>;
  joinRoom(command: JoinRoomCommand): Promise<FingerType>;
}

export class RoomInputPort implements IRoomInputPort {
  private roomOutputPort: IRoomOutputPort;

  constructor(roomOutputPort: IRoomOutputPort) {
    this.roomOutputPort = roomOutputPort;
  }

  makeNewRoom(command: NewRoomCommand): Promise<NewRoomResponse> {
    throw new Error("Method not implemented.");
  }
  joinRoom(command: JoinRoomCommand): Promise<FingerType> {
    throw new Error("Method not implemented.");
  }
}
