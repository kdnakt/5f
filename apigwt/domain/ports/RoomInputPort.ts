import { FingerType } from "../values/FingerType";

export type NewRoomCommand = {
    roomId: string;
    sessionId: string;
    fingerType: FingerType;
}

export type JoinRoomCommand = {
    roomId: string;
    sessionId: string;
}

export interface IRoomInputPort {
    makeNewRoom(command: NewRoomCommand): Promise<boolean>;
    joinRoom(command: JoinRoomCommand): Promise<FingerType>;
}

export class RoomInputPort implements IRoomInputPort {
    private roomOutputPort: IRoomInputPort;

    constructor(roomOutputPort: IRoomInputPort) {
        this.roomOutputPort = roomOutputPort;
    }

    makeNewRoom(command: NewRoomCommand): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    joinRoom(command: JoinRoomCommand): Promise<FingerType> {
        throw new Error("Method not implemented.");
    }
}
