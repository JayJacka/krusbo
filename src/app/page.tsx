import { UserButton, currentUser } from "@clerk/nextjs";

import { UserDataForm } from "./_components/UserDataForm";

export default async function Home() {
	const user = await currentUser();
	if (!user) {
		return <div className="text-white">Not Signed In</div>;
	}
	 
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-primary text-white gap-4">
			<div className="flex flex-col w-3/6 items-center gap-3">
				<UserDataForm/>
			</div>
		</div>
	);
}
