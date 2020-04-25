package com.kdnakt.quarkus.fivefingers;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

public class Room {

    public String roomId;
    public Set<User> users = Collections.newSetFromMap(
        Collections.synchronizedMap(new LinkedHashMap<>()));

}