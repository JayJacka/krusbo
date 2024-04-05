import { ScrollArea } from "~/components/ui/scroll-area";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmerica,
  faFire,
  faMessage,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import CreateGroupDialog from "./_components/create-group-dialog";
import CardGroup from "./_components/card-group";

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
    {
      id: 10,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 11,
      name: "SleepplyMak",
      participant: 4,
    },
    {
      id: 12,
      name: "SleepplyMak",
      participant: 4,
    },
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
    <div className="flex h-screen w-full flex-row gap-12 bg-primary">
      <div className="flex min-w-[278px] flex-col items-center justify-start gap-5 rounded-xl bg-black p-6">
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="text-white">
            <div className="flex flex-row items-center justify-center gap-3">
              <FontAwesomeIcon
                icon={faFire}
                className="text-[#FF1F00]"
                width={40}
                height={40}
              />
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
            <div className="flex flex-row items-center gap-4">
              <FontAwesomeIcon
                icon={faEarthAmerica}
                width={40}
                height={40}
                className="flex items-center justify-center text-[#2BB5F3]"
              />
              <div className="text-[36px] font-bold">Global Group</div>
            </div>
            <CreateGroupDialog />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h4 font-bold text-grey">
              {mockGroup.length} Group available
            </div>
            <ScrollArea className="flex max-h-[70vh] min-h-[70vh] flex-col gap-1">
              <div className="relative space-y-5">
                {mockGroup.map((data) => {
                  return <CardGroup key={data.id} {...data} />;
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <button className="flex flex-row items-center justify-center gap-3 rounded-xl border bg-none px-4 py-2">
            <FontAwesomeIcon
              icon={faMessage}
              width={24}
              height={24}
              className="text-white"
            />
            <div className="h4 font-bold text-white">Create Your Group</div>
          </button>
          <button className="flex flex-row items-center justify-center gap-3 rounded-xl bg-button-pink px-4 py-2">
            <FontAwesomeIcon
              icon={faRocket}
              width={24}
              height={24}
              className="text-white"
            />
            <div className="h4 font-bold text-white">My Group</div>
          </button>
        </div>
      </div>
    </div>
  );
}
