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
import { UserCard } from "../_components/userCard";

import EditProfileDialog from "./_components/EditProfileDialog";

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
              {mockGroup.length} Group available
            </div>
            <ScrollArea>
              <div className="flex flex-col gap-4">
                {mockGroup.map((data) => {
                  return <CardGroup key={data.id} {...data} />;
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
