import { Room } from "../entities/Room";

export interface IRoomAdapter {
    put(room: Room): Promise<boolean>;
    get(roomId: string): Promise<Room>;
    update(room: Room): Promise<boolean>;
}
