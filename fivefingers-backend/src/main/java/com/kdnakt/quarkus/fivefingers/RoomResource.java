package com.kdnakt.quarkus.fivefingers;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.RandomStringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/room")
public class RoomResource {

    @Inject
    RoomService roomService;

    @ConfigProperty(name = "5f.cookie.host", defaultValue = "localhost")
    String host;
    @ConfigProperty(name = "5f.session.max.age", defaultValue = "1800")
    int sessionMaxAge;

    @GET
    @Path("/new")
    @Produces(MediaType.TEXT_PLAIN)
    public Response newRoom() {
        String sessionId = RandomStringUtils.randomAlphanumeric(16);
        return Response.ok(roomService.newRoomId(sessionId))
                .cookie(new NewCookie("sessionId", sessionId, "/", host, null, sessionMaxAge, false))
                .build();
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response room(@QueryParam("id") String id) {
        if (!roomService.exists(id)) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        return Response.ok(id).build();
    }

    @POST
    @Path("/{id}/fingers")
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String send(@PathParam("id") String id, Fingers fingers) {
        return "You Selected: "  + fingers.count;
    }

}