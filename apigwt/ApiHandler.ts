import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();
const roomTable = process.env.ROOMS_TABLENAME;
const connTable = process.env.CONNECTIONS_TABLENAME;
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

export const newRoom: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event:', event);
  return {
    statusCode: 200,
    body: newRoomId(randomSessionId()),
  };
}
