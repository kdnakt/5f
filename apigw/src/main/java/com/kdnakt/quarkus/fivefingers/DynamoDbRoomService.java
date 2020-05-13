package com.kdnakt.quarkus.fivefingers;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.RandomStringUtils;
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
    @ConfigProperty(name = "5f.table.connections")
    String connectionsTableName;

    public String newRoomId() {
        String newRoomId = null;
        do {
            newRoomId = RandomStringUtils.randomNumeric(6);
        } while (exists(newRoomId));
        LOGGER.info("New Room ID: " + newRoomId);
        return newRoomId;
    }

    boolean exists(String roomId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("RoomId", AttributeValue.builder().s(roomId).build());
        return dynamo.getItem(
                GetItemRequest.builder()
                        .tableName(roomsTableName)
                        .key(key)
                        .projectionExpression("RoomId")
                        .build()
                ).hasItem();
    }

    public Room get(String roomId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("RoomId", AttributeValue.builder().s(roomId).build());
        return Room.from(dynamo.getItem(
                GetItemRequest.builder()
                        .tableName(roomsTableName)
                        .key(key)
                        .projectionExpression("RoomId")
                        .build()
                ).item());
    }

    ScanRequest scanRequest() {
        return ScanRequest.builder()
                .tableName(roomsTableName)
                .build();
    }
}