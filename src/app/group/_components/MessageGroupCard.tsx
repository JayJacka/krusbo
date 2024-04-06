interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}
export default function MessageGroupCard({ message }: { message: Message }) {
  const mockMyData = {
    id: "123",
    name: "Bow",
  };
  return (
    <div
      key={message.id}
      className={`flex w-full items-start gap-5 ${
        message.sender !== mockMyData.id ? "flex-row" : "flex-row-reverse"
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
          message.sender !== mockMyData.id ? "items-start" : "items-end"
        }`}
      >
        <div className="text-[24px] text-white">{message.sender}</div>
        <div
          className={`flex items-center gap-2 ${
            message.sender !== mockMyData.id ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`text-[20px] ${
              message.sender !== mockMyData.id
                ? "text-[#2BB5F3]"
                : "text-[#FABD40]"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}
