import { group } from "console";
import GroupRoom from "../_components/GroupRoom";

export default async function Chat({
  params,
}: {
  params: { groupID: string };
}) {
  return (
    <div className="h-full w-full bg-[#0F1130]">
      <GroupRoom groupID={params.groupID} />
    </div>
  );
}
