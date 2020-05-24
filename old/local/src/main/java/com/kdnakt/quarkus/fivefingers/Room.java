package com.kdnakt.quarkus.fivefingers;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import io.vertx.core.json.Json;

public class Room {

    public String roomId;
    public Map<String, Integer> fingers = new ConcurrentHashMap<>();

    public void addSession(String sessionId) {
        this.fingers.putIfAbsent(sessionId, Integer.valueOf(0));
    }

    public void removeSession(String sessionId) {
        this.fingers.remove(sessionId);
    }

    public String getFingers() {
        return Json.encode(this.fingers.entrySet().stream()
                .map(e -> new Finger(e.getKey(), e.getValue()))
                .collect(Collectors.toList()));
    }

    public void update(String sessionId, int count) {
        this.fingers.put(sessionId, Integer.valueOf(count));
    }

    public static class Finger {
        public String sid;
        public int cnt;
        public Finger(String sessionId, int count) {
            this.sid = sessionId;
            this.cnt = count;
        }
    }
}