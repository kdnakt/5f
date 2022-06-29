import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { DynamoDB } from 'aws-sdk';
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