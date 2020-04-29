package com.kdnakt.quarkus.fivefingers;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.jboss.logging.Logger;

@ServerEndpoint("/rooms/{roomId}/{sessionId}")
@ApplicationScoped
public class RoomSocket {

    private static final Logger LOGGER = Logger.getLogger("RoomService");

    Map<String, Map<String, Session>> sessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session,
            @PathParam("roomId") String roomId,
            @PathParam("sessionId") String sessionId) {
        sessions.putIfAbsent(roomId, new ConcurrentHashMap<>());
        // putIfAbsent().putIfAbsent threw NullPointerException
        sessions.get(roomId).putIfAbsent(sessionId, session);
        broadcast(roomId, sessionId, "joined");
    }

    @OnClose
    public void onClose(Session session,
    @PathParam("roomId") String roomId,
    @PathParam("sessionId") String sessionId) {
        sessions.get(roomId).remove(sessionId);
        broadcast(roomId, sessionId, "left");
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
    public void onMessage(String message,
            @PathParam("roomId") String roomId,
            @PathParam("sessionId") String sessionId) {
        broadcast(roomId, sessionId, message);
    }

    private void broadcast(String roomId, String sessionId,
            String message) {
        LOGGER.info("Room ID: " + roomId + ", Session ID: " + sessionId + ", Message: " + message);
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