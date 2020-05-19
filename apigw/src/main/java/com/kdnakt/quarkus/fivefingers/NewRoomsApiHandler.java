package com.kdnakt.quarkus.fivefingers;

import javax.inject.Inject;
import javax.inject.Named;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;

import org.jboss.logging.Logger;

@Named("newRoom")
public class NewRoomsApiHandler implements RequestHandler<APIGatewayProxyRequestEvent, ApiGatewayResponse> {

    private static final Logger LOG = Logger.getLogger(NewRoomsApiHandler.class);

    @Inject
    DynamoDbRoomService roomService;

    @Override
    public ApiGatewayResponse handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        LOG.info("input: " + input);
        return ApiGatewayResponse.builder()
                .setRawBody(roomService.newRoomId())
                .build();
    }

}