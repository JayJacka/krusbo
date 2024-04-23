import { useState } from "react";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";
import { api } from "~/trpc/react";

export default function ChatInput({ room }: { room: string }) {
	const [message, setMessage] = useState("");
	const userData = api.auth.me.useQuery();
	
	function sendMessage() {
        console.log(message, room)
		socket.emit("send group message", userData.data?.avatar, userData.data?.nickname, message, room);
		setMessage("");
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
