package com.kdnakt.quarkus.fivefingers;

import java.util.Collections;
import java.util.Map;

import javax.inject.Inject;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.logging.Logger;

public class RoomApiHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

    private static final Logger LOG = Logger.getLogger(RoomApiHandler.class);

    @Inject
    DynamoDbRoomService roomService;

    @Override
    public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {
        LOG.info("input: " + input);
        String sessionId = RandomStringUtils.randomAlphanumeric(16);
        return ApiGatewayResponse.builder()
                .setRawBody(roomService.newRoomId(sessionId))
                .setHeaders(Collections.singletonMap("Set-Cookie", "sessionId=" + sessionId))
                .build();
    }

}