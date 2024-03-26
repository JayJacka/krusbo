import { ScrollArea } from "~/components/ui/scroll-area";
import { GroupDetail } from "./type";

export default function search() {
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
  ];
  const mockGroup = [
    {
      id: 1,
      name: "Play4U",
      participant: 4,
    },
    {
      id: 2,
      name: "Singler",
      participant: 4,
    },
    {
      id: 3,
      name: "ChatOnly",
      participant: 4,
    },

    {
      id: 4,
      name: "BabyU",
      participant: 4,
    },
    {
      id: 5,
      name: "GuessMe",
      participant: 4,
    },
    {
      id: 6,
      name: "Weight",
      participant: 4,
    },
    {
      id: 7,
      name: "OverLook",
      participant: 4,
    },
    {
      id: 8,
      name: "Typer",
      participant: 4,
    },
    {
      id: 9,
      name: "SharkFight",
      participant: 4,
    },
    // {
    //   id: 10,
    //   name: "SleepplyMak",
    //   participant: 4,
    // },
    // {
    //   id: 11,
    //   name: "SleepplyMak",
    //   participant: 4,
    // },
    // {
    //   id: 12,
    //   name: "SleepplyMak",
    //   participant: 4,
    // },
    {
      id: 13,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 14,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 15,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 16,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 17,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 18,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 19,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 20,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 21,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 22,
      name: "SleepplyMak",
      participant: 4,
    },
  ];
  return (
    <div className="flex h-screen w-full flex-row gap-12 bg-primary p-9">
      <div className="flex min-w-[278px] flex-col items-center justify-start gap-5 rounded-xl bg-black p-6">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-white">
            <div className="flex flex-row items-center justify-center gap-3">
              <div className="min-h-[40px] min-w-[40px] text-[#FF1F00]">
                Fire
              </div>
              <div className="text-[32px] font-bold text-white">
                Online User
              </div>
            </div>
          </div>
          <div className="h5 font-bold text-grey">
            Click to chat with online user
          </div>
        </div>
        {mockData.map((data) => {
          return (
            <div key={data.id} className="h3 font-bold text-white">
              {data.name}
            </div>
          );
        })}
      </div>
      <div className="flex w-full flex-col  justify-between gap-4">
        <div className="flex flex-col gap-4 text-white">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row gap-4">
              <div className="min-h-[40px] min-w-[40px] items-center justify-center text-[#2BB5F3]">
                Pic
              </div>
              <div className="text-[36px] font-bold">Global Group</div>
            </div>
            <button className="flex flex-row items-center justify-center gap-3 rounded-xl bg-button-yellow px-4 py-2">
              <div className="text-primary">Pic</div>
              <div className="h4 font-bold text-primary">Create Your Group</div>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h5 font-bold text-grey">
              {mockGroup.length} Group available
            </div>
            <ScrollArea className="flex max-h-[70vh] min-h-[70vh] flex-col gap-1">
              <div className="relative space-y-5">
                {mockGroup.map((data) => {
                  return <GroupCard {...data} />;
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <button className="flex flex-row items-center justify-center gap-3 rounded-xl border bg-none px-4 py-2">
            <div className="text-white">Pic</div>
            <div className="h4 font-bold text-white">Create Your Group</div>
          </button>
          <button className="flex flex-row items-center justify-center gap-3 rounded-xl bg-button-pink px-4 py-2">
            <div className="text-white">Pic</div>
            <div className="h4 font-bold text-white">My Group</div>
          </button>
        </div>
      </div>
    </div>
  );
}

const GroupCard = (data: GroupDetail) => {
  return (
    <div className="flex h-[54px] flex-row items-center justify-between rounded-lg bg-input px-3 py-2">
      <div className=" font-bold text-grey">{data.name}</div>
      <div className="flex flex-row gap-2">
        <div>Icon</div>
        <div className="font-bold text-grey">{data.participant}</div>
      </div>
    </div>
  );
};
