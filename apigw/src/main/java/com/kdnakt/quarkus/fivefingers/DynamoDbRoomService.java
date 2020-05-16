package com.kdnakt.quarkus.fivefingers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.RandomStringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import io.vertx.core.json.Json;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.apigatewaymanagementapi.ApiGatewayManagementApiClient;
import software.amazon.awssdk.services.apigatewaymanagementapi.model.PostToConnectionRequest;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;

@ApplicationScoped
public class DynamoDbRoomService {

    private static final Logger LOGGER = Logger.getLogger("DynamoDbRoomService");

    @Inject
    DynamoDbClient dynamo;
    @Inject
    ApiGatewayManagementApiClient apigw;
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

    public void addConnection(String roomId, String connectionId) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("RoomId", AttributeValue.builder().s(roomId).build());
        item.put("ConnectionId", AttributeValue.builder().s(connectionId).build());
        dynamo.putItem(PutItemRequest.builder()
                .tableName(connectionsTableName)
                .item(item)
                .build());
    }

    public static class Finger {
        public String sid;
        public int cnt;
        public Finger(String sid, String cnt) {
            this.sid = sid;
            this.cnt = Integer.parseInt(cnt);
        }
    }

    public void send(String roomId) {
        Map<String, AttributeValue> values = new HashMap<>();
        values.put("RoomId", AttributeValue.builder().s(roomId).build());
        List<Map<String, AttributeValue>> items =
                dynamo.query(QueryRequest.builder()
                .tableName(connectionsTableName)
                .keyConditionExpression("RoomId = :roomId")
                .expressionAttributeValues(values)
                .attributesToGet("ConnectionId", "FingerCount")
                .build()).items();
        String data = Json.encode(items.stream().map(item -> new Finger(
                item.get("ConnectionId").s(),
                item.get("FingerCount").n())
                ).collect(Collectors.toList()));
        items.stream().forEach(item -> {
                    String connectionId = item.get("ConnectionId").s();
                    apigw.postToConnection(PostToConnectionRequest.builder()
                            .connectionId(connectionId)
                            .data(SdkBytes.fromUtf8String(data))
                            .build());
                });
    }
}