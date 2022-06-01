import { Room } from "../entities/Room";

export interface IRoomOutputPort {
    create(room: Room): Promise<boolean>;
    getRoom(roomId: string): Promise<Room>;
    update(room: Room): Promise<boolean>;
}
