"use client";

import { useRouter } from "next/navigation";

type UserCardProps = {
  name: string;
  id: string;
  index: number;
};
export function UserCard(prop: UserCardProps) {
  // list color from tailwind config
  const colors = [
    "bg-blue-50",
    "bg-pink",
    "bg-orange",
    "bg-green",
    "bg-purple",
  ];
  const router = useRouter();

  return (
    <div
      className={
        "flex h-10 w-full items-center justify-center rounded-xl text-white " +
        colors[prop.index % 5]
      }
      onClick={() => {
        router.push(`/chat/${prop.id}`);
      }}
    >
      <h3 className="text-2xl	">{prop.name}</h3>
    </div>
  );
}
