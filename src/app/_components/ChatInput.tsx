import { useState } from "react";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";

export default function ChatInput({ withUser }: { withUser: string }) {
	const [message, setMessage] = useState("");

	function sendMessage() {
		socket.emit("private message", {
			from: socket.userID,
			content: message,
			to: withUser,
		});
	}
	return (
		<form
			className="flex h-fit w-full flex-row items-center justify-center gap-4"
			onSubmit={(e) => {
				e.preventDefault();
				sendMessage();
			}}
		>
			<Input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message..."
				className="flex-1 rounded-xl bg-input text-white"
			/>
			<button
				className="hover:bg-yellow flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white text-[40px] text-black hover:text-primary"
				type="submit"
			>
				{">"}
			</button>
		</form>
	);
}
