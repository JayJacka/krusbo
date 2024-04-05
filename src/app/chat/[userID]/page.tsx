import { faChevronLeft, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import ChatRoom from "../_components/ChatRoom";

export default async function Chat({ params }: { params: { userID: string } }) {
  //   const pairUser = await serverapi.user.getUserPublicData.query({
  //     userID: params.userID,
  //   });
  const pairUser = {
    aka: "Faii",
  };

  return (
    <div className="h-full w-full bg-[#0F1130]">
      <ChatRoom withUser={params.userID} pairUser={pairUser.aka} />
    </div>
  );
}
