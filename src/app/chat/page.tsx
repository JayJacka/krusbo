"use client";

import { useEffect, useState } from "react";
import {socket} from "~/socket"

export default function chat() {
	const [currentMsg, setCurrentMsg] = useState("");
	const [chatList, setChatList] = useState<String[]>([]);
	
	const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await socket.emit("send_msg", currentMsg);
		setCurrentMsg("");
		};
		
	useEffect(() => {
		socket.on("send_msg", (msg) => {
			console.log(msg)
			console.log("chatList")
			setChatList((prev) => [...prev, msg]);
			console.log(chatList)
		});
	}, [socket]);

    return (
        <div className="bg-white h-screen">
		<div>
			<div>
			{chatList.map((msg, index) => (
				<div key={index}>{msg}</div>
			)
			)}
			</div>
			<div>
			<form onSubmit={(e) => sendData(e)}>
				<input
				type="text"
				value={currentMsg}
				placeholder="Type your message.."
				onChange={(e) => setCurrentMsg(e.target.value)}
				/>
				<button>Send</button>
			</form>
			</div>
		</div>
    </div>);
}
