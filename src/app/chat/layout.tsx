"use client";

import { usePathname } from "next/navigation";
import { MessageList } from "./_components/MessageList";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex h-screen flex-row gap-4 bg-[#0F1130] p-9 lg:gap-11">
      <MessageList pagePathName={pathname} />
      {children}
    </main>
  );
}
