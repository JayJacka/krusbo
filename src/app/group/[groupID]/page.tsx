import ChatRoom from "~/app/chat/_components/ChatRoom";
import GroupRoom from "../_components/GroupRoom";

export default async function Chat({
  params,
}: {
  params: { groupID: string };
}) {
  return (
    <div className="h-full w-full bg-primary">
      <GroupRoom groupID={params.groupID} />
    </div>
  );
}
