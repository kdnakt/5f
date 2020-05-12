package com.kdnakt.quarkus.fivefingers;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;

@ApplicationScoped
public class DynamoDbRoomService {

    private static final Logger LOGGER = Logger.getLogger("DynamoDbRoomService");

    @Inject
    DynamoDbClient dynamo;
    @ConfigProperty(name = "5f.table.rooms")
    String roomsTableName;
    @ConfigProperty(name = "5f.index.connections")
    String connectionsIndexName;

    public String newRoomId(String sessionId) {
        String newRoomId = null;
        // do {
        //     newRoomId = RandomStringUtils.randomNumeric(6);
        // } while (rooms.containsKey(newRoomId));
        // Room newRoom = new Room();
        // newRoom.roomId = newRoomId;
        // newRoom.addSession(sessionId);
        // rooms.put(newRoomId, newRoom);
        // LOGGER.info("New Room ID: " + newRoomId);
        return newRoomId;
    }

    public boolean exists(String roomId, String sessionId) {
        // boolean exists = rooms.containsKey(roomId);
        // if (exists) {
        //     rooms.get(roomId).addSession(sessionId);
        // }
        // return exists;
        return false;
    }

    public Room get(String roomId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("RoomId", AttributeValue.builder().s(roomId).build());
        return Room.from(dynamo.getItem(
                GetItemRequest.builder()
                        .tableName(roomsTableName)
                        .key(key)
                        .build()
                ).item());
    }

    ScanRequest scanRequest() {
        return ScanRequest.builder()
                .tableName(roomsTableName)
                .build();
    }
}