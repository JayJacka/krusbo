"use client";

import {
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserCard } from "~/app/_components/userCard";
import MessageCard from "~/app/_components/MessageCard";
import ChatInput from "~/app/_components/ChatInput";
export default function GroupRoom({ groupID }: { groupID: string }) {
  const mockMyData = {
    id: "123",
    name: "Faii",
  };
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mock = {
    GroupRoom: "123",
    groupName: "Group 123",
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
        sender: "12345",
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
  const [isCardOpen, setCardOpen] = useState<boolean>(false);
  const toggleCard = () => {
    setCardOpen(!isCardOpen);
  };
  const mockMember = [
    {
      name: "Bow",
      index: 1,
    },
    {
      name: "Jay",
      index: 2,
    },
    {
      name: "Faii",
      index: 3,
    },
    {
      name: "Win",
      index: 4,
    },
    {
      name: "Faii",
      index: 5,
    },
    {
      name: "Win",
      index: 6,
    },
    {
      name: "Faii",
      index: 7,
    },
    {
      name: "Win",
      index: 8,
    },
    {
      name: "Faii",
      index: 9,
    },
    {
      name: "Win",
      index: 10,
    },
    {
      name: "Faii",
      index: 11,
    },
    {
      name: "Win",
      index: 12,
    },
  ];
  //sort by timestamp (may have sorted)
  const sortedMessages = mock.messages
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="bg-blue-100 flex w-full items-center justify-between rounded-t-xl p-4 text-[32px] text-white">
        <div className="flex flex-row items-center gap-2">
          {mock.groupName}
          <button>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              flip={"horizontal"}
              className="text-grey"
            />
          </button>
        </div>
        <button
          onClick={() => {
            toggleCard();
          }}
        >
          <FontAwesomeIcon icon={faUserGroup} />
        </button>
      </div>
      <div className="flex h-[76%] w-full flex-row gap-2">
        <ScrollArea className="bg-blue-200 flex h-full flex-1">
          <div
            ref={chatContainerRef}
            className="flex flex-col gap-8  px-6 py-4"
          >
            {sortedMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                isMe={message.sender === mockMyData.id}
              />
            ))}
          </div>
        </ScrollArea>
        {isCardOpen && (
          <ScrollArea className="bg-blue-100 flex h-full w-[214px] rounded-lg">
            <div className="flex flex-col gap-3 p-4 text-[20px] text-grey">
              Member - {mockMember.length}
              {mockMember.map((member) => (
                <UserCard
                  key={member.index}
                  index={member.index}
                  name={member.name}
                ></UserCard>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <ChatInput />
    </div>
  );
}
