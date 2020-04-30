package com.kdnakt.quarkus.fivefingers;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import io.vertx.core.json.Json;

public class Fingers {

    public String sessionId;
    public int count;

    public Fingers(String sessionId, int count) {
        this.sessionId = sessionId;
        this.count = count;
    }

    public static class FingersEncoder implements Encoder.Text<Fingers> {

        @Override
        public void init(EndpointConfig config) {
        }

        @Override
        public void destroy() {
        }

        @Override
        public String encode(Fingers fingers) throws EncodeException {
            return Json.encode(fingers);
        }

    }
}