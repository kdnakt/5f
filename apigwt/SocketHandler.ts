import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support';
import { DynamoDB, ApiGatewayManagementApi } from 'aws-sdk';
import { lastUpdated } from './util/lastUpdated';

interface APIGatewayProxyEventWithWebSocket extends APIGatewayProxyEvent {
  requestContext: APIGatewayEventRequestContextWithWebSocket
}
interface APIGatewayEventRequestContextWithWebSocket extends APIGatewayEventRequestContext {
  domainName: string,
  connectionId: string
}

class Result implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 200) {}
}

const apigateway = ({ domainName, stage }): ApiGatewayManagementApi => new ApiGatewayManagementApi({ endpoint: `${domainName}/${stage}` });
const db = new DynamoDB.DocumentClient();
const roomTable = process.env.ROOMS_TABLENAME;
const connTable = process.env.CONNECTIONS_TABLENAME;

const broadcast = async (roomId: string, context: APIGatewayEventRequestContextWithWebSocket) => {
  const connections = await db.query({
    TableName: connTable,
    IndexName: 'roomid-index',
    KeyConditionExpression: 'RoomId = :rid',
    ExpressionAttributeValues: {
      ':rid': roomId
    },
  }).promise();
  const data = connections.Items.map(conn => {
    return {
      sid: conn.SessionId,
      cnt: conn.Count,
    };
  });
  await Promise.all(connections.Items.map(async (conn) => {
    try {
      const params: ApiGatewayManagementApi.Types.PostToConnectionRequest = {
        ConnectionId: conn.ConnectionId,
        Data: JSON.stringify(data),
      };
      await apigateway(context).postToConnection(params).promise();
    } catch (e) {
      if (e.statusCode === 410) {
        await db.delete({
          TableName: connTable,
          Key: {
            RoomId: roomId,
            ConnectionId: conn.ConnectionId
          }
        }).promise();
      } else {
        throw e;
      }
    }
  }));
}

export const onConnect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<Result> => {
  console.log('event:', event);
  return new Result('OK');
}

export const onMessage: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<Result> => {
  console.log('event:', event);
  const req = JSON.parse(event.body);
  await db.put({
    TableName: connTable,
    Item: {
      ConnectionId: event.requestContext.connectionId,
      RoomId: req.rid,
      SessionId: req.sid,
      Count: req.cnt,
      LastUpdated: lastUpdated(),
    }
  }).promise();
  await broadcast(req.rid, event.requestContext);
  return new Result('OK');
}

export const onDisconnect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<Result> => {
  console.log('event:', event);
  const conn = await db.get({
    TableName: connTable,
    Key: {
      ConnectionId: event.requestContext.connectionId
    }
  }).promise();
  const room = await db.get({
    TableName: roomTable,
    Key: {
      RoomId: conn.Item.RoomId
    }
  }).promise();
  await db.delete({
    TableName: connTable,
    Key: {
      ConnectionId: event.requestContext.connectionId
    },
  }).promise();
  const sessionIds = room.Item.SessionIds;
  console.log(conn.Item, sessionIds);
  sessionIds.splice(sessionIds.indexOf(conn.Item.SessionId), 1);
  if (sessionIds.length === 0) {
    await db.delete({
      TableName: roomTable,
      Key: {
        RoomId: room.Item.RoomId
      },
    }).promise();
  } else {
    await db.put({
      TableName: roomTable,
      Item: {
        RoomId: room.Item.RoomId,
        FingerType: room.Item.FingerType,
        SessionIds: sessionIds,
        LastUpdated: lastUpdated(),
      }
    }).promise();
  }
  await broadcast(room.Item.RoomId, event.requestContext);
  return new Result('OK');
}
