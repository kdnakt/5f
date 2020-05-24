package com.kdnakt.quarkus.fivefingers;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class RoomResourceTest {

    @Test
    public void testNewRoomEndpoint() {
        given().when()
                .get("/room/new").then()
                .statusCode(200).body(notNullValue());
    }

    @Test
    public void testGetRoomEndpoint() {
        String newRoomId = given().when()
                .get("/room/new").asString();
        given().when()
                .get("/room").then()
                .statusCode(400);
        given().when()
                .get("/room?id=" + newRoomId).then()
                .statusCode(200).body(is(newRoomId));
    }
}