"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";

export function RoomList({ pagePathName }: { pagePathName: string }) {
  const mockRoom = [
    {
      id: 123,
      name: "Room 123",
    },
    {
      id: 234,
      name: "Room 234",
    },
    {
      id: 345,
      name: "Room 345",
    },
    {
      id: 456,
      name: "Room 456",
    },
    {
      id: 567,
      name: "Room 567",
    },
    {
      id: 678,
      name: "Room 678",
    },
    {
      id: 789,
      name: "Room 789",
    },
    {
      id: 890,
      name: "Room 890",
    },
    {
      id: 901,
      name: "Room 901",
    },
  ];
  const router = useRouter();
  return (
    <div className="min-w-screen flex h-full flex-row gap-11 bg-[#0F1130]">
      <div className="flex h-full w-[200px] flex-col gap-10 lg:w-[270px]">
        <div className="flex h-fit items-center gap-6 text-[36px] text-white">
          <Link href="/" className="text-[40px]">
            {"<"}
          </Link>
          Group
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-2">
            {mockRoom.map((room) => (
              <button
                key={room.id}
                className={`flex items-center gap-2 ${
                  pagePathName.includes(room.id.toString())
                    ? "bg-[#FABD40] text-[#0F1130]"
                    : "bg-[#3A3D67] text-[#94A3B8] opacity-[0.8] hover:bg-[#2E3269]"
                } rounded-lg px-3 py-2 text-[24px]`}
                onClick={() => {
                  router.push(`/group/${room.id}`);
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
