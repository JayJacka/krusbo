import ChatRoom from "../_components/ChatRoom";

export default async function Chat({ params }: { params: { userID: string } }) {

  return (
    <div className="h-full w-full bg-primary">
      <ChatRoom withUser={params.userID} />
    </div>
  );
}
