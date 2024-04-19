import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type GroupDetail } from "../type";
import { socket } from "~/socket";
import Link from "next/link";

export default function CardGroup(data: GroupDetail) {
  function joinRoom() {
    socket.emit('join room', data.name);
  }

  return (
    <Link href={"../songguessr"} onClick={joinRoom} className="flex h-[54px] flex-row items-center justify-between rounded-lg bg-input px-3 py-2 cursor-pointer">
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
