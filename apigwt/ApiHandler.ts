import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import 'source-map-support/register';

import { DynamoDB } from 'aws-sdk';
import { lastUpdated } from './util/lastUpdated';
import { randomRoomId } from './domain/values/RoomId';
import { randomSessionId } from './domain/values/SessionId';
import { JoinRoomCommand, NewRoomCommand, RoomInputPort } from './domain/ports/RoomInputPort';
import { RoomOutputPort } from './domain/ports/RoomOutputPort';
import { DdbRoomAdapter } from './domain/adapters/RoomAdapter';
import { toFingerType } from './domain/values/FingerType';

const db = new DynamoDB.DocumentClient();
const roomTable = process.env.ROOMS_TABLENAME;
const corsOrigin = process.env.CORS_ORIGIN;

const roomAdapter = new DdbRoomAdapter(roomTable, db);
const roomOutputPort = new RoomOutputPort(roomAdapter);
const roomInputPort = new RoomInputPort(roomOutputPort);

const exists = async (id: string) => {
  let res = false;
  await db.get({
    TableName: roomTable,
    Key: {
      RoomId: id
    }
  }).promise().then(() => res = true);
  return res;
}

const newRoomId = async (sessionId: string, type: string) => {
  let fingerType = type;
  if (fingerType !== 'finger' && fingerType !== 'like') {
    fingerType = 'finger'; // use default
  }
  const id = randomRoomId();
  await db.put({
    TableName: roomTable,
    Item: {
      RoomId: id,
      FingerType: fingerType,
      SessionIds: [sessionId],
      LastUpdated: lastUpdated(),
    },
    ConditionExpression: 'attribute_not_exists(SessionIds)',
  }).promise().then(() => {
    console.log('newRoomId:', id);
  }).catch(e => {
    console.log(e);
  });
  return [id, fingerType];
}

const addSession = async (roomId: string, sessionId: string, _context: Context) => {
  const data = await db.get({
    TableName: roomTable,
    Key: {
      RoomId: roomId
    },
    ProjectionExpression: 'SessionIds, LastUpdated, FingerType',
  }).promise();
  if (!data.Item.SessionIds.includes(sessionId)) {
    data.Item.SessionIds.push(sessionId);
    db.update({
      TableName: roomTable,
      Key: {
        RoomId: roomId,
      },
      UpdateExpression: 'SessionIds = :sids, LastUpdated = :lu',
      ExpressionAttributeValues: {
        ':sids': data.Item.SessionIds,
        ':lu': lastUpdated(),
      }
    }).promise();
  } else {
    const errMsg = 'session already exists';
    console.log(errMsg);
    _context.fail(errMsg);
  }
  return data.Item.FingerType;
}

export const newRoom: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event:', event);
  const req = JSON.parse(event.body);
  const type = toFingerType(req.type)
  const command: NewRoomCommand = {
    fingerType: type
  };
  const res = await roomInputPort.makeNewRoom(command);
  return {
    statusCode: res.statusCode,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify(res.info)
  };
}

export const getRoom: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event:', event);
  const roomId = event.queryStringParameters.id;
  if (!roomId) {
    console.log('id parameter is not specified');
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin
      },
      body: 'Bad Request'
    };
  }
  const command: JoinRoomCommand = {
    roomId
  }
  const res = await roomInputPort.joinRoom(command);
  return {
    statusCode: res.statusCode,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify(res.info)
  };
}