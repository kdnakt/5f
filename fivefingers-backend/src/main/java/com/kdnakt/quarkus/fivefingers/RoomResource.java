package com.kdnakt.quarkus.fivefingers;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

@Path("/room")
public class RoomResource {

    @Inject
    RoomService roomService;

    @GET
    @Path("/new")
    @Produces(MediaType.TEXT_PLAIN)
    public String newRoom() {
        return roomService.newRoomId();
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response room(@QueryParam("id") String id) {
        if (!roomService.exists(id)) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        return Response.ok(id).build();
    }
}