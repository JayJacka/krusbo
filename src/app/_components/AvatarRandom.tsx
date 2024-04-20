"use client";
import { createAvatar } from "@dicebear/core";
import { useEffect, useMemo } from "react";
import { botttsNeutral } from "@dicebear/collection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faUsd } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@radix-ui/themes";
import { useState } from "react";

type AvatarRandomProps = {
  setAvatar: (avatar: string, seed: string) => void;
  size?: number;
  initialAvatar?: string;
};

export default function AvatarRandom({
  setAvatar,
  size,
  initialAvatar,
}: AvatarRandomProps) {
  const [seed, setSeed] = useState("");
  const [avatar, setAvatarImage] = useState(initialAvatar);

  useEffect(() => {
    if (!initialAvatar) {
      randomSeed();
    }
  }, [initialAvatar]);

  const randomSeed = () => {
    const newSeed = Math.random().toString();
    setSeed(newSeed);
    // Generate a new avatar using the new seed and update the component state
    const newAvatar = createAvatar(botttsNeutral, {
      size: 128,
      seed: newSeed,
    }).toDataUriSync();
    setAvatarImage(newAvatar);
    // Update parent component with both avatar and seed
    setAvatar(newAvatar, newSeed);
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
