import "~/styles/globals.css";

import { Bakbak_One } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const bakbakOne = Bakbak_One({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["400"],
});

export const metadata = {
	title: "Krusbo",
	description: "Just a Simple Chat App",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`font-sans bg-black ${bakbakOne.variable}`}>
				<ClerkProvider appearance={{ baseTheme: dark }}>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
