package com.kdnakt.quarkus.fivefingers;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoomService {

    private Set<String> rooms = Collections.newSetFromMap(
            Collections.synchronizedMap(new LinkedHashMap<>()));

    public String newRoomId() {
        String newRoomId;
        do {
            newRoomId = UUID.randomUUID().toString();
        } while (rooms.contains(newRoomId));
        rooms.add(newRoomId);
        return newRoomId;
    }

}