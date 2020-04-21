package com.kdnakt.quarkus.fivefingers;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.logging.Logger;

@ApplicationScoped
public class RoomService {

    private static final Logger LOGGER = Logger.getLogger("RoomService");

    private Set<String> rooms = Collections.newSetFromMap(
            Collections.synchronizedMap(new LinkedHashMap<>()));

    public String newRoomId() {
        String newRoomId;
        do {
            newRoomId = RandomStringUtils.randomNumeric(6);
        } while (rooms.contains(newRoomId));
        rooms.add(newRoomId);
        LOGGER.info("New Room ID: " + newRoomId);
        return newRoomId;
    }

    public boolean exists(String roomId) {
        return rooms.contains(roomId);
    }

}