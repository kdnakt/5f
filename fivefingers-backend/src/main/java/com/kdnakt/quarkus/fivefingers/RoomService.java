package com.kdnakt.quarkus.fivefingers;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.logging.Logger;

@ApplicationScoped
public class RoomService {

    private static final Logger LOGGER = Logger.getLogger("RoomService");

    private Map<String, Room> rooms =
            Collections.synchronizedMap(new LinkedHashMap<>());

    public String newRoomId(String sessionId) {
        String newRoomId;
        do {
            newRoomId = RandomStringUtils.randomNumeric(6);
        } while (exists(newRoomId));
        Room newRoom = new Room();
        newRoom.roomId = newRoomId;
        rooms.put(newRoomId, newRoom);
        LOGGER.info("New Room ID: " + newRoomId);
        return newRoomId;
    }

    public boolean exists(String roomId) {
        return rooms.containsKey(roomId);
    }

}