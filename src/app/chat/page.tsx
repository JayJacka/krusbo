"use client";

import { useEffect, useState } from "react";
import { socket } from "~/socket";

export type Message = {
	content: string;
	senderId: string;
};

export default function Chat() {
	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [usersWithName, setUsersWithName] = useState<Map<string, string>>(new Map());

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("session", ({ sessionID, userID }) => {
			console.log("session", sessionID, userID);
			// attach the session ID to the next reconnection attempts
			// store it in the localStorage
			localStorage.setItem("sessionID", sessionID);
			localStorage.setItem("userID", userID);
			// save the ID of the user
		});
		socket.on(
			"onlineUsers",
			(users: {
				users: string[];
				names: Map<string, string>;
			}) => {
				const temp = new Map()
				users.users?.map((user) => {
					users.names.forEach((name) => {
						if (user === name[0]) {
							console.log(name[1]);
							temp.set(user, name[1]);
						}
					});
				});
				setUsersWithName(temp)
				setOnlineUsers(users.users);
			},
		);
		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("session");
			socket.off("onlineUsers");
		};
	}, []);


	function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const input = event.target[0];
		const message: Message = {
			content: input.value,
			senderId: socket.id,
		};
		socket.emit("send message", message);
		input.value = "";
	}

	return (
		<div className="bg-white h-screen">
			<p>Status: {isConnected ? "connected" : "disconnected"}</p>
			<form onSubmit={submitHandler}>
				<input />
				<button type="submit">Send</button>
			</form>
			<p>
				Online Users:{" "}
				{onlineUsers
					?.map((user) => {
						return usersWithName.get(user);
					})
					.join(", ")}
			</p>
		</div>
	);
}
