"use client";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { MessageCard } from "./MessageCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function MessageList({ pagePathName }: { pagePathName: string }) {
  const mockRoom = [
    {
      id: 123,
      name: "Faii",
    },
    {
      id: 234,
      name: "Jay",
    },
    {
      id: 345,
      name: "Bow",
    },
  ];
  const router = useRouter();
  return (
    <div className="min-w-screen flex h-full flex-row gap-11 bg-[#0F1130]">
      <div className="flex h-full w-[200px] flex-col gap-12 lg:w-[270px]">
        <div className="flex h-fit items-center gap-6 text-[36px] text-white">
          <Link href="/" className="text-[40px]">
            {"<"}
          </Link>
          Chat
        </div>
        <div className="flex flex-col gap-2">
          {mockRoom.map((room) => (
            <button
              className={`flex items-center gap-2 ${
                pagePathName.includes(room.id.toString())
                  ? "bg-[#FABD40] text-[#0F1130]"
                  : "bg-[#3A3D67] text-[#94A3B8] opacity-[0.8] hover:bg-[#2E3269]"
              } rounded-lg px-3 py-2 text-[24px]`}
              onClick={() => {
                router.push(`/chat/${room.id}`);
              }}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
