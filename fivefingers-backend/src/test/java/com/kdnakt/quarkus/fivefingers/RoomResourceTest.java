package com.kdnakt.quarkus.fivefingers;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class RoomResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/room")
          .then()
             .statusCode(200)
             .body(is("hello"));
    }

}