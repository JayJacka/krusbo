"use client";
import ChatInput from "../../_components/ChatInput";

import { useRef, useState, useEffect } from "react";
import MessageCard from "../../_components/MessageCard";
import { ScrollArea } from "~/components/ui/scroll-area";
import { socket } from "~/socket";

export type Message = {
	content: string;
	from: string;
	to: string;
	id: string;
	name: string;
	avatar: string;
};
export default function ChatRoom({
	withUser,
}: {
	withUser: string;
}) {
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		socket.on("private message", (msg: Message) => {
			console.log(msg, withUser);
			if (
				(msg.from === withUser || msg.to === withUser) &&
				(msg.from === socket.auth.userID || msg.to === socket.auth.userID)
			) {
				setMessages((prev) => [...prev, msg]);
			}
		});

		return () => {
			socket.off("private message");
		};
	}, [withUser]);

	const chatContainerRef = useRef<HTMLDivElement>(null);
	// useEffect(() => {
	// 	chatContainerRef.current?.scrollIntoView({
	// 		behavior: "smooth",
	// 	});
	// }, [messages]);

	return (
		<div className="flex h-full w-full flex-col gap-3">
			<ScrollArea>
				<div className="bg-blue-200 flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-4 h-screen">
					{messages.map((message) => (
						<MessageCard
							key={message.id}
							isMe={message.from !== withUser}
							message={message.content}
							name={message.name}
							avatar={message.avatar}
						/>
					))}
				</div>
				<div ref={chatContainerRef} />
			</ScrollArea>
			<ChatInput withUser={withUser} />
		</div>
	);
}
