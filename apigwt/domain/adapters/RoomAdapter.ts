import { DynamoDB } from "aws-sdk";
import { Room } from "../entities/Room";

export interface IRoomAdapter {
    put(room: Room): Promise<boolean>;
    get(roomId: string): Promise<Room>;
    update(room: Room): Promise<boolean>;
}

export class DdbRoomAdapter implements IRoomAdapter {
    private ddb: DynamoDB.DocumentClient;

    constructor(ddb: DynamoDB.DocumentClient) {
        this.ddb = ddb;
    }

    put(room: Room): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    get(roomId: string): Promise<Room> {
        throw new Error("Method not implemented.");
    }
    update(room: Room): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}