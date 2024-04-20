"use client"
import { ScrollArea } from "~/components/ui/scroll-area";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmerica,
  faFire,
  faMessage,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import CardGroup from "./_components/CardGroup";
import { UserCard } from "../_components/userCard";

import EditProfileDialog from "./_components/EditProfileDialog";
import { socket } from "~/socket";
import { useEffect, useState } from "react";
import { GroupDetail } from "./type";

export default function search() {
  const [allRooms, setAllRooms] = useState<GroupDetail[]>([]);
  
  useEffect(() => {
    socket.emit('get rooms');
  }, []);

  useEffect(() => {
    socket.on('all rooms', (rooms: GroupDetail[]) => {
      setAllRooms(rooms);
    });
    return () => { 
      socket.off('all rooms');
    }
  }, [socket]);

  const mockData = [
    {
      id: 1,
      name: "Bow",
    },
    {
      id: 2,
      name: "Jay",
    },
    {
      id: 3,
      name: "Faii",
    },
    {
      id: 4,
      name: "Win",
    },
    {
      id: 5,
      name: "Ploy",
    },
    {
      id: 6,
      name: "Pim",
    },
    {
      id: 7,
      name: "Pim",
    },
    {
      id: 8,
      name: "Pim",
    },
    {
      id: 9,
      name: "Pim",
    },
  ];
  
  return (
    <div className="flex h-screen w-screen flex-row gap-11 bg-primary p-9">
      <div className="flex h-full w-[278px] flex-col items-center justify-start gap-5 rounded-xl bg-black p-6">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-white">
            <div className="flex flex-row items-center justify-center gap-3">
              <FontAwesomeIcon
                icon={faFire}
                className="text-red"
                width={40}
                height={40}
              />
              <div className="text-[32px] text-white">Online User</div>
            </div>
          </div>
          <div className="h5 text-grey">Click to chat with online user</div>
        </div>
        <ScrollArea className="flex h-full w-full">
          <div className="flex h-full w-full flex-col gap-5">
            {mockData.map((data) => {
              return (
                <UserCard index={data.id} name={data.name} key={data.id} />
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <div className="relative flex h-full flex-1 flex-col  justify-between gap-4">
        <div className="flex h-[75%] w-full flex-col gap-4 text-white lg:h-[80%]">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-4">
              <FontAwesomeIcon
                icon={faEarthAmerica}
                width={40}
                height={40}
                className="flex items-center justify-center text-blue"
              />
              <div className="text-[36px]">Global Group</div>
            </div>
            {/* profile */}
            <EditProfileDialog />
          </div>
          <div className="flex h-full flex-col gap-4">
            <div className="h4 text-grey">
              {allRooms.length} Group available
            </div>
            <ScrollArea>
              <div className="flex flex-col gap-4">
                {allRooms.map((room) => {
                  return <CardGroup key={room.name} {...room} />;
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="absolute bottom-0 flex w-full justify-between">
          <CreateGroupDialog />
          <div className="flex gap-4">
            <button className="flex flex-row items-center justify-center gap-3 rounded-xl border bg-none px-4 py-2">
              <FontAwesomeIcon
                icon={faMessage}
                width={24}
                height={24}
                className="text-white"
              />
              <div className="h6 lg:h4 text-white">My Group</div>
            </button>
            <button className="flex flex-row items-center justify-center gap-3 rounded-xl bg-pink px-4 py-2">
              <FontAwesomeIcon
                icon={faRocket}
                width={24}
                height={24}
                className="text-white"
              />
              <div className="h6 lg:h4 text-white">My Group</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
