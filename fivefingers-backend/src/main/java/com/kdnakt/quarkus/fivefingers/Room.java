package com.kdnakt.quarkus.fivefingers;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Room {

    public String roomId;
    public Map<String, Integer> fingers = new ConcurrentHashMap<>();

    public void addSession(String sessionId) {
        this.fingers.putIfAbsent(sessionId, Integer.valueOf(0));
    }

    public void removeSession(String sessionId) {
        this.fingers.remove(sessionId);
    }

}