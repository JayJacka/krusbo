"use client";
import { createAvatar } from "@dicebear/core";
import { useEffect, useMemo } from "react";
import { botttsNeutral } from '@dicebear/collection';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faUsd} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@radix-ui/themes";
import { useState } from "react";

type AvatarRandomProps = {
  setAvatar: (avatar: string) => void;
}

export default function AvatarRandom({setAvatar}: AvatarRandomProps) {
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
    }
    return <div className="w-[140px] h-[140px] relative">
            <img src={avatar} alt="avatar" />
            <Button className="absolute right-[-1px] bottom-[-1px] cursor-pointer w-9 h-9" onClick={randomSeed}>
              <FontAwesomeIcon className="text-primary bg-button-yellow rounded-lg stroke-1	stoke-text-primary p-2" icon={faArrowRotateRight}/>
            </Button>
        </div>
}