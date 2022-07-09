import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
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

type ApiResponse = {
  statusCode: number;
  info: any;
}

type API = (e: APIGatewayProxyEvent) => Promise<ApiResponse>;

const baseApi = async (event: APIGatewayProxyEvent, api: API) => {
  console.log('event:', event);
  const res = await api(event);
  console.log('res', res);
  return {
    statusCode: res.statusCode,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin
    },
    body: JSON.stringify(res.info)
  };
}

export const newRoom: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent, _: Context
) => baseApi(event, async (e) => {
  const req = JSON.parse(e.body);
  const type = toFingerType(req.type)
  const command: NewRoomCommand = {
    fingerType: type
  };
  return await roomInputPort.makeNewRoom(command);
})

export const getRoom: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent, _: Context
) => baseApi(event, async (e) => {
  const roomId = e.queryStringParameters.id;
  const command: JoinRoomCommand = {
    roomId
  }
  return await roomInputPort.joinRoom(command);
})
