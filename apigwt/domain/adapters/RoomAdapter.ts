import { DynamoDB } from "aws-sdk";
import { lastUpdated } from "../../util/lastUpdated";
import { Room } from "../entities/Room";

export interface IRoomAdapter {
  put(room: Room): Promise<boolean>;
  get(roomId: string): Promise<Room>;
  update(room: Room): Promise<boolean>;
}

export class DdbRoomAdapter implements IRoomAdapter {
  private tableName: string;
  private ddb: DynamoDB.DocumentClient;

  constructor(tableName: string, ddb: DynamoDB.DocumentClient) {
    this.tableName = tableName;
    this.ddb = ddb;
  }

  public async put(room: Room): Promise<boolean> {
    return this.ddb.put({
        TableName: this.tableName,
        Item: {
            RoomId: room.id,
            FingerType: room.fingerType,
            SessionIds: room.sessionIds,
            LastUpdated: lastUpdated()
        },
        ConditionExpression: 'attribute_not_exists(SessionIds)',
    }).promise().then(_ => true)
    .catch(e => {
        console.error(e);
        return false;
    });
  }

  public async get(roomId: string): Promise<Room> {
    const item = await this.ddb.get({
        TableName: this.tableName,
        Key: {
          RoomId: roomId
        },
        ProjectionExpression: 'SessionIds, LastUpdated, FingerType',
    }).promise();
    if (!item.Item) {
      return {
        id: item.Item.RoomId,
        fingerType: item.Item.FingerType,
        sessionIds: item.Item.SessionIds
      };
    }
    throw new Error(`room not found: ${roomId}`)
  }

  public async update(room: Room): Promise<boolean> {
    return this.ddb.update({
        TableName: this.tableName,
        Key: {
            RoomId: room.id,
        },
        UpdateExpression: 'SessionIds = :sids, LastUpdated = :lu',
        ExpressionAttributeValues: {
          ':sids': room.sessionIds,
          ':lu': lastUpdated(),
        }
    }).promise().then(_ => true)
    .catch(e => {
        console.error(e);
        return false;
    });
  }

}