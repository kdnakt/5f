package com.kdnakt.quarkus.fivefingers;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class RoomResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/room/new")
          .then()
             .statusCode(200)
             .body(notNullValue());
    }

}