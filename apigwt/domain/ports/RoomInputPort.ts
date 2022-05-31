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
    makeNewRoom(command: NewRoomCommand): Promise<void>
    joinRoom(command: JoinRoomCommand): Promise<FingerType>
}