"use client";
import ChatInput from "../../_components/ChatInput";

import { useRef, useState } from "react";
import MessageCard from "../../_components/MessageCard";
import { ScrollArea } from "~/components/ui/scroll-area";
export default function ChatRoom({
  withUser,
  pairUser,
}: {
  withUser: string;
  pairUser: string;
}) {
  //  const [messages, setMessages] = useState<RecentMessage[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  //query messages from withUser (mock 123)
  const mock = {
    ChatRoom: "123", //me chat with user 123
    messages: [
      {
        id: 8,
        content: "I need help with my order",
        sender: "123",
        timestamp: "2021-06-10T11:00:08Z",
      },
      {
        id: 1,
        content: "Hello, how can I help you?",
        sender: "123",
        timestamp: "2021-06-10T11:00:00Z",
      },
      {
        id: 2,
        content: "I need help with my order",
        sender: "123",
        timestamp: "2021-06-10T11:00:02Z",
      },
      {
        id: 3,
        content: "Sure, what is your order number?",
        sender: "1234",
        timestamp: "2021-06-10T11:00:03Z",
      },

      {
        id: 5,
        content: "Thank you, I will check on that for you",
        sender: "4321",
        timestamp: "2021-06-10T11:00:05Z",
      },
      {
        id: 6,
        content: "You're welcome",
        sender: "4321",
        timestamp: "2021-06-10T11:00:06Z",
      },
      {
        id: 7,
        content: "Hello, how can I help you?",
        sender: "123",
        timestamp: "2021-06-10T11:00:07Z",
      },
      {
        id: 4,
        content: "123456",
        sender: "4321",
        timestamp: "2021-06-10T11:00:04Z",
      },
    ],
  };
  //sort by timestamp (may have sorted)
  const sortedMessages = mock.messages
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="bg-blue-100 flex w-full justify-between rounded-t-xl p-4 text-[32px] text-white">
        {pairUser}
      </div>

      <ScrollArea>
        <div
          ref={chatContainerRef}
          className="bg-blue-200 flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-4"
        >
          {sortedMessages.map((message) => (
            <MessageCard
              key={message.id}
              isMe={message.sender !== withUser}
              message={message}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatInput />
    </div>
  );
}
