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

const exists = (id: string) => {
  let res = false;
  db.get({
    TableName: roomTable,
    Key: {
      RoomId: id
    }
  }).promise().then(() => res = true);
  return res;
}

const newRoomId = (sessionId: string) => {
  let id = "";
  do {
    id = randomRoomId();
  } while (exists(id));
  db.put({
    TableName: roomTable,
    Item: {
      RoomId: id,
      SessionIds: [sessionId],
      LastUpdated: lastUpdated(),
    },
  }).promise().then(() => {
    console.log('newRoomId:', id);
  });
  return id;
}

const addSession = (roomId: string, sessionId: string, _context: Context) => {
  db.get({
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
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `sessionId=${sessionId};Max-Age=180`,
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: newRoomId(sessionId),
  };
}

export const getRoom: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event:', event);
  const roomId = event.queryStringParameters.id;
  if (!roomId) {
    console.log('id parameter is not specified');
    return {
      statusCode: 400,
      body: 'Bad Request'
    };
  }
  if (!exists(roomId)) {
    console.log(`${roomId} doens't exist`);
    return {
      statusCode: 400,
      body: `Bad Request`
    }
  }
  const sessionId = randomSessionId();
  addSession(roomId, sessionId, _context);
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `sessionId=${sessionId};Max-Age=180`,
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: roomId,
  };
}