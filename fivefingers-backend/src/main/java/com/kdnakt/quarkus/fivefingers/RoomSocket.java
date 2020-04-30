package com.kdnakt.quarkus.fivefingers;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.jboss.logging.Logger;

import io.vertx.core.json.Json;

@ServerEndpoint("/rooms/{roomId}/{sessionId}")
@ApplicationScoped
public class RoomSocket {

    private static final Logger LOGGER = Logger.getLogger("RoomSocket");

    Map<String, Map<String, Session>> sessions = new ConcurrentHashMap<>();

    @Inject
    RoomService service;

    @OnOpen
    public void onOpen(Session session,
            @PathParam("roomId") String roomId,
            @PathParam("sessionId") String sessionId) {
        sessions.putIfAbsent(roomId, new ConcurrentHashMap<>());
        // putIfAbsent().putIfAbsent threw NullPointerException
        sessions.get(roomId).put(sessionId, session);
        broadcast(roomId, sessionId, Json.encode(service.get(roomId).fingers));
    }

    @OnClose
    public void onClose(Session session,
            @PathParam("roomId") String roomId,
            @PathParam("sessionId") String sessionId) {
        sessions.get(roomId).remove(sessionId);
        Room room = service.get(roomId);
        room.removeSession(sessionId);
        broadcast(roomId, sessionId, Json.encode(room.fingers));
    }

    @OnError
    public void onError(Session session,
            @PathParam("roomId") String roomId,
            @PathParam("sessionId") String sessionId,
            Throwable throwable) {
        LOGGER.error(throwable);
        throwable.printStackTrace();
        sessions.get(roomId).remove(sessionId);
        broadcast(roomId, sessionId, "error: " + throwable);
    }

    @OnMessage
    public void onMessage(int count,
            @PathParam("roomId") String roomId,
            @PathParam("sessionId") String sessionId) {
        Map<String, Integer> fingers =  service.get(roomId).fingers;
        fingers.put(sessionId, Integer.valueOf(count));
        broadcast(roomId, sessionId, Json.encode(fingers));
    }

    private void broadcast(String roomId, String sessionId,
            Object message) {
        LOGGER.info("Room ID: " + roomId + ", Session ID: " + sessionId + ", Object: " + message);
        sessions.get(roomId).entrySet().forEach(e -> {
            if (sessionId.equals(e.getKey())) return;
            e.getValue().getAsyncRemote().sendObject(message, result -> {
                if (result.getException() != null) {
                    LOGGER.error("Unable to send message", result.getException());
                }
            });
        });
    }

}