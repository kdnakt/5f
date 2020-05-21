import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support';
import { DynamoDB } from 'aws-sdk';

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

const db = new DynamoDB.DocumentClient();
const roomTable = process.env.ROOMS_TABLENAME;

export const onConnect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<Result> => {
  console.log('event:', event);
  return new Result('OK');
}

export const onDisconnect: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<Result> => {
  console.log('event:', event);
  return new Result('OK');
}

export const onMessage: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<Result> => {
  console.log('event:', event);
  return new Result('OK');
}
