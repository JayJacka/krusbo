"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";

import { socket } from "~/socket";

export function RoomList({ pagePathName }: { pagePathName: string }) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [usersWithName, setUsersWithName] = useState<Map<string, string>>(
    new Map(),
  );

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

  const page = pagePathName.split("/")[1];
  console.log(pagePathName, page);
  const router = useRouter();
  return (
    <div className="min-w-screen flex h-full flex-row gap-11 bg-primary">
      <div className="flex h-full w-[200px] flex-col gap-10 lg:w-[270px]">
        <div className="flex h-fit items-center gap-6 text-[36px] text-white">
          <Link href="/" className="text-[40px]">
            {"<"}
          </Link>
          {page === "chat" ? "Chat" : "Group"}
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-2">
            {onlineUsers
              ?.map((user) => {
                return {
                  username: usersWithName.get(user),
                  id: user,
                };
              })
              .map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`flex items-center gap-2 ${
                    pagePathName.includes(user.id.toString())
                      ? "bg-yellow text-primary"
                      : "bg-input text-grey opacity-[0.8] hover:bg-secondary"
                  } rounded-lg px-3 py-2 text-[24px]`}
                  onClick={() => {
                    router.push(`/${page}/${user.id}`);
                  }}
                >
                  {user.username}
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
