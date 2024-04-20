"use client";
import { api } from "~/trpc/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function EditProfileIcon() {
  const userDataQuery = api.auth.me.useQuery();
  if (userDataQuery.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative">
      <img
        alt="profile"
        src={userDataQuery.data?.avatar}
        height={50}
        width={50}
      />
      <div className="absolute left-9 top-8">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <FontAwesomeIcon icon={faPen} className="text-[16px] text-black" />
        </div>
      </div>
    </div>
  );
}
