package com.kdnakt.quarkus.fivefingers;

import javax.inject.Inject;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyResponseEvent;

import org.jboss.logging.Logger;

public class RoomSocketDisconnectHandler
        implements RequestHandler<APIGatewayV2ProxyRequestEvent, APIGatewayV2ProxyResponseEvent> {

    private static final Logger LOG = Logger.getLogger(RoomSocketDisconnectHandler.class);

    @Inject
    DynamoDbRoomService roomService;

    @Override
    public APIGatewayV2ProxyResponseEvent handleRequest(APIGatewayV2ProxyRequestEvent input, Context context) {
        LOG.info(input);
        LOG.info(context);
        String roomId = input.getBody();
        String connectionId = input.getRequestContext().getConnectionId();
        roomService.removeConnection(roomId, connectionId);
        roomService.send(roomId);
        APIGatewayV2ProxyResponseEvent res = new APIGatewayV2ProxyResponseEvent();
        res.setStatusCode(200);
        return res;
    }

}