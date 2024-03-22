import { UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
	const user = await currentUser();
	if (!user) {
		return <div>Not Signed In</div>;
	}
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4 text-4xl">
			Hello, {user?.username}!
			<UserButton />
		</main>
	);
}
