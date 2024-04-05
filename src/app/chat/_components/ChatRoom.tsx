"use client";
import ChatInput from "./ChatInput";

import { useRef, useState } from "react";
export default function ChatRoom({
  withUser,
  pairUser,
}: {
  withUser: string;
  pairUser: string;
}) {
  //  const [messages, setMessages] = useState<RecentMessage[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mock = {
    ChatRoom: "123",
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
      <div className="flex w-full justify-between rounded-t-xl bg-[#1E2049] p-4 text-[32px] text-white">
        {pairUser}
      </div>
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-8 overflow-y-auto bg-[#131429] p-4"
      >
        {sortedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full items-start gap-5 ${
              message.sender === withUser ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <img
              alt="profile"
              src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Boots"
              height={26}
              width={26}
              className="py-2"
            ></img>
            <div
              key={message.id}
              className={`flex w-full flex-col gap-3 ${
                message.sender === withUser ? "items-start" : "items-end"
              }`}
            >
              <div className="text-[24px] text-white">{message.sender}</div>
              <div
                className={`flex items-center gap-2 ${
                  message.sender === withUser ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`text-[20px] ${
                    message.sender === withUser
                      ? "text-[#2BB5F3]"
                      : "text-[#FABD40]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
}
