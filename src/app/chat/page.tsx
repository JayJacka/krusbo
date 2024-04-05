"use client";

import { useEffect, useState } from "react";
import {socket} from "~/socket"

export default function Chat() {
	const [isConnected, setIsConnected] = useState(false);

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

		return () => {
		socket.off("connect", onConnect);
		socket.off("disconnect", onDisconnect);
		};
	}, []);

	return (
		<div className="bg-white h-screen">
		<p>Status: { isConnected ? "connected" : "disconnected" }</p>
		</div>
  );
}
