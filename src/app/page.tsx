import { UserButton, currentUser } from "@clerk/nextjs";

import { zodResolver } from "@hookform/resolvers/zod"
import AvatarRandom from "./_components/AvatarRandom";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form"
import { z } from "zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
  } from "~/components/ui/form"
import { Input } from "~/components/ui/input";
import { NicknameForm } from "./_components/NicknameForm";

export default async function Home() {
	const user = await currentUser();
	if (!user) {
		return <div className="text-white">Not Signed In</div>;
	}
	 
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-primary text-white gap-4">
			<div className="flex flex-col w-3/6 items-center">
				<div className="text-4xl"> Hello, {user?.username}! </div>
				<UserButton />
				<AvatarRandom/>
				<NicknameForm/>
			</div>
		</div>
	);
}
