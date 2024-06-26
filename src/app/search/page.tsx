"use client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false;
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
import Link from "next/link";

export default function search() {
  const [allRooms, setAllRooms] = useState<GroupDetail[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [usersWithName, setUsersWithName] = useState<Map<string, string>>(
    new Map<string, string>(),
  );
  useEffect(() => {
    socket.emit("get rooms");
  }, []);

  useEffect(() => {
    socket.on("all rooms", (rooms: GroupDetail[]) => {
      setAllRooms(rooms);
    });
    return () => {
      socket.off("all rooms");
    };
  }, [socket]);

  useEffect(() => {
    socket.on(
      "onlineUsers",
      (users: { users: string[]; names: Map<string, string> }) => {
        const temp = new Map();
        users.users?.map((user) => {
          users.names.forEach((name) => {
            if (user === name[0]) {
              console.log(name[1]);
              temp.set(user, name[1]);
            }
          });
        });
        setUsersWithName(temp);
        setOnlineUsers(users.users);

        return () => {
          socket.off("onlineUsers");
        };
      },
    );
  }, []);

  return (
    <div className="flex h-screen w-screen flex-row gap-11 bg-primary p-9">
      <div className="flex h-full w-[278px] flex-col items-center justify-start gap-5 rounded-xl bg-black p-6">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-white">
            <div className="flex flex-row items-center justify-center gap-3">
              <FontAwesomeIcon icon={faFire} className="text-[40px] text-red" />
              <div className="text-[32px] text-white">Online User</div>
            </div>
          </div>
          <div className="h5 text-grey">Click to chat with online user</div>
        </div>
        <ScrollArea className="flex h-full w-full">
          <div className="flex h-full w-full flex-col gap-5">
            {onlineUsers
              ?.map((user) => {
                return {
                  username: usersWithName.get(user),
                  id: user,
                };
              })
              .map((data, index) => {
                return (
                  <Link href={`/chat/${data.id}`} key={data.id}>
                    <UserCard
                      index={index}
                      name={data.username ?? ""}
                      id={data.id}
                      key={data.id}
                    />
                  </Link>
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
                className="flex items-center justify-center text-[40px] text-blue"
              />
              <div className="text-[36px]">Global Group</div>
            </div>
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
        <div className="absolute bottom-0 flex w-full justify-end">
          <CreateGroupDialog />
        </div>
      </div>
    </div>
  );
}
