import ChatRoom from "../_components/ChatRoom";

export default async function Chat({ params }: { params: { userID: string } }) {
  //   const pairUser = await serverapi.user.getUserPublicData.query({
  //     userID: params.userID,
  //   });
  const pairUser = {
    aka: "Faii",
  };

  return (
    <div className="h-full w-full bg-primary">
      <ChatRoom withUser={params.userID} pairUser={pairUser.aka} />
    </div>
  );
}
