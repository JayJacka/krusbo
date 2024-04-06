"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";

export function RoomList({ pagePathName }: { pagePathName: string }) {
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
            {mockRoom.map((room) => (
              <button
                key={room.id}
                className={`flex items-center gap-2 ${
                  pagePathName.includes(room.id.toString())
                    ? "bg-yellow text-primary"
                    : "bg-input text-grey opacity-[0.8] hover:bg-secondary"
                } rounded-lg px-3 py-2 text-[24px]`}
                onClick={() => {
                  router.push(`/${page}/${room.id}`);
                }}
              >
                {room.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
