"use client";

import { io } from "socket.io-client";

const socket = io();
if (typeof window !== "undefined") {
	socket.auth = { sessionID: localStorage.getItem("sessionID"), userID: localStorage.getItem("userID")};
}

export { socket };
