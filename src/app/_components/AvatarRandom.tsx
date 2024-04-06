"use client";
import { createAvatar } from "@dicebear/core";
import { useEffect, useMemo } from "react";
import { botttsNeutral } from "@dicebear/collection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faUsd } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@radix-ui/themes";
import { useState } from "react";

type AvatarRandomProps = {
  setAvatar: (avatar: string) => void;
};

export default function AvatarRandom({ setAvatar }: AvatarRandomProps) {
  const [seed, setSeed] = useState("");

  const avatar = useMemo(() => {
    return createAvatar(botttsNeutral, {
      size: 128,
      seed: seed,
      // ... other options
    }).toDataUriSync();
  }, [seed]);

  useEffect(() => {
    setAvatar(avatar);
  }, [avatar]);

  const randomSeed = () => {
    setSeed(Math.random().toString());
  };
  return (
    <div className="relative h-[140px] w-[140px]">
      <img src={avatar} alt="avatar" />
      <Button
        className="absolute bottom-[-1px] right-[-1px] h-9 w-9 cursor-pointer"
        onClick={randomSeed}
      >
        <FontAwesomeIcon
          className="bg-yellow stoke-text-primary rounded-lg stroke-1	p-2 text-primary"
          icon={faArrowRotateRight}
        />
      </Button>
    </div>
  );
}
