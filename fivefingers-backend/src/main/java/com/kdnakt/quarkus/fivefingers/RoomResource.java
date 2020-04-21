package com.kdnakt.quarkus.fivefingers;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

@Path("/room")
public class RoomResource {

    @Inject
    RoomService roomService;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String room() {
        return "Room 1";
    }

    @GET
    @Path("/new")
    @Produces(MediaType.TEXT_PLAIN)
    public String newRoom() {
        return roomService.newRoomId();
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String room(@QueryParam("id") String id) {
        if (!roomService.exists(id)) {
            throw new RuntimeException();
        }
        return id;
    }
}