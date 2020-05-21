import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import 'source-map-support/register';

import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const roomTable = process.env.ROOMS_TABLENAME;
const connTable = process.env.CONNECTIONS_TABLENAME;
const corsOrigin = process.env.CORS_ORIGIN;
const NUMBERS = "0123456789";
const ALPHANUMS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + NUMBERS;
const ALPHANUMS_LEN = ALPHANUMS.length;

const lastUpdated = () => {
  return new Date().toLocaleString('ja', { timeZone: 'Asia/Tokyo' });
}

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

const newRoomId = async (sessionId: string) => {
  const id = randomRoomId();
  await db.put({
    TableName: roomTable,
    Item: {
      RoomId: id,
      SessionIds: [sessionId],
      LastUpdated: lastUpdated(),
    },
    ConditionExpression: 'attribute_not_exists(SessionIds)',
  }).promise().then(() => {
    console.log('newRoomId:', id);
  }).catch(e => {
    console.log(e);
  });
  return id;
}

const addSession = async (roomId: string, sessionId: string, _context: Context) => {
  await db.get({
    TableName: roomTable,
    Key: {
      RoomId: roomId
    },
    ProjectionExpression: 'SessionIds, LastUpdated',
  }).promise().then(data => {
    if (!data.Item.SessionIds.includes(sessionId)) {
      data.Item.SessionIds.push(sessionId);
      db.put({
        TableName: roomTable,
        Item: {
          RoomId: roomId,
          SessionIds: data.Item.SessionIds,
          LastUpdated: lastUpdated(),
        }
      }).promise();
    } else {
      const errMsg = 'session already exists';
      console.log(errMsg);
      _context.fail(errMsg);
    }
  }).catch(err => {
    console.log('Error:', err);
    _context.fail(err);
  });
}

export const newRoom: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event:', event);
  const sessionId = randomSessionId();
  const roomId = await newRoomId(sessionId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify({
      roomId: roomId,
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
    console.log(`${roomId} doens't exist`);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin
      },
      body: `Bad Request`
    }
  }
  const sessionId = randomSessionId();
  await addSession(roomId, sessionId, _context);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify({
      roomId: roomId,
      sessionId: sessionId,
    })
  };
}