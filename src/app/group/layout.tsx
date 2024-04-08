"use client";

import { usePathname } from "next/navigation";
import { RoomList } from "../_components/RoomList";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex h-screen flex-row gap-4 bg-primary p-9 lg:gap-11">
      <RoomList pagePathName={pathname} />
      {children}
    </main>
  );
}
