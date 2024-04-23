"use client";

import { io } from "socket.io-client";
let socket;

if (typeof window !== "undefined") {
	socket = io("http://localhost:3000", {
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
