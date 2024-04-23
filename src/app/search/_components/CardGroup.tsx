import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type GroupDetail } from "../type";
import { socket } from "~/socket";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CardGroup(data: GroupDetail) {
  const userData = api.auth.me.useQuery();
  const router = useRouter();
  function joinRoom() {
    socket.emit("join room", data.name, userData.data?.id);
  }

  return (
    <Link
      href={`../songguessr/${data.name}`}
      onClick={joinRoom}
      className="flex h-[54px] cursor-pointer flex-row items-center justify-between rounded-lg bg-input px-3 py-2 hover:bg-input/40"
    >
      <div className="h4 text-grey">{data.name}</div>
      <div className="flex flex-row items-center gap-2">
        <FontAwesomeIcon
          icon={faUserGroup}
          width={20}
          height={20}
          className="text-grey"
        />
        <div className="h4 text-grey">{data.participant}</div>
      </div>
    </Link>
  );
}
