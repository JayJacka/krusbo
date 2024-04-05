"use client";

import { useRouter } from "next/navigation";
import { type MessageCardProps } from "./type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "~/components/ui/button";

export function MessageCard(props: MessageCardProps) {
  const router = useRouter();

  const onClick = () => {
    router.push(`/chat/${props.discourserId}`);
  };

  return (
    <div
      className={`flex cursor-pointer items-center justify-between p-4 ${
        props.isSelected ? "bg-primary-100" : ""
      }`}
      onClick={onClick}
    ></div>
  );
}
