package com.kdnakt.quarkus.fivefingers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyResponseEvent;

import org.jboss.logging.Logger;

public class RoomSocketDefaultHandler implements RequestHandler<APIGatewayV2ProxyRequestEvent, APIGatewayV2ProxyResponseEvent> {

    private static final Logger LOG = Logger.getLogger(RoomSocketDefaultHandler.class);

    @Override
    public APIGatewayV2ProxyResponseEvent handleRequest(APIGatewayV2ProxyRequestEvent input, Context context) {
        LOG.info(input);
        LOG.info(context);
        return null;
    }

}