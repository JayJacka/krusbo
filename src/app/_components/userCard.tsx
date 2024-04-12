"use client";

type UserCardProps = {
  name: string;
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

  return (
    <div
      className={
        "flex h-10 w-full items-center justify-center rounded-xl text-white " +
        colors[prop.index % 5]
      }
    >
      <h3 className="text-2xl	">{prop.name}</h3>
    </div>
  );
}
