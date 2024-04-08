import { useState } from "react";
import { Input } from "~/components/ui/input";

export default function ChatInput() {
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
      <button className="hover:bg-y flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white text-[40px] text-pink hover:text-primary">
        +
      </button>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl bg-input text-white"
      />
      <button className="hover:bg-yellow flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white text-[40px] text-black hover:text-primary">
        {">"}
      </button>
    </form>
  );
}
