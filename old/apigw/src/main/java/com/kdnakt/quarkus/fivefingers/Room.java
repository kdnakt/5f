package com.kdnakt.quarkus.fivefingers;

import java.util.Map;
import java.util.Objects;

import io.quarkus.runtime.annotations.RegisterForReflection;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

@RegisterForReflection
public class Room {

    private String roomId;

    public Room() {}

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public static Room from(Map<String, AttributeValue> item) {
        Room room = new Room();
        if (item != null && !item.isEmpty()) {
            room.setRoomId(item.get("RoomId").s());
        }
        return room;
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Room)) {
            return false;
        }

        Room other = (Room) obj;

        return Objects.equals(other.roomId, this.roomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.roomId);
    }
}