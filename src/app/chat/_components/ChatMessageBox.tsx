import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
export default function ChatMessageBox({ toUserID }: { toUserID: string }) {
  const [message, setMessage] = useState("");

  return (
    <div className="bottom-0 z-10 mt-4 flex w-full flex-row items-center justify-center gap-2 bg-white px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex w-full flex-row gap-2"
      >
        <input
          type="text"
          placeholder="Write your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full flex-1 rounded-xl bg-neutral-50 px-4 py-2 text-black"
        />
        {message !== "" && (
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white transition"
          ></button>
        )}
      </form>
    </div>
  );
}
