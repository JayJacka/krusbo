import { useState } from "react";
import { Input } from "~/components/ui/input";

export default function GroupInput() {
  const [message, setMessage] = useState("");
  return (
    <form
      className="flex h-fit w-full flex-row items-center justify-center gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        // sendMessage.mutate({
        //   content: message,
        //   toUserID: toUserID,
        // });
      }}
    >
      <button className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white text-[40px] text-[#D51F68] hover:bg-[#FABD40] hover:text-[#0F1130]">
        +
      </button>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl bg-[#3A3D67] text-white"
      />
      <button className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white text-[40px] text-black hover:bg-[#FABD40] hover:text-[#0F1130]">
        {">"}
      </button>
    </form>
  );
}
