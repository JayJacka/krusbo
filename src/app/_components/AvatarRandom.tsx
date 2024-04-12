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
  size?: number;
};

export default function AvatarRandom({ setAvatar, size }: AvatarRandomProps) {
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
  if (!size) {
    size = 140;
  }
  return (
    <div className={`h-140 w-140 relative`}>
      <img src={avatar} alt="avatar" height={size} width={size} />
      <Button
        className="bottom absolute bottom-[-14px] right-[-10px] h-9 w-9 cursor-pointer"
        onClick={randomSeed}
      >
        <FontAwesomeIcon
          className="stoke-text-primary rounded-lg bg-yellow stroke-1	p-2 text-primary"
          icon={faArrowRotateRight}
        />
      </Button>
    </div>
  );
}
