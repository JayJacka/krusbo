"use client";

import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { Socket, io } from "socket.io-client";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

if (typeof window !== "undefined") {
  socket = io({
    query: {
      name: localStorage.getItem("name"),
    },
    auth: {
      sessionID: localStorage.getItem("sessionID"),
      userID: localStorage.getItem("userID"),
    },
  });
} else {
  socket = io();
}
export { socket };
