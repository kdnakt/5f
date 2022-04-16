import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import 'source-map-support/register';

import { DynamoDB } from 'aws-sdk';
import { lastUpdated } from './util/lastUpdated';

const db = new DynamoDB.DocumentClient();
const roomTable = process.env.ROOMS_TABLENAME;
const corsOrigin = process.env.CORS_ORIGIN;
const NUMBERS = "0123456789";
const ALPHANUMS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + NUMBERS;
const ALPHANUMS_LEN = ALPHANUMS.length;

const randomRoomId = () => {
  let res = "";
  for (let i = 0; i < 6; i++) {
    res += NUMBERS[Math.floor(Math.random()*10)]
  }
  return res;
}

const randomSessionId = () => {
  let res = "";
  for (let i = 0; i < 16; i++) {
    res += ALPHANUMS[Math.floor(Math.random()*ALPHANUMS_LEN)]
  }
  console.log('newSessionId:', res);
  return res;
}

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
  const sessionId = randomSessionId();
  const [roomId, type] = await newRoomId(sessionId, req.type);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify({
      roomId: roomId,
      type: type,
      sessionId: sessionId,
    })
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
  if (!exists(roomId)) {
    console.log(`${roomId} doesn't exist`);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin
      },
      body: `Bad Request`
    }
  }
  const sessionId = randomSessionId();
  const type = await addSession(roomId, sessionId, _context);
  console.log(type)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify({
      roomId: roomId,
      type: type,
      sessionId: sessionId,
    })
  };
}