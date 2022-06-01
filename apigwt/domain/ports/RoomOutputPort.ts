import { IRoomAdapter } from "../adapters/RoomAdapter";
import { Room } from "../entities/Room";

export interface IRoomOutputPort {
    create(room: Room): Promise<boolean>;
    getRoom(roomId: string): Promise<Room>;
    update(room: Room): Promise<boolean>;
}

export class RoomOutputPort implements IRoomOutputPort {
    private adapter: IRoomAdapter;

    constructor(adapter: IRoomAdapter) {
        this.adapter = adapter;
    }

    create(room: Room): Promise<boolean> {
        return this.adapter.put(room);
    }
    getRoom(roomId: string): Promise<Room> {
        return this.adapter.get(roomId);
    }
    update(room: Room): Promise<boolean> {
        return this.adapter.update(room);
    }
}