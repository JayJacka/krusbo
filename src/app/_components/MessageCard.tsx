type MessageCardProp = {
  name: string;
  avatar: string;
  isMe: boolean;
  message: string;
};
export default function MessageCard({
  name,
  avatar,
  isMe,
  message,
}: MessageCardProp) {
  return (
    <div
      className={`mx-auto flex w-full items-end gap-5 ${
        !isMe ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <img alt="profile" src={avatar} height={26} width={26} className="py-2" />
      <div
        className={`flex w-full flex-col gap-3 ${
          !isMe ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`flex w-fit flex-col ${!isMe ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`flex w-fit text-[20px] text-white ${
              !isMe ? "justify-start" : "justify-end"
            }`}
          >
            {name}
          </div>
          <div
            className={`w-fit break-words text-[20px] ${!isMe ? "text-blue" : "text-yellow"} `}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
