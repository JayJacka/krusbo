import { useEffect, useRef, useState } from "react";
import { GroupMessage } from "../type";
import { ScrollArea } from "~/components/ui/scroll-area";
import ChatInput from "./ChatInput";
import MessageCard from "~/app/_components/MessageCard";
import { socket } from "~/socket";

export function ChatBox({ room }: { room: string }){
    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
		socket.on("group message", (msg: GroupMessage) => {
			setMessages((prev) => [...prev, msg]);
		});

        chatContainerRef.current?.scrollIntoView({
            behavior: "smooth",
          });

		return () => {
			socket.off("group message");
		};
	}, [socket]);

    
    return <div className="flex w-full flex-col gap-3">
            <ScrollArea ref={chatContainerRef} className="bg-blue-200 flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-4 max-h-40">
                {messages.map((message) => (
                    <MessageCard
                        key={message.id}
                        isMe={message.from === socket.id}
                        message={message.content}
                    />
                ))}
            </ScrollArea>
            <ChatInput room={room} />
    </div>
}