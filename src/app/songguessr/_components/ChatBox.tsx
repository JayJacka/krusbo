import { useEffect, useRef, useState } from "react";
import { GroupMessage } from "../type";
import { ScrollArea } from "~/components/ui/scroll-area";
import ChatInput from "./ChatInput";
import MessageCard from "~/app/_components/MessageCard";
import { socket } from "~/socket";
import { api } from "~/trpc/react";

export function ChatBox({ room }: { room: string }) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const userData = api.auth.me.useQuery();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("group message", (msg: GroupMessage) => {
      console.log(msg)
      setMessages((prev) => [...prev, msg]);
    });

    chatContainerRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    return () => {
      socket.off("group message");
    };
  }, [socket]);

  return (
    <div className="flex w-full flex-col gap-3">
      <ScrollArea
        ref={chatContainerRef}
        className="flex max-h-40 min-h-40 flex-1 flex-col gap-8 overflow-y-auto bg-blue-200 px-6 py-4"
      >
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            avatar={message.from.avatar}
            name = {message.from.username}
            isMe={message.from.username === userData.data?.nickname}
            message={message.content}
          />
        ))}
      </ScrollArea>
      <ChatInput room={room} />
    </div>
  );
}
