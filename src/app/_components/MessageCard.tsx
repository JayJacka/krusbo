interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}
export default function MessageCard({
  isMe,
  message,
}: {
  isMe: boolean;
  message: Message;
}) {
  return (
    <div
      key={message.id}
      className={`flex w-full items-start gap-5 ${
        !isMe ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <img
        alt="profile"
        src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Boots"
        height={26}
        width={26}
        className="py-2"
      ></img>
      <div
        key={message.id}
        className={`flex w-full flex-col gap-3 ${
          !isMe ? "items-start" : "items-end"
        }`}
      >
        <div className="text-[24px] text-white">{message.sender}</div>
        <div
          className={`flex items-center gap-2 ${
            !isMe ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`text-[20px] ${!isMe ? "text-blue" : "text-button-yellow"} `}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}
