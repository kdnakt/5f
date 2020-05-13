package com.kdnakt.quarkus.fivefingers;

import java.util.Map;
import java.util.Objects;

import io.quarkus.runtime.annotations.RegisterForReflection;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

@RegisterForReflection
public class Connection {

    private String roomId;
    private String connectionId;

    public Connection() {}

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(String connectionId) {
        this.connectionId = connectionId;
    }

    public static Connection from(Map<String, AttributeValue> item) {
        Connection conn = new Connection();
        if (item != null && !item.isEmpty()) {
            conn.setRoomId(item.get("RoomId").s());
            conn.setConnectionId(item.get("ConnectionId").s());
        }
        return conn;
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Connection)) {
            return false;
        }

        Connection other = (Connection) obj;

        return Objects.equals(other.roomId, this.roomId)
                && Objects.equals(other.connectionId, this.connectionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.roomId, this.connectionId);
    }
}